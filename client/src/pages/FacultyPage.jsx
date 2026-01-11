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

  const handleOpen = (faculty = null) => {
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
    try {
      if (editId) {
        await updateFaculty(editId, form);
        setAlert({
          open: true,
          message: "Faculty updated successfully!",
          severity: "success",
        });
      } else {
        await createFaculty(form);
        setAlert({
          open: true,
          message: "Faculty created successfully!",
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
    try{
      await deleteFaculty(id);
      fetchFaculties();
      setAlert({
          open: true,
          message: "Faculty deleted successfully!",
          severity: "success",
        });
    }catch(error){
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
            Add Faculty
          </Button>
        </Box>

        <DefaultTable columns={columns} rows={rows} />

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? "Edit Faculty" : "Add Faculty"}</DialogTitle>
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
                label="Faculty Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
              />
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
