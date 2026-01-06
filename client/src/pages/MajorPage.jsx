import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DefaultTable from "../components/DefaultTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {getMajors,createMajor,deleteMajor,updateMajor} from "../services/majorService";
import {getFaculties} from "../services/facultyService";
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

  const handleOpen = (major = null) => {
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
    if (editId) {
      await updateMajor(editId, form);
    } else {
      await createMajor(form);
    }
    fetchMajors();
    handleClose();
  };

  const handleDelete = async (id) => {
    await deleteMajor(id);
    fetchMajors();
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
  );
}

export default MajorPage;
