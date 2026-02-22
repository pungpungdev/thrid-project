const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createStudentTransfer = async (req, res) => {
  try {
    console.log("Creating student transfer with data:", req.body);
    const studentTransfer = await prisma.studentTransfer.create({ data: req.body });
    res.status(201).json(studentTransfer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudentTransfer = async (req, res) => {
  try {
    const updated = await prisma.studentTransfer.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStudentTransfer = async (req, res) => {
  try {
    await prisma.studentTransfer.update({
      where: { id: Number(req.params.id) },
      data: { actives: false },
    });
    res.json({ message: "Student transfer soft deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.ActiveStudentTransfer = async (req, res) => {
  try {
    const studentTransfer = await prisma.studentTransfer.update({
      where: { id: parseInt(req.params.id) },
      data: { actives: true },
    });
    res.json({ message: "Student transfer activated", studentTransfer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getStudentTransfers = async (req, res) => {
  const studentTransfer = await prisma.studentTransfer.findMany({
    where: { actives: true },
  });
  res.json(studentTransfer);
};

exports.getInactiveStudentTransfers = async (req, res) => {
  const studentTransfer = await prisma.studentTransfer.findMany({
    where: { actives: false },
  });
  res.json(studentTransfer);
};

exports.getStudentTransferById = async (req, res) => {
  const studentTransfer = await prisma.studentTransfer.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  studentTransfer ? res.json(studentTransfer) : res.status(404).json({ error: "Student transfer not found" });
};