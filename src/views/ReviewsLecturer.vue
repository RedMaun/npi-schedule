<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import Review from "../components/Review.vue";
import Grade from "../components/Grade.vue";
import Header from "../components/Header.vue";
import { useRoute, useRouter } from "vue-router";
import { io } from "socket.io-client";
import { LECTURERS_URL } from "../constants";
import axios from "axios";

let loaded = ref(false);

onBeforeMount(async () => {
  const resp = (await axios.get(LECTURERS_URL + "/" + encodeURI(lecturer)))
    .data;
  if (resp.length === 0) {
    window.location.href = "/404";
  }
  loaded.value = true;
});

let rawData;
const socket = io("http://localhost:3000");
const route = useRoute();
const router = useRouter();
const lecturer = route.params.lecturer;
const data = ref(null);
const grade = ref(null);
const gradeNumber = ref(0);
const formText = ref("");
const submitButton = ref(null);
const goBack = ref(null);
socket.on("connect", () => {
  socket.emit("getSpecificData", lecturer);
  socket.on("takeSpecificData", (comments) => {
    rawData = comments;
    rawData.map((item) => {
      delete item.lecturer;
    });
    data.value = rawData;
  });
});

const paintStars = (array, index) => {
  for (let i = 1; i <= index; i++) {
    array[i].firstChild.style.color = "#F1FA8C";
  }
  for (let i = array.length - 2; i > index; i--) {
    array[i].firstChild.style.color = "#44475A";
  }
};
onMounted(() => {
  const array = Array.from(grade.value.firstChild.childNodes);
  grade.value.onmouseleave = () => {
    paintStars(array, gradeNumber.value);
  };
  array.map((item, index) => {
    if (item.nodeName !== "#text") {
      item.firstChild.onclick = () => {
        gradeNumber.value = item.id;
      };
      item.firstChild.onmouseover = () => {
        paintStars(array, index);
      };
    }
  });
  submitButton.value.onclick = (e) => {
    e.preventDefault();
    socket.emit("takeData", formText.value, gradeNumber.value, lecturer);
    gradeNumber.value = 0
    formText.value = ''
    socket.emit("getSpecificData", lecturer);
  };
  goBack.value.onclick = () => {
    router.go(-1);
  };
});
</script>
<template>
  <div class="frame">
    <div class="title">
      <div ref="goBack" class="title__go-back">
        <button class="title__button">
          <font-awesome-icon icon="arrow-left" class="title__icon fa-lg" />
        </button>
      </div>
      <header class="title__header">Отзывы о {{ lecturer }}</header>
    </div>
    <div class="form-cont">
      <form class="form">
        <div ref="grade" class="grade-cont">
          <Grade ref="grade" :grade="gradeNumber" :size="'fa-2x'"></Grade>
        </div>
        <div class="input-cont">
          <textarea
            name="text"
            placeholder="Напишите отзыв"
            v-model="formText"
            class="input-cont__text-input"
            maxlength="250"
          ></textarea>
          <div class="input-cont__text-count">{{ formText.length }}/250</div>
        </div>
        <button ref="submitButton" class="form__submit-button">
          Отправить
        </button>
      </form>
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
  margin: auto;
  margin-top: 3rem;
}
.title {
  width: fit-content;
  display: flex;
  /* padding-left: 1rem; */
  margin-bottom: 1rem;
  gap: 1rem;
  align-items: center;
}
.form-cont {
  width: 100%;
  background: #282a36;
  padding: 0.5rem;
  padding-top: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  /* margin: auto;/ */
  /* margin: auto; */
}

.title__header {
  font-size: 2rem;
}
.title__button {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 2.5rem;
  background-color: #f8f8f2;
  cursor: pointer;
}
.title__icon {
  color: #282a36;
}
.reviews-cont {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
.form {
  /* width: 30rem; */
  padding: 1rem;
  padding-top: 0.2rem;
  padding-bottom: 0.5rem;
  /* border-radius: 0.5rem; */
  /* background-color: #282A36; */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
.grade-cont {
  /* width: 100%; */
  align-self: start;
  cursor: pointer;
  margin-top: 0.5rem;
}
.icon-cont {
  display: flex;
  gap: 0.3rem;
}
.input-cont__text-input {
  background-color: #353744;
  border: 0.1rem solid rgb(93, 97, 114);
  padding: 0.5rem;
  border-radius: 0.5rem;
  width: 100%;
  /* width: 100%; */
  height: 7rem;
  outline: none;
  resize: none;
  box-sizing: border-box;
}
.input-cont__text-input:focus {
  border: 0.1rem solid rgb(126, 131, 151);
}
.input-cont__text-input::placeholder {
  color: #9e9ea1;
}
.form__submit-button {
  background-color: #353744;
  padding: 0.5rem;
  border-radius: 0.5rem;
  /* border: 0.1rem solid rgb(93, 97, 114); */
  border: 0.1rem solid #44475a;
  align-self: end;
}
.input-cont {
  width: 100%;
}
.input-cont__text-count {
  text-align: right;
}
.reviews-cont:last-child {
  margin-bottom: 10rem;
}
</style>
