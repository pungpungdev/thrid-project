import React, { useEffect, useState } from "react";
import CustomAlert from "../components/CustomAlert";
import Sidebar from "../components/Sidebar";
import DefaultTable from "../components/DefaultTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  createFaculty,
  deleteFaculty,
  getFaculties,
  updateFaculty,
} from "../services/facultyService";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { useValidation } from "../hooks/useValidation";

const columns = [
  { field: "name", headerName: "คณะ" },
  { field: "actions", headerName: "ตัวเลือก" },
];

export default function FacultyPage() {
  const [faculties, setFaculties] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
  });
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchFaculties = async () => {
    const res = await getFaculties();
    setFaculties(res.data);
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const requiredFields = ["name"];
  const { validate, resetErrors, errors } = useValidation(requiredFields);

  const handleOpen = (faculty = null) => {
    resetErrors();
    if (faculty) {
      setForm({
        name: faculty.name || "",
      });
      setEditId(faculty.id);
    } else {
      setForm({
        name: "",
      });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    resetErrors();
    if (!validate(form)) return;
    try {
      if (editId) {
        await updateFaculty(editId, form);
        setAlert({
          open: true,
          message: "บันทึกสำเร็จ",
          severity: "success",
        });
      } else {
        await createFaculty(form);
        setAlert({
          open: true,
          message: "บันทึกสำเร็จ",
          severity: "success",
        });
      }
      fetchFaculties();
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
      await deleteFaculty(id);
      fetchFaculties();
      setAlert({
        open: true,
        message: "ลบสำเร็จ",
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

  const rows = faculties.map((faculty) => ({
    ...faculty,
    actions: (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpen(faculty)}
        >
          <EditIcon />
        </Button>
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={() => handleDelete(faculty.id)}
        >
          <DeleteForeverIcon />
        </Button>
      </Box>
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
              คณะ
            </Typography>
            <Button variant="contained" onClick={() => handleOpen()}>
              เพิ่มข้อมูลคณะ
            </Button>
          </Box>

          <DefaultTable columns={columns} rows={rows} />

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editId ? "แก้ไขรายชื่อคณะ" : "เพิ่มข้อมูลคณะ"}</DialogTitle>
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
                  label="ชื่อคณะ"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                />
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
