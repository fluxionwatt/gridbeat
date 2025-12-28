<script setup>
const { fetchUser } = useAuth()

onMounted(() => {
  fetchUser()
})
</script>

<template>
  <NuxtPage />
</template>