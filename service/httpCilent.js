import axios from "axios";

export const client = (ops) => {
  const config = useRuntimeConfig();
  const token = useCookie("token"); // หรือ 'refToken' ถ้าคุณใช้ชื่อนี้

  const api = axios.create({
    baseURL: ops.baseURL || config.public.API_BASE,
    headers: {
      "Content-Type": "application/json",
      ...(token.value && { Authorization: `Bearer ${token.value}` }),
    },
    validateStatus: () => true,
  });

  api.interceptors.request.use((config) => {
    const token = useCookie("token");
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`;
    }
    return config;
  });
  ops.method = ops.method.toLowerCase();

  return api({ ...ops });
};
