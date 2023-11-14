<script setup>
import { computed } from "vue";
const props = defineProps({
  name: String,
  color: String,
});
// const iconClassName = computed(() => ({
//   "fa-1x": true,
//   [color]: true,
// }));

const stylesList = computed(() => ({
  color: props.color
}))
</script>

<template>
  <font-awesome-icon :icon="name" class="fa-1x" :style="stylesList" />
</template>

