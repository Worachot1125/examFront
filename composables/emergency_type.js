import { ref } from "vue";
import service from "../service";

export const useEmergencyTypes = () => {
  const types = ref([]);
  const isLoading = ref(false);
  const errorText = ref("");

  const fetchEmergencyTypes = async () => {
    isLoading.value = true;
    errorText.value = "";
    try {
      // เรียกชื่อใหม่ตาม service
      const res = await service.emergency_type.fetchEmergency_type();
      const fetched = res.data.data || [];
      types.value = fetched.map((t) => ({
        id: t.id,
        name: t.name,
      }));
    } catch (error) {
      console.error("Error fetching emergency types:", error);
      errorText.value = "ไม่สามารถโหลดประเภทเหตุฉุกเฉินได้";
      types.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    types,
    isLoading,
    errorText,
    fetchEmergencyTypes,
  };
};
