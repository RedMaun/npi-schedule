<script setup>
import { computed } from "vue";
const props = defineProps({
  name: String,
  color: String,
});
const iconClassName = computed(() => ({
  "fa-1x": true,
  [color]: true,
}));

const stylesList = computed(() => ({
  color: props.color
}))
</script>

<template>
  <font-awesome-icon :icon="name" class="fa-1x" :style="stylesList" />
</template>

<style>
.purple {
  color: #bd93f9;
}
.yellow {
  color: #ffb86c;
}
.blue {
  color: #8be9fd;
}
.green {
  color: #50fa7b;
}
</style>
