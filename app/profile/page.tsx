"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProfilePageHeader from "@/components/profilePageHeader";
import NoPlans from "@/components/NoPlans";
import { Button } from "@/components/ui/button";
import { AppleIcon, CalendarIcon, DumbbellIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id as string;
  const allPlans = useQuery(api.plans.getUserPlans, { userId });
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const activePlan = allPlans?.find((plan) => plan.isActive);
  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4 xl:w-1/5">
          <ProfilePageHeader user={user} />
        </div>

        <div className="w-full lg:w-3/4 xl:w-4/5">
          {/* PLAN Section */}
          {allPlans && allPlans?.length > 0 ? (
            <div className="space-y-6">
              <div className="relative backdrop-blur-sm border border-border p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <h2 className="text-lg lg:text-xl font-bold tracking-tight">
                    <span className="text-primary">Your</span>{" "}
                    <span className="text-gray-500">Fitness Plans</span>
                  </h2>
                  <div className="font-mono text-xs text-muted-foreground">
                    TOTAL: {allPlans.length}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allPlans?.map((plan) => (
                    <Button
                      key={plan._id}
                      onClick={() => setSelectedPlanId(plan._id)}
                      className={`text-gray-500 border hover:text-white text-sm ${
                        selectedPlanId === plan._id
                          ? "bg-primary/20 text-gray-500 border-primary"
                          : "bg-transparent border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="hidden sm:inline">{plan.name}</span>
                      <span className="sm:hidden">
                        {plan.name.length > 15
                          ? plan.name.substring(0, 15) + "..."
                          : plan.name}
                      </span>
                      {plan.isActive && (
                        <span className="ml-2 bg-green-500/20 text-green-500 text-xs px-2 py-0.5 rounded">
                          ACTIVE
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {currentPlan && (
                <div className="relative backdrop-blur-sm border border-border rounded-lg p-4 lg:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <h3 className="text-base lg:text-lg font-bold text-gray-500">
                      PLAN:{" "}
                      <span className="text-gray-500">{currentPlan.name}</span>
                    </h3>
                  </div>

                  <Tabs defaultValue="workout" className="w-full">
                    <TabsList className="mb-6 w-full grid grid-cols-2 bg-cyber-terminal-bg border">
                      <TabsTrigger
                        value="workout"
                        className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
                      >
                        <DumbbellIcon className="mr-2 size-4" />
                        <span className="hidden sm:inline text-gray-500">
                          Workout Plan
                        </span>
                        <span className="sm:hidden">Workout</span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="diet"
                        className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-sm"
                      >
                        <AppleIcon className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline text-gray-500">
                          Diet Plan
                        </span>
                        <span className="sm:hidden">Diet</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="workout">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                          <span className="font-mono text-xs sm:text-sm text-gray-500">
                            SCHEDULE:{" "}
                            {currentPlan.workoutPlan.schedule.join(", ")}
                          </span>
                        </div>

                        <Accordion type="multiple" className="space-y-4">
                          {currentPlan.workoutPlan.exercises.map(
                            (exerciseDay, index) => (
                              <AccordionItem
                                key={index}
                                value={exerciseDay.day}
                                className="border rounded-lg overflow-hidden"
                              >
                                <AccordionTrigger className="px-3 sm:px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                                  <div className="flex flex-col sm:flex-row sm:justify-between w-full items-start sm:items-center gap-2">
                                    <span className="text-primary text-sm sm:text-base">
                                      {exerciseDay.day}
                                    </span>
                                    <div className="text-xs text-muted-foreground">
                                      {exerciseDay.routines.length} EXERCISES
                                    </div>
                                  </div>
                                </AccordionTrigger>

                                <AccordionContent className="pb-4 px-3 sm:px-4">
                                  <div className="space-y-3 mt-2">
                                    {exerciseDay.routines.map(
                                      (routine, routineIndex) => (
                                        <div
                                          key={routineIndex}
                                          className="border border-border rounded p-3 bg-background/50"
                                        >
                                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                                            <h4 className="font-semibold text-foreground text-sm sm:text-base">
                                              {routine.name}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                              <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                                                {routine.sets} SETS
                                              </div>
                                              <div className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mono">
                                                {routine.reps} REPS
                                              </div>
                                            </div>
                                          </div>
                                          {routine.description && (
                                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                              {routine.description}
                                            </p>
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )
                          )}
                        </Accordion>
                      </div>
                    </TabsContent>

                    <TabsContent value="diet">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                          <span className="font-mono text-xs sm:text-sm text-muted-foreground">
                            DAILY CALORIE TARGET
                          </span>
                          <div className="font-mono text-lg sm:text-xl text-primary">
                            {currentPlan.dietPlan.dailyCalories} KCAL
                          </div>
                        </div>

                        <div className="h-px w-full bg-border my-4"></div>

                        <div className="space-y-4">
                          {currentPlan.dietPlan.meals.map((meal, index) => (
                            <div
                              key={index}
                              className="border border-border rounded-lg overflow-hidden p-3 sm:p-4"
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <h4 className="font-mono text-primary text-sm sm:text-base">
                                  {meal.name}
                                </h4>
                              </div>
                              <ul className="space-y-2">
                                {meal.foods.map((food, foodIndex) => (
                                  <li
                                    key={foodIndex}
                                    className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                                  >
                                    <span className="text-xs text-primary font-mono">
                                      {String(foodIndex + 1).padStart(2, "0")}
                                    </span>
                                    {food}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          ) : (
            <NoPlans />
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
