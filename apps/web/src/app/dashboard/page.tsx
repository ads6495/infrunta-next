"use client";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  Flame,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUserData } from "../../data/mockUser";

export default function DashboardPage() {
  const [_activeTab, setActiveTab] = useState("overview");

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const privateData = useQuery(trpc.privateData.queryOptions());

  // useEffect(() => {
  //   if (!session && !isPending) {
  //     router.push("/login");
  //   }
  // }, [session, isPending]);

  // if (isPending) {
  //   return <div>Loading...</div>;
  // }

  const continueLesson = () => {
    // router.push(
    //   `/level/${mockUserData.level}/unit/${mockUserData.lastLesson.unitId}/lesson/${mockUserData.lastLesson.id}`,
    // );
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen className="h-4 w-4" />;
      case "Flame":
        return <Flame className="h-4 w-4" />;
      case "Award":
        return <Award className="h-4 w-4" />;
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  return (
    <>
      <div className="mb-2 flex flex-col items-start justify-between md:flex-row md:items-center">
        <div>
          <h1 className="font-bold text-3xl">
            Welcome back, {mockUserData.name}!
          </h1>
          <p className="text-muted-foreground">
            Continue your Romanian language journey
          </p>
        </div>
        <div className="mt-4 flex items-center md:mt-0">
          <div className="mr-4 flex items-center">
            <Flame className="mr-1 h-5 w-5 text-orange-500" />
            <span className="font-bold">{mockUserData.streak} day streak</span>
          </div>
          <div className="flex items-center">
            <Sparkles className="mr-1 h-5 w-5 text-yellow-500" />
            <span className="font-bold">{mockUserData.totalXp} XP</span>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="overview"
        className="mb-8"
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4 grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Continue Learning Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold text-lg">
                      {mockUserData.lastLesson.title}
                    </h3>
                    <Badge variant="outline">Level {mockUserData.level}</Badge>
                  </div>
                  <Progress
                    value={mockUserData.lastLesson.progress}
                    className="mb-4"
                  />
                  <p className="mb-4 text-muted-foreground text-sm">
                    You&apos;ve completed {mockUserData.lastLesson.progress}% of
                    this lesson.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={continueLesson} className="w-full">
                  Continue Learning
                </Button>
              </CardFooter>
            </Card>

            {/* Daily Goal Card */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Goal</CardTitle>
                <CardDescription>Track your daily progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 h-32 w-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold text-2xl">
                        {mockUserData.dailyXp}/{mockUserData.dailyGoal}
                      </span>
                    </div>
                    <svg
                      aria-label="Daily goal progress"
                      className="h-32 w-32"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={
                          2 *
                          Math.PI *
                          40 *
                          (1 - mockUserData.dailyXp / mockUserData.dailyGoal)
                        }
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <p className="text-center text-muted-foreground text-sm">
                    {mockUserData.dailyXp < mockUserData.dailyGoal
                      ? `${
                          mockUserData.dailyGoal - mockUserData.dailyXp
                        } XP to go today!`
                      : "Daily goal completed!"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Lessons */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recommended Lessons</CardTitle>
                <CardDescription>
                  Based on your learning progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserData.recommendedLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {lesson.description}
                        </p>
                      </div>
                      <Link href={"/"}>
                        <Button variant="outline" size="sm">
                          Start <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest learning activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className="mt-0.5 mr-3">
                        {activity.type === "lesson_completed" && (
                          <BookOpen className="h-4 w-4 text-green-500" />
                        )}
                        {activity.type === "achievement" && (
                          <Award className="h-4 w-4 text-amber-500" />
                        )}
                        {activity.type === "lesson_started" && (
                          <Clock className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(activity.date).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {activity.xp > 0 && ` • +${activity.xp} XP`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Your XP earned this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-64 items-end justify-between">
                  {mockUserData.weeklyProgress.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className="w-10 rounded-t-md bg-primary"
                        style={{ height: `${(day.xp / 100) * 200}px` }}
                      />
                      <span className="mt-2 text-xs">{day.day}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Stats</CardTitle>
                <CardDescription>
                  Your learning journey in numbers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center rounded-lg bg-muted p-4">
                    <BookOpen className="mb-2 h-8 w-8 text-primary" />
                    <span className="font-bold text-2xl">3</span>
                    <span className="text-muted-foreground text-sm">
                      Lessons Completed
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-muted p-4">
                    <Clock className="mb-2 h-8 w-8 text-primary" />
                    <span className="font-bold text-2xl">2.5</span>
                    <span className="text-muted-foreground text-sm">
                      Hours Studied
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-muted p-4">
                    <BarChart3 className="mb-2 h-8 w-8 text-primary" />
                    <span className="font-bold text-2xl">75%</span>
                    <span className="text-muted-foreground text-sm">
                      Accuracy Rate
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-muted p-4">
                    <Calendar className="mb-2 h-8 w-8 text-primary" />
                    <span className="font-bold text-2xl">7</span>
                    <span className="text-muted-foreground text-sm">
                      Active Days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proficiency Level */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Proficiency Level</CardTitle>
                <CardDescription>
                  Track your progress towards the next level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                    {mockUserData.level}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex justify-between">
                      <span className="font-medium text-sm">
                        Current Level: Beginner
                      </span>
                      <span className="font-medium text-sm">
                        Next: Elementary (A2)
                      </span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex flex-col rounded-lg bg-muted p-4">
                    <span className="mb-1 text-muted-foreground text-sm">
                      Vocabulary
                    </span>
                    <div className="flex items-center">
                      <Progress value={40} className="mr-2 h-2 flex-1" />
                      <span className="text-xs">40%</span>
                    </div>
                  </div>
                  <div className="flex flex-col rounded-lg bg-muted p-4">
                    <span className="mb-1 text-muted-foreground text-sm">
                      Grammar
                    </span>
                    <div className="flex items-center">
                      <Progress value={25} className="mr-2 h-2 flex-1" />
                      <span className="text-xs">25%</span>
                    </div>
                  </div>
                  <div className="flex flex-col rounded-lg bg-muted p-4">
                    <span className="mb-1 text-muted-foreground text-sm">
                      Pronunciation
                    </span>
                    <div className="flex items-center">
                      <Progress value={60} className="mr-2 h-2 flex-1" />
                      <span className="text-xs">60%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Achievements */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Your Achievements</CardTitle>
                <CardDescription>
                  Milestones you&apos;ve reached
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserData.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-start rounded-lg bg-muted p-4"
                    >
                      <div className="mr-4 rounded-full bg-primary/10 p-2">
                        {getIconComponent(achievement.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {achievement.description}
                        </p>
                        <p className="mt-1 text-muted-foreground text-xs">
                          Earned on{" "}
                          {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Next Goals</CardTitle>
                <CardDescription>Achievements to aim for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start rounded-lg border border-dashed bg-muted/50 p-4">
                    <div className="mr-4 rounded-full bg-muted p-2">
                      <Flame className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">10-Day Streak</h3>
                      <p className="text-muted-foreground text-sm">
                        Practice for 10 days in a row
                      </p>
                      <div className="mt-2">
                        <Progress value={70} className="h-1.5" />
                        <p className="mt-1 text-muted-foreground text-xs">
                          7/10 days
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start rounded-lg border border-dashed bg-muted/50 p-4">
                    <div className="mr-4 rounded-full bg-muted p-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Unit Master</h3>
                      <p className="text-muted-foreground text-sm">
                        Complete all lessons in a unit
                      </p>
                      <div className="mt-2">
                        <Progress value={40} className="h-1.5" />
                        <p className="mt-1 text-muted-foreground text-xs">
                          2/5 lessons
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start rounded-lg border border-dashed bg-muted/50 p-4">
                    <div className="mr-4 rounded-full bg-muted p-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Vocabulary Builder</h3>
                      <p className="text-muted-foreground text-sm">
                        Learn 50 new words
                      </p>
                      <div className="mt-2">
                        <Progress value={60} className="h-1.5" />
                        <p className="mt-1 text-muted-foreground text-xs">
                          30/50 words
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
