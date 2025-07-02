<template>
    <div class="flex flex-col justify-center items-center">
        <div>
            <div class="flex justify-between items-center w-full">
                <button v-if="token" @click="handleLogout" :disabled="isLoggingOut"
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
                </button>
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script setup>
const { sendLogout } = useAuth()
const router = useRouter()
const isLoggingOut = ref(false)
const token = useCookie('token')

const handleLogout = async () => {
    isLoggingOut.value = true

    try {
        await sendLogout()

        // ลบ token cookie
        const cookie = useCookie('token')
        cookie.value = null

        // redirect ไปหน้า login
        router.push('/login')
    } catch (error) {
        console.error('Logout failed:', error)
    } finally {
        isLoggingOut.value = false
    }
}
</script>