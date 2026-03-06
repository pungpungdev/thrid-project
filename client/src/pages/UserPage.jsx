import React, { useEffect, useState } from "react";
import CustomAlert from "../components/CustomAlert";
import Sidebar from "../components/Sidebar";
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
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import { USER_ROLES } from "../shares/roles";
import { useValidation } from "../hooks/useValidation";

const columns = [
  { field: "username", headerName: "ชื่อผู้ใช้" },
  { field: "firstname", headerName: "ชื่อ" },
  { field: "lastname", headerName: "นามสกุล" },
  { field: "telephone", headerName: "เบอร์โทรศัพท์" },
  { field: "email", headerName: "อีเมล" },
  { field: "facultyName", headerName: "คณะ" },
  { field: "majorName", headerName: "สาขา" },
  {
    field: "role",
    headerName: "ระดับผู้ใช้งาน",
    renderCell: (params) => {
      let color = "default";
      let label = params.value === "Teacher" ? "อาจารย์" : params.value === "Committee" ? "กรรมการ" : params.value === "Admin" ? "แอดมิน" : "";
      if (params.value === "Teacher") color = "warning";
      else if (params.value === "Admin") color = "primary";
      else if (params.value === "Committee") color = "orange";
      return (
        <Chip
          label={label}
          color={color === "orange" ? undefined : color}
          sx={
            color === "orange"
              ? { backgroundColor: "orange", color: "#fff" }
              : {}
          }
          size="small"
        />
      );
    },
  },
  { field: "actions", headerName: "ตัวเลือก" },
];

function UserPage() {
  const [users, setUsers] = useState([]);
  const [usersTab2, setUsersTab2] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "123456",
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
    fetchUsers();
    fetchUsersTab2();
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
        //password: /*user.password*/ "123456" || "",
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
        password: "123456",
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
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

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
          message: "บันทึกสำเร็จ",
          severity: "success",
        });
      } else {
        await createUser(form);
        setAlert({
          open: true,
          message: "บันทึกสำเร็จ",
          severity: "success",
        });
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      setAlert({
        open: true,
        message: "ดำเนินการไม่สำเร็จกรุณาลองใหม่อีกครั้ง" || error.message,
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
        message: "ลบสำเร็จ",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "ดำเนินการไม่สำเร็จกรุณาลองใหม่อีกครั้ง" || error.message,
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
        message: "กู้คืนสำเร็จ",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "ดำเนินการไม่สำเร็จกรุณาลองใหม่อีกครั้ง" || error.message,
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

  return (
    <>
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
              ผู้ใช้งาน
            </Typography>
            <Button variant="contained" onClick={() => handleOpen()}>
              เพิ่มผู้ใช้งาน
            </Button>
          </Box>
          <Tabs value={activeTab} onChange={handleChangeActiveTab}>
            <Tab label="ผู้ใช้งาน" />
            <Tab label="ผู้ใช้งานที่ถูกลบ" />
          </Tabs>
          <div role="tabpanel" hidden={activeTab !== 0}>
            <DefaultTable columns={columns} rows={rows} />
          </div>
          <div role="tabpanel" hidden={activeTab !== 1}>
            <DefaultTable columns={columns} rows={rowsTab2} />
          </div>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editId ? "แก้ไขผู้ใช้งาน" : "เพิ่มผู้ใช้งาน"}</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  minWidth: 400,
                  py: 1,
                }}
              >
                <TextField
                  margin="dense"
                  label="ชื่อผู้ใช้งาน"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="ชื่อ"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  error={!!errors.firstname}
                  helperText={errors.firstname}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="นามสกุล"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  error={!!errors.lastname}
                  helperText={errors.lastname}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="หมายเลขโทรศัพท์"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  error={!!errors.telephone}
                  helperText={errors.telephone}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="อีเมล์"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel id="faculty-label">คณะ</InputLabel>
                  <Select
                    labelId="faculty-label"
                    id="faculties_id"
                    name="faculties_id"
                    value={form.faculties_id}
                    label="คณะ"
                    onChange={handleChange}
                  >
                    <MenuItem value={null}>
                      <em>-</em>
                    </MenuItem>
                    {faculties.map((f) => (
                      <MenuItem key={f.id} value={f.id}>
                        {f.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="major-label">สาขา</InputLabel>
                  <Select
                    labelId="major-label"
                    id="majors_id"
                    name="majors_id"
                    value={form.majors_id}
                    label="สาขา"
                    onChange={handleChange}
                  >
                    <MenuItem value={null}>
                      <em>-</em>
                    </MenuItem>
                    {majors.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="role-label">ตำแหน่ง</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    label="ตำแหน่ง"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    error={!!errors.role}
                    helperText={errors.role}
                  >
                    {USER_ROLES.map((role) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>ยกเลิก</Button>
              <Button onClick={handleSubmit} variant="contained">
                {editId ? "บันทึก" : "บันทึก"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
      <CustomAlert
        open={alert.open}
        onClose={() => setAlert({ ...alert, open: false })}
        severity={alert.severity}
        message={alert.message}
      />
    </>
  );
}

export default UserPage;
