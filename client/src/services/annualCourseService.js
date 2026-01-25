import api from "../api/axios";

export const getAnnualCourses = () => api.get("/api/annual-courses");
export const getAnnualCourse = (id) => api.get(`/api/annual-courses/${id}`);
export const createAnnualCourse = (data) =>
  api.post("/api/annual-courses", data);
export const updateAnnualCourse = (id, data) =>
  api.put(`/api/annual-courses/${id}`, data);
export const deleteAnnualCourse = (id) =>
  api.delete(`/api/annual-courses/${id}`);
export const activeAnnualCourse = (id) =>
  api.patch(`/api/annual-courses/active/${id}`);

export const getAnnualCourseSubjects = () =>
  api.get("/api/annual-courses/subject");
export const getAnnualCourseSubject = (id) =>
  api.get(`/api/annual-courses/subject/${id}`);
export const createAnnualCourseSubject = (data) =>
  api.post("/api/annual-courses/subject", data);
export const updateAnnualCourseSubject = (id, data) =>
  api.put(`/api/annual-courses/subject/${id}`, data);
export const deleteAnnualCourseSubject = (id) =>
  api.delete(`/api/annual-courses/subject/${id}`);
export const deleteAnnualCourseSubjectByAnnualCourseId = (id) =>
  api.delete(`/api/annual-courses/subject-by-annual-course/${id}`);