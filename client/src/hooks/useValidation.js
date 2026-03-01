import { useState } from "react";

export function useValidation(requiredFields = []) {
  const [errors, setErrors] = useState({});

  const validate = (form) => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field] || form[field].toString().trim() === "") {
        newErrors[field] = "กรุณาเพิ่มข้อมูลในช่องว่าง";
      }
    });
    if (form.student_id && !/^\d{12}$/.test(form.student_id)) {
      newErrors.student_id = "รหัสนักศึกษาจะต้องมี12ตัว (เฉพาะตัวเลข)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTransferData = (data) => {
    const newErrors = {};
    data.forEach((item, idx) => {
      item.groups.forEach((group, idx2) => {
        group.courses.forEach((course, idx3) => {
          if (!course.id || course.id.toString().trim() === "") {
            newErrors[`id${idx}-${idx2}-${idx3}`] = "กรุณาเพิ่มข้อมูลในช่องว่าง";
          }
          if (!course.name || course.name.toString().trim() === "") {
            newErrors[`name${idx}-${idx2}-${idx3}`] = "กรุณาเพิ่มข้อมูลในช่องว่าง";
          }
          if (!course.credits || course.credits.toString().trim() === "") {
            newErrors[`credits${idx}-${idx2}-${idx3}`] = "กรุณาเพิ่มข้อมูลในช่องว่าง";
          }
          if (!course.grade || course.grade.toString().trim() === "") {
            newErrors[`grade${idx}-${idx2}-${idx3}`] = "กรุณาเพิ่มข้อมูลในช่องว่าง";
          }
        });
      });
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetErrors = () => setErrors({});
  return { errors, validate, validateTransferData, resetErrors };
}
