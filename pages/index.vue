<script setup>
import Report from '../components/Report.vue'

definePageMeta({
  title: 'First Page',
  middleware: ['auth'], // เรียกใช้ middleware ชื่อ 'auth'
  layout: 'default',    // หรือ custom layout ถ้ามี
  requiresAuth: true    // custom field ได้เช่นกัน
})
</script>

<template>
  <div>
    Hello from first page!
    <Report />
  </div>
</template>
