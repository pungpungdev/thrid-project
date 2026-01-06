const { PrismaClient } = require("@prisma/client");
const { subGroup } = require("../prismaClient");
const prisma = new PrismaClient();

exports.getUserStats = async (req, res) => {
  try {
    const adminCount = await prisma.user.count({ where: { role: "Admin" } });
    const teacherCount = await prisma.user.count({
      where: { role: "Teacher" },
    });
    const committeeCount = await prisma.user.count({
      where: { role: "Committee" },
    });
    res.json({ Admin: adminCount, Teacher: teacherCount, Committee: committeeCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentStats = async (req, res) => {
  try {
    const active = await prisma.student.count({ where: { actives: true } });
    const inactive = await prisma.student.count({ where: { actives: false } });
    res.json({ Active: active, Inactive: inactive });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCompareSubjectByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const where = year ? { year: Number(year) } : {};

    const annualCourses = await prisma.annualCourse.findMany({
      where,
      include: {
        faculty: true,
        major: true,
        subjects: {
          include: {
            subject: {
              include: {
                subGroup: true,
              },
            },
          },
        },
      },
    });
    res.json(annualCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
