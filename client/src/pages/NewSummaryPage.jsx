import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
  { field: "statusDesc", headerName: "สถานะ" },
  { field: "actions", headerName: "ตัวเลือก" },
];

function NewSummaryPage() {
  const [annualCourses, setAnnualCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentTransfers, setStudentTransfers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [transferData, setTransferData] = useState([]);
  const [role,setRole] = useState("");

  const [openSummary, setOpenSummary] = useState(false);
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
    const filteredTransfers = res.data.filter(
      (t) => t.status === "APPROVED" || t.status === "WAITING_FOR_APPROVAL",
    );
    const { user } = useAuth();
    console.log("userObj", user);
    setRole(user.role)
    if (user.role === "Student") {
      const myStudentId = students.find(
        (student) => student.student_id === user.username,
      )?.id;
      const myData = filteredTransfers.filter((data) => data.studentId === myStudentId);
      setStudentTransfers(myData);
    } else {
      setStudentTransfers(filteredTransfers);
    }
  };

  const fetchAnnualCourses = async () => {
    const result = await annualService.getAnnualCourses();
    console.log(result.data);
    setAnnualCourses(result.data);
  };
  useEffect(() => {
    fetchAnnualCourses();
    fetchStudents();
  }, []);
  useEffect(() => {
    if (students.length > 0) {
      fetchStudentTransfers();
    }
  }, [students]);

  const requiredFields = ["studentId", "annualCourseId", "status"];
  const { validate, validateTransferData, resetErrors, errors } =
    useValidation(requiredFields);

  const handleOpenSummary = (transfer) => {
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
      setOpenSummary(true);
    }
  };

  const handleCloseSummary = () => {
    setOpenSummary(false);
  };

  const handleSubmitSummary = async () => {
    resetErrors();
    try {
      if (editId) {
        await updateStudentTransfer(editId, {
          ...form,
          status: "APPROVED",
          transferData: JSON.stringify(transferData),
        });
        setAlert({
          open: true,
          message: "บันทึกสำเร็จ",
          severity: "success",
        });
      }
      fetchStudentTransfers();
      handleCloseSummary();
    } catch (error) {
      setAlert({
        open: true,
        message: "ดำเนินการไม่สำเร็จกรุณาลองใหม่อีกครั้ง" || error.message,
        severity: "error",
      });
    }
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
    statusDesc:
      transfer.status === "DRAFT" ? (
        <Chip label="ร่าง" color="secondary" size="small" />
      ) : transfer.status === "WAITING_FOR_APPROVAL" ? (
        <Chip label="รอการอนุมัติ" color="primary" size="small" />
      ) : transfer.status === "APPROVED" ? (
        <Chip label="อนุมัติแล้ว" color="success" size="small" />
      ) : (
        <Chip label="ไม่ทราบสถานะ" size="small" />
      ),
    actions: (
      <>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={() => handleOpenSummary(transfer)}
          >
            ดูผลการเทียบโอน
          </Button>
          <Link
            to={`/previewDocument/${transfer.id}`}
            target="_blank"
            rel="noopener noreferrer" // เพื่อความปลอดภัย
            style={{ textDecoration: "none" }}
          >
            <Button variant="contained" size="small" color="info">
              ดูเอกสาร
            </Button>
          </Link>
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
              สรุปผลการเทียบโอนรายวิชา
            </Typography>
          </Box>

          <DefaultTable columns={columns} rows={rows} />

          <Dialog
            open={openSummary}
            onClose={handleCloseSummary}
            fullWidth
            maxWidth="lg"
          >
            <DialogTitle>{`สรุปผลการเทียบโอน`}</DialogTitle>
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
                          <th rowSpan="2">ผลการเทียบ</th>
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
                                        {group.selected ? "✓" : ""}
                                      </td>
                                      <td rowSpan={group.courses.length}>
                                        {group.isNotCE ? "✓" : ""}
                                      </td>
                                      <td rowSpan={group.courses.length}>
                                        {group.selected &&
                                        !!group.courses.find(
                                          (c) =>
                                            Number(c.grade) >= 2 &&
                                            Number(c.credits) >=
                                              Number(mainCourse.credits),
                                        )
                                          ? "✓"
                                          : group.selected
                                            ? "✗"
                                            : ""}
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
              <Button onClick={handleCloseSummary}>ยกเลิก</Button>
              {role !== 'Student' && <Button onClick={handleSubmitSummary} variant="contained">
                {"อนุมัติผลการเทียบโอน"}
              </Button>}
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
}

export default NewSummaryPage;
