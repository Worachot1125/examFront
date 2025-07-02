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
    emergencyTypeId: r.emergency_type_id, // 👈 เก็บ id ไว้
    reportedAt: r.created_at,
    userId: r.user_id, // เพิ่มถ้าต้องการใช้กรอง
  });

  /* ---------- actions ---------- */
  /** ดึงรายการเหตุฉุกเฉินทั้งหมด (อาจจะไม่ใช้) */
  const fetchEmergencyReports = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // ดึงข้อมูลทั้งหมด หรือจะกรอง user_id ก็ได้
      const res = await apiClient.get("/emergency_reports", {
        params: { user_id: userId }, // ส่ง user_id เพื่อกรองฝั่ง backend
      });
      // สมมติ res.data.data คือ array ของ reports
      reports.value = res.data.data.map(mapReport);
    } catch (err) {
      error.value = err;
      reports.value = [];
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
