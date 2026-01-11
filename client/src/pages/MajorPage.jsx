import React, { useEffect, useState } from "react";
import CustomAlert from "../components/CustomAlert";
import Sidebar from "../components/Sidebar";
import DefaultTable from "../components/DefaultTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  getMajors,
  createMajor,
  deleteMajor,
  updateMajor,
} from "../services/majorService";
import { getFaculties } from "../services/facultyService";
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
import { useValidation } from "../hooks/useValidation";

const columns = [
  { field: "name", headerName: "สาขา" },
  { field: "facultyName", headerName: "คณะ" },
  { field: "actions", headerName: "ตัวเลือก" },
];

function MajorPage() {
  const [majors, setMajors] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    faculty_id: "",
  });
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchMajors = async () => {
    const res = await getMajors();
    console.log("Fetched majors:", res.data);
    setMajors(res.data);
  };
  const fetchFaculties = async () => {
    const res = await getFaculties();
    console.log("Fetched faculties:", res.data);
    setFaculties(res.data);
  };

  useEffect(() => {
    fetchMajors();
    fetchFaculties();
  }, []);

  const requiredFields = ["name", "faculty_id"];
  const { validate, resetErrors, errors } = useValidation(requiredFields);

  const handleOpen = (major = null) => {
    resetErrors();
    if (major) {
      setForm({
        name: major.name || "",
        faculty_id: major.faculty_id || "",
      });
      setEditId(major.id);
    } else {
      setForm({
        name: "",
        faculty_id: "",
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
        await updateMajor(editId, form);
        setAlert({
          open: true,
          message: "Major updated successfully!",
          severity: "success",
        });
      } else {
        await createMajor(form);
        setAlert({
          open: true,
          message: "Major created successfully!",
          severity: "success",
        });
      }
      fetchMajors();
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
      await deleteMajor(id);
      fetchMajors();
      setAlert({
        open: true,
        message: "Major deleted successfully!",
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

  const rows = majors.map((major) => ({
    ...major,
    facultyName: major.faculty?.name || "",
    actions: (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpen(major)}
        >
          <EditIcon />
        </Button>
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={() => handleDelete(major.id)}
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
              สาขาวิชา
            </Typography>
            <Button variant="contained" onClick={() => handleOpen()}>
              Add Major
            </Button>
          </Box>

          <DefaultTable columns={columns} rows={rows} />

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editId ? "Edit Major" : "Add Major"}</DialogTitle>
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
                  label="Major Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  fullWidth
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel id="faculty-label">Faculty</InputLabel>
                  <Select
                    labelId="faculty-label"
                    id="faculty_id"
                    label="Faculty"
                    name="faculty_id"
                    value={form.faculty_id}
                    onChange={handleChange}
                    error={!!errors.faculty_id}
                    helperText={errors.faculty_id}
                  >
                    {faculties.map((faculty) => (
                      <MenuItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
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

export default MajorPage;
