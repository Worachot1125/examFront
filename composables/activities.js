import service from "../service";
import { ref } from "vue";

export const useActivities = () => {
  const query = ref({
    page: 1,
    limit: 10,
  });

  const activities = ref([]);
  const isLoading = ref(false);

  const fetchActivities = async () => {
    isLoading.value = true;
    try {
      const res = await service.activities.fetchActivities(query.value);
      console.log("Full API Response Data:", res.data);
      const fetchedData = res.data.data;
      activities.value = fetchedData.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
      }));
      console.log("activities updated:", activities.value);
    } catch (err) {
      console.error("Error fetching activities:", err);
      activities.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const createActivities = async (payload) => {
    try {
      await service.activities.createActivities(payload);
      console.log("create activities successfully!");
      await fetchActivities();
      return true;
    } catch (err) {
      console.error("Error creating activities:", err);
      return false;
    }
  };

  const updateActivities = async (payload, id) => {
    try {
      await service.activities.updateActivities(payload, id);
      console.log("update activities successfully!");
      return true;
    } catch (err) {
      console.error("Error Updating activities:", err);
      return false;
    }
  };

  const deleteActivities = async (id) => {
    try {
      await service.activities.deleteActivities(id);
      console.log("delete activities successfully!");
      await fetchActivities();
    } catch (err) {
      console.error("Error Deleting activities", err);
      return false;
    }
  };

  return {
    activities,
    isLoading, // ✅ export loading
    fetchActivities,
    createActivities,
    updateActivities,
    deleteActivities,
  };
};
