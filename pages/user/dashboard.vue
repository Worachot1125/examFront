<template>
  <div class="dashboard-container">
    <h1>รายการเหตุฉุกเฉิน</h1>

    <div class="top-actions">
      <button
        class="refresh-btn"
        :disabled="isLoading"
        @click="fetchReportsByUserId"
      >
        {{ isLoading ? "Loading..." : "Refresh" }}
      </button>

      <NuxtLink
        :to="{ path: '/user/report', query: { userId } }"
        class="view-btn"
      >
        แจ้งเหตุ
      </NuxtLink>
    </div>

    <table class="report-table" v-if="reports.length">
      <thead>
        <tr>
          <th>#</th>
          <th>ประเภทเหตุ</th>
          <th>รายละเอียด</th>
          <th>สถานะ</th>
          <th>เวลาแจ้งเหตุ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, idx) in reports" :key="r.id">
          <td>{{ idx + 1 }}</td>
          <td>{{ typeNameById(r.emergencyTypeId) }}</td>
          <td>{{ r.description }}</td>
          <td>{{ r.status }}</td>
          <td>{{ formatDate(r.reportedAt) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else class="no-data">ไม่พบรายการเหตุฉุกเฉิน</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useCookie } from "#app";

import { useEmergencyReports } from "@/composables/emergency_report";
import { useEmergencyTypes } from "@/composables/emergency_type";

const { reports, isLoading, fetchReportsByUserId } = useEmergencyReports();
const { types, fetchEmergencyTypes } = useEmergencyTypes();

const userIdCookie = useCookie("user_id"); // ชื่อต้องตรงกับ cookie ที่บันทึกตอน login
const userId = userIdCookie.value || "";

onMounted(async () => {
  console.log("Dashboard mounted, userId =", userId);
  await fetchEmergencyTypes();
  if (userId) {
    console.log("Fetching reports by user id");
    await fetchReportsByUserId();
  }
});

const userReports = computed(() => {
  return reports.value; // เพราะ API ดึงมาเฉพาะ user นี้แล้ว
});

const firstUserReportId = computed(() => {
  return userReports.value.length ? userReports.value[0].id : null;
});

const typeNameById = (id) => {
  const t = types.value.find((x) => x.id === id);
  return t ? t.name : "-";
};

const formatDate = (ts) =>
  ts ? new Date(Number(ts) * 1000).toLocaleString() : "-";
</script>

<style scoped>
.dashboard-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.refresh-btn {
  display: block;
  margin-left: auto;
  margin-bottom: 15px;
  padding: 8px 18px;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.refresh-btn:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #2563eb;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
}

.report-table th,
.report-table td {
  padding: 12px 10px;
  border: 1px solid #ddd;
  text-align: left;
  font-size: 0.95rem;
}

.report-table th {
  background-color: #f3f4f6;
}

.status-pill {
  padding: 4px 10px;
  border-radius: 12px;
  color: #fff;
  font-weight: 600;
  font-size: 0.8rem;
}

td select {
  padding: 4px 6px;
  font-size: 0.9rem;
  margin-right: 8px;
}

td button {
  padding: 4px 10px;
  font-size: 0.85rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

td button:hover {
  background-color: #059669;
}

.no-data {
  text-align: center;
  color: #666;
  margin-top: 40px;
}

.view-btn {
  padding: 4px 10px;
  font-size: 0.85rem;
  background-color: #f6483b;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
}
.view-btn:hover {
  background-color: #2563eb;
}
</style>
