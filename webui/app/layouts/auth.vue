<template>
  <BContainer fluid class="vh-100 d-flex justify-content-center align-items-center">
    <BRow class="w-100 justify-content-center">
      <BCol cols="12" md="8">
        <slot />
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
//import { BContainer, BRow, BCol } from 'bootstrap-vue-next'
</script>

<style scoped>
/* 这里暂时不需要额外样式，有需要可以自己加 */
</style>