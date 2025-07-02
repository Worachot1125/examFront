// middleware/auth.global.ts
import { jwtDecode } from "jwt-decode"

export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("token")

  if (!token?.value) {
    return navigateTo("/login")
  }

  try {
    const decoded = jwtDecode(token.value)

    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp && decoded.exp < now) {
      return navigateTo("/login")
    }

    // token valid → ปล่อยผ่าน
  } catch (e) {
    console.error("Invalid JWT:", e)
    return navigateTo("/login")
  }
})
