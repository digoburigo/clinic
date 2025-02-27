-- DropIndex
DROP INDEX "allergies_patientId_allergiesValuesId_key";

-- DropIndex
DROP INDEX "comorbidities_patientId_comorbiditiesValuesId_key";

-- DropIndex
DROP INDEX "exam_results_patientId_examResultsValuesId_key";

-- DropIndex
DROP INDEX "health_plans_patientId_healthPlansValuesId_key";

-- DropIndex
DROP INDEX "medications_patientId_medicationsValuesId_key";

-- DropIndex
DROP INDEX "surgeries_patientId_surgeriesValuesId_key";

-- DropIndex
DROP INDEX "vaccinations_patientId_vaccinationsValuesId_key";

-- AlterTable
ALTER TABLE "exam_results" ADD COLUMN "date" DATETIME;
ALTER TABLE "exam_results" ADD COLUMN "result" TEXT;

-- CreateTable
CREATE TABLE "default_objective_information" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT,
    "organizationId" TEXT,
    CONSTRAINT "default_objective_information_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "default_objective_information_organizationId_key" ON "default_objective_information"("organizationId");
