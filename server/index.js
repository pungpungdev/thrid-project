const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const userRoutes = require("./routes/userRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const majorRoutes = require("./routes/majorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const annualCourseRoutes = require("./routes/annualCourseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const mailRoutes = require("./routes/mailRoutes");
const docRoutes = require("./routes/docRoutes");
const summaryRoutes = require("./routes/summaryRoutes");
const subGroupRoutes = require("./routes/subGroupRoutes");
const studentTransferRoutes = require("./routes/studentTransferRoutes");

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(
  session({
    secret: "b2e6f8c7-1a4d-4f9a-8e2c-7d3a9b5c2f1e",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.get("/", (req, res) => {
  res.send("Hello transfer server API");
});

const setupSwagger = require("./swaggerConfig");
setupSwagger(app);

app.use("/api/students", studentRoutes);
app.use("/api/annual-courses", annualCourseRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/majors", majorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/doc", docRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/sub-groups", subGroupRoutes);
app.use("/api/student-transfers", studentTransferRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
