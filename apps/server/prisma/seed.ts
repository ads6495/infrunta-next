/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ExerciseComponentType,
  ExerciseType,
  Level,
  PrismaClient,
} from "../prisma/generated/client";

const prisma = new PrismaClient();

async function createLanguages() {
  await prisma.language.createMany({
    data: [
      {
        code: "ro",
        name: "Romanian",
      },
      {
        code: "it",
        name: "italian",
      },
      {
        code: "fr",
        name: "French",
      },
      {
        code: "es",
        name: "Spanish",
      },
    ],
  });
}

async function createUnits() {
  const unitsData = [
    {
      orderNumber: 1,
      title: "Introduction to Romanian",
      level: Level.A1,
      language: {
        connect: {
          id: 1,
        },
      },
      objective: "Learn basic greetings and introductions",
      lessons: {
        create: [
          {
            title: "Basic Greetings",
            content: "Learn how to say hello and goodbye in Romanian",
            orderNumber: 1,
            premium: false,
            exercises: {
              create: [
                {
                  type: ExerciseType.AUDIO_IMAGE_MATCH,
                  audioUrl: "/audio/hello.mp3",
                  prompt: "Match the audio to the correct greeting",
                  correctAnswer: "Bună",
                  englishTranslation: "Hello",
                  orderNumber: 1,
                  exerciseOptions: {
                    create: [
                      {
                        text: "Bună",
                        isCorrect: true,
                        orderIndex: 0,
                      },
                      {
                        text: "La revedere",
                        isCorrect: false,
                        orderIndex: 1,
                      },
                      {
                        text: "Mulțumesc",
                        isCorrect: false,
                        orderIndex: 2,
                      },
                      {
                        text: "Bună ziua",
                        isCorrect: false,
                        orderIndex: 3,
                      },
                    ],
                  },
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Bună",
                        imageUrl:
                          "https://cdn.pixabay.com/photo/2021/11/19/18/28/ladies-6810005_1280.jpg?w=1920",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "La revedere",
                        imageUrl:
                          "https://images.pexels.com/photos/8475151/pexels-photo-8475151.jpeg?auto=compress&cs=tinysrgb",
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Mulțumesc",
                        imageUrl:
                          "https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                        orderIndex: 2,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Bună ziua",
                        imageUrl:
                          "https://images.pexels.com/photos/1036627/pexels-photo-1036627.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.AUDIO_IMAGE_MATCH,
                  audioUrl: "/audio/goodmorning.mp3",
                  prompt: "Match the audio to the correct greeting",
                  correctAnswer: "Bună dimineața",
                  englishTranslation: "Good morning",
                  orderNumber: 2,
                  exerciseOptions: {
                    create: [
                      {
                        text: "Bună dimineața",
                        isCorrect: true,
                        orderIndex: 0,
                      },
                      {
                        text: "La revedere",
                        isCorrect: false,
                        orderIndex: 1,
                      },
                      {
                        text: "Mulțumesc",
                        isCorrect: false,
                        orderIndex: 2,
                      },
                      {
                        text: "Bună ziua",
                        isCorrect: false,
                        orderIndex: 3,
                      },
                    ],
                  },
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Bună dimineața",
                        imageUrl:
                          "https://images.pexels.com/photos/4145032/pexels-photo-4145032.jpeg?auto=compress&cs=tinysrgb&w=1920",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "La revedere",
                        imageUrl:
                          "https://images.pexels.com/photos/8475151/pexels-photo-8475151.jpeg?auto=compress&cs=tinysrgb",
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Mulțumesc",
                        imageUrl:
                          "https://img.freepik.com/free-photo/portrait-young-beautiful-woman-gesticulating_273609-40419.jpg",
                        orderIndex: 2,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Bună ziua",
                        imageUrl:
                          "https://images.pexels.com/photos/5064865/pexels-photo-5064865.jpeg?auto=compress&cs=tinysrgb",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.AUDIO_IMAGE_MATCH,
                  audioUrl: "/audio/goodafternoon.mp3",
                  prompt: "Match the audio to the correct greeting",
                  correctAnswer: "Bună seara",
                  englishTranslation: "Good afternoon",
                  orderNumber: 3,
                  exerciseOptions: {
                    create: [
                      {
                        text: "Bună ziua",
                        isCorrect: false,
                        orderIndex: 0,
                      },
                      {
                        text: "La revedere",
                        isCorrect: false,
                        orderIndex: 1,
                      },
                      {
                        text: "Mulțumesc",
                        isCorrect: false,
                        orderIndex: 2,
                      },
                      {
                        text: "Bună seara",
                        isCorrect: true,
                        orderIndex: 3,
                      },
                    ],
                  },
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Bună ziua",
                        imageUrl:
                          "https://images.pexels.com/photos/4145032/pexels-photo-4145032.jpeg?auto=compress&cs=tinysrgb",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "La revedere",
                        imageUrl:
                          "https://images.pexels.com/photos/8475151/pexels-photo-8475151.jpeg?auto=compress&cs=tinysrgb",
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Mulțumesc",
                        imageUrl:
                          "https://img.freepik.com/free-photo/portrait-young-beautiful-woman-gesticulating_273609-40419.jpg",
                        orderIndex: 2,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Bună seara",
                        imageUrl:
                          "https://images.pexels.com/photos/5064865/pexels-photo-5064865.jpeg?auto=compress&cs=tinysrgb",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.AUDIO_IMAGE_MATCH,
                  audioUrl: "/audio/goodbye.mp3",
                  prompt: "Match the audio to the correct greeting",
                  correctAnswer: "Hi",
                  englishTranslation: "Salut",
                  orderNumber: 4,
                  exerciseOptions: {
                    create: [
                      {
                        text: "Hi",
                        isCorrect: true,
                        orderIndex: 0,
                      },
                      {
                        text: "Thank you",
                        isCorrect: false,
                        orderIndex: 1,
                      },
                      {
                        text: "Morning",
                        isCorrect: false,
                        orderIndex: 2,
                      },
                      {
                        text: "Goodbye",
                        isCorrect: false,
                        orderIndex: 3,
                      },
                    ],
                  },
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Hi",
                        imageUrl:
                          "https://images.pexels.com/photos/4145032/pexels-photo-4145032.jpeg?auto=compress&cs=tinysrgb",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Thank you",
                        imageUrl:
                          "https://images.pexels.com/photos/8475151/pexels-photo-8475151.jpeg?auto=compress&cs=tinysrgb",
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Morning",
                        imageUrl:
                          "https://img.freepik.com/free-photo/portrait-young-beautiful-woman-gesticulating_273609-40419.jpg",
                        orderIndex: 2,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Goodbye",
                        imageUrl:
                          "https://images.pexels.com/photos/5064865/pexels-photo-5064865.jpeg?auto=compress&cs=tinysrgb",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.AUDIO_FILL_BLANK,
                  audioUrl: "/audio/goodmorning.mp3",
                  prompt: "Fill in the blank with the word you hear",
                  correctAnswer: "dimineața",
                  englishTranslation: "Good morning",
                  orderNumber: 5,
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "Bună ___ !",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "dimineața",
                        isCorrect: true,
                        orderIndex: 1,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.AUDIO_FILL_BLANK,
                  audioUrl: "/audio/goodafternoon.mp3",
                  prompt: "Fill in the blank with the word you hear",
                  correctAnswer: "ziua",
                  englishTranslation: "Good afternoon",
                  orderNumber: 6,
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "Bună ___ !",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "ziua",
                        isCorrect: true,
                        orderIndex: 1,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.AUDIO_FILL_BLANK,
                  audioUrl: "/audio/goodbye.mp3",
                  prompt: "Fill in the blank with the word you hear",
                  correctAnswer: "revedere",
                  englishTranslation: "Goodbye",
                  orderNumber: 7,
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "La ___ !",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "revedere",
                        isCorrect: true,
                        orderIndex: 1,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.CONVERSATION_RESPONSE,
                  prompt: "Choose the most appropriate response",
                  correctAnswer: "Bine, mulțumesc",
                  orderNumber: 8,
                  exerciseOptions: {
                    create: [
                      {
                        text: "Bine, mulțumesc",
                        isCorrect: true,
                        orderIndex: 0,
                      },
                      {
                        text: "La revedere!",
                        isCorrect: false,
                        orderIndex: 1,
                      },
                      {
                        text: "Galben!",
                        isCorrect: false,
                        orderIndex: 2,
                      },
                    ],
                  },
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.DIALOGUE_LINE,
                        content: 'Person A: "Salut! Ce mai faci?"',
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.DIALOGUE_LINE,
                        content: "Person B: ?",
                        orderIndex: 1,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.CONVERSATION_RESPONSE,
                  prompt: "Choose the most appropriate response",
                  correctAnswer: "Bună ziua",
                  orderNumber: 9,
                  exerciseOptions: {
                    create: [
                      {
                        text: "Bună ziua",
                        isCorrect: true,
                        orderIndex: 0,
                      },
                      {
                        text: "Bună dimineața",
                        isCorrect: false,
                        orderIndex: 1,
                      },
                      {
                        text: "Mulțumesc",
                        isCorrect: false,
                        orderIndex: 2,
                      },
                    ],
                  },
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.DIALOGUE_LINE,
                        content: 'Person A: "Bună ziua"',
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.DIALOGUE_LINE,
                        content: "Person B: ?",
                        orderIndex: 1,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.CONVERSATION_RESPONSE,
                  prompt: "Choose the most appropriate response",
                  correctAnswer: "Noapte bună",
                  orderNumber: 10,
                  exerciseOptions: {
                    create: [
                      {
                        text: "Noapte bună",
                        isCorrect: true,
                        orderIndex: 0,
                      },
                      {
                        text: "Bună dimineața",
                        isCorrect: false,
                        orderIndex: 1,
                      },
                      {
                        text: "Mulțumesc",
                        isCorrect: false,
                        orderIndex: 2,
                      },
                    ],
                  },
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.DIALOGUE_LINE,
                        content: 'Person A: "Noapte bună"',
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.DIALOGUE_LINE,
                        content: "Person B: ?",
                        orderIndex: 1,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.DRAG_MATCH,
                  prompt: "Match the greeting to the correct time of day",
                  correctAnswer:
                    "Morning:Bună dimineața, Day:Bună ziua, Anytime:Salut / ceau, Evening:Bună seara",
                  orderNumber: 11,
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Morning",
                        pairWith: "Bună dimineața",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Day",
                        pairWith: "Bună ziua",
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Anytime",
                        pairWith: "Salut / ceau",
                        orderIndex: 2,
                      },
                      {
                        type: ExerciseComponentType.MATCH_PAIR,
                        content: "Evening",
                        pairWith: "Bună seara",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.PRONUNCIATION_CHALLENGE,
                  audioUrl: "/audio/thankyou.mp3",
                  prompt: "Listen and repeat aloud",
                  correctAnswer: "mulțumesc",
                  orderNumber: 12,
                },
                {
                  type: ExerciseType.PRONUNCIATION_CHALLENGE,
                  audioUrl: "/audio/yourewelcome.mp3",
                  prompt: "Listen and repeat aloud",
                  correctAnswer: "cu plăcere",
                  orderNumber: 13,
                },
                {
                  type: ExerciseType.PRONUNCIATION_CHALLENGE,
                  audioUrl: "/audio/sorry.mp3",
                  prompt: "Listen and repeat aloud",
                  correctAnswer: "scuze",
                  orderNumber: 14,
                },
                {
                  type: ExerciseType.PRONUNCIATION_CHALLENGE,
                  audioUrl: "/audio/please.mp3",
                  prompt: "Listen and repeat aloud",
                  correctAnswer: "vă rog",
                  orderNumber: 15,
                },
                {
                  type: ExerciseType.WORD_ORDER,
                  prompt: "Rearrange the words",
                  correctAnswer: "eu mă numesc andrei",
                  orderNumber: 16,
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "eu",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "mă",
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "numesc",
                        orderIndex: 2,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "Andrei",
                        orderIndex: 3,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.WORD_ORDER,
                  prompt: "Rearrange the words",
                  correctAnswer: "bună ziua",
                  orderNumber: 17,
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "bună",
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "ziua",
                        orderIndex: 2,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.WORD_ORDER,
                  prompt: "Rearrange the words",
                  correctAnswer: "încântat de cunoștință",
                  orderNumber: 18,
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "cunoștință",
                        orderIndex: 2,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "încântat",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "de",
                        orderIndex: 1,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.AUDIO_TYPING,
                  audioUrl: "/audio/goodmorning.mp3",
                  prompt: "Repeat and type what you hear",
                  correctAnswer: "bună dimineața eu sunt ana",
                  orderNumber: 19,
                },
                {
                  type: ExerciseType.WORD_ORDER,
                  prompt: "Rearrange the words",
                  correctAnswer: "mă cheamă Andrei",
                  orderNumber: 20,
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "cheamă",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "mă",
                        orderIndex: 1,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "Andrei",
                        orderIndex: 2,
                      },
                    ],
                  },
                },
                {
                  type: ExerciseType.WORD_ORDER,
                  prompt: "Rearrange the words",
                  correctAnswer: "Vă rog ajutați-mă",
                  orderNumber: 21,
                  exerciseComponents: {
                    create: [
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "Vă",
                        orderIndex: 0,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "ajutați-mă",
                        orderIndex: 2,
                      },
                      {
                        type: ExerciseComponentType.WORD_FRAGMENT,
                        content: "rog",
                        orderIndex: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    // {
    //   orderNumber: 2,
    //   title: "The Romanian Alphabet",
    //   objective: "Learn the Romanian alphabet and pronunciation",
    //   level: Level.A1,
    //   language: {
    //     connect: {
    //       id: 1,
    //     },
    //   },
    //   lessons: {
    //     create: [
    //       {
    //         title: "Vowels",
    //         content: "Learn the Romanian vowels and their pronunciation",
    //         orderNumber: 1,
    //         premium: false,
    //         exercises: {
    //           create: [
    //             {
    //               type: ExerciseType.ALPHABET_OVERVIEW,
    //               prompt: "Explore the Romanian vowels",
    //               correctAnswer: "viewed",
    //               orderNumber: 1,
    //               exerciseComponents: {
    //                 create: [
    //                   {
    //                     type: ExerciseComponentType.LETTER_GROUP,
    //                     content: "A",
    //                     pairWith: "ah",
    //                     audioUrl: "/audio/a.mp3",
    //                     orderIndex: 0,
    //                   },
    //                   {
    //                     type: ExerciseComponentType.LETTER_GROUP,
    //                     content: "Ă",
    //                     pairWith: "uh",
    //                     audioUrl: "/audio/a_breve.mp3",
    //                     orderIndex: 1,
    //                   },
    //                   {
    //                     type: ExerciseComponentType.LETTER_GROUP,
    //                     content: "Â",
    //                     pairWith: "uh",
    //                     audioUrl: "/audio/a_circumflex.mp3",
    //                     orderIndex: 2,
    //                   },
    //                   {
    //                     type: ExerciseComponentType.LETTER_GROUP,
    //                     content: "E",
    //                     pairWith: "eh",
    //                     audioUrl: "/audio/e.mp3",
    //                     orderIndex: 3,
    //                   },
    //                   {
    //                     type: ExerciseComponentType.LETTER_GROUP,
    //                     content: "I",
    //                     pairWith: "ee",
    //                     audioUrl: "/audio/i.mp3",
    //                     orderIndex: 4,
    //                   },
    //                   {
    //                     type: ExerciseComponentType.LETTER_GROUP,
    //                     content: "Î",
    //                     pairWith: "uh",
    //                     audioUrl: "/audio/i_circumflex.mp3",
    //                     orderIndex: 5,
    //                   },
    //                   {
    //                     type: ExerciseComponentType.LETTER_GROUP,
    //                     content: "O",
    //                     pairWith: "oh",
    //                     audioUrl: "/audio/o.mp3",
    //                     orderIndex: 6,
    //                   },
    //                   {
    //                     type: ExerciseComponentType.LETTER_GROUP,
    //                     content: "U",
    //                     pairWith: "oo",
    //                     audioUrl: "/audio/u.mp3",
    //                     orderIndex: 7,
    //                   },
    //                 ],
    //               },
    //             },
    //             {
    //               type: ExerciseType.AUDIO_TYPING,
    //               audioUrl: "/audio/vowels.mp3",
    //               prompt: "Type the vowels you hear",
    //               correctAnswer: "aăâeiîou",
    //               orderNumber: 2,
    //             },
    //           ],
    //         },
    //       },
    //       {
    //         title: "Consonants (Part 1)",
    //         content: "Learn the first group of Romanian consonants",
    //         orderNumber: 2,
    //         premium: false,
    //         exercises: {
    //           create: [],
    //         },
    //       },
    //       {
    //         title: "Consonants (Part 2)",
    //         content: "Learn the second group of Romanian consonants",
    //         orderNumber: 3,
    //         premium: false,
    //         exercises: {
    //           create: [],
    //         },
    //       },
    //     ],
    //   },
    // },
  ];

  for (const unit of unitsData) {
    await prisma.unit.create({
      data: unit,
    });
  }
}

// biome-ignore lint/correctness/noUnusedVariables: <call to clean the database but keep tables>
async function cleanTables() {
  await prisma.exerciseAttempt.deleteMany({});
  await prisma.exerciseComponent.deleteMany({});
  await prisma.exerciseOption.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.userLessonProgress.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.unit.deleteMany({});
  await prisma.language.deleteMany({});
  await prisma.user.deleteMany({});
}

// biome-ignore lint/correctness/noUnusedVariables: <call to destroy the database>
async function destroy() {
  // drop the database
  await prisma.$executeRaw`DROP SCHEMA public CASCADE;`;

  console.log("Successfully destroyed database");
}

async function main() {
  try {
    // First create languages
    console.log("🌱 Seeding languages...");
    await createLanguages();
    console.log("✅ Languages seeded successfully");

    // Then create units (which depend on languages)
    console.log("🌱 Seeding units...");
    await createUnits();
    console.log("✅ Units seeded successfully");

    console.log("🌱 Database seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
