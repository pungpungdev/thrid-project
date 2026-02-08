import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getStudentSummary } from "../services/summaryService";

function TestPage() {
  const courseData = [
    {
      id: "5-155-302",
      name: "การฝึกงาน (Job Training)",
      credits: "3(0-40-0)",
      groups: [
        {
          groupId: 1,
          courses: [
            { id: "30202-8001", name: "ฝึกงาน", credits: 4, grade: "" },
          ],

          selected: false,
        },
        {
          groupId: 2,
          courses: [
            { id: "30204-8001", name: "ฝึกงาน", credits: 4, grade: "4" },
          ],
          selected: true,
        },
        {
          groupId: 3,
          courses: [
            { id: "30901-8001", name: "ฝึกงาน", credits: 4, grade: "" },
          ],
          selected: false,
        },
      ],
    },
    {
      id: "5-151-121",
      name: "การพัฒนาโปรแกรมคอมพิวเตอร์ (Computer Programming)",
      credits: "3(0-6-3)",
      groups: [
        {
          groupId: 1,
          courses: [
            {
              id: "30204-2005",
              name: "การเขียนโปรแกรมคอมพิวเตอร์",
              credits: 3,
              grade: "2.5",
            },
          ],
          selected: true,
        },
        {
          groupId: 2,
          courses: [
            {
              id: "30901-1001",
              name: "การโปรแกรมคอมพิวเตอร์เชิงโครงสร้าง",
              credits: 3,
              grade: "",
            },
          ],
          selected: false,
        },
      ],
    },
    {
      id: "5-151-122",
      name: "ซอฟต์แวร์ประยุกต์ทางธุรกิจ (Business Application Software)",
      credits: "3(0-6-3)",
      groups: [
        {
          groupId: 2,
          courses: [
            {
              id: "30001-2001",
              name: "เทคโนโลยีสารสนเทศเพื่อการจัดการอาชีพ",
              credits: 3,
              grade: "3",
            },
          ],
          selected: false,
        },
      ],
    },
    {
      id: "5-151-222",
      name: "วัสดุคอมพิวเตอร์และระบบสมองกลฝังตัว (Computer Materials and Embedded System)",
      credits: "3(3-0-6)",
      groups: [
        {
          groupId: 1,
          courses: [
            {
              id: "30900-0004",
              name: "งานติดตั้งระบบคอมพิวเตอร์เบื้องต้น",
              credits: 3,
              grade: "3",
            },
            {
              id: "30901-2017",
              name: "พื้นฐานเทคโนโลยีระบบสมองกลฝังตัวและไอโอที",
              credits: 3,
              grade: "3",
            },
          ],
          selected: false,
        },
        {
          groupId: 2,
          courses: [
            {
              id: "30204-2304",
              name: "การบำรุงรักษาคอมพิวเตอร์และอุปกรณ์พกพา",
              credits: 3,
              grade: "2.5",
            },
            {
              id: "30204-2104",
              name: "อินเทอร์เน็ตสรรพสิ่งสำหรับธุรกิจดิจิทัล",
              credits: 3,
              grade: "3",
            },
          ],
          selected: false,
        },
      ],
    },
  ];
  const dataForMoreRows = [...courseData, ...courseData, ...courseData];
  const [data] = useState(dataForMoreRows);
  const [data2, setData2] = useState(null);
  const [header, setHeader] = useState({});
  //const isLoaded = useRef(false);

  useEffect(() => {
    //if (isLoaded.current) return;
    //isLoaded.current = true;
    getStudentSummary(1).then((res) => {
      if (res.data) {
        setHeader({
          ...header,
          courseName: "หลักสูตรเทคโนโลยีสารสนเทศและธุรกิจดิจิทัล ปี2567",
        });
        setData2(res.data);
      }
    });
  }, []);
  /* useEffect(() => {
    if (data2) {
      window.print();
    }
  }, [data2]); */

  return (
    <div className="print-container">
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Link to="/test" target="_blank">
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
              marginRight: "10px",
            }}
          >
            new tab
          </button>
        </Link>
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
          พิมพ์เอกสาร
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
            <div style={{marginBottom: "10px"}}>
              <div className="uni-th">มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ</div>
              <div className="uni-en">Rajamangala University of Technology</div>
            </div>
          </div>

          <div className="document-title-section">
            <div style={{marginBottom: "10px"}}>
              <div className="main-title">
                ตารางการเทียบวิชาเรียนและโอนหน่วยกิตการศึกษาในระบบ
              </div>
              <div className="sub-title">
                หลักสูตรเทคโนโลยีสารสนเทศและธุรกิจดิจิทัล (เข้าศึกษาปี 2567)
              </div>
            </div>
          </div>
        </div>

        <hr className="header-divider" />

        {/* ส่วนข้อมูลนักศึกษา: จัดเรียงแบบ Grid */}
        <div className="student-info-grid">
          <div className="info-item">
            <span className="label">รหัสประจำตัวนักศึกษา</span>
            <span className="value">67605100065-8</span>
          </div>
          <div className="info-item">
            <span className="label">ชื่อ-สกุล</span>
            <span className="value">นายธนนวัฒน์ กำเนิดธรพิสิฐ</span>
          </div>
          <div className="info-item">
            <span className="label">หลักสูตร</span>
            <span className="value">เทคโนโลยีสารสนเทศและธุรกิจดิจิทัล</span>
          </div>
          <div className="info-item">
            <span className="label">คณะ</span>
            <span className="value">บริหารธุรกิจ</span>
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
          class="course-comparison-table"
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
                          <td rowSpan={group.courses.length}></td>
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
          <span className="summary-value"> 7 </span> วิชา
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
export default TestPage;
