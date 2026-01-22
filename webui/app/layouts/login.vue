<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-4">
      <div class="mb-6 flex justify-center">
        <Logo class="h-7 w-auto" />
      </div>

      <UCard class="shadow-sm">
        <slot />
      </UCard>

      <div class="mt-6 text-center text-xs text-gray-500">
        GridBeat WebUI
      </div>
    </div>
  </div>
</template>
