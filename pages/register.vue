<template>
  <div class="auth-container">
    <form @submit.prevent="onRegister" class="auth-form">
      <h2>Register</h2>

      <div class="form-group">
        <label for="first_name">First Name</label>
        <input
          id="first_name"
          v-model="form.first_name"
          type="text"
          required
          placeholder="Enter your first name"
        />
      </div>

      <div class="form-group">
        <label for="last_name">Last Name</label>
        <input
          id="last_name"
          v-model="form.last_name"
          type="text"
          required
          placeholder="Enter your last name"
        />
      </div>

      <div class="form-group">
        <label for="user_number">User Number</label>
        <input
          id="user_number"
          v-model="form.user_number"
          type="text"
          required
          placeholder="Enter your user number"
        />
      </div>

      <div class="form-group">
        <label for="phone">Phone</label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          required
          placeholder="Enter your phone number"
        />
      </div>

      <div class="form-group">
        <label for="address">Address</label>
        <input
          id="address"
          v-model="form.address"
          type="text"
          required
          placeholder="Enter your address"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          placeholder="Enter your password"
        />
      </div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? "Registering..." : "Register" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/auth";

const form = ref({
  first_name: "",
  last_name: "",
  user_number: "",
  phone: "",
  address: "",
  password: "",
});

const isLoading = ref(false);
const router = useRouter();
const authStore = useAuth();

const onRegister = async () => {
  isLoading.value = true;
  try {
    await authStore.sendRegister(form.value);
    router.push("/login");
  } catch (err) {
    console.error("Register error:", err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f2f5;
  padding: 20px;
}

.auth-form {
  background: white;
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.auth-form h2 {
  text-align: center;
  margin-bottom: 25px;
  font-weight: 600;
  color: #333;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #444;
}

.form-group input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  border-color: #3b82f6;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #3b82f6;
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

button:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #2563eb;
}
</style>
