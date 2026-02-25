const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { sendWelcomeMail } = require("./mailController");
const prisma = new PrismaClient();

exports.getStudents = async (req, res) => {
  const students = await prisma.student.findMany({
    where: { actives: true },
    include: { major: true, faculty: true },
  });
  res.json(students);
};

exports.getStudentById = async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  student
    ? res.json(student)
    : res.status(404).json({ error: "Student not found" });
};

exports.createStudent = async (req, res) => {
  const { password, ...rest } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await prisma.student.create({
      data: {
        password: hashedPassword,
        ...rest,
      },
    });

    sendWelcomeMail(student.email, student.student_id)
      .then(() => console.log("Welcome email sent"))
      .catch((err) => console.error("Failed to send welcome email:", err));

    res.status(200).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const data = { ...req.body };
    // If password is being updated, hash it
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const student = await prisma.student.update({
      where: { id: parseInt(req.params.id) },
      data,
    });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.softDeleteStudent = async (req, res) => {
  try {
    const student = await prisma.student.update({
      where: { id: parseInt(req.params.id) },
      data: { actives: false },
    });
    res.json({ message: "Student deactivated", student });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.bulkStudents = async (req, res) => {
  const students = req.body;
  try {
    /* const createdStudents = await prisma.student.createMany({
      data: students.map((student) => ({
        ...student,
        password: bcrypt.hashSync(student.password, 10),
      })),
    }); */

    const excelData = students.map((student) => ({
      ...student,
      password: bcrypt.hashSync(student.password, 10),
    }));
    // 2. ใช้ Transaction เพื่อความเร็วและความถูกต้อง (All or Nothing)
    // การใช้ map เพื่อสร้าง Array ของ Promise และใช้ $transaction จัดการ
    const operations = excelData.map((student) =>
      prisma.student.upsert({
        where: { student_id: student.student_id },
        update: { ...student }, // ถ้าซ้ำให้เขียนทับด้วยข้อมูลใหม่จาก Excel
        create: { ...student }, // ถ้าไม่ซ้ำให้สร้างใหม่
      }),
    );

    const results = await prisma.$transaction(operations);
    res
      .status(201)
      .json({ message: "Students imported", count: results.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
