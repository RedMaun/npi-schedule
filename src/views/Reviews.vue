<script setup>
import { ref } from "vue";
import Review from "../components/Review.vue";
import { io } from "socket.io-client";
const socket = io("https://socket.redmaun.ru");
socket.on("connect", () => {
  socket.emit("getData");
  socket.on("takeData", (comments) => {
    data.value = comments;
    console.log('jjhagsjgasljkglajskjlkh')
  });
});
const data = ref(null);
</script>

<template>
  <div class="frame">
    <div class="page-title">
      <a href="/">
        <button class="page-title__button">
          <font-awesome-icon icon="arrow-left" class="page-title__icon fa-lg" />
        </button>
      </a>
      <header class="page-title__header">Недавние отзывы</header>
    </div>
    <div class="reviews-cont">
      <div v-if="data && data.length === 0" class="no-reviews">
        Отзывов пока нет
      </div>
      <Review v-for="review in data" :data="review" />
    </div>
  </div>
</template>

<style scoped>
.frame {
  width: 40rem;
  min-width: 20rem;
  margin: auto;
}
.no-reviews {
  color: #c7c7c7;
}
.page-title {
  width: fit-content;
  margin-top: 5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
.page-title__header {
  font-size: 2rem;
}
.page-title__button {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 2.5rem;
  background-color: #f8f8f2;
  cursor: pointer;
}
.page-title__icon {
  color: #282a36;
}
.reviews-cont {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}
.reviews-cont:last-child {
  margin-bottom: 10rem;
}
@media only screen and (max-width: 600px) {
  .frame {
    width: 90%;
  }
}
</style>
