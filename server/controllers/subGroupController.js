const prisma = require('../prismaClient');

exports.getSubGroups = async (req, res) => {
  const subGroups = await prisma.subGroup.findMany();
  res.json(subGroups);
};