import { TRPCError } from "@trpc/server";
import z from "zod";
import prisma from "../../prisma";
import { protectedProcedure, router } from "../lib/trpc";

// Validation schemas
const createLessonSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	unitId: z.number().int().positive("Unit ID must be a positive integer"),
	orderNumber: z
		.number()
		.int()
		.positive("Order number must be a positive integer"),
	premium: z.boolean().default(false),
});

const updateLessonSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1).optional(),
	content: z.string().min(1).optional(),
	unitId: z.number().int().positive().optional(),
	orderNumber: z.number().int().positive().optional(),
	premium: z.boolean().optional(),
});

const reorderLessonsSchema = z.object({
	unitId: z.number().int().positive(),
	updates: z.array(
		z.object({
			id: z.number().int().positive(),
			orderNumber: z.number().int().positive(),
		}),
	),
});

export const lessonRouter = router({
	// Get all lessons with optional filtering
	getAll: protectedProcedure
		.input(
			z
				.object({
					unitId: z.number().int().positive().optional(),
					includeStats: z.boolean().default(false),
				})
				.optional(),
		)
		.query(async ({ input }) => {
			const where = input?.unitId ? { unitId: input.unitId } : {};

			return await prisma.lesson.findMany({
				where,
				include: {
					unit: {
						include: {
							language: true,
						},
					},
					exercises: input?.includeStats
						? {
								select: { id: true },
							}
						: false,
					...(input?.includeStats && {
						_count: {
							select: {
								exercises: true,
								progress: true,
							},
						},
					}),
				},
				orderBy: [{ unitId: "asc" }, { orderNumber: "asc" }, { id: "asc" }],
			});
		}),

	// Get lesson by ID with detailed information
	getById: protectedProcedure
		.input(z.object({ id: z.number().int().positive() }))
		.query(async ({ input }) => {
			const lesson = await prisma.lesson.findUnique({
				where: { id: input.id },
				include: {
					unit: {
						include: {
							language: true,
						},
					},
					exercises: {
						select: {
							id: true,
							type: true,
							prompt: true,
							correctAnswer: true,
							englishTranslation: true,
							orderNumber: true,
							audioUrl: true,
							imageUrl: true,
							exerciseOptions: {
								select: {
									id: true,
									text: true,
									isCorrect: true,
									orderIndex: true,
								},
								orderBy: { orderIndex: "asc" },
							},
							exerciseComponents: {
								select: {
									id: true,
									type: true,
									content: true,
									pairWith: true,
									audioUrl: true,
									imageUrl: true,
									isCorrect: true,
									orderIndex: true,
								},
								orderBy: { orderIndex: "asc" },
							},
							_count: {
								select: {
									attempts: true,
								},
							},
						},
						orderBy: [{ orderNumber: "asc" }, { id: "asc" }],
					},
					_count: {
						select: {
							exercises: true,
							progress: true,
						},
					},
				},
			});

			if (!lesson) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Lesson not found",
				});
			}

			return lesson;
		}),

	// Get lessons by unit
	getByUnit: protectedProcedure
		.input(z.object({ unitId: z.number().int().positive() }))
		.query(async ({ input }) => {
			return await prisma.lesson.findMany({
				where: { unitId: input.unitId },
				include: {
					_count: {
						select: {
							exercises: true,
							progress: true,
						},
					},
				},
				orderBy: [{ orderNumber: "asc" }, { id: "asc" }],
			});
		}),

	// Create new lesson
	create: protectedProcedure
		.input(createLessonSchema)
		.mutation(async ({ input }) => {
			try {
				// Check if unit exists
				const unit = await prisma.unit.findUnique({
					where: { id: input.unitId },
				});

				if (!unit) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Unit not found",
					});
				}

				// Check if order number is already taken for this unit
				const existingLesson = await prisma.lesson.findFirst({
					where: {
						unitId: input.unitId,
						orderNumber: input.orderNumber,
					},
				});

				if (existingLesson) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Order number already exists for this unit",
					});
				}

				return await prisma.lesson.create({
					data: input,
					include: {
						unit: {
							include: {
								language: true,
							},
						},
						_count: {
							select: {
								exercises: true,
								progress: true,
							},
						},
					},
				});
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create lesson",
				});
			}
		}),

	// Update lesson
	update: protectedProcedure
		.input(updateLessonSchema)
		.mutation(async ({ input }) => {
			const { id, ...updateData } = input;

			try {
				// Check if lesson exists
				const existingLesson = await prisma.lesson.findUnique({
					where: { id },
				});

				if (!existingLesson) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Lesson not found",
					});
				}

				// If updating unit or order, check constraints
				if (updateData.unitId || updateData.orderNumber) {
					const unitId = updateData.unitId || existingLesson.unitId;
					const orderNumber =
						updateData.orderNumber || existingLesson.orderNumber;

					const conflictLesson = await prisma.lesson.findFirst({
						where: {
							unitId,
							orderNumber,
							id: { not: id },
						},
					});

					if (conflictLesson) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Order number already exists for this unit",
						});
					}
				}

				// If updating unitId, verify it exists
				if (updateData.unitId) {
					const unit = await prisma.unit.findUnique({
						where: { id: updateData.unitId },
					});

					if (!unit) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Unit not found",
						});
					}
				}

				return await prisma.lesson.update({
					where: { id },
					data: updateData,
					include: {
						unit: {
							include: {
								language: true,
							},
						},
						_count: {
							select: {
								exercises: true,
								progress: true,
							},
						},
					},
				});
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update lesson",
				});
			}
		}),

	// Delete lesson
	delete: protectedProcedure
		.input(z.object({ id: z.number().int().positive() }))
		.mutation(async ({ input }) => {
			try {
				const lesson = await prisma.lesson.findUnique({
					where: { id: input.id },
					include: {
						_count: {
							select: {
								exercises: true,
								progress: true,
							},
						},
					},
				});

				if (!lesson) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Lesson not found",
					});
				}

				// Delete lesson (exercises will cascade delete due to schema)
				await prisma.lesson.delete({
					where: { id: input.id },
				});

				return {
					success: true,
					message: `Lesson deleted successfully. ${lesson._count.exercises} exercises and ${lesson._count.progress} progress records were also deleted.`,
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete lesson",
				});
			}
		}),

	// Reorder lessons within a unit
	reorder: protectedProcedure
		.input(reorderLessonsSchema)
		.mutation(async ({ input }) => {
			try {
				// Validate unit exists
				const unit = await prisma.unit.findUnique({
					where: { id: input.unitId },
				});

				if (!unit) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Unit not found",
					});
				}

				// Validate all lessons exist and belong to the specified unit
				const lessons = await prisma.lesson.findMany({
					where: {
						id: { in: input.updates.map((u) => u.id) },
						unitId: input.unitId,
					},
				});

				if (lessons.length !== input.updates.length) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message:
							"One or more lessons not found or do not belong to the specified unit",
					});
				}

				// Check for duplicate order numbers
				const orderNumbers = input.updates.map((u) => u.orderNumber);
				if (new Set(orderNumbers).size !== orderNumbers.length) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Duplicate order numbers provided",
					});
				}

				// Perform updates in transaction
				await prisma.$transaction(
					input.updates.map(({ id, orderNumber }) =>
						prisma.lesson.update({
							where: { id },
							data: { orderNumber },
						}),
					),
				);

				return {
					success: true,
					message: `Successfully reordered ${input.updates.length} lessons`,
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to reorder lessons",
				});
			}
		}),

	// Get lesson progress for current user
	getProgress: protectedProcedure
		.input(z.object({ lessonId: z.number().int().positive() }))
		.query(async ({ input, ctx }) => {
			const progress = await prisma.userLessonProgress.findUnique({
				where: {
					userId_lessonId: {
						userId: ctx.session.user.id,
						lessonId: input.lessonId,
					},
				},
				include: {
					lesson: {
						select: {
							title: true,
							unit: {
								select: {
									title: true,
									language: {
										select: {
											name: true,
										},
									},
								},
							},
						},
					},
				},
			});

			return progress;
		}),

	// Mark lesson as completed for current user
	markCompleted: protectedProcedure
		.input(z.object({ lessonId: z.number().int().positive() }))
		.mutation(async ({ input, ctx }) => {
			try {
				// Check if lesson exists
				const lesson = await prisma.lesson.findUnique({
					where: { id: input.lessonId },
				});

				if (!lesson) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Lesson not found",
					});
				}

				return await prisma.userLessonProgress.upsert({
					where: {
						userId_lessonId: {
							userId: ctx.session.user.id,
							lessonId: input.lessonId,
						},
					},
					update: {
						completed: true,
						lastAccessed: new Date(),
					},
					create: {
						userId: ctx.session.user.id,
						lessonId: input.lessonId,
						completed: true,
					},
					include: {
						lesson: {
							select: {
								title: true,
							},
						},
					},
				});
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to mark lesson as completed",
				});
			}
		}),
});
