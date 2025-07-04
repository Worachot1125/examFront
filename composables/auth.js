// composables/auth.js
import { ref } from "vue";
import service from "../service";

export const useAuth = () => {
  const isLoading = ref(false);

  const sendAuth = async (payload) => {
    try {
      const res = await service.auth.sendLogin(payload);
      const { token, user } = res.data;
      return { success: true, token, user };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return { success: false, token: null, user: null };
    }
  };

  const sendLogout = async () => {
    try {
      await service.auth.sendLogout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ฟังก์ชันใหม่ สำหรับ register
  const sendRegister = async (payload) => {
    isLoading.value = true;
    try {
      const res = await service.auth.createUser(payload); // เรียก API createUser ที่คุณสร้างไว้
      return { success: true, data: res.data };
    } catch (err) {
      console.error("Register failed:", err.response?.data || err.message);
      return { success: false, error: err };
    } finally {
      isLoading.value = false;
    }
  };

  // ฟังก์ชันใหม่ สำหรับดึงรายงานเหตุฉุกเฉินตาม userId
  const getEmergencyReportsByUserId = async (userId) => {
    try {
      const res = await service.emergency_report.getByUserIDEmergencyReport(userId);
      return { success: true, data: res.data.data };
    } catch (err) {
      console.error("Fetch emergency reports failed:", err);
      return { success: false, data: [] };
    }
  };

  return { sendAuth, sendLogout, sendRegister, getEmergencyReportsByUserId, isLoading };
};
