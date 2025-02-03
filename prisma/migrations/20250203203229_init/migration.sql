-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "organizationId" TEXT,
    CONSTRAINT "post_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "post_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "role" TEXT,
    "banned" BOOLEAN,
    "banReason" TEXT,
    "banExpires" DATETIME
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    "impersonatedBy" TEXT,
    "activeOrganizationId" TEXT,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "organization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "logo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "metadata" TEXT
);

-- CreateTable
CREATE TABLE "member" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT,
    "status" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inviterId" TEXT NOT NULL,
    CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "appointment_cid" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appointmentId" TEXT NOT NULL,
    "cidId" TEXT NOT NULL,
    "organizationId" TEXT,
    CONSTRAINT "appointment_cid_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appointment_cid_cidId_fkey" FOREIGN KEY ("cidId") REFERENCES "cid" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appointment_cid_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "appointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "motive" TEXT NOT NULL,
    "subjective" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "evaluation" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "organizationId" TEXT,
    CONSTRAINT "appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appointment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "appointment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "cellphone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sex" TEXT NOT NULL,
    "responsible" TEXT,
    "nationality" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "occupation" TEXT NOT NULL,
    "sexualOrientation" TEXT,
    "civilStatus" TEXT NOT NULL,
    "bloodType" TEXT NOT NULL,
    "genderIdentity" TEXT NOT NULL,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ownerId" TEXT NOT NULL,
    "organizationId" TEXT,
    "userId" TEXT,
    CONSTRAINT "patient_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "patient_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vaccinations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT NOT NULL,
    "vaccinationsValuesId" TEXT NOT NULL,
    "organizationId" TEXT,
    CONSTRAINT "vaccinations_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "vaccinations_vaccinationsValuesId_fkey" FOREIGN KEY ("vaccinationsValuesId") REFERENCES "vaccinations_values" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "vaccinations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vaccinations_values" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "allergies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT,
    "allergiesValuesId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "organizationId" TEXT,
    CONSTRAINT "allergies_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "allergies_allergiesValuesId_fkey" FOREIGN KEY ("allergiesValuesId") REFERENCES "allergies_values" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "allergies_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "allergies_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "allergies_values" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "medications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT,
    "medicationsValuesId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "organizationId" TEXT,
    CONSTRAINT "medications_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "medications_medicationsValuesId_fkey" FOREIGN KEY ("medicationsValuesId") REFERENCES "medications_values" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "medications_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "medications_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medications_values" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "exam_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT NOT NULL,
    "examResultsValuesId" TEXT NOT NULL,
    "organizationId" TEXT,
    CONSTRAINT "exam_results_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "exam_results_examResultsValuesId_fkey" FOREIGN KEY ("examResultsValuesId") REFERENCES "exam_results_values" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "exam_results_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exam_results_values" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "comorbidities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT,
    "comorbiditiesValuesId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "organizationId" TEXT,
    CONSTRAINT "comorbidities_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comorbidities_comorbiditiesValuesId_fkey" FOREIGN KEY ("comorbiditiesValuesId") REFERENCES "comorbidities_values" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comorbidities_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "comorbidities_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "comorbidities_values" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "surgeries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT NOT NULL,
    "surgeriesValuesId" TEXT NOT NULL,
    "organizationId" TEXT,
    CONSTRAINT "surgeries_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "surgeries_surgeriesValuesId_fkey" FOREIGN KEY ("surgeriesValuesId") REFERENCES "surgeries_values" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "surgeries_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "surgeries_values" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "health_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "patientId" TEXT NOT NULL,
    "healthPlansValuesId" TEXT NOT NULL,
    "organizationId" TEXT,
    CONSTRAINT "health_plans_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patient" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "health_plans_healthPlansValuesId_fkey" FOREIGN KEY ("healthPlansValuesId") REFERENCES "health_plans_values" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "health_plans_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "health_plans_values" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "post_slug_idx" ON "post"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "organization_slug_key" ON "organization"("slug");

-- CreateIndex
CREATE INDEX "cid_code_idx" ON "cid"("code");

-- CreateIndex
CREATE UNIQUE INDEX "cid_code_key" ON "cid"("code");

-- CreateIndex
CREATE UNIQUE INDEX "appointment_cid_appointmentId_cidId_key" ON "appointment_cid"("appointmentId", "cidId");

-- CreateIndex
CREATE UNIQUE INDEX "patient_userId_organizationId_key" ON "patient"("userId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "vaccinations_patientId_vaccinationsValuesId_key" ON "vaccinations"("patientId", "vaccinationsValuesId");

-- CreateIndex
CREATE UNIQUE INDEX "vaccinations_values_value_key" ON "vaccinations_values"("value");

-- CreateIndex
CREATE UNIQUE INDEX "allergies_patientId_allergiesValuesId_key" ON "allergies"("patientId", "allergiesValuesId");

-- CreateIndex
CREATE UNIQUE INDEX "allergies_values_value_key" ON "allergies_values"("value");

-- CreateIndex
CREATE UNIQUE INDEX "medications_patientId_medicationsValuesId_key" ON "medications"("patientId", "medicationsValuesId");

-- CreateIndex
CREATE UNIQUE INDEX "medications_values_value_key" ON "medications_values"("value");

-- CreateIndex
CREATE UNIQUE INDEX "exam_results_patientId_examResultsValuesId_key" ON "exam_results"("patientId", "examResultsValuesId");

-- CreateIndex
CREATE UNIQUE INDEX "exam_results_values_value_key" ON "exam_results_values"("value");

-- CreateIndex
CREATE UNIQUE INDEX "comorbidities_patientId_comorbiditiesValuesId_key" ON "comorbidities"("patientId", "comorbiditiesValuesId");

-- CreateIndex
CREATE UNIQUE INDEX "comorbidities_values_value_key" ON "comorbidities_values"("value");

-- CreateIndex
CREATE UNIQUE INDEX "surgeries_patientId_surgeriesValuesId_key" ON "surgeries"("patientId", "surgeriesValuesId");

-- CreateIndex
CREATE UNIQUE INDEX "surgeries_values_value_key" ON "surgeries_values"("value");

-- CreateIndex
CREATE UNIQUE INDEX "health_plans_patientId_healthPlansValuesId_key" ON "health_plans"("patientId", "healthPlansValuesId");

-- CreateIndex
CREATE UNIQUE INDEX "health_plans_values_value_key" ON "health_plans_values"("value");
