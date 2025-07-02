<template>
  <div class="auth-container">
    <form @submit.prevent="onLogin" class="auth-form">
      <h2>Login</h2>

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
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          placeholder="Enter your password"
        />
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? "Logging in..." : "Login" }}
      </button>

      <p class="register-link">
        Don't have an account? <NuxtLink to="/register">Register</NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/auth";
import { useCookie } from "#app";

const form = reactive({
  user_number: "",
  password: ""
});
const error = ref("");
const isLoading = ref(false);

const router = useRouter();
const { sendAuth } = useAuth();

const ADMIN_ROLE_ID = "5bd129b4-7d88-41ef-99b9-8ef4b3e77301";

const onLogin = async () => {
  error.value = "";
  isLoading.value = true;

  const result = await sendAuth(form);
  isLoading.value = false;

  if (result.success) {
    // เก็บ token ลง cookie
    const cookieToken = useCookie("token");
    cookieToken.value = result.token;

    // เก็บ userId ลง cookie
    const cookieUserId = useCookie("user_id");
    cookieUserId.value = result.user?.id || "";

    // เช็ก role แล้วเปลี่ยนเส้นทาง
    const roleId = result.user?.role_id;
    if (roleId === ADMIN_ROLE_ID) {
      router.push("/admin/dashboard");
    } else {
      router.push("/user/dashboard");
    }
  } else {
    error.value = "Invalid user number or password";
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 20px;
}

.auth-form {
  background: white;
  padding: 30px 40px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
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

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 10px;
  text-align: center;
}

.register-link {
  margin-top: 15px;
  text-align: center;
  font-size: 0.9rem;
}

.register-link a {
  color: #3b82f6;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
