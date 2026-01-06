const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSubject = async (req, res) => {
  try {
    const subject = await prisma.subject.create({ data: req.body });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany();
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: req.params.id },
    });
    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const updated = await prisma.subject.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    await prisma.subject.update({
      where: { id: req.params.id },
      data: { actives: true },
    });
    res.json({ message: 'Subject soft deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
