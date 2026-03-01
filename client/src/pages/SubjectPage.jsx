import React, { useEffect, useState } from "react";
import CustomAlert from "../components/CustomAlert";
import Sidebar from "../components/Sidebar";
import DefaultTable from "../components/DefaultTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { getFaculties } from "../services/facultyService";
import { getMajorsByFacultyId } from "../services/majorService";
import { getSubGroups } from "../services/subGroupService";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from "../services/subjectService";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useValidation } from "../hooks/useValidation";

const columns = [
  { field: "subId", headerName: "รหัสวิชา" },
  { field: "subName", headerName: "ชื่อวิชา" },
  { field: "subUnit", headerName: "หน่วยกิต" },
  { field: "actions", headerName: "การดำเนินการ" },
];

function SubjectPage() {
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    subId: "",
    subName: "",
    subUnit: "",
    facultiesId: "",
    majorId: "",
    subGroupId: "",
    actives: true,
  });
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  const fetchSubGroups = async () => {
    const res = await getSubGroups();
    console.log("Fetched sub-groups:", res.data);
    setSubGroups(res.data);
  };

  const fetchSubjects = async () => {
    const res = await getSubjects();
    console.log("Fetched subjects:", res.data);
    setSubjects(res.data);
  };

  useEffect(() => {
    fetchSubjects();
    fetchFaculties();
    fetchSubGroups();
  }, []);

  const handleOpen = (subject = null) => {
    resetErrors();
    if (subject) {
      fetchMajorsByFacultyId(subject.facultiesId);
      setForm({
        subId: subject.subId || "",
        subName: subject.subName || "",
        subUnit: subject.subUnit || "",
        facultiesId: subject.facultiesId || "",
        majorId: subject.majorId || "",
        subGroupId: subject.subGroupId || "",
        actives: true,
      });
      setEditId(subject.id);
    } else {
      setMajors([]);
      setForm({
        subId: "",
        subName: "",
        subUnit: "",
        facultiesId: "",
        majorId: "",
        subGroupId: "",
        actives: true,
      });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    if (e.target.name === "facultiesId") {
      fetchMajorsByFacultyId(e.target.value);
      setForm({ ...form, [e.target.name]: e.target.value, majorId: "" });
    } else if (e.target.name === "subUnit") {
      setForm({ ...form, [e.target.name]: Number(e.target.value) });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const requiredFields = [
    "subId",
    "subName",
    "subUnit",
    "facultiesId",
    "majorId",
    "subGroupId",
  ];
  const { validate, resetErrors, errors } = useValidation(requiredFields);

  const handleSubmit = async () => {
    resetErrors();
    if (!validate(form)) return;
    try {
      if (editId) {
        await updateSubject(editId, form);
        setAlert({
          open: true,
          message: "บันทึกสำเร็จ",
          severity: "success",
        });
      } else {
        await createSubject(form);
        setAlert({
          open: true,
          message: "บันทึกสำเร็จ",
          severity: "success",
        });
      }
      fetchSubjects();
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
      await deleteSubject(id);
      fetchSubjects();
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

  const rows = subjects.map((subject) => ({
    ...subject,
    actions: (
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpen(subject)}
        >
          <EditIcon />
        </Button>
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={() => handleDelete(subject.id)}
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
            <Typography variant="h5" fontWeight={700}>
              วิชา
            </Typography>
            <Button variant="contained" onClick={() => handleOpen()}>
              เพิ่มรายวิชา
            </Button>
          </Box>

          <DefaultTable columns={columns} rows={rows} />

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{editId ? "แก้ไขรายวิชา" : "เพิ่มรายวิชา"}</DialogTitle>
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
                  label="รหัสวิชา"
                  name="subId"
                  value={form.subId}
                  onChange={handleChange}
                  error={!!errors.subId}
                  helperText={errors.subId}
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="ชื่อวิชา"
                  name="subName"
                  value={form.subName}
                  onChange={handleChange}
                  error={!!errors.subName}
                  helperText={errors.subName}
                  fullWidth
                />
                <TextField
                  type="number"
                  margin="dense"
                  label="หน่วยกิต"
                  name="subUnit"
                  value={form.subUnit}
                  onChange={handleChange}
                  error={!!errors.subUnit}
                  helperText={errors.subUnit}
                  fullWidth
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel id="faculty-label">คณะ</InputLabel>
                  <Select
                    labelId="faculty-label"
                    id="facultiesId"
                    label="คณะ"
                    name="facultiesId"
                    value={form.facultiesId}
                    onChange={handleChange}
                    error={!!errors.facultiesId}
                    helperText={errors.facultiesId}
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
                    id="majorId"
                    label="สาขา"
                    name="majorId"
                    value={form.majorId}
                    onChange={handleChange}
                    error={!!errors.majorId}
                    helperText={errors.majorId}
                  >
                    {majors.map((major) => (
                      <MenuItem key={major.id} value={major.id}>
                        {major.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="dense">
                  <InputLabel id="sub-group-label">กลุ่มวิชา</InputLabel>
                  <Select
                    labelId="sub-group-label"
                    id="subGroupId"
                    label="กลุ่มวิชา"
                    name="subGroupId"
                    value={form.subGroupId}
                    onChange={handleChange}
                    error={!!errors.subGroupId}
                    helperText={errors.subGroupId}
                  >
                    {subGroups.map((subGroup) => (
                      <MenuItem key={subGroup.id} value={subGroup.id}>
                        {subGroup.nameSubject}
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

export default SubjectPage;
