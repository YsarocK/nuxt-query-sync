<template>
  <div>
    <button @click="addItem">Ajouter un item</button>
    <input v-model="test" type="text" />
    <ul>
      <li v-for="(item, index) in items" :key="index">{{ item }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const test = ref('test');
usePersistence(test, 'test')

const items = ref(['Item 1', 'Item 2'])
usePersistence(items, 'items')

function addItem() {
  items.value.push(`Item ${items.value.length + 1}`)
}
</script>
