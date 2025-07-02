<template>
  <div class="form-container">
    <h1>แจ้งเหตุฉุกเฉิน</h1>
    <form @submit.prevent="handleSubmit">
      <!-- ประเภทเหตุ -->
      <div class="form-group">
        <label>ประเภทเหตุฉุกเฉิน</label>
        <select v-model="typeId" required>
          <option disabled value="">-- เลือกประเภท --</option>
          <option v-for="t in emergencyTypes" :key="t.id" :value="t.id">
            {{ t.name }}
          </option>
        </select>
      </div>

      <!-- รายละเอียด -->
      <div class="form-group">
        <label>รายละเอียดเหตุการณ์</label>
        <textarea v-model="description" required></textarea>
      </div>

      <!-- แนบรูป -->
      <div class="form-group">
        <label>แนบรูปภาพ (ถ้ามี)</label>
        <input type="file" accept="image/*" @change="onFileChange" />
      </div>

      <!-- ปุ่ม -->
      <button type="submit" class="submit-btn">แจ้งเหตุ</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useEmergencyReports } from "@/composables/emergency_report";
import { useEmergencyTypes } from "@/composables/emergency_type";

const router = useRouter();
const route = useRoute();  // ดึง query params

const userId = route.query.userId || "";

const emergencyStore = useEmergencyReports();
const { types: emergencyTypes, fetchEmergencyTypes } = useEmergencyTypes();

const typeId = ref("");
const description = ref("");
const fileObj = ref(null);

onMounted(async () => {
  await fetchEmergencyTypes();
});

const onFileChange = (e) => {
  fileObj.value = e.target.files[0] || null;
};

const handleSubmit = async () => {
  if (!userId) {
    alert("ไม่พบ user id");
    return;
  }

  const fd = new FormData();
  fd.append("user_id", userId);  // ส่ง user_id ด้วย
  fd.append("emergency_type_id", typeId.value);
  fd.append("description", description.value);
  if (fileObj.value) fd.append("image", fileObj.value);

  const ok = await emergencyStore.createEmergencyReport(fd);
  if (ok) {
    router.push("/user/dashboard");  // เปลี่ยนเส้นทางไปหน้า user/dashboard
  }
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", sans-serif;
}

.form-container h1 {
  font-size: 1.8rem;
  margin-bottom: 25px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-group input[type="text"],
.form-group input[type="file"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: #fff;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #4a90e2;
  outline: none;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  display: block;
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}
</style>
