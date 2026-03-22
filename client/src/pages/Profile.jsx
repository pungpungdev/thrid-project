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
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import CustomAlert from "../components/CustomAlert";
import { getUser, updateUser } from "../services/userService";
import { useValidation } from "../hooks/useValidation";
import { getFaculties } from "../services/facultyService";
import { getMajorsByFacultyId } from "../services/majorService";
import { updatePassword } from "../services/adminService";

function Profile() {
  const { user, role } = useAuth();
  const [user2, setUser] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [form2, setForm2] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const requiredFields = ["telephone", "email", "faculties_id", "majors_id"];
  const { errors, validate, resetErrors } = useValidation(requiredFields);
  const requiredFields2 = ["oldPassword", "newPassword", "newPassword2"];
  const {
    errors: errors2,
    validate: validate2,
    resetErrors: resetErrors2,
  } = useValidation(requiredFields2);

  const fetchUser = async () => {
    const res = await getUser(user.id);
    console.log("Fetched user2:", res.data);
    setUser(res.data);
    setForm(res.data);
    setForm2({
      username: user.username,
    });
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
  const handleChangePassword = (e) => {
    console.log(e.target.name, e.target.value);
    {
      setForm2({ ...form2, [e.target.name]: e.target.value });
    }
  };

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPassword2, setShowNewPassword2] = useState(false);

  // ฟังก์ชันสลับค่า
  const handleClickShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickShowNewPassword2 = () =>
    setShowNewPassword2(!showNewPassword2);

  useEffect(() => {
    if (role !== "Student" && user?.id) {
      fetchUser();
    }
  }, []);

  const handleEdit = () => {
    setEditMode(true);
    setForm(user2);
    setSuccessMsg("");
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm(user2);
    setSuccessMsg("");
  };

  const handleSave = async () => {
    resetErrors();
    console.log(validate(form));
    console.log(errors);
    if (!validate(form)) return;
    setLoading(true);
    try {
      const res = await updateUser(user2.id, form);
      setUser(res.data);
      setEditMode(false);
      setSuccessMsg("บันทึกข้อมูลสำเร็จ!");
    } catch (err) {
      setSuccessMsg("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
    setLoading(false);
  };

  const handleSubmitChangePassword = async () => {
    resetErrors2();
    console.log(validate2(form2));
    console.log(errors2);
    if (!validate2(form2)) return;
    setLoading(true);
    try {
      const res = await updatePassword(form2);
      setAlert({
        open: true,
        severity: "success",
        message: "บันทึกสำเร็จ",
      });
      setOpen(false);
    } catch (err) {
      setAlert({
        open: true,
        severity: "error",
        message: err.response?.data?.error || "บันทึกไม่สำเร็จ",
      });
    }
    setLoading(false);
  };

  if (!user2) {
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
              {user2.profile_img ? (
                <img
                  src={user2.profile_img}
                  alt="profile"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid #eee",
                    mp: 2,
                  }}
                />
              ) : (
                <Avatar sx={{ width: 80, height: 80, mb: 2 }}>
                  {user2.firstname?.charAt(0)}
                </Avatar>
              )}
              <Typography variant="h5" sx={{ mb: 1 }}>
                {user2.firstname} {user2.lastname}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                username: {user2.username}
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
                label="โทรศัพท์"
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
                label="อีเมล์"
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
                value={user2.actives ? "กำลังศึกษา" : "ไม่ใช้งาน"}
                disabled
                fullWidth
              /> */}
              <FormControl fullWidth margin="dense">
                <InputLabel id="faculty-label">คณะ</InputLabel>
                <Select
                  labelId="faculty-label"
                  id="faculties_id"
                  label="คณะ"
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
                <InputLabel id="major-label">สาขา</InputLabel>
                <Select
                  labelId="major-label"
                  id="majors_id"
                  label="สาขา"
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
              <Button variant="contained" onClick={() => setOpen(true)}>
                แก้ไขรหัสผ่าน
              </Button>
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

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>{"แก้ไขรหัสผ่าน"}</DialogTitle>
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
                  label="รหัสผ่านเก่า"
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={form2.oldPassword}
                  onChange={handleChangePassword}
                  fullWidth
                  error={!!errors2.oldPassword}
                  helperText={errors2.oldPassword}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowOldPassword}
                            edge="end"
                          >
                            {showOldPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  margin="dense"
                  label="รหัสผ่านใหม่"
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={form2.newPassword}
                  onChange={handleChangePassword}
                  fullWidth
                  error={!!errors2.newPassword}
                  helperText={errors2.newPassword}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowNewPassword}
                            edge="end"
                          >
                            {showNewPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  margin="dense"
                  label="รหัสผ่านใหม่อีกครั้ง"
                  type={showNewPassword2 ? "text" : "password"}
                  name="newPassword2"
                  value={form2.newPassword2}
                  onChange={handleChangePassword}
                  fullWidth
                  error={!!errors2.newPassword2}
                  helperText={errors2.newPassword2}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowNewPassword2}
                            edge="end"
                          >
                            {showNewPassword2 ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSubmitChangePassword} variant="contained">
              {"บันทึก"}
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

export default Profile;
