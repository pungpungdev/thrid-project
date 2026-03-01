import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DefaultTable from "../components/DefaultTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import * as studentService from "../services/studentService";
import { getFaculties } from "../services/facultyService";
import { getMajors, getMajorsByFacultyId } from "../services/majorService";
import { useBase64 } from "../hooks/useBase64";
import defaultProfileImg from "../assets/image/profile.png";
import { useValidation } from "../hooks/useValidation";
import CustomAlert from "../components/CustomAlert";
import * as XLSX from "xlsx";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const columns = [
  {
    field: "profile_img",
    headerName: "รูปภาพ",
    renderCell: (row) => (
      <img
        src={row.profile_img ? row.profile_img : defaultProfileImg}
        alt="profile"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1px solid #eee",
        }}
      />
    ),
  },
  { field: "student_id", headerName: "รหัสนักศึกษา" },
  { field: "firstname_th", headerName: "ชื่อ" },
  { field: "lastname_th", headerName: "นามสกุล" },
  { field: "email", headerName: "อีเมล" },
  { field: "facultyName", headerName: "คณะ" },
  { field: "majorName", headerName: "สาขา" },
  { field: "actions", headerName: "ตัวเลือก" },
];

function StudentPage() {
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [allMajors, setAllMajors] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    student_id: "",
    password: "P@ssw0rd",
    title_th: "",
    firstname_th: "",
    lastname_th: "",
    telephone: "",
    email: "",
    faculties_id: "",
    majors_id: "",
    certificate: "",
    profile_img: "",
    actives: true,
  });
  const [editId, setEditId] = useState(null);
  const [studentIdError, setStudentIdError] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const toBase64 = useBase64();

  const requiredFields = [
    "student_id",
    "title_th",
    "firstname_th",
    "lastname_th",
    "telephone",
    "email",
    "faculties_id",
    "majors_id",
  ];
  const { errors, validate, resetErrors } = useValidation(requiredFields);

  const fetchStudents = async () => {
    const res = await studentService.getStudents();
    setStudents(res.data);
  };
  const fetchFaculties = async () => {
    const res = await getFaculties();
    setFaculties(res.data);
  };
  const fetchMajors = async () => {
    const res = await getMajors();
    setAllMajors(res.data);
  };
  const fetchMajorsByFacultyId = async (facultyId) => {
    const res = await getMajorsByFacultyId(facultyId);
    console.log("Fetched majors:", res.data);
    setMajors(res.data);
  };

  useEffect(() => {
    fetchStudents();
    fetchFaculties();
    fetchMajors();
  }, []);

  const handleOpen = (student = null) => {
    resetErrors();
    if (student) {
      fetchMajorsByFacultyId(student.faculties_id);
      setForm({
        student_id: student.student_id || "",
        password: student.password || "",
        title_th: student.title_th || "",
        firstname_th: student.firstname_th || "",
        lastname_th: student.lastname_th || "",
        telephone: student.telephone || "",
        email: student.email || "",
        faculties_id: student.faculties_id || "",
        majors_id: student.majors_id || "",
        profile_img: student.profile_img || "",
        certificate: "",
        actives: student.actives ?? true,
      });
      setEditId(student.id);
    } else {
      setForm({
        student_id: "",
        password: "P@ssw0rd",
        title_th: "",
        firstname_th: "",
        lastname_th: "",
        telephone: "",
        email: "",
        faculties_id: "",
        majors_id: "",
        profile_img: "",
        certificate: "",
        actives: true,
      });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    if (e.target.name === "faculties_id") {
      fetchMajorsByFacultyId(e.target.value);
      setForm({ ...form, [e.target.name]: e.target.value, majors_id: "" });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    resetErrors();
    if (!validate(form) || studentIdError) return;
    try {
      if (editId) {
        await studentService.updateStudent(editId, form);
        setAlert({
          open: true,
          severity: "success",
          message: "บันทึกสำเร็จ",
        });
      } else {
        await studentService.createStudent(form);
        setAlert({
          open: true,
          severity: "success",
          message: "บันทึกสำเร็จ",
        });
      }
      fetchStudents();
      handleClose();
    } catch (err) {
      setAlert({ open: true, severity: "error", message: "Operation failed!" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await studentService.deleteStudent(id);
      fetchStudents();
      setAlert({
        open: true,
        severity: "success",
        message: "ลบสำเร็จ",
      });
    } catch (error) {
      setAlert({ open: true, severity: "error", message: "Operation failed!" });
    }
  };

  // Export students to Excel
  const handleExport = () => {
    // Prepare data for export
    const exportData = students.map((student) => ({
      "Student Id": student.student_id,
      "Title": student.title_th,
      "First Name": student.firstname_th,
      "Last Name": student.lastname_th,
      "Email": student.email,
      "Faculty": student.faculty?.name || "",
      "Major": student.major?.name || "",
      "Telephone": student.telephone,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "students.xlsx");
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(worksheet);
    // You may want to map/validate json before sending to backend
    // Example: await studentService.importStudents(json);
    // For demo, just log and show alert
    const importData = json.map((item) => ({
      student_id: String(item["Student Id"]) || "",
      title_th: String(item["Title"]) || "",
      firstname_th: String(item["First Name"]) || "",
      lastname_th: String(item["Last Name"]) || "",
      email: String(item["Email"]) || "",
      faculties_id: faculties.find((f) => f.name === item["Faculty"])?.id || null,
      majors_id: allMajors.find((m) => m.name === item["Major"])?.id || null,
      telephone: String(item["Telephone"]) || "",
      password: "password123",
      actives: true,
    }));
    console.log("Imported JSON:", importData);

    await studentService.importStudents(importData); // <-- implement this API if needed
    setAlert({
      open: true,
      severity: "success",
      message: `Import สำเร็จ`,
    });
    e.target.value = null;
    fetchStudents();
  };

  const rows = students.map((student) => ({
    ...student,
    facultyName: student.faculty?.name || "",
    majorName: student.major?.name || "",
    actions: (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpen(student)}
        >
          <EditIcon />
        </Button>
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={() => handleDelete(student.id)}
        >
          <DeleteForeverIcon />
        </Button>
      </Box>
    ),
  }));

  return (
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
          <Typography variant="h5" fontWeight={700} className="title-thai">
            นักศึกษา
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={() => handleOpen()}
              sx={{ mr: 2 }}
            >
              เพิ่มรายชื่อนักศึกษา
            </Button>
            {/* Export Button */}
            <Button
              color="warning"
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{ mr: 2 }}
              onClick={handleExport}
            >
              Export Excel
            </Button>
            {/* Import Button */}
            <input
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{ display: "none" }}
              id="import-student-file"
              type="file"
              onChange={handleImport}
            />
            <label htmlFor="import-student-file">
              <Button
                variant="contained"
                color="secondary"
                component="span"
                startIcon={<UploadFileIcon />}
              >
                Import File
              </Button>
            </label>
          </Box>
        </Box>

        <DefaultTable columns={columns} rows={rows} />

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? "แก้ไขรายชื่อนักศึกษา" : "เพิ่มรายชื่อนักศึกษา"}</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 4,
                width: "100%",
                py: 2,
                justifyContent: "justify-between",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  flex: "1 1 320px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  margin="dense"
                  label="รหัสนักศึกษา"
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.student_id}
                  helperText={errors.student_id}
                />
                <TextField
                  margin="dense"
                  label="คำนำหน้า"
                  name="title_th"
                  value={form.title_th}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.title_th}
                  helperText={errors.title_th}
                />
                <TextField
                  margin="dense"
                  label="ชื่อ"
                  name="firstname_th"
                  value={form.firstname_th}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.firstname_th}
                  helperText={errors.firstname_th}
                />
                <TextField
                  margin="dense"
                  label="นามสกุล"
                  name="lastname_th"
                  value={form.lastname_th}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.lastname_th}
                  helperText={errors.lastname_th}
                />
                <TextField
                  margin="dense"
                  label="หมายเลขโทรศัพท์"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.telephone}
                  helperText={errors.telephone}
                />
                <TextField
                  margin="dense"
                  label="อีเมล์"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Box>
              <Box
                sx={{
                  flex: "1 1 320px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <FormControl fullWidth margin="dense">
                  <InputLabel id="faculty-label">คณะ</InputLabel>
                  <Select
                    labelId="faculty-label"
                    id="faculties_id"
                    label="คณะ"
                    name="faculties_id"
                    value={form.faculties_id}
                    onChange={handleChange}
                    error={!!errors.faculties_id}
                    helperText={errors.faculties_id}
                  >
                    {faculties.map((faculty) => (
                      <MenuItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="major-label">สาขา</InputLabel>
                  <Select
                    labelId="major-label"
                    id="majors_id"
                    label="สาขา"
                    name="majors_id"
                    value={form.majors_id}
                    onChange={handleChange}
                    error={!!errors.majors_id}
                    helperText={errors.majors_id}
                  >
                    {majors
                      .filter(
                        (major) =>
                          major.faculty_id === Number(form.faculties_id)
                      )
                      .map((major) => (
                        <MenuItem key={major.id} value={major.id}>
                          {major.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <Button variant="outlined" component="label" sx={{ mt: 1 }}>
                  เพิ่มรูปภาพ
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const base64 = await toBase64(file);
                      setForm({ ...form, profile_img: base64 });
                    }}
                  />
                </Button>
                {form.profile_img && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      Selected: รูปภาพถูกแปลงเป็น base64 แล้ว
                    </Typography>
                    <img
                      src={form.profile_img}
                      alt="Preview"
                      style={{
                        width: 100,
                        height: 100,
                        marginTop: 8,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #eee",
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>ยกเลิก</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!!studentIdError}
            >
              {editId ? "บันทึก" : "บันทึก"}
            </Button>
          </DialogActions>
        </Dialog>
        <CustomAlert
          open={alert.open}
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          message={alert.message}
        />
      </Box>
    </Box>
  );
}

export default StudentPage;
