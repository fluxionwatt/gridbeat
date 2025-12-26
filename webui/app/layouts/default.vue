<script setup lang="ts">
const auth = useAuthStore()
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">
    <BNavbar variant="light" class="border-bottom bg-white">
      <BNavbarBrand href="/">Industrial Gateway</BNavbarBrand>
      <BNavbarNav class="ms-auto">
        <BNavItem href="/devices">Devices</BNavItem>
        <BNavItem href="/" @click.prevent="auth.logout()">Logout</BNavItem>
      </BNavbarNav>
    </BNavbar>

    <div class="flex-grow-1">
      <BContainer fluid class="py-3">
        <slot />
      </BContainer>
    </div>
  </div>
</template>