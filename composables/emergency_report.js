// composables/useEmergencyReports.js
import { ref } from "vue";
import { useCookie } from "#app"; // สำหรับดึง cookie ใน Nuxt 3
import service from "../service"; // default export จาก service/index.js

export const useEmergencyReports = () => {
  /* ---------- state ---------- */
  const query = ref({ page: 1, limit: 10 });
  const reports = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  // ดึง userId จาก cookie
  const userId = useCookie("user_id").value || "";

  /* ---------- helpers ---------- */
  const mapReport = (r) => ({
    id: r.id,
    description: r.description,
    status: r.status,
    emergency_type_id: r.emergency_type_id, // ใช้ชื่อเดียวกับที่ dashboard.vue ใช้
    created_at: r.created_at, // ใช้ชื่อเดียวกับที่ dashboard.vue ใช้
    user_id: r.user_id,
  });

  /* ---------- actions ---------- */
  /** ดึงรายการเหตุฉุกเฉินทั้งหมด (สำหรับ admin) */
  const fetchEmergencyReports = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // ดึงข้อมูลทั้งหมดโดยไม่กรอง user_id สำหรับ admin
      const res = await service.emergency_report.fetchEmergency_report({});
      // ข้อมูลจาก backend อยู่ใน res.data.data
      const rawData = res.data.data || [];
      reports.value = rawData.map(mapReport);
    } catch (err) {
      error.value = err;
      reports.value = [];
      console.error("Error fetching emergency reports:", err);
    } finally {
      isLoading.value = false;
    }
  };

  /** ดึงรายงานเหตุฉุกเฉินของ user คนเดียว (ใช้ API /emergency_reports/users/:userId) */
  const fetchReportsByUserId = async () => {
    if (!userId) {
      reports.value = [];
      return;
    }
    isLoading.value = true;
    error.value = null;
    try {
      const res = await service.emergency_report.getByUserIDEmergencyReport(
        userId
      );
      // ดึงข้อมูลจาก res.data.data (เพราะข้อมูลอยู่ใน data)
      reports.value = res.data.data.map(mapReport);
    } catch (err) {
      error.value = err;
      reports.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  /** สร้างเหตุฉุกเฉินใหม่ */
  const createEmergencyReport = async (payload) => {
    try {
      await service.emergency_report.createEmergency_report(payload);
      await fetchReportsByUserId();
      return true;
    } catch (err) {
      console.error("Error creating emergency report:", err);
      return false;
    }
  };

  /** อัปเดตเหตุฉุกเฉิน */
  const updateEmergencyReport = async (payload, id) => {
    try {
      await service.emergency_report.updateEmergency_report(payload, id);
      await fetchReportsByUserId();
      return true;
    } catch (err) {
      console.error("Error updating emergency report:", err);
      return false;
    }
  };

  /** ลบเหตุฉุกเฉิน */
  const deleteEmergencyReport = async (id) => {
    try {
      await service.emergency_report.deleteEmergency_report(id);
      await fetchReportsByUserId();
      return true;
    } catch (err) {
      console.error("Error deleting emergency report:", err);
      return false;
    }
  };

  /* ---------- export ---------- */
  return {
    query,
    reports,
    isLoading,
    error,
    fetchEmergencyReports,
    fetchReportsByUserId,
    createEmergencyReport,
    updateEmergencyReport,
    deleteEmergencyReport,
  };
};
