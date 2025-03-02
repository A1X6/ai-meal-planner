-- CreateTable
CREATE TABLE "SavedMealPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mealPlanData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedMealPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedMealPlan_userId_createdAt_idx" ON "SavedMealPlan"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "SavedMealPlan_name_idx" ON "SavedMealPlan"("name");

-- CreateIndex
CREATE INDEX "Profile_subscriptionActive_subscriptionTier_idx" ON "Profile"("subscriptionActive", "subscriptionTier");

-- AddForeignKey
ALTER TABLE "SavedMealPlan" ADD CONSTRAINT "SavedMealPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
