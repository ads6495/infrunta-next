import { TRPCError } from "@trpc/server";
import z from "zod";
import prisma from "../../prisma";
import { protectedProcedure, router } from "../lib/trpc";

// Validation schemas
const createUnitSchema = z.object({
	title: z.string().min(1, "Title is required"),
	objective: z.string().min(1, "Objective is required"),
	languageId: z
		.number()
		.int()
		.positive("Language ID must be a positive integer"),
	orderNumber: z
		.number()
		.int()
		.positive("Order number must be a positive integer"),
	level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).default("A1"),
});

const updateUnitSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1).optional(),
	objective: z.string().min(1).optional(),
	languageId: z.number().int().positive().optional(),
	orderNumber: z.number().int().positive().optional(),
	level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
});

const reorderUnitsSchema = z.object({
	updates: z.array(
		z.object({
			id: z.number().int().positive(),
			orderNumber: z.number().int().positive(),
		}),
	),
});

export const unitRouter = router({
	// Get all units with optional filtering and includes
	getAll: protectedProcedure
		.input(
			z
				.object({
					languageId: z.number().int().positive().optional(),
					includeStats: z.boolean().default(false),
				})
				.optional(),
		)
		.query(async ({ input }) => {
			const where = input?.languageId ? { languageId: input.languageId } : {};

			return await prisma.unit.findMany({
				where,
				include: {
					language: true,
					lessons: input?.includeStats
						? {
								select: { id: true },
							}
						: false,
					...(input?.includeStats && {
						_count: {
							select: {
								lessons: true,
							},
						},
					}),
				},
				orderBy: [{ orderNumber: "asc" }, { id: "asc" }],
			});
		}),

	// Get unit by ID with detailed information
	getById: protectedProcedure
		.input(z.object({ id: z.number().int().positive() }))
		.query(async ({ input }) => {
			const unit = await prisma.unit.findUnique({
				where: { id: input.id },
				include: {
					language: true,
					lessons: {
						select: {
							id: true,
							title: true,
							orderNumber: true,
							premium: true,
							_count: {
								select: {
									exercises: true,
								},
							},
						},
						orderBy: [{ orderNumber: "asc" }, { id: "asc" }],
					},
					_count: {
						select: {
							lessons: true,
						},
					},
				},
			});

			if (!unit) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Unit not found",
				});
			}

			return unit;
		}),

	// Get units by language
	getByLanguage: protectedProcedure
		.input(z.object({ languageId: z.number().int().positive() }))
		.query(async ({ input }) => {
			console.log("input:", input);
			return await prisma.unit.findMany({
				where: { languageId: input.languageId },
				include: {
					_count: {
						select: {
							lessons: true,
						},
					},
				},
				orderBy: [{ orderNumber: "asc" }, { id: "asc" }],
			});
		}),

	// Create new unit
	create: protectedProcedure
		.input(createUnitSchema)
		.mutation(async ({ input }) => {
			try {
				// Check if language exists
				const language = await prisma.language.findUnique({
					where: { id: input.languageId },
				});

				if (!language) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Language not found",
					});
				}

				// Check if order number is already taken for this language
				const existingUnit = await prisma.unit.findFirst({
					where: {
						languageId: input.languageId,
						orderNumber: input.orderNumber,
					},
				});

				if (existingUnit) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Order number already exists for this language",
					});
				}

				return await prisma.unit.create({
					data: input,
					include: {
						language: true,
						_count: {
							select: {
								lessons: true,
							},
						},
					},
				});
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create unit",
				});
			}
		}),

	// Update unit
	update: protectedProcedure
		.input(updateUnitSchema)
		.mutation(async ({ input }) => {
			const { id, ...updateData } = input;

			try {
				// Check if unit exists
				const existingUnit = await prisma.unit.findUnique({
					where: { id },
				});

				if (!existingUnit) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Unit not found",
					});
				}

				// If updating language or order, check constraints
				if (updateData.languageId || updateData.orderNumber) {
					const languageId = updateData.languageId || existingUnit.languageId;
					const orderNumber =
						updateData.orderNumber || existingUnit.orderNumber;

					const conflictUnit = await prisma.unit.findFirst({
						where: {
							languageId,
							orderNumber,
							id: { not: id },
						},
					});

					if (conflictUnit) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Order number already exists for this language",
						});
					}
				}

				// If updating languageId, verify it exists
				if (updateData.languageId) {
					const language = await prisma.language.findUnique({
						where: { id: updateData.languageId },
					});

					if (!language) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Language not found",
						});
					}
				}

				return await prisma.unit.update({
					where: { id },
					data: updateData,
					include: {
						language: true,
						_count: {
							select: {
								lessons: true,
							},
						},
					},
				});
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update unit",
				});
			}
		}),

	// Delete unit
	delete: protectedProcedure
		.input(z.object({ id: z.number().int().positive() }))
		.mutation(async ({ input }) => {
			try {
				const unit = await prisma.unit.findUnique({
					where: { id: input.id },
					include: {
						_count: {
							select: {
								lessons: true,
							},
						},
					},
				});

				if (!unit) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Unit not found",
					});
				}

				// Delete unit (lessons will cascade delete due to schema)
				await prisma.unit.delete({
					where: { id: input.id },
				});

				return {
					success: true,
					message: `Unit deleted successfully. ${unit._count.lessons} lessons were also deleted.`,
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete unit",
				});
			}
		}),

	// Reorder multiple units
	reorder: protectedProcedure
		.input(reorderUnitsSchema)
		.mutation(async ({ input }) => {
			try {
				// Validate all units exist and belong to the same language
				const units = await prisma.unit.findMany({
					where: {
						id: { in: input.updates.map((u) => u.id) },
					},
				});

				if (units.length !== input.updates.length) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "One or more units not found",
					});
				}

				// Check all units belong to the same language
				const languageIds = [...new Set(units.map((u) => u.languageId))];
				if (languageIds.length > 1) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message:
							"All units must belong to the same language for reordering",
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
						prisma.unit.update({
							where: { id },
							data: { orderNumber },
						}),
					),
				);

				return {
					success: true,
					message: `Successfully reordered ${input.updates.length} units`,
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to reorder units",
				});
			}
		}),
});
