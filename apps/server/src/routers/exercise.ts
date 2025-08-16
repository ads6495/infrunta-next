import { TRPCError } from "@trpc/server";
import z from "zod";
import prisma from "../../prisma";
import { protectedProcedure, router } from "../lib/trpc";

// Validation schemas
const exerciseOptionSchema = z.object({
	text: z.string().min(1, "Option text is required"),
	isCorrect: z.boolean().default(false),
	orderIndex: z.number().int().min(0, "Order index must be non-negative"),
});

const exerciseComponentSchema = z.object({
	type: z.enum([
		"SYLLABLE",
		"LETTER_GROUP",
		"MATCH_PAIR",
		"DIALOGUE_LINE",
		"WORD_FRAGMENT",
	]),
	content: z.string().min(1, "Component content is required"),
	pairWith: z.string().optional(),
	audioUrl: z.string().url().optional(),
	imageUrl: z.string().url().optional(),
	isCorrect: z.boolean().optional(),
	orderIndex: z.number().int().min(0, "Order index must be non-negative"),
});

const createExerciseSchema = z.object({
	type: z.enum([
		"AUDIO_IMAGE_MATCH",
		"AUDIO_FILL_BLANK",
		"WORD_USAGE_QUIZ",
		"SPELLING_BANK",
		"SYLLABLE_ASSEMBLY",
		"DRAG_MATCH",
		"PRONUNCIATION_CHALLENGE",
		"CONVERSATION_RESPONSE",
		"WORD_ORDER",
		"AUDIO_TYPING",
		"FIND_MISTAKE",
		"ALPHABET_OVERVIEW",
	]),
	lessonId: z.number().int().positive("Lesson ID must be a positive integer"),
	orderNumber: z
		.number()
		.int()
		.positive("Order number must be a positive integer"),
	prompt: z.string().optional(),
	correctAnswer: z.string().min(1, "Correct answer is required"),
	englishTranslation: z.string().optional(),
	audioUrl: z.string().url().optional(),
	imageUrl: z.string().url().optional(),
	options: z.array(exerciseOptionSchema).optional(),
	components: z.array(exerciseComponentSchema).optional(),
});

const updateExerciseSchema = z.object({
	id: z.number().int().positive(),
	type: z
		.enum([
			"AUDIO_IMAGE_MATCH",
			"AUDIO_FILL_BLANK",
			"WORD_USAGE_QUIZ",
			"SPELLING_BANK",
			"SYLLABLE_ASSEMBLY",
			"DRAG_MATCH",
			"PRONUNCIATION_CHALLENGE",
			"CONVERSATION_RESPONSE",
			"WORD_ORDER",
			"AUDIO_TYPING",
			"FIND_MISTAKE",
			"ALPHABET_OVERVIEW",
		])
		.optional(),
	lessonId: z.number().int().positive().optional(),
	orderNumber: z.number().int().positive().optional(),
	prompt: z.string().optional(),
	correctAnswer: z.string().min(1).optional(),
	englishTranslation: z.string().optional(),
	audioUrl: z.string().url().optional(),
	imageUrl: z.string().url().optional(),
	options: z.array(exerciseOptionSchema).optional(),
	components: z.array(exerciseComponentSchema).optional(),
});

const reorderExercisesSchema = z.object({
	lessonId: z.number().int().positive(),
	updates: z.array(
		z.object({
			id: z.number().int().positive(),
			orderNumber: z.number().int().positive(),
		}),
	),
});

const submitAnswerSchema = z.object({
	exerciseId: z.number().int().positive(),
	answer: z.string().min(1, "Answer is required"),
});

export const exerciseRouter = router({
	// Get all exercises with optional filtering
	getAll: protectedProcedure
		.input(
			z
				.object({
					lessonId: z.number().int().positive().optional(),
					includeStats: z.boolean().default(false),
				})
				.optional(),
		)
		.query(async ({ input }) => {
			const where = input?.lessonId ? { lessonId: input.lessonId } : {};

			return await prisma.exercise.findMany({
				where,
				include: {
					lesson: {
						include: {
							unit: {
								include: {
									language: true,
								},
							},
						},
					},
					exerciseOptions: {
						orderBy: { orderIndex: "asc" },
					},
					exerciseComponents: {
						orderBy: [{ type: "asc" }, { orderIndex: "asc" }],
					},
					...(input?.includeStats && {
						_count: {
							select: {
								attempts: true,
							},
						},
					}),
				},
				orderBy: [{ lessonId: "asc" }, { orderNumber: "asc" }, { id: "asc" }],
			});
		}),

	// Get exercise by ID with detailed information
	getById: protectedProcedure
		.input(z.object({ id: z.number().int().positive() }))
		.query(async ({ input }) => {
			const exercise = await prisma.exercise.findUnique({
				where: { id: input.id },
				include: {
					lesson: {
						include: {
							unit: {
								include: {
									language: true,
								},
							},
						},
					},
					exerciseOptions: {
						orderBy: { orderIndex: "asc" },
					},
					exerciseComponents: {
						orderBy: [{ type: "asc" }, { orderIndex: "asc" }],
					},
					_count: {
						select: {
							attempts: true,
						},
					},
				},
			});

			if (!exercise) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Exercise not found",
				});
			}

			return exercise;
		}),

	// Get exercises by lesson
	getByLesson: protectedProcedure
		.input(z.object({ lessonId: z.number().int().positive() }))
		.query(async ({ input }) => {
			return await prisma.exercise.findMany({
				where: { lessonId: input.lessonId },
				include: {
					exerciseOptions: {
						orderBy: { orderIndex: "asc" },
					},
					exerciseComponents: {
						orderBy: [{ type: "asc" }, { orderIndex: "asc" }],
					},
					_count: {
						select: {
							attempts: true,
						},
					},
				},
				orderBy: [{ orderNumber: "asc" }, { id: "asc" }],
			});
		}),

	// Create new exercise
	create: protectedProcedure
		.input(createExerciseSchema)
		.mutation(async ({ input }) => {
			try {
				// Check if lesson exists
				const lesson = await prisma.lesson.findUnique({
					where: { id: input.lessonId },
				});

				if (!lesson) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Lesson not found",
					});
				}

				// Check if order number is already taken for this lesson
				const existingExercise = await prisma.exercise.findFirst({
					where: {
						lessonId: input.lessonId,
						orderNumber: input.orderNumber,
					},
				});

				if (existingExercise) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Order number already exists for this lesson",
					});
				}

				// Validate options have unique order indices
				if (input.options) {
					const orderIndices = input.options.map((o) => o.orderIndex);
					if (new Set(orderIndices).size !== orderIndices.length) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Option order indices must be unique",
						});
					}
				}

				// Validate components have unique order indices per type
				if (input.components) {
					const componentsByType = input.components.reduce(
						(acc, comp) => {
							if (!acc[comp.type]) acc[comp.type] = [];
							acc[comp.type].push(comp.orderIndex);
							return acc;
						},
						{} as Record<string, number[]>,
					);

					for (const [type, indices] of Object.entries(componentsByType)) {
						if (new Set(indices).size !== indices.length) {
							throw new TRPCError({
								code: "BAD_REQUEST",
								message: `Component order indices must be unique per type (duplicate in ${type})`,
							});
						}
					}
				}

				const { options, components, ...exerciseData } = input;

				return await prisma.exercise.create({
					data: {
						...exerciseData,
						exerciseOptions: options
							? {
									create: options,
								}
							: undefined,
						exerciseComponents: components
							? {
									create: components,
								}
							: undefined,
					},
					include: {
						lesson: {
							include: {
								unit: {
									include: {
										language: true,
									},
								},
							},
						},
						exerciseOptions: {
							orderBy: { orderIndex: "asc" },
						},
						exerciseComponents: {
							orderBy: [{ type: "asc" }, { orderIndex: "asc" }],
						},
						_count: {
							select: {
								attempts: true,
							},
						},
					},
				});
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create exercise",
				});
			}
		}),

	// Update exercise
	update: protectedProcedure
		.input(updateExerciseSchema)
		.mutation(async ({ input }) => {
			const { id, options, components, ...updateData } = input;

			try {
				// Check if exercise exists
				const existingExercise = await prisma.exercise.findUnique({
					where: { id },
				});

				if (!existingExercise) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Exercise not found",
					});
				}

				// If updating lesson or order, check constraints
				if (updateData.lessonId || updateData.orderNumber) {
					const lessonId = updateData.lessonId || existingExercise.lessonId;
					const orderNumber =
						updateData.orderNumber || existingExercise.orderNumber;

					const conflictExercise = await prisma.exercise.findFirst({
						where: {
							lessonId,
							orderNumber,
							id: { not: id },
						},
					});

					if (conflictExercise) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Order number already exists for this lesson",
						});
					}
				}

				// If updating lessonId, verify it exists
				if (updateData.lessonId) {
					const lesson = await prisma.lesson.findUnique({
						where: { id: updateData.lessonId },
					});

					if (!lesson) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Lesson not found",
						});
					}
				}

				// Validate options if provided
				if (options) {
					const orderIndices = options.map((o) => o.orderIndex);
					if (new Set(orderIndices).size !== orderIndices.length) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Option order indices must be unique",
						});
					}
				}

				// Validate components if provided
				if (components) {
					const componentsByType = components.reduce(
						(acc, comp) => {
							if (!acc[comp.type]) acc[comp.type] = [];
							acc[comp.type].push(comp.orderIndex);
							return acc;
						},
						{} as Record<string, number[]>,
					);

					for (const [type, indices] of Object.entries(componentsByType)) {
						if (new Set(indices).size !== indices.length) {
							throw new TRPCError({
								code: "BAD_REQUEST",
								message: `Component order indices must be unique per type (duplicate in ${type})`,
							});
						}
					}
				}

				return await prisma.exercise.update({
					where: { id },
					data: {
						...updateData,
						...(options && {
							exerciseOptions: {
								deleteMany: {},
								create: options,
							},
						}),
						...(components && {
							exerciseComponents: {
								deleteMany: {},
								create: components,
							},
						}),
					},
					include: {
						lesson: {
							include: {
								unit: {
									include: {
										language: true,
									},
								},
							},
						},
						exerciseOptions: {
							orderBy: { orderIndex: "asc" },
						},
						exerciseComponents: {
							orderBy: [{ type: "asc" }, { orderIndex: "asc" }],
						},
						_count: {
							select: {
								attempts: true,
							},
						},
					},
				});
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update exercise",
				});
			}
		}),

	// Delete exercise
	delete: protectedProcedure
		.input(z.object({ id: z.number().int().positive() }))
		.mutation(async ({ input }) => {
			try {
				const exercise = await prisma.exercise.findUnique({
					where: { id: input.id },
					include: {
						_count: {
							select: {
								attempts: true,
								exerciseOptions: true,
								exerciseComponents: true,
							},
						},
					},
				});

				if (!exercise) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Exercise not found",
					});
				}

				// Delete exercise (options, components, and attempts will cascade delete)
				await prisma.exercise.delete({
					where: { id: input.id },
				});

				return {
					success: true,
					message: `Exercise deleted successfully. ${exercise._count.attempts} attempts, ${exercise._count.exerciseOptions} options, and ${exercise._count.exerciseComponents} components were also deleted.`,
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete exercise",
				});
			}
		}),

	// Reorder exercises within a lesson
	reorder: protectedProcedure
		.input(reorderExercisesSchema)
		.mutation(async ({ input }) => {
			try {
				// Validate lesson exists
				const lesson = await prisma.lesson.findUnique({
					where: { id: input.lessonId },
				});

				if (!lesson) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Lesson not found",
					});
				}

				// Validate all exercises exist and belong to the specified lesson
				const exercises = await prisma.exercise.findMany({
					where: {
						id: { in: input.updates.map((u) => u.id) },
						lessonId: input.lessonId,
					},
				});

				if (exercises.length !== input.updates.length) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message:
							"One or more exercises not found or do not belong to the specified lesson",
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
						prisma.exercise.update({
							where: { id },
							data: { orderNumber },
						}),
					),
				);

				return {
					success: true,
					message: `Successfully reordered ${input.updates.length} exercises`,
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to reorder exercises",
				});
			}
		}),

	// Submit answer for exercise
	submitAnswer: protectedProcedure
		.input(submitAnswerSchema)
		.mutation(async ({ input, ctx }) => {
			try {
				// Check if exercise exists
				const exercise = await prisma.exercise.findUnique({
					where: { id: input.exerciseId },
					select: {
						correctAnswer: true,
						lesson: {
							select: {
								title: true,
							},
						},
					},
				});

				if (!exercise) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Exercise not found",
					});
				}

				// Check if answer is correct (case-insensitive comparison)
				const isCorrect =
					input.answer.toLowerCase().trim() ===
					exercise.correctAnswer.toLowerCase().trim();

				// Record the attempt
				const attempt = await prisma.exerciseAttempt.create({
					data: {
						exerciseId: input.exerciseId,
						userId: ctx.session.user.id,
						answer: input.answer,
						correct: isCorrect,
					},
				});

				return {
					correct: isCorrect,
					correctAnswer: exercise.correctAnswer,
					attemptId: attempt.id,
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to submit answer",
				});
			}
		}),

	// Get user's attempts for an exercise
	getAttempts: protectedProcedure
		.input(z.object({ exerciseId: z.number().int().positive() }))
		.query(async ({ input, ctx }) => {
			return await prisma.exerciseAttempt.findMany({
				where: {
					exerciseId: input.exerciseId,
					userId: ctx.session.user.id,
				},
				orderBy: {
					timestamp: "desc",
				},
				take: 10, // Limit to last 10 attempts
			});
		}),
});
