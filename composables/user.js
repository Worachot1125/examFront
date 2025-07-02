import { ref } from "vue";
import service from "../service";

export const useUsers = () => {
  const query = ref({
    page: 1,
    limit: 10,
  });

  const users = ref([]);
  const isLoading = ref(false);

  /** ดึงรายชื่อผู้ใช้ */
  const fetchUsers = async () => {
    isLoading.value = true;
    try {
      const res = await service.users.fetchUser(query.value);
      console.log("Full API Response Data:", res.data);

      // สมมุติ API คืน { data: { data: [...] } }
      const fetched = res.data.data;

      // map เฉพาะ field ที่จำเป็น
      users.value = fetched.map((u) => ({
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        userNumber: u.user_number,
        phone: u.phone,
        role: u.role,
      }));
      console.log("users updated:", users.value);
    } catch (err) {
      console.error("Error fetching users:", err);
      users.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  /** สร้างผู้ใช้ใหม่ */
  const createUser = async (payload) => {
    try {
      await service.users.createUser(payload);
      console.log("create user successfully!");
      await fetchUsers();
      return true;
    } catch (err) {
      console.error("Error creating user:", err);
      return false;
    }
  };

  /** แก้ไขข้อมูลผู้ใช้ */
  const updateUser = async (payload, id) => {
    try {
      await service.users.updateUser(payload, id);
      console.log("update user successfully!");
      await fetchUsers();
      return true;
    } catch (err) {
      console.error("Error updating user:", err);
      return false;
    }
  };

  /** ลบผู้ใช้ */
  const deleteUser = async (id) => {
    try {
      await service.users.deleteUser(id);
      console.log("delete user successfully!");
      await fetchUsers();
      return true;
    } catch (err) {
      console.error("Error deleting user:", err);
      return false;
    }
  };

  return {
    query,
    users,
    isLoading,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
