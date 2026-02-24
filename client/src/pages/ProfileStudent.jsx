import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "../components/Sidebar";
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { getStudent, updateStudent } from "../services/studentService";
import { useValidation } from "../hooks/useValidation";
import { getFaculties } from "../services/facultyService";
import { getMajorsByFacultyId } from "../services/majorService";

function ProfileStudent() {
  const { user, role } = useAuth();
  const [student, setStudent] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const requiredFields = ["telephone", "email", "faculties_id", "majors_id"];
  const { errors, validate, resetErrors } = useValidation(requiredFields);

  const fetchStudent = async () => {
    const res = await getStudent(user.id);
    console.log("Fetched student:", res.data);
    setStudent(res.data);
    setForm(res.data);
    fetchFaculties();
    fetchMajorsByFacultyId(res.data.faculties_id);
  };
  const fetchFaculties = async () => {
    const res = await getFaculties();
    setFaculties(res.data);
  };
  const fetchMajorsByFacultyId = async (facultyId) => {
    const res = await getMajorsByFacultyId(facultyId);
    console.log("Fetched majors:", res.data);
    setMajors(res.data);
  };

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    if (e.target.name === "faculties_id") {
      fetchMajorsByFacultyId(e.target.value);
      setForm({ ...form, [e.target.name]: e.target.value, majors_id: "" });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  useEffect(() => {
    if (role === "Student" && user?.id) {
      fetchStudent();
    }
  }, []);

  const handleEdit = () => {
    setEditMode(true);
    setForm(student);
    setSuccessMsg("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm(student);
    setSuccessMsg("");
  };

  const handleSave = async () => {
    resetErrors();
    console.log(validate(form));
    console.log(errors)
    if (!validate(form)) return;
    setLoading(true);
    try {
      const res = await updateStudent(student.id, form);
      setStudent(res.data);
      setEditMode(false);
      setSuccessMsg("บันทึกข้อมูลสำเร็จ!");
    } catch (err) {
      setSuccessMsg("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
    setLoading(false);
  };

  if (!student) {
    return (
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box
          sx={{ flexGrow: 1, display: "flex", justifyContent: "center", mt: 5 }}
        >
          <Typography>Loading...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{ flexGrow: 1, display: "flex", justifyContent: "center", mt: 5 }}
      >
        <Card sx={{ minWidth: 800, p: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                {student.firstname_th?.charAt(0)}
              </Avatar>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {student.title_th ? "นาย" : "นางสาว"} {student.firstname_th}{" "}
                {student.lastname_th}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                รหัสนักศึกษา: {student.student_id}
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {successMsg && (
              <Typography color="success.main" sx={{ mb: 2 }}>
                {successMsg}
              </Typography>
            )}
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <TextField
                margin="dense"
                label="Telephone"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                disabled={!editMode}
                fullWidth
                error={!!errors.telephone}
                helperText={errors.telephone}
              />
              <TextField
                margin="dense"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editMode}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
              {/* <TextField
                label="วุฒิการศึกษา"
                name="certificate"
                value={form.certificate || ""}
                onChange={handleChange}
                disabled={!editMode}
                fullWidth
              />
              <TextField
                label="ที่อยู่"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                disabled={!editMode}
                fullWidth
              />
              <TextField
                label="คณะ"
                value={form.faculties_id || "-"}
                disabled
                fullWidth
              />
              <TextField
                label="สาขา"
                value={form.majors_id || "-"}
                disabled
                fullWidth
              />
              <TextField
                label="สถานะ"
                value={student.actives ? "กำลังศึกษา" : "ไม่ใช้งาน"}
                disabled
                fullWidth
              /> */}
              <FormControl fullWidth margin="dense">
                <InputLabel id="faculty-label">Faculty</InputLabel>
                <Select
                  labelId="faculty-label"
                  id="faculties_id"
                  label="Faculty"
                  name="faculties_id"
                  value={form.faculties_id}
                  onChange={handleChange}
                  disabled={!editMode}
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
                <InputLabel id="major-label">Major</InputLabel>
                <Select
                  labelId="major-label"
                  id="majors_id"
                  label="Major"
                  name="majors_id"
                  value={form.majors_id}
                  onChange={handleChange}
                  disabled={!editMode}
                  error={!!errors.majors_id}
                  helperText={errors.majors_id}
                >
                  {majors
                    .filter(
                      (major) => major.faculty_id === Number(form.faculties_id),
                    )
                    .map((major) => (
                      <MenuItem key={major.id} value={major.id}>
                        {major.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              {!editMode ? (
                <Button variant="contained" onClick={handleEdit}>
                  แก้ไขข้อมูล
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? "กำลังบันทึก..." : "บันทึก"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    ยกเลิก
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default ProfileStudent;
