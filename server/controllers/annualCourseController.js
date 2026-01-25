const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createAnnualCourse = async (req, res) => {
  try {
    const annualCourse = await prisma.annualCourse.create({ data: req.body });
    res.json(annualCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAnnualCourses = async (req, res) => {
  try {
    const annualCourses = await prisma.annualCourse.findMany({
      include: {
        faculty: true,
        major: true,
        subjects: {
          include: {
            subject: {
              include: { subGroup: true },
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

exports.getAnnualCourseById = async (req, res) => {
  try {
    const annualCourse = await prisma.annualCourse.findUnique({
      where: { id: Number(req.params.id) },
      include: { faculty: true, major: true, subjects: true },
    });
    if (!annualCourse) return res.status(404).json({ error: "Not found" });
    res.json(annualCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAnnualCourse = async (req, res) => {
  try {
    const updated = await prisma.annualCourse.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAnnualCourse = async (req, res) => {
  try {
    await prisma.annualCourse.update({
      where: { id: Number(req.params.id) },
      data: { actives: false },
    });
    res.json({ message: "AnnualCourse deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.activeAnuualCourse = async (req, res) => {
  try {
    await prisma.annualCourse.update({
      where: { id: Number(req.params.id) },
      data: { actives: true },
    });
    res.json({ message: "AnnualCourse actived" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAnnualCourseSubject = async (req, res) => {
  try {
    const acSubject = await prisma.annualCourseSubject.create({
      data: req.body,
    });
    res.json(acSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAnnualCourseSubjects = async (req, res) => {
  try {
    const acSubjects = await prisma.annualCourseSubject.findMany({
      include: { annualCourse: true, subject: true },
    });
    res.json(acSubjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnnualCourseSubjectById = async (req, res) => {
  try {
    const acSubject = await prisma.annualCourseSubject.findUnique({
      where: { id: Number(req.params.id) },
      include: { annualCourse: true, subject: true },
    });
    if (!acSubject) return res.status(404).json({ error: "Not found" });
    res.json(acSubject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAnnualCourseSubject = async (req, res) => {
  try {
    const updated = await prisma.annualCourseSubject.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAnnualCourseSubject = async (req, res) => {
  try {
    await prisma.annualCourseSubject.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "AnnualCourseSubject deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAnnualCourseSubjectByAnnualCourseId = async (req, res) => {
  try {
    await prisma.annualCourseSubject.deleteMany({
      where: { annualCourseId: Number(req.params.id) },
    });
    res.json({ message: "AnnualCourseSubject deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
