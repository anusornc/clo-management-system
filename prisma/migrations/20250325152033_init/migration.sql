-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "department" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "descriptionTh" TEXT,
    "credits" INTEGER NOT NULL,
    "faculty" TEXT,
    "department" TEXT,
    "prerequisites" TEXT,
    "corequisites" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Course_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "version" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "courseId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DocumentVersion_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DocumentVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CLO" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionTh" TEXT NOT NULL,
    "bloomLevel" TEXT NOT NULL,
    "documentVersionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CLO_documentVersionId_fkey" FOREIGN KEY ("documentVersionId") REFERENCES "DocumentVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PLO" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codeEn" TEXT NOT NULL,
    "codeTh" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionTh" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TeachingMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "documentVersionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TeachingMethod_documentVersionId_fkey" FOREIGN KEY ("documentVersionId") REFERENCES "DocumentVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AssessmentMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nameEn" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "documentVersionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AssessmentMethod_documentVersionId_fkey" FOREIGN KEY ("documentVersionId") REFERENCES "DocumentVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CLOPLOMapping" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "strength" TEXT NOT NULL DEFAULT 'NONE',
    "cloId" TEXT NOT NULL,
    "ploId" TEXT NOT NULL,
    "documentVersionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CLOPLOMapping_cloId_fkey" FOREIGN KEY ("cloId") REFERENCES "CLO" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CLOPLOMapping_ploId_fkey" FOREIGN KEY ("ploId") REFERENCES "PLO" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CLOPLOMapping_documentVersionId_fkey" FOREIGN KEY ("documentVersionId") REFERENCES "DocumentVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CLOTeachingMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "cloId" TEXT NOT NULL,
    "methodId" TEXT NOT NULL,
    "documentVersionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CLOTeachingMethod_cloId_fkey" FOREIGN KEY ("cloId") REFERENCES "CLO" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CLOTeachingMethod_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "TeachingMethod" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CLOTeachingMethod_documentVersionId_fkey" FOREIGN KEY ("documentVersionId") REFERENCES "DocumentVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CLOAssessmentMethod" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "percentage" REAL NOT NULL DEFAULT 0,
    "cloId" TEXT NOT NULL,
    "methodId" TEXT NOT NULL,
    "documentVersionId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CLOAssessmentMethod_cloId_fkey" FOREIGN KEY ("cloId") REFERENCES "CLO" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CLOAssessmentMethod_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "AssessmentMethod" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CLOAssessmentMethod_documentVersionId_fkey" FOREIGN KEY ("documentVersionId") REFERENCES "DocumentVersion" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CLOPLOMapping_cloId_ploId_key" ON "CLOPLOMapping"("cloId", "ploId");

-- CreateIndex
CREATE UNIQUE INDEX "CLOTeachingMethod_cloId_methodId_key" ON "CLOTeachingMethod"("cloId", "methodId");

-- CreateIndex
CREATE UNIQUE INDEX "CLOAssessmentMethod_cloId_methodId_key" ON "CLOAssessmentMethod"("cloId", "methodId");
