-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Schedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "teacherId" TEXT NOT NULL,
    "locationId" TEXT,
    "substituteTeacherId" TEXT,
    "isSubstitutional" BOOLEAN NOT NULL DEFAULT false,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Schedule_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Schedule_substituteTeacherId_fkey" FOREIGN KEY ("substituteTeacherId") REFERENCES "Teacher" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Schedule_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Schedule" ("createdAt", "dayOfWeek", "endTime", "id", "isSubstitutional", "locationId", "startTime", "substituteTeacherId", "teacherId", "updatedAt") SELECT "createdAt", "dayOfWeek", "endTime", "id", "isSubstitutional", "locationId", "startTime", "substituteTeacherId", "teacherId", "updatedAt" FROM "Schedule";
DROP TABLE "Schedule";
ALTER TABLE "new_Schedule" RENAME TO "Schedule";
CREATE INDEX "Schedule_dayOfWeek_startTime_endTime_idx" ON "Schedule"("dayOfWeek", "startTime", "endTime");
CREATE INDEX "Schedule_teacherId_idx" ON "Schedule"("teacherId");
CREATE INDEX "Schedule_locationId_idx" ON "Schedule"("locationId");
CREATE INDEX "Schedule_substituteTeacherId_idx" ON "Schedule"("substituteTeacherId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
