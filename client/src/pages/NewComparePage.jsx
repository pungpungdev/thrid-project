import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import { debounce } from "lodash";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  TextField,
  Chip,
  Tabs,
  Tab,
  Stack,
  Card,
  CardContent,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import * as annualService from "../services/annualCourseService";

import CustomAlert from "../components/CustomAlert";
import DefaultTable from "../components/DefaultTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { getStudents } from "../services/studentService";
import {
  activateStudentTransfer,
  createStudentTransfer,
  deleteStudentTransfer,
  getInactiveStudentTransfers,
  getStudentTransfer,
  getStudentTransfers,
  updateStudentTransfer,
} from "../services/studentTransferService";
import { USER_ROLES } from "../shares/roles";
import { useValidation } from "../hooks/useValidation";

const columns = [
  { field: "id", headerName: "รหัสใบเทียบ" },
  { field: "courseName", headerName: "ชื่อหลักสูตร" },
  { field: "year", headerName: "ปีการศึกษา" },
  { field: "term", headerName: "ภาคเรียนที่" },
  { field: "facultyName", headerName: "คณะ" },
  { field: "majorName", headerName: "สาขา" },

  { field: "studentId", headerName: "รหัสนักศึกษา" },
  { field: "firstName", headerName: "ชื่อ" },
  { field: "lastName", headerName: "นามสกุล" },
  { field: "actions", headerName: "ตัวเลือก" },
];

function NewComparePage() {
  const [selectedYear, setSelectedYear] = useState("");
  const [annualCourses, setAnnualCourses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [years, setYears] = useState([]);
  const [dialogViewSubjects, setDialogViewSubjects] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentTransfers, setStudentTransfers] = useState([]);
  const [studentTransfersTab2, setStudentTransfersTab2] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [transferData, setTransferData] = useState([]);

  const handleChangeYear = (e) => {
    setSelectedYear(e.target.value);
    setSummary([]);
  };

  const handleGetSummary = () => {
    const result = annualCourses.filter(
      (course) => course.year === parseInt(selectedYear),
    );
    setSummary(result);
  };

  const handleCompare = (course) => {
    setSelectedCourse(course);
    const initTransferData = [];
    course.subjects.forEach((subject) => {
      initTransferData.push({
        id: subject.subject.subId,
        name: subject.subject.subName,
        credits: subject.subject.subUnit,
        groups: [
          {
            groupId: 1,
            courses: [{ id: "", name: "", credits: "", grade: "" }],

            selected: false,
            isNotCE: false,
          },
        ],
      });
    });
    setForm({ ...form, annualCourseId: course.id });
    setTransferData(initTransferData);
    console.log("Selected Course for Compare:", course);
  };

  const handleViewSubjects = (course) => {
    console.log("Selected Course:", course);
    setSelectedSubjects(course.subjects);
    setDialogViewSubjects(true);
  };

  const handleCloseViewSubjects = () => {
    setDialogViewSubjects(false);
  };

  const [open, setOpen] = useState(false);
  const [openSendSummary, setOpenSendSummary] = useState(false);
  const [form, setForm] = useState({
    studentId: "",
    annualCourseId: "",
    status: "DRAFT",
  });
  const [editId, setEditId] = useState(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchStudents = async () => {
    const res = await getStudents();
    console.log("Fetched students:", res.data);
    setStudents(res.data);
  };

  const fetchStudentTransfers = async () => {
    const res = await getStudentTransfers();
    console.log("Fetched student transfers:", res.data);
    setStudentTransfers(res.data);
  };

  const fetchInactiveStudentTransfers = async () => {
    const res = await getInactiveStudentTransfers();
    console.log("Fetched inactive student transfers:", res.data);
    setStudentTransfersTab2(res.data);
  };

  const fetchAnnualCourses = async () => {
    const result = await annualService.getAnnualCourses();
    console.log(result.data);
    setAnnualCourses(result.data);
    const uniqueYears = [...new Set(result.data.map((c) => c.year))];
    setYears(uniqueYears);
  };
  useEffect(() => {
    const { user } = useAuth();
    console.log("userObj", user);
  }, []);
  useEffect(() => {
    fetchAnnualCourses();
    fetchStudents();
    fetchStudentTransfers();
    fetchInactiveStudentTransfers();
  }, []);

  const requiredFields = ["studentId", "annualCourseId", "status"];
  const { validate, validateTransferData, resetErrors, errors } =
    useValidation(requiredFields);

  const handleOpenSendSummary = (transfer) => {
    resetErrors();
    if (transfer) {
      setForm({
        studentId: transfer.studentId || "",
        annualCourseId: transfer.annualCourseId || "",
        status: transfer.status || "DRAFT",
      });
      setTransferData(JSON.parse(transfer.transferData));
      setSelectedCourse(
        annualCourses.find((c) => c.id === transfer.annualCourseId),
      );
      setEditId(transfer.id);
      setOpenSendSummary(true);
    }
  };

  const handleOpen = (transfer = null) => {
    resetErrors();
    if (transfer) {
      setForm({
        studentId: transfer.studentId || "",
        annualCourseId: transfer.annualCourseId || "",
        status: transfer.status || "DRAFT",
      });
      setTransferData(JSON.parse(transfer.transferData));
      setSelectedCourse(
        annualCourses.find((c) => c.id === transfer.annualCourseId),
      );
      setEditId(transfer.id);
    } else {
      setForm({
        studentId: "",
        annualCourseId: "",
        status: "DRAFT",
      });
      setSelectedCourse(null);
      setEditId(null);
    }
    setOpen(true);
  };

  const handleCloseSendSummary = () => {
    setOpenSendSummary(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  /* 
  const handleChangeTransferData = (
    subjectIdx,
    groupIdx,
    courseIdx,
    field,
    value,
  ) => {
    setTransferData((prev) => {
      const updatedTransferData = [...prev];
      updatedTransferData[subjectIdx].groups[groupIdx].courses[courseIdx][
        field
      ] = value;
      return updatedTransferData;
    });
  };
 */
  const handleChangeTransferData = (
    subjectIdx,
    groupIdx,
    courseIdx,
    field,
    value,
  ) => {
    setTransferData((prev) =>
      prev.map((subject, sIdx) => {
        if (sIdx !== subjectIdx) return subject; // ถ้าไม่ใช่ subject ที่แก้ ให้คืนค่าเดิม

        return {
          ...subject,
          groups: subject.groups.map((group, gIdx) => {
            if (gIdx !== groupIdx) return group; // ถ้าไม่ใช่ group ที่แก้ ให้คืนค่าเดิม

            return {
              ...group,
              courses: group.courses.map((course, cIdx) => {
                if (cIdx !== courseIdx) return course; // ถ้าไม่ใช่ course ที่แก้ ให้คืนค่าเดิม

                return { ...course, [field]: value }; // Update ค่าเฉพาะ field ที่ส่งมา
              }),
            };
          }),
        };
      }),
    );
  };
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleRadioChange = (subjectIdx, groupIdx, key, value) => {
  const newData = [...transferData];
  
  if (key === 'selected') {
    // สำหรับ Radio: วนลูปให้กลุ่มอื่นในวิชาเดียวกันเป็น false ให้หมดก่อน
    newData[subjectIdx].groups.forEach((g, i) => {
      newData[subjectIdx].groups[i].selected = (i === groupIdx);
    });
  } else {
    // สำหรับ Checkbox: เปลี่ยนค่าเฉพาะกลุ่มนั้นๆ
    newData[subjectIdx].groups[groupIdx][key] = value;
  }

  setTransferData(newData);
};

  const handleSubmit = async () => {
    resetErrors();
    if (/* !validateTransferData(transferData) || */ !validate(form)) return;
    try {
      if (editId) {
        await updateStudentTransfer(editId, {
          ...form,
          transferData: JSON.stringify(transferData),
        });
        setAlert({
          open: true,
          message: "Student transfer updated successfully!",
          severity: "success",
        });
      } else {
        await createStudentTransfer({
          ...form,
          transferData: JSON.stringify(transferData),
        });
        setAlert({
          open: true,
          message: "Student transfer created successfully!",
          severity: "success",
        });
      }
      fetchStudentTransfers();
      handleClose();
    } catch (error) {
      setAlert({
        open: true,
        message:
          error.response?.data?.error || error.message || "Error occurred",
        severity: "error",
      });
    }
  };

  const handleSubmitSendSummary = async () => {
    resetErrors();
    try {
      if (editId) {
        await updateStudentTransfer(editId, {
          ...form,
          status: "WAITING_FOR_APPROVAL",
          transferData: JSON.stringify(transferData),
        });
        setAlert({
          open: true,
          message: "Student transfer updated successfully!",
          severity: "success",
        });
      }
      fetchStudentTransfers();
      handleCloseSendSummary();
    } catch (error) {
      setAlert({
        open: true,
        message:
          error.response?.data?.error || error.message || "Error occurred",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteStudentTransfer(id);
      fetchStudentTransfers();
      fetchInactiveStudentTransfers();
      setAlert({
        open: true,
        message: "Student transfer deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message:
          error.response?.data?.error || error.message || "Error occurred",
        severity: "error",
      });
    }
  };

  const handleRestoreTransfer = async (id) => {
    try {
      await activateStudentTransfer(id);
      fetchStudentTransfers();
      fetchInactiveStudentTransfers();
      setAlert({
        open: true,
        message: "Student transfer restored successfully!",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message:
          error.response?.data?.error || error.message || "Error occurred",
        severity: "error",
      });
    }
  };

  const [activeTab, setActiveTab] = useState(0);

  const handleChangeActiveTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const currentCourse = annualCourses.find((c) => c.id === form.annualCourseId);
  const courseYear = currentCourse ? currentCourse.year : "ไม่พบข้อมูล";
  const courseTerm = currentCourse ? currentCourse.term : "ไม่พบข้อมูล";
  const courseName = currentCourse ? currentCourse.name : "ไม่พบข้อมูล";
  const courseFaculty = currentCourse?.faculty?.name || "ไม่พบข้อมูล";
  const courseMajor = currentCourse?.major?.name || "ไม่พบข้อมูล";

  const currentStudent = students.find((s) => s.id === form.studentId);
  const studentFullName = currentStudent
    ? `${currentStudent.title_th} ${currentStudent.firstname_th} ${currentStudent.lastname_th}`
    : "ไม่พบข้อมูล";
  const studentFaculty = currentStudent?.faculty?.name || "ไม่พบข้อมูล";
  const studentMajor = currentStudent?.major?.name || "ไม่พบข้อมูล";

  const rows = studentTransfers.map((transfer) => ({
    ...transfer,
    courseName:
      annualCourses.find((c) => c.id === transfer.annualCourseId)?.name ||
      "null",
    year:
      annualCourses.find((c) => c.id === transfer.annualCourseId)?.year ||
      "null",
    term:
      annualCourses.find((c) => c.id === transfer.annualCourseId)?.term ||
      "null",
    facultyName:
      annualCourses.find((c) => c.id === transfer.annualCourseId)?.faculty
        ?.name || "null",
    majorName:
      annualCourses.find((c) => c.id === transfer.annualCourseId)?.major
        ?.name || "null",
    studentId:
      students.find((item) => item.id === transfer.studentId)?.student_id ||
      "null",
    firstName:
      students.find((item) => item.id === transfer.studentId)?.firstname_th ||
      "null",
    lastName:
      students.find((item) => item.id === transfer.studentId)?.lastname_th ||
      "null",
    actions: (
      <>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpen(transfer)}
          >
            <EditIcon />
          </Button>
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={() => handleOpenSendSummary(transfer)}
          >
            ส่งสรุปผล
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => handleDelete(transfer.id)}
          >
            <DeleteForeverIcon />
          </Button>
        </Box>
      </>
    ),
  }));
  const rowsTab2 = studentTransfersTab2.map((transfer) => ({
    ...transfer,
    courseName:
      annualCourses.find((c) => c.id === transfer.annualCourseId)?.name ||
      "null",
    year:
      annualCourses.find((c) => c.id === transfer.annualCourseId)?.year ||
      "null",
    term:
      annualCourses.find((c) => c.id === transfer.annualCourseId)?.term ||
      "null",
    facultyName:
      annualCourses.find((c) => c.id === transfer.annualCourseId)?.faculty
        ?.name || "null",
    majorName:
      annualCourses.find((c) => c.id === transfer.annualCourseId)?.major
        ?.name || "null",
    studentId:
      students.find((item) => item.id === transfer.studentId)?.student_id ||
      "null",
    firstName:
      students.find((item) => item.id === transfer.studentId)?.firstname_th ||
      "null",
    lastName:
      students.find((item) => item.id === transfer.studentId)?.lastname_th ||
      "null",
    actions: (
      <>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleRestoreTransfer(transfer.id)}
          >
            กู้คืนใบเทียบรายวิชา
          </Button>
        </Box>
      </>
    ),
  }));

  return (
    <>
      <CustomAlert
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        severity={alert.severity}
        message={alert.message}
      />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" fontWeight={500}>
              ใบเทียบรายวิชา
            </Typography>
            <Button variant="contained" onClick={() => handleOpen()}>
              เพิ่มใบเทียบรายวิชา
            </Button>
          </Box>
          <Tabs value={activeTab} onChange={handleChangeActiveTab}>
            <Tab label="ใบเทียบรายวิชา" />
            <Tab label="ใบเทียบรายวิชาที่ถูกลบ" />
          </Tabs>
          <div role="tabpanel" hidden={activeTab !== 0}>
            <DefaultTable columns={columns} rows={rows} />
          </div>
          <div role="tabpanel" hidden={activeTab !== 1}>
            <DefaultTable columns={columns} rows={rowsTab2} />
          </div>

          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle>
              {editId ? "แก้ไขใบเทียบรายวิชา" : "สร้างใบเทียบรายวิชา"}
            </DialogTitle>
            <DialogContent>
              {!editId && !selectedCourse && (
                <Box
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 5,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <FormControl sx={{ minWidth: 300, mb: 3 }}>
                      <InputLabel id="year-label">เลือกปีการศึกษา</InputLabel>
                      <Select
                        labelId="year-label"
                        id="year"
                        value={selectedYear}
                        label="เลือกปีการศึกษา"
                        onChange={handleChangeYear}
                      >
                        {years.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      onClick={handleGetSummary}
                      sx={{ mb: 3, ml: 1 }}
                    >
                      ดึงข้อมูล
                    </Button>
                  </Box>

                  {summary.length > 0 && (
                    <TableContainer
                      component={Paper}
                      sx={{ maxWidth: 900, mb: 4 }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>ภาคเรียนที่</TableCell>
                            <TableCell>ชื่อหลักสูตร</TableCell>
                            <TableCell>คณะ</TableCell>
                            <TableCell>สาขา</TableCell>
                            <TableCell align="center">จำนวนวิชา</TableCell>
                            <TableCell align="center">การดำเนินการ</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {summary.map((course) => {
                            const key = `${course.faculty.id}-${course.major.id}-${course.id}`;
                            const subjectCount = course.subjects.length;

                            return (
                              <TableRow key={key}>
                                <TableCell>{course.term}</TableCell>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.faculty.name}</TableCell>
                                <TableCell>{course.major.name}</TableCell>
                                <TableCell align="center">
                                  {subjectCount}
                                </TableCell>
                                <TableCell align="center">
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleCompare(course)}
                                    sx={{ mr: 1 }}
                                  >
                                    เปรียบเทียบ
                                  </Button>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => handleViewSubjects(course)}
                                  >
                                    ดูรายวิชา
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* Subject Dialog */}
                  <Dialog
                    open={dialogViewSubjects}
                    onClose={handleCloseViewSubjects}
                    fullWidth
                    maxWidth="sm"
                  >
                    <DialogTitle bgcolor={"#2d1259"} color="white">
                      รายวิชาในหลักสูตรที่เลือก
                    </DialogTitle>
                    <DialogContent dividers>
                      <TableContainer component={Paper} elevation={0}>
                        <Table size="small">
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                              <TableCell>รหัสวิชา</TableCell>
                              <TableCell>ชื่อวิชา</TableCell>
                              <TableCell>หน่วยกิต</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              /* uniqueSubjects */ selectedSubjects.map(
                                (subject) => (
                                  <TableRow key={subject.id}>
                                    <TableCell>
                                      {subject.subject.subId}
                                    </TableCell>
                                    <TableCell>
                                      {subject.subject.subName}
                                    </TableCell>
                                    <TableCell>
                                      {subject.subject.subUnit}
                                    </TableCell>
                                  </TableRow>
                                ),
                              )
                            }
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleCloseViewSubjects}>ปิด</Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              )}
              {((editId && selectedCourse) || selectedCourse) && (
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    mb={3}
                    align="center"
                  >
                    ใบเปรียบเทียบรายวิชา (ปี {courseYear} ภาคเรียนที่{" "}
                    {courseTerm})
                  </Typography>
                  <Typography
                    variant="h5"
                    mb={3}
                    align="center"
                    fontWeight="normal"
                  >
                    {courseName}
                  </Typography>
                  <Typography
                    variant="h6"
                    mb={3}
                    align="center"
                    fontWeight="normal"
                  >
                    {"คณะ " + courseFaculty + " สาขา " + courseMajor}
                  </Typography>

                  <FormControl fullWidth margin="dense">
                    <InputLabel id="student-label">Student</InputLabel>
                    <Select
                      labelId="student-label"
                      id="studentId"
                      label="Student"
                      name="studentId"
                      value={form.studentId}
                      onChange={handleChange}
                      error={!!errors.studentId}
                    >
                      {students.map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.title_th +
                            " " +
                            student.firstname_th +
                            " " +
                            student.lastname_th}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {transferData.map((subject, idx) => {
                    return (
                      <Accordion
                        key={subject.id}
                        defaultExpanded
                        sx={{
                          width: "100%",
                          maxWidth: 1200,
                          bgcolor: "rgb(238, 238, 238)",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          component="div"
                        >
                          <Typography marginRight={4} fontWeight="bold">
                            {subject.id}
                          </Typography>
                          <Typography marginRight={4} fontWeight="bold">
                            {subject.name}
                          </Typography>
                          <Typography marginRight={4} fontWeight="bold">
                            หน่วยกิต {subject.credits}
                          </Typography>
                          <Box sx={{ flexGrow: 1 }}></Box>
                          <Button
                            variant="contained"
                            sx={{ mr: 2 }}
                            onClick={(e) => {
                              e.stopPropagation(); // สำคัญมาก! กันไม่ให้ Accordion พับ/กาง ตอนกดปุ่ม
                              if (subject.groups.length < 3) {
                                const newGroup = [
                                  ...subject.groups,
                                  {
                                    groupId: subject.groups.length + 1,
                                    courses: [
                                      {
                                        id: "",
                                        name: "",
                                        credits: "",
                                        grade: "",
                                      },
                                    ],

                                    selected: false,
                                    isNotCE: false,
                                  },
                                ];
                                setTransferData((prev) => {
                                  const updatedTransferData = [...prev];
                                  updatedTransferData[idx].groups = newGroup;
                                  return updatedTransferData;
                                });
                              }
                            }}
                            disabled={subject.groups.length >= 3}
                          >
                            + กลุ่มเทียบ
                          </Button>
                        </AccordionSummary>
                        <AccordionDetails sx={{ p: 0 }}>
                          {subject.groups.map((group, idx2) => (
                            <Accordion
                              key={group.groupId}
                              defaultExpanded
                              sx={{
                                width: "100%",
                                maxWidth: 1200,
                                bgcolor: "rgb(245, 245, 245)",
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                component="div"
                              >
                                <Typography marginRight={4} fontWeight="bold">
                                  กลุ่มเทียบที่ {group.groupId}
                                </Typography>
                                <Box sx={{ flexGrow: 1 }}></Box>
                                <Button
                                  variant="contained"
                                  color="warning"
                                  sx={{ mr: 2 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updatedTransferData = [
                                      ...transferData,
                                    ];
                                    updatedTransferData[idx].groups =
                                      updatedTransferData[idx].groups.filter(
                                        (g) => g.groupId !== group.groupId,
                                      );
                                    updatedTransferData[idx].groups =
                                      updatedTransferData[idx].groups.map(
                                        (g, index) => ({
                                          ...g,
                                          groupId: index + 1,
                                        }),
                                      );
                                    setTransferData(updatedTransferData);
                                  }}
                                  disabled={subject.groups.length <= 1}
                                >
                                  <DeleteForeverIcon />
                                </Button>
                              </AccordionSummary>

                              <AccordionDetails sx={{ p: 0 }}>
                                <Card
                                  variant="outlined"
                                  sx={{
                                    width: "100%",
                                    boxShadow: "none",
                                    border: "none",
                                  }}
                                >
                                  <CardContent sx={{ p: 0 }}>
                                    <TableContainer
                                      component={Paper}
                                      sx={{ boxShadow: 0 }}
                                    >
                                      <Table>
                                        <TableHead>
                                          <TableRow>
                                            <TableCell
                                              align="center"
                                              sx={{ fontWeight: "bold" }}
                                            >
                                              รหัสวิชา
                                            </TableCell>
                                            <TableCell
                                              align="center"
                                              sx={{ fontWeight: "bold" }}
                                            >
                                              ชื่อวิชา
                                            </TableCell>
                                            <TableCell
                                              align="center"
                                              sx={{ fontWeight: "bold" }}
                                            >
                                              หน่วยกิต
                                            </TableCell>
                                            <TableCell
                                              align="center"
                                              sx={{ fontWeight: "bold" }}
                                            >
                                              เกรด
                                            </TableCell>
                                            <TableCell
                                              align="center"
                                              sx={{ fontWeight: "bold" }}
                                            ></TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {group.courses.map((item, idx3) => (
                                            <TableRow key={idx3}>
                                              <TableCell align="center">
                                                <TextField
                                                  sx={{ width: 140 }}
                                                  variant="outlined"
                                                  value={item.id}
                                                  onChange={(e) =>
                                                    handleChangeTransferData(
                                                      idx,
                                                      idx2,
                                                      idx3,
                                                      "id",
                                                      e.target.value,
                                                    )
                                                  }
                                                  error={
                                                    !!errors[
                                                      "id" +
                                                        idx +
                                                        "-" +
                                                        idx2 +
                                                        "-" +
                                                        idx3
                                                    ]
                                                  }
                                                  helperText=""
                                                />
                                              </TableCell>
                                              <TableCell align="center">
                                                <TextField
                                                  sx={{ width: "100%" }}
                                                  variant="outlined"
                                                  value={item.name}
                                                  onChange={(e) =>
                                                    handleChangeTransferData(
                                                      idx,
                                                      idx2,
                                                      idx3,
                                                      "name",
                                                      e.target.value,
                                                    )
                                                  }
                                                  error={
                                                    !!errors[
                                                      "name" +
                                                        idx +
                                                        "-" +
                                                        idx2 +
                                                        "-" +
                                                        idx3
                                                    ]
                                                  }
                                                  helperText=""
                                                />
                                              </TableCell>
                                              <TableCell align="center">
                                                <TextField
                                                  sx={{ width: 80 }}
                                                  variant="outlined"
                                                  inputMode="numeric"
                                                  value={item.credits}
                                                  onChange={(e) => {
                                                    const value =
                                                      e.target.value;
                                                    // Regex นี้จะยอมให้มีเฉพาะตัวเลข 0-9 เท่านั้น
                                                    // ถ้าต้องการทศนิยมด้วย ให้ใช้: /[^0-9.]/g
                                                    const onlyNums =
                                                      value.replace(
                                                        /[^0-9]/g,
                                                        "",
                                                      );
                                                    handleChangeTransferData(
                                                      idx,
                                                      idx2,
                                                      idx3,
                                                      "credits",
                                                      onlyNums,
                                                    );
                                                  }}
                                                  error={
                                                    !!errors[
                                                      "credits" +
                                                        idx +
                                                        "-" +
                                                        idx2 +
                                                        "-" +
                                                        idx3
                                                    ]
                                                  }
                                                  helperText=""
                                                />
                                              </TableCell>
                                              <TableCell align="center">
                                                <TextField
                                                  variant="outlined"
                                                  sx={{ width: 80 }}
                                                  inputMode="numeric"
                                                  value={item.grade}
                                                  onChange={(e) => {
                                                    const value =
                                                      e.target.value;
                                                    // Regex นี้จะยอมให้มีเฉพาะตัวเลข 0-9 เท่านั้น
                                                    // ถ้าต้องการทศนิยมด้วย ให้ใช้: /[^0-9.]/g
                                                    const onlyNums =
                                                      value.replace(
                                                        /[^0-9.]/g,
                                                        "",
                                                      );
                                                    handleChangeTransferData(
                                                      idx,
                                                      idx2,
                                                      idx3,
                                                      "grade",
                                                      onlyNums,
                                                    );
                                                  }}
                                                  error={
                                                    !!errors[
                                                      "grade" +
                                                        idx +
                                                        "-" +
                                                        idx2 +
                                                        "-" +
                                                        idx3
                                                    ]
                                                  }
                                                  helperText=""
                                                />
                                              </TableCell>
                                              <TableCell align="center">
                                                <Button
                                                  variant="contained"
                                                  color="warning"
                                                  onClick={(e) => {
                                                    e.stopPropagation(); // สำคัญมาก! กันไม่ให้ Accordion พับ/กาง ตอนกดปุ่ม
                                                    const newCourses =
                                                      group.courses.filter(
                                                        (_, i) => i !== idx3,
                                                      );
                                                    setTransferData((prev) => {
                                                      const updatedTransferData =
                                                        [...prev];
                                                      updatedTransferData[
                                                        idx
                                                      ].groups[idx2].courses =
                                                        newCourses;
                                                      return updatedTransferData;
                                                    });
                                                  }}
                                                  disabled={
                                                    group.courses.length <= 1
                                                  }
                                                >
                                                  <DeleteForeverIcon />
                                                </Button>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          m: 2,
                                          justifyContent: "flex-end",
                                        }}
                                      >
                                        <Button
                                          variant="contained"
                                          onClick={(e) => {
                                            e.stopPropagation(); // สำคัญมาก! กันไม่ให้ Accordion พับ/กาง ตอนกดปุ่ม

                                            const newCourses = [
                                              ...group.courses,
                                              {
                                                id: "",
                                                name: "",
                                                credits: "",
                                                grade: "",
                                              },
                                            ];
                                            setTransferData((prev) => {
                                              const updatedTransferData = [
                                                ...prev,
                                              ];
                                              updatedTransferData[idx].groups[
                                                idx2
                                              ].courses = newCourses;
                                              return updatedTransferData;
                                            });
                                          }}
                                        >
                                          + วิชา
                                        </Button>
                                      </Box>
                                    </TableContainer>
                                  </CardContent>
                                </Card>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    );
                  })}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {editId ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openSendSummary}
            onClose={handleCloseSendSummary}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle>{`ส่งข้อมูลไปที่สรุปผลการเทียบ`}</DialogTitle>
            <DialogContent>
              {editId && selectedCourse && (
                <Box
                  component="main"
                  sx={{
                    flexGrow: 1,
                    p: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    mb={3}
                    align="center"
                  >
                    ใบเปรียบเทียบรายวิชา (ปี {courseYear} ภาคเรียนที่{" "}
                    {courseTerm})
                  </Typography>
                  <Typography
                    variant="h5"
                    mb={3}
                    align="center"
                    fontWeight="normal"
                  >
                    {courseName}
                  </Typography>
                  <Typography
                    variant="h6"
                    mb={3}
                    align="center"
                    fontWeight="normal"
                  >
                    {"คณะ " + courseFaculty + " สาขา " + courseMajor}
                  </Typography>
                  <Divider sx={{ width: "100%", mb: 3, borderColor: "#000" }} />
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Typography
                        variant="h6"
                        mb={3}
                        align="left"
                        fontWeight="normal"
                      >
                        {"ชื่อ-สกุล " + studentFullName}
                      </Typography>
                    </Box>
                    <Box sx={{ width: "100%" }}>
                      <Typography
                        variant="h6"
                        mb={3}
                        align="left"
                        fontWeight="normal"
                      >
                        {"คณะ " + studentFaculty + " สาขา " + studentMajor}
                      </Typography>
                    </Box>
                  </Box>
                  {/* --- CONTENT ส่วนตาราง --- */}
                  <div style={{ fontFamily: "sans-serif" }}>
                    <table
                      border="1"
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "center",
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                          <th rowSpan="2">รหัสวิชา</th>
                          <th rowSpan="2">ชื่อวิชา</th>
                          <th rowSpan="2">หน่วยกิต</th>
                          <th rowSpan="2">กลุ่มเทียบ</th>
                          <th colSpan="3">
                            รายวิชาที่ขอเทียบโอน (จะต้องได้เกรด C หรือ 2 ขึ้นไป)
                          </th>
                          <th rowSpan="2">เกรด</th>
                          <th rowSpan="2">เลือก (✓)</th>
                          <th rowSpan="2">นอกระบบ CE</th>
                        </tr>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                          <th>รหัสวิชา</th>
                          <th>ชื่อวิชา</th>
                          <th>หน่วยกิต</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transferData.map((mainCourse, mIdx) => {
                          // คำนวณ total rows ของวิชาหลักนี้
                          const totalRowsInMain = mainCourse.groups.reduce(
                            (acc, g) => acc + g.courses.length,
                            0,
                          );

                          return mainCourse.groups.map((group, gIdx) => {
                            return group.courses.map((subCourse, sIdx) => {
                              const isFirstRowOfMain = gIdx === 0 && sIdx === 0;
                              const isFirstRowOfGroup = sIdx === 0;

                              return (
                                <tr key={`${mainCourse.id}-${gIdx}-${sIdx}`}>
                                  {/* Render ข้อมูลวิชาหลักเฉพาะแถวแรกสุด */}
                                  {isFirstRowOfMain && (
                                    <>
                                      <td rowSpan={totalRowsInMain}>
                                        {mainCourse.id}
                                      </td>
                                      <td
                                        rowSpan={totalRowsInMain}
                                        style={{
                                          textAlign: "left",
                                          paddingLeft: "5px",
                                        }}
                                      >
                                        {mainCourse.name}
                                      </td>
                                      <td rowSpan={totalRowsInMain}>
                                        {mainCourse.credits}
                                      </td>
                                    </>
                                  )}

                                  {/* Render กลุ่มเทียบเฉพาะแถวแรกของกลุ่ม */}
                                  {isFirstRowOfGroup && (
                                    <td rowSpan={group.courses.length}>
                                      {group.groupId}
                                    </td>
                                  )}

                                  {/* ข้อมูลวิชาย่อย (แสดงทุกแถว) */}
                                  <td>{subCourse.id}</td>
                                  <td
                                    style={{
                                      textAlign: "left",
                                      paddingLeft: "5px",
                                    }}
                                  >
                                    {subCourse.name}
                                  </td>
                                  <td>{subCourse.credits}</td>
                                  <td>{subCourse.grade}</td>
                                  {/* ข้อมูลเกรดและการเลือก เฉพาะแถวแรกของกลุ่ม */}
                                  {isFirstRowOfGroup && (
                                    <>
                                      <td rowSpan={group.courses.length}>
                                        <div className="custom-radio-group">
                                          <label className="container">
                                            <input
                                              type="radio"
                                              name={`selected-${mainCourse.id}`}
                                              checked={group.selected || false}
                                              onChange={() => handleRadioChange(mIdx, gIdx, 'selected', true)}
                                            />
                                            <span className="checkmark"></span>
                                          </label>
                                        </div>
                                      </td>
                                      <td rowSpan={group.courses.length}>
                                        <div className="custom-radio-group">
                                          <label className="container">
                                            <input
                                              type="checkbox"
                                              name={`isNotCE-${mainCourse.id}-${group.groupId}`}
                                              checked={group.isNotCE || false}
                                              onChange={(e) => handleRadioChange(mIdx, gIdx, 'isNotCE', e.target.checked)}
                                            />
                                            <span className="checkmark"></span>
                                          </label>
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              );
                            });
                          });
                        })}
                      </tbody>
                    </table>
                  </div>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSendSummary}>Cancel</Button>
              <Button onClick={handleSubmitSendSummary} variant="contained">
                {"ส่งข้อมูล"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}

export default NewComparePage;
