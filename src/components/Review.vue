<script setup>
import { ref } from "vue";
import Grade from "../components/Grade.vue";
import { io } from "socket.io-client";
const props = defineProps({
  data: Object,
});

const socket = io("http://localhost:3000");
const { name, grade, text, lecturer, _id } = props.data;

const likes = ref(props.data.likes);
const dislikes = ref(props.data.dislikes);
const liked = ref(false);
const disliked = ref(false);
const checkRate = () => {
  socket.emit("getIp");
  socket.on("takeIp", (ip) => {
    console.log(ip);
    likes.value.map((item) => {
      if (item === ip) {
        liked.value = true;
      }
    });
    dislikes.value.map((item) => {
      if (item === ip) {
        disliked.value = true;
      }
    });
  });
};
checkRate();

const date = new Date(props.data.date).toLocaleDateString("ru-RU");

const like = () => {
  socket.emit("like", _id);
  socket.on("takeLikes", (likesList) => {
    likes.value = likesList;
    liked.value = !liked.value;
    socket.off();
    if (disliked.value) {
      socket.emit("dislike", _id);
      socket.on("takeDislikes", (dislikeList) => {
        dislikes.value = dislikeList;
        disliked.value = !disliked.value;
        socket.off();
      });
    }
  });
};
const dislike = () => {
  socket.emit("dislike", _id);
  socket.on("takeDislikes", (dislikeList) => {
    dislikes.value = dislikeList;
    disliked.value = !disliked.value;
    socket.off();
    if (liked.value) {
      socket.emit("like", _id);
      socket.on("takeLikes", (likesList) => {
        likes.value = likesList;
        liked.value = !liked.value;
        socket.off();
      });
    }
  });
};
</script>

<template>
  <article class="review">
    <div class="date">
      <span>{{ date }}</span>
    </div>
    <header class="head">
      <a v-if="lecturer" :href="`/reviews/${lecturer}`" class="head__lecturer">
        {{ lecturer }}
      </a>
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
      <div class="rate">
        <div class="rate__cont">
          <button
            class="rate__button rate__like"
            @click="like"
            :style="{ background: liked ? '#ff5555' : '#1e2029' }"
          >
            <font-awesome-icon icon="thumbs-up" class="fa-1x" />
          </button>
          <span>{{ likes.length }}</span>
        </div>
        <span class="rate__sep">|</span>
        <div class="rate__cont">
          <button
            class="rate__button rate__dislike"
            @click="dislike"
            :style="{ background: disliked ? '#ff5555' : '#1e2029' }"
          >
            <font-awesome-icon icon="thumbs-down" class="fa-1x" />
          </button>
          <span>{{ dislikes.length }}</span>
        </div>
      </div>
    </main>
  </article>
</template>

<style scoped>
.review {
  background-color: #282a36;
  border-radius: 0.5rem;
  padding: 1rem;
}
.rate {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.rate__sep {
  color: #4b4e60;
}
.rate__cont {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.content__text
{
  white-space: normal;
  word-break: break-word;
  word-wrap: break-word;
}
.rate__button {
  padding: 0.5rem;
  border-radius: 2rem;
  border: 0.1rem solid #9ea2b9;
  border: none;
  width: 2.2rem;
  height: 2.2rem;
  background-color: #1e2029;
  cursor: pointer;
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
.date {
  position: relative;
}
.date span {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
