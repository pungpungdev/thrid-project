import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import PrintIcon from "@mui/icons-material/Print";
import { getStudentTransfer } from "../services/studentTransferService";
import { getStudents } from "../services/studentService";
import { getAnnualCourses } from "../services/annualCourseService";

function PreviewDocumentPage() {
  const { id } = useParams();

  const [data, setData] = useState([]);
  const [header, setHeader] = useState({});

  const [students, setStudents] = useState([]);
  const [annualCourses, setAnnualCourses] = useState([]);
  const [studentTransfer, setStudentTransfer] = useState({});

  const fetchStudents = async () => {
    const res = await getStudents();
    console.log("Fetched students:", res.data);
    setStudents(res.data);
  };

  const fetchAnnualCourses = async () => {
    const result = await getAnnualCourses();
    console.log(result.data);
    setAnnualCourses(result.data);
  };

  useEffect(() => {
    fetchStudents();
    fetchAnnualCourses();
    getStudentTransfer(id).then((res) => {
      if (res.data) {
        console.log("Student Transfer Data:", res.data);
        setHeader({
          ...header,
          courseName: "หลักสูตรเทคโนโลยีสารสนเทศและธุรกิจดิจิทัล ปี2567",
        });
        setData(res.data.transferData ? JSON.parse(res.data.transferData) : []);
        setStudentTransfer(res.data);
      }
    });
  }, []);

  const totalPassed = useMemo(() => {
    let count = 0;

    data.forEach((mainCourse) => {
      // วนลูปทุกกลุ่มในวิชาหลักนั้นๆ
      mainCourse.groups.forEach((group) => {
        // ใช้ Logic เดียวกันกับที่คุณเขียนใน JSX
        const isPassed =
          group.selected &&
          group.courses.some(
            (c) =>
              Number(c.grade) >= 2 &&
              Number(c.credits) >= Number(mainCourse.credits),
          );

        if (isPassed) {
          count++;
        }
      });
    });

    return count;
  }, [data]); // จะคำนวณใหม่เมื่อ transferData เปลี่ยนแปลง

  const currentCourse = annualCourses.find(
    (c) => c.id === studentTransfer.annualCourseId,
  );
  const courseYear = currentCourse ? currentCourse.year : "ไม่พบข้อมูล";
  const courseTerm = currentCourse ? currentCourse.term : "ไม่พบข้อมูล";
  const courseName = currentCourse ? currentCourse.name : "ไม่พบข้อมูล";
  const courseFaculty = currentCourse?.faculty?.name || "ไม่พบข้อมูล";
  const courseMajor = currentCourse?.major?.name || "ไม่พบข้อมูล";

  const currentStudent = students.find(
    (s) => s.id === studentTransfer.studentId,
  );
  const studentId = currentStudent?.student_id || "ไม่พบข้อมูล";
  const studentFullName = currentStudent
    ? `${currentStudent.title_th} ${currentStudent.firstname_th} ${currentStudent.lastname_th}`
    : "ไม่พบข้อมูล";
  const studentFaculty = currentStudent?.faculty?.name || "ไม่พบข้อมูล";
  const studentMajor = currentStudent?.major?.name || "ไม่พบข้อมูล";

  return (
    <div className="print-container">
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button
          className="no-print" // เราจะใช้ Class นี้เพื่อซ่อนปุ่มตอนพิมพ์
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
          onClick={() => window.print()}
        >
          <PrintIcon />
        </button>
      </div>
      <div className="official-header">
        {/* ส่วนบน: โลโก้ และ ชื่อหัวข้อเอกสาร */}
        <div className="doc-code">สวท. 12 - 05</div>
        <div className="header-top-row">
          <div className="university-info">
            <img
              src="/logo/rmutk-header-logo.png"
              alt="Logo"
              style={{ width: "80px", height: "auto", marginRight: "15px" }}
            />
            <div style={{ marginBottom: "10px" }}>
              <div className="uni-th">มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ</div>
              <div className="uni-en">Rajamangala University of Technology</div>
            </div>
          </div>

          <div className="document-title-section">
            <div style={{ marginBottom: "10px" }}>
              <div className="main-title">
                ตารางการเทียบวิชาเรียนและโอนหน่วยกิตการศึกษาในระบบ
              </div>
              <div className="sub-title">
                {courseName} (เข้าศึกษาปี {courseYear})
              </div>
            </div>
          </div>
        </div>

        <hr className="header-divider" />

        {/* ส่วนข้อมูลนักศึกษา: จัดเรียงแบบ Grid */}
        <div className="student-info-grid">
          <div className="info-item">
            <span className="label">รหัสประจำตัวนักศึกษา</span>
            <span className="value">{studentId}</span>
          </div>
          <div className="info-item">
            <span className="label">ชื่อ-สกุล</span>
            <span className="value">{studentFullName}</span>
          </div>
          <div className="info-item">
            <span className="label">หลักสูตร</span>
            <span className="value">{courseName}</span>
          </div>
          <div className="info-item">
            <span className="label">คณะ</span>
            <span className="value">{courseFaculty}</span>
          </div>
        </div>
      </div>

      {/* --- CONTENT ส่วนตาราง --- */}
      <div style={{ fontFamily: "sans-serif" }}>
        <table
          border="1"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
          }}
          className="course-comparison-table"
        >
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th rowSpan="2">รหัสวิชา</th>
              <th rowSpan="2">ชื่อวิชา</th>
              <th rowSpan="2">หน่วยกิต</th>
              <th rowSpan="2">กลุ่มเทียบ</th>
              <th colSpan="3">
                รายวิชาที่ขอเทียบโอน (จะต้องได้เกรด C หรือ 2 ขึ้นไป)
              </th>
              <th rowSpan="2">เกรด</th>
              <th rowSpan="2">เลือก (✓)</th>
              <th rowSpan="2">นอกระบบ CE</th>
              <th rowSpan="2">ผลการเทียบ</th>
            </tr>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th>รหัสวิชา</th>
              <th>ชื่อวิชา</th>
              <th>หน่วยกิต</th>
            </tr>
          </thead>
          <tbody>
            {data.map((mainCourse) => {
              // คำนวณ total rows ของวิชาหลักนี้
              const totalRowsInMain = mainCourse.groups.reduce(
                (acc, g) => acc + g.courses.length,
                0,
              );

              return mainCourse.groups.map((group, gIdx) => {
                return group.courses.map((subCourse, sIdx) => {
                  const isFirstRowOfMain = gIdx === 0 && sIdx === 0;
                  const isFirstRowOfGroup = sIdx === 0;

                  return (
                    <tr key={`${mainCourse.id}-${gIdx}-${sIdx}`}>
                      {/* Render ข้อมูลวิชาหลักเฉพาะแถวแรกสุด */}
                      {isFirstRowOfMain && (
                        <>
                          <td rowSpan={totalRowsInMain}>{mainCourse.id}</td>
                          <td
                            rowSpan={totalRowsInMain}
                            style={{ textAlign: "left", paddingLeft: "5px" }}
                          >
                            {mainCourse.name}
                          </td>
                          <td rowSpan={totalRowsInMain}>
                            {mainCourse.credits}
                          </td>
                        </>
                      )}

                      {/* Render กลุ่มเทียบเฉพาะแถวแรกของกลุ่ม */}
                      {isFirstRowOfGroup && (
                        <td rowSpan={group.courses.length}>{group.groupId}</td>
                      )}

                      {/* ข้อมูลวิชาย่อย (แสดงทุกแถว) */}
                      <td>{subCourse.id}</td>
                      <td style={{ textAlign: "left", paddingLeft: "5px" }}>
                        {subCourse.name}
                      </td>
                      <td>{subCourse.credits}</td>
                      <td>{subCourse.grade}</td>
                      {/* ข้อมูลเกรดและการเลือก เฉพาะแถวแรกของกลุ่ม */}
                      {isFirstRowOfGroup && (
                        <>
                          <td rowSpan={group.courses.length}>
                            {group.selected ? "✓" : ""}
                          </td>
                          <td rowSpan={group.courses.length}>
                            {group.isNotCE ? "✓" : ""}
                          </td>
                          <td rowSpan={group.courses.length}>
                            {group.selected &&
                            !!group.courses.find(
                              (c) =>
                                Number(c.grade) >= 2 &&
                                Number(c.credits) >= Number(mainCourse.credits),
                            )
                              ? "✓"
                              : group.selected
                                ? "✗"
                                : ""}
                          </td>
                        </>
                      )}
                    </tr>
                  );
                });
              });
            })}
          </tbody>
        </table>
      </div>

      <div className="official-footer">
        {/* ส่วนสรุปจำนวนวิชา */}
        <div className="summary-section">
          สรุปจำนวนรายวิชาที่ขอเทียบโอนได้{" "}
          <span className="summary-value"> {totalPassed} </span> วิชา
        </div>

        {/* ส่วนลายเซ็นกรรมการ 3 ท่าน */}
        <div className="signature-grid">
          <div className="signature-item">
            <div className="signature-line">
              ลงชื่อ....................................กรรมการ
            </div>
            <div className="name-block">(นางสาวสุภี ดวงใส)</div>
            <div className="date-block">มิถุนายน 2567</div>
          </div>

          <div className="signature-item">
            <div className="signature-line">
              ลงชื่อ....................................กรรมการ
            </div>
            <div className="name-block">
              (ผู้ช่วยศาสตราจารย์วาสนา ด้วงเหมือน)
            </div>
            <div className="date-block">มิถุนายน 2567</div>
          </div>

          <div className="signature-item">
            <div className="signature-line">
              ลงชื่อ....................................กรรมการ
            </div>
            <div className="name-block">(นายณัฏฐนนท์ กานต์รวีกุลธนา)</div>
            <div className="date-block">มิถุนายน 2567</div>
          </div>
        </div>

        {/* ส่วนล่างสุด: โลโก้สำนักทะเบียน */}
        <div className="ascar-footer">
          <div className="ascar-logo-section">
            <div className="ascar-logo-placeholder">
              {/* สามารถเปลี่ยนเป็นแท็ก <img src="..." /> ได้ */}
              <img
                src="/logo/rmutk-footer-logo.png"
                alt="Logo"
                style={{ width: "80px", height: "auto" }}
              />
            </div>
            <div className="ascar-text">
              <div className="office-th">สำนักส่งเสริมวิชาการและงานทะเบียน</div>
              <div className="office-en">
                Academic Support Center and Registration
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PreviewDocumentPage;
