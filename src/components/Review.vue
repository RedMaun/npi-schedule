<script setup>
import Grade from "../components/Grade.vue";
const props = defineProps({
  data: Object,
});
const { name, grade, text, lecturer } = props.data;
const date = new Date(props.data.date).toLocaleDateString('ru-RU')
</script>

<template>
  <article class="review">
    <header class="head">
      <a v-if="lecturer" :href="`/reviews/${lecturer}`" class="head__lecturer">
        {{ lecturer }}
      </a>
      <div class="head__date">
        <span>{{ date }}</span>
      </div>
    </header>
    <main class="content">
      <div class="content-info">
        <div class="content-info__name">
          <b>{{ name }}</b>
        </div>
        <div class="content-info__grade">
          <Grade :grade="grade"></Grade>
        </div>
      </div>
      <span class="content__text">{{ text }}</span>
    </main>
  </article>
</template>

<style scoped>
.review {
  background-color: #282a36;
  border-radius: 0.5rem;
  padding: 1rem;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.content-info {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
.head__lecturer {
  color: #8093ca;
  text-decoration: none;
}
.head__date {
  position: relative;
}
.head__date span
{
    position: absolute;
    top: 0;
    right: 0;
}
</style>
