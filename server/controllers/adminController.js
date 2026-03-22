const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Try to find user in user table
    let user = await prisma.user.findUnique({
      where: { username },
    });

    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
      return res.json({ user: req.session.user });
    }

    let student = await prisma.student.findUnique({
      where: { student_id: username },
    });

    if (student) {
      const valid = await bcrypt.compare(password, student.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.session.user = {
        id: student.id,
        username: student.student_id,
        role: "Student",
      };
      return res.json({ user: req.session.user });
    }

    // If neither found
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.authenticate = (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};

exports.updatePassword = async (req, res) => {
  try {
    const data = { ...req.body };
    // If password is being updated, hash it

    let findStudent = await prisma.student.findUnique({
      where: { student_id: data.username },
    });

    let findUser = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (findStudent) {
      const valid = await bcrypt.compare(
        data.oldPassword,
        findStudent.password,
      );
      if (!valid) {
        return res
          .status(401)
          .json({ error: "โปรดกรอกรหัสผ่านเก่าให้ถูกต้อง" });
      } else {
        if (data.newPassword !== data.newPassword2) {
          return res
            .status(400)
            .json({ error: "โปรดกรอกรหัสผ่านใหม่ให้ตรงกัน" });
        } else {
          data.newPassword = await bcrypt.hash(data.newPassword, 10);
          const student = await prisma.student.update({
            where: { student_id: data.username },
            data: { password: data.newPassword },
          });
          res.json(student);
        }
      }
    } else if (findUser) {
      const valid = await bcrypt.compare(
        data.oldPassword,
        findUser.password,
      );
      if (!valid) {
        return res
          .status(401)
          .json({ error: "โปรดกรอกรหัสผ่านเก่าให้ถูกต้อง" });
      } else {
        if (data.newPassword !== data.newPassword2) {
          return res
            .status(400)
            .json({ error: "โปรดกรอกรหัสผ่านใหม่ให้ตรงกัน" });
        } else {
          data.newPassword = await bcrypt.hash(data.newPassword, 10);
          const user = await prisma.user.update({
            where: { username: data.username },
            data: { password: data.newPassword },
          });
          res.json(user);
        }
      }
    } else {
      return res.status(400).json({ error: "ไม่เจอผู้ใช้งานนี้" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
