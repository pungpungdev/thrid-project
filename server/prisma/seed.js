require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

async function cleanDatabase() {
  await prisma.studentTranscriptGrade.deleteMany();
  await prisma.studentTransfer.deleteMany();
  await prisma.annualCourseSubject.deleteMany();
  await prisma.annualCourse.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.subGroup.deleteMany();
  await prisma.user.deleteMany();
  await prisma.student.deleteMany();
  await prisma.major.deleteMany();
  await prisma.faculty.deleteMany();
}

async function seedDatabase() {
  // Create Faculty & Major
  const faculty = await prisma.faculty.create({
    data: { name: "บริหารธุรกิจ" },
  });

  const major = await prisma.major.create({
    data: {
      name: "เทคโนโลยีสารสนเทศและธุรกิจดิจิทัล",
      faculty_id: faculty.id,
    },
  });

  // Create Student
  const student = await prisma.student.create({
    data: {
      student_id: "676051000065-8",
      password: await bcrypt.hash("password123", 10),
      title_th: "นาย",
      firstname_th: "อานนท์",
      lastname_th: "กิมเจริญพิริย",
      telephone: "0899999999",
      email: "anon@example.com",
      faculties_id: faculty.id,
      majors_id: major.id,
      actives: true,
    },
  });

  // Create User (Admin)
  const user = await prisma.user.create({
    data: {
      username: "admin",
      password: await bcrypt.hash("admin123", 10),
      firstname: "System",
      lastname: "Admin",
      telephone: "0812345678",
      email: "admin@example.com",
      faculties_id: faculty.id,
      majors_id: major.id,
      role: "Admin",
      actives: true,
    },
  });

  // Create User (Teacher)
  const teacher = await prisma.user.create({
    data: {
      username: "teacher",
      password: await bcrypt.hash("teacher123", 10),
      firstname: "System",
      lastname: "Teacher",
      telephone: "0812345678",
      email: "teacher@example.com",
      faculties_id: faculty.id,
      majors_id: major.id,
      role: "Teacher",
      actives: true,
    },
  });

  // Create User (Committee)
  const committee = await prisma.user.create({
    data: {
      username: "committee",
      password: await bcrypt.hash("committee123", 10),
      firstname: "System",
      lastname: "Committee",
      telephone: "0812345678",
      email: "committee@example.com",
      faculties_id: faculty.id,
      majors_id: major.id,
      role: "Committee",
      actives: true,
    },
  });

  // Create SubGroups
  const subGroupsData = [
    { codeSubject: "EXP", nameSubject: "กลุ่มวิชาฝึกประสบการณ์วิชาชีพ" },
    { codeSubject: "CS", nameSubject: "กลุ่มวิชาคอมพิวเตอร์พื้นฐาน" },
    { codeSubject: "BUS", nameSubject: "กลุ่มวิชาธุรกิจดิจิทัล" },
  ];

  await prisma.subGroup.createMany({ data: subGroupsData });

  const subGroups = await prisma.subGroup.findMany();
  const getSubGroupId = (code) =>
    subGroups.find((g) => g.codeSubject === code)?.id;

  // Create Subjects
  const subjectsData = [
    {
      id: 1,
      subId: "30202-8001",
      subName: "ฝึกงาน",
      subUnit: 4,
      groupCode: "EXP",
    },
    {
      id: 2,
      subId: "30204-2005",
      subName: "การเขียนโปรแกรมคอมพิวเตอร์",
      subUnit: 3,
      groupCode: "CS",
    },
    {
      id: 3,
      subId: "30204-2102",
      subName: "การวิเคราะห์เชิงธุรกิจดิจิทัล",
      subUnit: 3,
      groupCode: "BUS",
    },
    {
      id: 4,
      subId: "30204-2301",
      subName: "การออกแบบประสบการณ์ผู้ใช้",
      subUnit: 3,
      groupCode: "BUS",
    },
    {
      id: 5,
      subId: "30204-2401",
      subName: "การออกแบบและพัฒนาเว็บไซต์",
      subUnit: 3,
      groupCode: "CS",
    },
    {
      id: 6,
      subId: "30204-2002",
      subName: "ระบบฐานข้อมูลและคลังข้อมูล",
      subUnit: 3,
      groupCode: "CS",
    },
    {
      id: 7,
      subId: "30204-2104",
      subName: "หลักการพัฒนาโปรแกรมประยุกต์ธุรกิจดิจิทัล",
      subUnit: 3,
      groupCode: "BUS",
    },
  ];

  await prisma.subject.createMany({
    data: subjectsData.map((s) => ({
      id: s.id,
      subId: s.subId,
      subName: s.subName,
      subUnit: s.subUnit,
      facultiesId: faculty.id,
      majorId: major.id,
      subGroupId: getSubGroupId(s.groupCode),
      actives: true,
    })),
  });

  // Create Annual Course
  const annualCourse = await prisma.annualCourse.create({
    data: {
      year: 2567,
      term: 1,
      startDate: new Date("2024-06-01"),
      endDate: new Date("2024-10-30"),
      facultyId: faculty.id,
      majorId: major.id,
      actives: true,
    },
  });

  // Create Annual Course Subjects
  await prisma.annualCourseSubject.createMany({
    data: subjectsData.map((s) => ({
      annualCourseId: annualCourse.id,
      subjectId: s.id,
    })),
  });

  const TransferData = [
    {
      id: "5-155-302",
      name: "การฝึกงาน (Job Training)",
      credits: "3(0-40-0)",
      groups: [
        {
          groupId: 1,
          courses: [
            { id: "30202-8001", name: "ฝึกงาน", credits: 4, grade: "" },
          ],

          selected: false,
        },
        {
          groupId: 2,
          courses: [
            { id: "30204-8001", name: "ฝึกงาน", credits: 4, grade: "4" },
          ],
          selected: true,
        },
        {
          groupId: 3,
          courses: [
            { id: "30901-8001", name: "ฝึกงาน", credits: 4, grade: "" },
          ],
          selected: false,
        },
      ],
    },
    {
      id: "5-151-121",
      name: "การพัฒนาโปรแกรมคอมพิวเตอร์ (Computer Programming)",
      credits: "3(0-6-3)",
      groups: [
        {
          groupId: 1,
          courses: [
            {
              id: "30204-2005",
              name: "การเขียนโปรแกรมคอมพิวเตอร์",
              credits: 3,
              grade: "2.5",
            },
          ],
          selected: true,
        },
        {
          groupId: 2,
          courses: [
            {
              id: "30901-1001",
              name: "การโปรแกรมคอมพิวเตอร์เชิงโครงสร้าง",
              credits: 3,
              grade: "",
            },
          ],
          selected: false,
        },
      ],
    }
  ];
  // Student Transfer
  const transfer = await prisma.studentTransfer.create({
    data: {
      studentId: student.id,
      annualCourseId: annualCourse.id,
      status: "APPROVED",
      transferData: JSON.stringify(TransferData),
    },
  });

  // Transcript Grades
  /* const grades = [4.0, 2.5, 3.5, 3.0, 3.0, 3.0, 3.5];
  await prisma.studentTranscriptGrade.createMany({
    data: subjectsData.map((s, idx) => ({
      studentTransfer_id: transfer.id,
      subjectId: s.id,
      grade: grades[idx],
    })),
  }); */

  console.log("✅ Seeding completed.");
}

cleanDatabase()
  .then(seedDatabase)
  .then(() => prisma.$disconnect())
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    return prisma.$disconnect();
  });
