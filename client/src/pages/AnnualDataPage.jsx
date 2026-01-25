import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import * as annualService from "../services/annualCourseService";

function AnnualDataPage() {
  const [selectedYear, setSelectedYear] = useState("");
  const [annualCourses, setAnnualCourses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [years, setYears] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const reportRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await annualService.getAnnualCourses();
      console.log(result.data);
      setAnnualCourses(result.data);
      const uniqueYears = [...new Set(result.data.map((c) => c.year))];
      setYears(uniqueYears);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setSelectedYear(e.target.value);
    setSummary([]);
  };

  const handleGetSummary = () => {
    const result = annualCourses.filter(
      (course) => course.year === parseInt(selectedYear)
    );
    setSummary(result);
  };

  const handlePrint = () => {
    if (reportRef.current) {
      window.print();
    }
  };

  /* const uniqueSubjects = Array.from(
    new Map(
      selectedSubjects.map((subject) => [
        subject.subject.subGroup.codeSubject, // ใช้ค่านี้เป็น key
        subject,
      ])
    ).values()
  ); */

  const handleCompare = (year) => {
    navigate(`/compare?year=${year}`);
  };

  const handleViewSubjects = (course) => {
    console.log("Selected Course:", course);
    setSelectedSubjects(course.subjects);
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 5,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={"bold"}
          color="primary"
          sx={{ mb: 3 }}
        >
          รายงานหลักสูตรประจำปี
        </Typography>

        <FormControl sx={{ minWidth: 300, mb: 3 }}>
          <InputLabel id="year-label">เลือกปีการศึกษา</InputLabel>
          <Select
            labelId="year-label"
            id="year"
            value={selectedYear}
            label="เลือกปีการศึกษา"
            onChange={handleChange}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Button variant="contained" onClick={handleGetSummary} sx={{ mb: 3 }}>
            ดึงข้อมูล
          </Button>
          <Button
            variant="outlined"
            onClick={handlePrint}
            sx={{ mb: 3, ml: 1 }}
          >
            พิมพ์รายงาน
          </Button>
        </Box>

        {summary.length > 0 && (
          <TableContainer component={Paper} sx={{ maxWidth: 900, mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ภาคเรียนที่</TableCell>
                  <TableCell>คณะ</TableCell>
                  <TableCell>สาขา</TableCell>
                  <TableCell align="center">จำนวนวิชา</TableCell>
                  <TableCell align="center">การดำเนินการ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.map((course) => {
                  const key = `${course.faculty.id}-${course.major.id}-${course.id}`;
                  const subjectCount = course.subjects.length;

                  return (
                    <TableRow key={key}>
                      <TableCell>{course.term}</TableCell>
                      <TableCell>{course.faculty.name}</TableCell>
                      <TableCell>{course.major.name}</TableCell>
                      <TableCell align="center">{subjectCount}</TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleCompare(course.year)}
                          sx={{ mr: 1 }}
                        >
                          เปรียบเทียบ
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleViewSubjects(course)}
                        >
                          ดูรายวิชา
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Subject Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle bgcolor={"#2d1259"} color="white">
            รายวิชาใน {selectedCourse?.major.name || "สาขาที่เลือก"}
          </DialogTitle>
          <DialogContent dividers>
            <TableContainer component={Paper} elevation={0}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell>รหัสวิชา</TableCell>
                    <TableCell>ชื่อวิชา</TableCell>
                    <TableCell>หน่วยกิต</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    /* uniqueSubjects */ selectedSubjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>{subject.subject.subId}</TableCell>
                        <TableCell>{subject.subject.subName}</TableCell>
                        <TableCell>{subject.subject.subUnit}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>ปิด</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default AnnualDataPage;
