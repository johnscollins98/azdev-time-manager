-- CreateTable
CREATE TABLE "HourLog" (
    "iterationId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hourIndex" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "HourLog_pkey" PRIMARY KEY ("date","hourIndex")
);
