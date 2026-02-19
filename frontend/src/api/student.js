import axiosInstance from "../utils/axiosInstance";

// GET profile
export const getProfile = async () => {
  const res = await axiosInstance.get("/student-management/me");
  return res.data;
};

// UPDATE profile
export const updateProfile = async (data) => {
  const res = await axiosInstance.put("/student-management/me", data);
  return res.data;
};
