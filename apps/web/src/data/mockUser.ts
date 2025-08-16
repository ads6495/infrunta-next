import { mockLastLesson, mockRecommendedLessons } from "./mockLessons";
import { mockRecentActivity, mockWeeklyProgress } from "./mockProgress";

export const mockAchievements = [
	{
		id: 1,
		title: "First Lesson",
		description: "Completed your first lesson",
		date: "2023-10-01",
		icon: "BookOpen",
	},
	{
		id: 2,
		title: "3-Day Streak",
		description: "Practiced for 3 days in a row",
		date: "2023-10-03",
		icon: "Flame",
	},
	{
		id: 3,
		title: "Perfect Score",
		description: "Got 100% on a lesson",
		date: "2023-10-05",
		icon: "Award",
	},
];

export const mockUserData = {
	name: "Albert",
	level: "A1",
	streak: 7,
	totalXp: 1250,
	dailyGoal: 50,
	dailyXp: 30,
	lastLesson: mockLastLesson,
	achievements: mockAchievements,
	recentActivity: mockRecentActivity,
	weeklyProgress: mockWeeklyProgress,
	recommendedLessons: mockRecommendedLessons,
};
