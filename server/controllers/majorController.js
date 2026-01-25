const prisma = require("../prismaClient");

exports.getMajors = async (req, res) => {
  const { facultyId } = req.query;
  const majors = await prisma.major.findMany({
    where: facultyId
      ? {
          faculty_id: Number(facultyId),
        }
      : {},
    include: { faculty: true },
  });
  res.json(majors);
};

exports.getMajorById = async (req, res) => {
  const major = await prisma.major.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  major ? res.json(major) : res.status(404).json({ error: "Major not found" });
};

exports.createMajor = async (req, res) => {
  try {
    const major = await prisma.major.create({ data: req.body });
    res.status(201).json(major);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMajor = async (req, res) => {
  try {
    const major = await prisma.major.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(major);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMajor = async (req, res) => {
  try {
    const major = await prisma.major.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: "Major deleted", major });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
