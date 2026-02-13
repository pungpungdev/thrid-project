import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
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
import UploadFileIcon from "@mui/icons-material/UploadFile";
import * as dashboardService from "../services/dashboardService";

import * as annualService from "../services/annualCourseService";

import CustomAlert from "../components/CustomAlert";
import DefaultTable from "../components/DefaultTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getInactiveUsers,
  updateActiveUser,
} from "../services/userService";
import { getFaculties } from "../services/facultyService";
import { getMajorsByFacultyId } from "../services/majorService";
import { USER_ROLES } from "../shares/roles";
import { useValidation } from "../hooks/useValidation";

const columns = [
  { field: "courseName", headerName: "หลักสูตร" },
  { field: "year", headerName: "ปีการศึกษา" },
  { field: "facultyName", headerName: "คณะ" },
  { field: "majorName", headerName: "สาขา" },

  { field: "username", headerName: "ชื่อผู้ใช้" },
  { field: "firstname", headerName: "ชื่อ" },
  { field: "lastname", headerName: "นามสกุล" },
  { field: "actions", headerName: "ตัวเลือก" },
];

function NewComparePage() {
  const [selectedYear, setSelectedYear] = useState("");
  const [annualCourses, setAnnualCourses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [years, setYears] = useState([]);
  const [dialogViewSubjects, setDialogViewSubjects] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [transferData, setTransferData] = useState([]);

  const reportRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { user } = useAuth();
    console.log("userObj", user);
    const fetchData = async () => {
      const result = await annualService.getAnnualCourses();
      console.log(result.data);
      setAnnualCourses(result.data);
      const uniqueYears = [...new Set(result.data.map((c) => c.year))];
      setYears(uniqueYears);
    };
    fetchData();
  }, []);

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
            courses: [{ id: "", name: "", credits: null, grade: "" }],

            selected: false,
          },
        ],
      });
    });
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

  /* copy crud table page */

  const [users, setUsers] = useState([]);
  const [usersTab2, setUsersTab2] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "P@ssw0rd",
    firstname: "",
    lastname: "",
    telephone: "",
    email: "",
    role: "User",
    faculties_id: null,
    majors_id: null,
  });
  const [editId, setEditId] = useState(null);

  // New state for faculties and majors
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchUsers = async () => {
    const res = await getUsers();
    console.log("Fetched users:", res.data);
    setUsers(res.data);
  };

  const fetchUsersTab2 = async () => {
    const res = await getInactiveUsers();
    console.log("Fetched inactive users:", res.data);
    setUsersTab2(res.data);
  };

  const fetchFaculties = async () => {
    const res = await getFaculties();
    console.log("Fetched faculties:", res.data);
    setFaculties(res.data);
  };

  const fetchMajorsByFacultyId = async (facultyId) => {
    const res = await getMajorsByFacultyId(facultyId);
    console.log("Fetched majors:", res.data);
    setMajors(res.data);
  };

  useEffect(() => {
    //fetchUsers();
    //fetchUsersTab2();
    fetchFaculties();
  }, []);

  const requiredFields = [
    "username",
    "firstname",
    "lastname",
    "role",
    "email",
    "telephone",
  ];
  const { validate, resetErrors, errors } = useValidation(requiredFields);

  const handleOpen = (user = null) => {
    resetErrors();
    if (user) {
      if (user.faculties_id) {
        fetchMajorsByFacultyId(user.faculties_id);
      } else {
        setMajors([]);
      }
      setForm({
        username: user.username || "",
        password: user.password || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        telephone: user.telephone || "",
        email: user.email || "",
        role: user.role || "",
        faculties_id: user.faculties_id || null,
        majors_id: user.majors_id || null,
      });
      setEditId(user.id);
    } else {
      setMajors([]);
      setForm({
        username: "",
        password: "P@ssw0rd",
        firstname: "",
        lastname: "",
        telephone: "",
        email: "",
        role: "Teacher",
        faculties_id: null,
        majors_id: null,
      });
      setEditId(null);
    }
    setSelectedCourse(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    if (e.target.name === "faculties_id") {
      setForm({ ...form, [e.target.name]: e.target.value, majors_id: null });
      if (e.target.value) {
        fetchMajorsByFacultyId(e.target.value);
      } else {
        setMajors([]);
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    resetErrors();
    if (!validate(form)) return;
    try {
      if (editId) {
        await updateUser(editId, form);
        setAlert({
          open: true,
          message: "User updated successfully!",
          severity: "success",
        });
      } else {
        await createUser(form);
        setAlert({
          open: true,
          message: "User created successfully!",
          severity: "success",
        });
      }
      fetchUsers();
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

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
      fetchUsersTab2();
      setAlert({
        open: true,
        message: "User deleted successfully!",
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

  const handleRestoreUser = async (id) => {
    try {
      await updateActiveUser(id);
      fetchUsers();
      fetchUsersTab2();
      setAlert({
        open: true,
        message: "User restored successfully!",
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

  const rows = users.map((user) => ({
    ...user,
    role: user.role || "Teacher",
    facultyName: user.faculty?.name || "null",
    majorName: user.major?.name || "null",
    actions: (
      <>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpen(user)}
          >
            <EditIcon />
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => handleDelete(user.id)}
          >
            <DeleteForeverIcon />
          </Button>
        </Box>
      </>
    ),
  }));
  const rowsTab2 = usersTab2.map((user) => ({
    ...user,
    role: user.role || "Teacher",
    facultyName: user.faculty?.name || "null",
    majorName: user.major?.name || "null",
    actions: (
      <>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleRestoreUser(user.id)}
          >
            กู้คืนผู้ใช้งาน
          </Button>
        </Box>
      </>
    ),
  }));

  /*copy compare page */

  const handleGradeChange = (subjectId, value) => {
    let val = value.replace(/[^0-9.]/g, "");
    const parts = val.split(".");
    if (parts.length > 2) val = parts[0] + "." + parts[1];
    if (parts[1]?.length > 2) val = parts[0] + "." + parts[1].slice(0, 2);
    if (parseFloat(val) > 4) val = "4";
    /* setGrades((prev) => ({
      ...prev,
      [subjectId]: val,
    })); */
  };

  const handleSubmitGrades = async () => {
    const gradeArray = Object.entries(grades).map(([subject_id, grade]) => ({
      subject_id,
      grade,
    }));

    try {
      console.log("Saving grades:", gradeArray);
      // await dashboardService.saveGrades(gradeArray);
      alert("Saved grades:\n" + JSON.stringify(gradeArray, null, 2));
    } catch (err) {
      alert("Error saving grades");
    }
  };

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
              {(editId || selectedCourse) && (
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
                    เปรียบเทียบรายวิชา (ปี {selectedCourse.year || ""})
                  </Typography>
                  <Typography
                    variant="h6"
                    mb={3}
                    align="center"
                    fontWeight="normal"
                  >
                    คณะ {selectedCourse?.faculty?.name} สาขา{" "}
                    {selectedCourse?.major?.name}
                  </Typography>

                  {transferData.map((subject, idx) => {
                    return (
                      <>
                        <Accordion
                          key={subject.id}
                          defaultExpanded
                          sx={{
                            width: "100%",
                            maxWidth: 1200,
                            bgcolor: "rgb(238, 238, 238)",
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                                          credits: null,
                                          grade: "",
                                        },
                                      ],

                                      selected: false,
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
                                                      console.log(
                                                        e.target.value,
                                                      )
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell align="center">
                                                  <TextField
                                                    sx={{ width: "100%" }}
                                                    variant="outlined"
                                                    value={item.name}
                                                    onChange={(e) =>
                                                      console.log(
                                                        e.target.value,
                                                      )
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell align="center">
                                                  <TextField
                                                    sx={{ width: 80 }}
                                                    variant="outlined"
                                                    type="number"
                                                    value={item.credits}
                                                    onChange={(e) =>
                                                      console.log(
                                                        e.target.value,
                                                      )
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell align="center">
                                                  <TextField
                                                    type="number"
                                                    variant="outlined"
                                                    sx={{ width: 80 }}
                                                    value={item.grade}
                                                    onChange={(e) =>
                                                      /* handleGradeChange(
                                                          item.id,
                                                          e.target.value,
                                                        ) */
                                                      console.log(
                                                        e.target.value,
                                                      )
                                                    }
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
                                                      setTransferData(
                                                        (prev) => {
                                                          const updatedTransferData =
                                                            [...prev];
                                                          updatedTransferData[
                                                            idx
                                                          ].groups[
                                                            idx2
                                                          ].courses =
                                                            newCourses;
                                                          return updatedTransferData;
                                                        },
                                                      );
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
                                                  credits: null,
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
                      </>
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
        </Box>
      </Box>
    </>
  );
}

export default NewComparePage;
