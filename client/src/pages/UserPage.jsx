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
} from "../services/userService";
import { getFaculties } from "../services/facultyService";
import { getMajors } from "../services/majorService";
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
} from "@mui/material";
import { USER_ROLES } from "../shares/roles";

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
      let label = params.value;
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
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "P@ssw0rd",
    firstname: "",
    lastname: "",
    telephone: "",
    email: "",
    role: "User",
    faculties_id: "",
    majors_id: "",
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

  // Fetch faculties and majors on open dialog
  const fetchFacultiesAndMajors = async () => {
    const [facRes, majRes] = await Promise.all([getFaculties(), getMajors()]);
    setFaculties(facRes.data);
    setMajors(majRes.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpen = (user = null) => {
    fetchFacultiesAndMajors();
    if (user) {
      setForm({
        username: user.username || "",
        password: user.password || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        telephone: user.telephone || "",
        email: user.email || "",
        role: user.role || "",
        faculties_id: user.faculties_id || "",
        majors_id: user.majors_id || "",
      });
      setEditId(user.id);
    } else {
      setForm({
        username: "",
        password: "P@ssw0rd",
        firstname: "",
        lastname: "",
        telephone: "",
        email: "",
        role: "Teacher",
        faculties_id: "",
        majors_id: "",
      });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
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
        message: error.message || "Error occurred",
        severity: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
      setAlert({
        open: true,
        message: "User deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message || "Error occurred",
        severity: "error",
      });
    }
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
              Add User
            </Button>
          </Box>

          <DefaultTable columns={columns} rows={rows} />

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editId ? "Edit User" : "Add User"}</DialogTitle>
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
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="First Name"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Last Name"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Telephone"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel id="faculty-label">Faculty</InputLabel>
                  <Select
                    labelId="faculty-label"
                    id="faculties_id"
                    name="faculties_id"
                    value={form.faculties_id}
                    label="Faculty"
                    onChange={handleChange}
                  >
                    {faculties.map((f) => (
                      <MenuItem key={f.id} value={f.id}>
                        {f.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="major-label">Major</InputLabel>
                  <Select
                    labelId="major-label"
                    id="majors_id"
                    name="majors_id"
                    value={form.majors_id}
                    label="Major"
                    onChange={handleChange}
                  >
                    {majors.map((m) => (
                      <MenuItem key={m.id} value={m.id}>
                        {m.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    label="Role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
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
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {editId ? "Update" : "Create"}
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
