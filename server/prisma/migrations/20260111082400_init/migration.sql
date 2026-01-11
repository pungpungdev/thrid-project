-- CreateTable
CREATE TABLE `Faculty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Major` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `faculty_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    INDEX `Major_faculty_id_idx`(`faculty_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `title_th` VARCHAR(191) NOT NULL,
    `firstname_th` VARCHAR(191) NOT NULL,
    `lastname_th` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `faculties_id` INTEGER NOT NULL,
    `majors_id` INTEGER NOT NULL,
    `certificate` VARCHAR(191) NULL DEFAULT '',
    `profile_img` VARCHAR(191) NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL,
    `actives` BOOLEAN NOT NULL,

    UNIQUE INDEX `Student_student_id_key`(`student_id`),
    INDEX `Student_faculties_id_idx`(`faculties_id`),
    INDEX `Student_majors_id_idx`(`majors_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstname` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `faculties_id` INTEGER NULL,
    `majors_id` INTEGER NULL,
    `profile_img` VARCHAR(191) NULL DEFAULT '',
    `role` VARCHAR(191) NOT NULL,
    `actives` BOOLEAN NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    INDEX `User_faculties_id_idx`(`faculties_id`),
    INDEX `User_majors_id_idx`(`majors_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `facultiesId` INTEGER NOT NULL,
    `subId` VARCHAR(15) NOT NULL,
    `subName` VARCHAR(45) NOT NULL,
    `subUnit` DOUBLE NOT NULL,
    `subGroupId` INTEGER NOT NULL,
    `majorId` INTEGER NULL,
    `actives` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualCourse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `term` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `facultyId` INTEGER NOT NULL,
    `majorId` INTEGER NOT NULL,
    `actives` BOOLEAN NOT NULL DEFAULT false,

    INDEX `AnnualCourse_facultyId_idx`(`facultyId`),
    INDEX `AnnualCourse_majorId_idx`(`majorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codeSubject` VARCHAR(191) NOT NULL DEFAULT '',
    `nameSubject` VARCHAR(191) NOT NULL DEFAULT '',
    `description` VARCHAR(191) NULL DEFAULT '',
    `unit` DOUBLE NOT NULL DEFAULT 0,
    `actives` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnnualCourseSubject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `annualCourseId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,

    UNIQUE INDEX `AnnualCourseSubject_annualCourseId_subjectId_key`(`annualCourseId`, `subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentTransfer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `annualCourseId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentTranscriptGrade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentTransfer_id` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `grade` DOUBLE NOT NULL,

    INDEX `StudentTranscriptGrade_studentTransfer_id_idx`(`studentTransfer_id`),
    INDEX `StudentTranscriptGrade_subjectId_idx`(`subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Major` ADD CONSTRAINT `Major_faculty_id_fkey` FOREIGN KEY (`faculty_id`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_faculties_id_fkey` FOREIGN KEY (`faculties_id`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_majors_id_fkey` FOREIGN KEY (`majors_id`) REFERENCES `Major`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_faculties_id_fkey` FOREIGN KEY (`faculties_id`) REFERENCES `Faculty`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_majors_id_fkey` FOREIGN KEY (`majors_id`) REFERENCES `Major`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_facultiesId_fkey` FOREIGN KEY (`facultiesId`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subject` ADD CONSTRAINT `Subject_subGroupId_fkey` FOREIGN KEY (`subGroupId`) REFERENCES `SubGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualCourse` ADD CONSTRAINT `AnnualCourse_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualCourse` ADD CONSTRAINT `AnnualCourse_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualCourseSubject` ADD CONSTRAINT `AnnualCourseSubject_annualCourseId_fkey` FOREIGN KEY (`annualCourseId`) REFERENCES `AnnualCourse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AnnualCourseSubject` ADD CONSTRAINT `AnnualCourseSubject_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentTransfer` ADD CONSTRAINT `StudentTransfer_annualCourseId_fkey` FOREIGN KEY (`annualCourseId`) REFERENCES `AnnualCourse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentTranscriptGrade` ADD CONSTRAINT `StudentTranscriptGrade_studentTransfer_id_fkey` FOREIGN KEY (`studentTransfer_id`) REFERENCES `StudentTransfer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentTranscriptGrade` ADD CONSTRAINT `StudentTranscriptGrade_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
