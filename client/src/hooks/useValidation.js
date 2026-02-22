import { useState } from "react";

export function useValidation(requiredFields = []) {
  const [errors, setErrors] = useState({});

  const validate = (form) => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field] || form[field].toString().trim() === "") {
        newErrors[field] = "This field is required";
      }
    });
    if (form.student_id && !/^\d{12}$/.test(form.student_id)) {
      newErrors.student_id = "Student ID must be 12 digits (numbers only)";
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
            newErrors[`id${idx}-${idx2}-${idx3}`] = "This field is required";
          }
          if (!course.name || course.name.toString().trim() === "") {
            newErrors[`name${idx}-${idx2}-${idx3}`] = "This field is required";
          }
          if (!course.credits || course.credits.toString().trim() === "") {
            newErrors[`credits${idx}-${idx2}-${idx3}`] = "This field is required";
          }
          if (!course.grade || course.grade.toString().trim() === "") {
            newErrors[`grade${idx}-${idx2}-${idx3}`] = "This field is required";
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
