import { TRPCError } from "@trpc/server";
import z from "zod";
import prisma from "../../prisma";
import { protectedProcedure, router } from "../lib/trpc";

// Validation schemas
const createLanguageSchema = z.object({
	code: z.string().min(2).max(5, "Language code must be 2-5 characters"),
	name: z.string().min(1, "Language name is required"),
});

const updateLanguageSchema = z.object({
	id: z.number().int().positive(),
	code: z.string().min(2).max(5).optional(),
	name: z.string().min(1).optional(),
});

export const languageRouter = router({
	// Get all languages with unit counts
	getAll: protectedProcedure.query(async () => {
		return await prisma.language.findMany({
			include: {
				_count: {
					select: {
						units: true,
					},
				},
			},
			orderBy: { name: "asc" },
		});
	}),

	// Get language by ID with detailed info
	getById: protectedProcedure
		.input(z.object({ id: z.number().int().positive() }))
		.query(async ({ input }) => {
			const language = await prisma.language.findUnique({
				where: { id: input.id },
				include: {
					units: {
						select: {
							id: true,
							title: true,
							level: true,
							orderNumber: true,
							_count: {
								select: {
									lessons: true,
								},
							},
						},
						orderBy: [{ orderNumber: "asc" }, { id: "asc" }],
					},
					_count: {
						select: {
							units: true,
						},
					},
				},
			});

			if (!language) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Language not found",
				});
			}

			return language;
		}),

	// Create new language
	create: protectedProcedure
		.input(createLanguageSchema)
		.mutation(async ({ input }) => {
			try {
				// Check if language code already exists
				const existingLanguage = await prisma.language.findFirst({
					where: { code: input.code },
				});

				if (existingLanguage) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Language code already exists",
					});
				}

				return await prisma.language.create({
					data: input,
					include: {
						_count: {
							select: {
								units: true,
							},
						},
					},
				});
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create language",
				});
			}
		}),

	// Update language
	update: protectedProcedure
		.input(updateLanguageSchema)
		.mutation(async ({ input }) => {
			const { id, ...updateData } = input;

			try {
				// Check if language exists
				const existingLanguage = await prisma.language.findUnique({
					where: { id },
				});

				if (!existingLanguage) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Language not found",
					});
				}

				// If updating code, check for conflicts
				if (updateData.code) {
					const conflictLanguage = await prisma.language.findFirst({
						where: {
							code: updateData.code,
							id: { not: id },
						},
					});

					if (conflictLanguage) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Language code already exists",
						});
					}
				}

				return await prisma.language.update({
					where: { id },
					data: updateData,
					include: {
						_count: {
							select: {
								units: true,
							},
						},
					},
				});
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update language",
				});
			}
		}),

	// Delete language
	delete: protectedProcedure
		.input(z.object({ id: z.number().int().positive() }))
		.mutation(async ({ input }) => {
			try {
				const language = await prisma.language.findUnique({
					where: { id: input.id },
					include: {
						_count: {
							select: {
								units: true,
							},
						},
					},
				});

				if (!language) {
					throw new TRPCError({
						code: "NOT_FOUND",
						message: "Language not found",
					});
				}

				if (language._count.units > 0) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: `Cannot delete language with ${language._count.units} units. Delete units first.`,
					});
				}

				await prisma.language.delete({
					where: { id: input.id },
				});

				return {
					success: true,
					message: "Language deleted successfully",
				};
			} catch (error) {
				if (error instanceof TRPCError) throw error;

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete language",
				});
			}
		}),
});
