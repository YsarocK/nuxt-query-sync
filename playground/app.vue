<template>
  <div>
    Nuxt module playground!
    <input v-model="test" type="text" />
  </div>
</template>

<script setup lang="ts">
const test = usePersistence(ref('dsq'), 'test')
</script>
