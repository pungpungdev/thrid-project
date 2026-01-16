import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import * as annualCourseService from "../services/annualCourseService";
import { getFaculties } from "../services/facultyService";
import { getMajorsByFacultyId, getMajors } from "../services/majorService";
import { getSubjects } from "../services/subjectService";
import DefaultTable from "../components/DefaultTable";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { formatDateDDMMYYYY } from "../utils/dateUtils";
import CustomAlert from "../components/CustomAlert";
import { useValidation } from "../hooks/useValidation";
import dayjs from "dayjs";

function CoursePage() {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [allMajors, setAllMajors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    year: "",
    term: "",
    startDate: null,
    endDate: null,
    facultyId: "",
    majorId: "",
    subjectIds: [],
  });
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    getSubjects().then((res) => setSubjects(res.data));
    fetchFaculties();
    fetchCourses();
    fetchMajors();
  }, []);

  const requiredFields = [
    "year",
    "term",
    "startDate",
    "endDate",
    "subjectIds",
    "facultyId",
    "majorId",
  ];
  const { validate, resetErrors, errors } = useValidation(requiredFields);

  const fetchCourses = async () => {
    const res = await annualCourseService.getAnnualCourses();
    setCourses(res.data);
  };

  const fetchMajors = async () => {
    const res = await getMajors();
    setAllMajors(res.data);
  }

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

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    if (e.target.name === "facultyId") {
      fetchMajorsByFacultyId(e.target.value);
      setForm({ ...form, [e.target.name]: e.target.value, majorId: "" });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubjectsChange = (e) => {
    setForm((prev) => ({
      ...prev,
      subjectIds: e.target.value,
    }));
  };

  const handleOpen = (course = null) => {
    resetErrors();
    console.log(course);
    if (course) {
      fetchMajorsByFacultyId(course.facultyId);
      setForm({
        year: course.year || "",
        term: course.term || "",
        startDate: dayjs(course.startDate) || null,
        endDate: dayjs(course.endDate) || null,
        facultyId: course.facultyId || "",
        majorId: course.majorId || "",
        subjectIds: course.subjects?.map((s) => s.subjectId) || [],
      });
      setEditId(course.id);
    } else {
      setForm({
        year: "",
        term: "",
        startDate: null,
        endDate: null,
        facultyId: "",
        majorId: "",
        subjectIds: [],
      });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleSubmit = async () => {
    resetErrors();
    if (!validate(form)) return;
    try {
      const { subjectIds, ...courseData } = form;
      let res;
      courseData.year = parseInt(courseData.year);
      courseData.term = parseInt(courseData.term);
      courseData.facultyId = parseInt(courseData.facultyId) || null;
      courseData.majorId = parseInt(courseData.majorId) || null;
      courseData.startDate = courseData.startDate
        ? courseData.startDate.toISOString()
        : null;
      courseData.endDate = courseData.endDate
        ? courseData.endDate.toISOString()
        : null;

      if (editId) {
        res = await annualCourseService.updateAnnualCourse(editId, courseData);
      } else {
        res = await annualCourseService.createAnnualCourse(courseData);
        await Promise.all(
          subjectIds.map((subjectId) =>
            annualCourseService.createAnnualCourseSubject({
              annualCourseId: res.data.id,
              subjectId,
            })
          )
        );
      }
      setOpen(false);
      setEditId(null);
      fetchCourses();
      showAlert("success", "Saved successfully!");
    } catch (error) {
      showAlert("error", error.message || "Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    await annualCourseService.deleteAnnualCourse(id);
    fetchCourses();
  };

  const showAlert = (severity, message) => {
    setAlert({ open: true, severity, message });
  };

  const columns = [
    { field: "year", headerName: "ปีการศึกษา" },
    { field: "term", headerName: "ภาคเรียน" },
    {
      field: "startDate",
      headerName: "วันที่เริ่มต้น",
      renderCell: ({ value }) => formatDateDDMMYYYY(value),
    },
    {
      field: "endDate",
      headerName: "วันที่สิ้นสุด",
      renderCell: ({ value }) => formatDateDDMMYYYY(value),
    },
    {
      field: "faculty",
      headerName: "คณะ",
      renderCell: ({ row }) =>
        faculties.find((f) => f.id === row.facultyId)?.name || row.facultyId,
    },
    {
      field: "major",
      headerName: "สาขา",
      renderCell: ({ row }) =>
        allMajors.find((m) => m.id === row.majorId)?.name || row.majorId,
    },
    {
      field: "actives",
      headerName: "สถานะ",
      renderCell: ({ row }) =>
        row.actives ? (
          <Chip label="เปิดใช้งาน" color="success" size="small" />
        ) : (
          <Chip label="ปิดใช้งาน" color="default" size="small" />
        ),
    },
    {
      field: "subjects",
      headerName: "รายวิชา",
      renderCell: ({ row }) => {
        const subjectNames = row.subjects
          ?.map(
            (s) =>
              subjects.find((sub) => sub.id === s.subjectId)?.subName ||
              s.subjectId
          )
          .join(", ");
        return (
          <Button
            variant="contained"
            startIcon={<ContentPasteSearchIcon />}
            color="info"
            size="small"
            onClick={() => {
              setSelectedSubjects(
                row.subjects.map(
                  (s) =>
                    subjects.find((sub) => sub.id === s.subjectId)?.subName ||
                    s.subjectId
                )
              );
              setSubjectDialogOpen(true);
            }}
          >
            ดูรายวิชา
          </Button>
        );
      },
    },
    {
      field: "actions",
      headerName: "การดำเนินการ",
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleOpen(row)}
          >
            <EditIcon fontSize="small" />
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => handleDelete(row.id)}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight={"bold"} mb={2}>
            จัดการหลักสูตรประจำปี
          </Typography>
          <Button variant="contained" onClick={() => handleOpen()}>
            Add Annual Course
          </Button>
        </Box>

        <Box sx={{ my: 3 }}>
          <DefaultTable columns={columns} rows={courses} />
        </Box>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
            setEditId(null);
          }}
        >
          <DialogTitle>{editId ? "Edit" : "Create"} Annual Course</DialogTitle>
          <DialogContent
            sx={{
              minWidth: 400,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Year"
              name="year"
              value={form.year}
              onChange={handleChange}
              fullWidth
              margin="dense"
              error={!!errors.year}
              helperText={errors.year}
            />
            <TextField
              label="Term"
              name="term"
              value={form.term}
              onChange={handleChange}
              fullWidth
              margin="dense"
              error={!!errors.term}
              helperText={errors.term}
            />
            <DatePicker
              name="startDate"
              label="Start Date"
              value={form.startDate}
              onChange={(newValue) =>
                handleChange({ target: { name: "startDate", value: newValue } })
              }
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  error: !!errors.startDate,
                  helperText: errors.startDate,
                },
              }}
            />
            <DatePicker
              name="endDate"
              label="End Date"
              value={form.endDate}
              onChange={(newValue) =>
                handleChange({ target: { name: "endDate", value: newValue } })
              }
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  error: !!errors.endDate,
                  helperText: errors.endDate,
                },
              }}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Faculty</InputLabel>
              <Select
                name="facultyId"
                value={form.facultyId}
                onChange={handleChange}
                label="Faculty"
                error={!!errors.facultyId}
                helperText={errors.facultyId}
              >
                {faculties.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Major</InputLabel>
              <Select
                name="majorId"
                value={form.majorId}
                onChange={handleChange}
                label="Major"
                error={!!errors.majorId}
                helperText={errors.majorId}
              >
                {majors
                  .filter((m) => m.faculty_id === Number(form.facultyId))
                  .map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Subjects</InputLabel>
              <Select
                multiple
                name="subjectIds"
                value={form.subjectIds}
                onChange={handleSubjectsChange}
                input={<OutlinedInput label="Subjects" />}
                renderValue={(selected) =>
                  subjects
                    .filter((s) => selected.includes(s.id))
                    .map((s) => s.subName)
                    .join(", ")
                }
                error={!!errors.subjectIds}
                helperText={errors.subjectIds}
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.id}>
                    <Checkbox checked={form.subjectIds.includes(subject.id)} />
                    <ListItemText primary={subject.subName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
                setEditId(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              {editId ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={subjectDialogOpen}
          onClose={() => setSubjectDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Subjects </DialogTitle>
          <DialogContent>
            {selectedSubjects.length > 0 ? (
              <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" width={80}>
                        No.
                      </TableCell>
                      <TableCell>Subject Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedSubjects.map((name, idx) => (
                      <TableRow key={idx}>
                        <TableCell align="center">{idx + 1}</TableCell>
                        <TableCell>{name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                No subjects
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setSubjectDialogOpen(false)}
              color="primary"
            >
              Close
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

export default CoursePage;
