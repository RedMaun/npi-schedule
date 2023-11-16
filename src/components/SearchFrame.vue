<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import axios from "axios";
import HeaderFull from "./HeaderFull.vue";
import { defineAsyncComponent } from "vue";
import { INF_LINES_URL, LAST_UPDATED_URL } from "../constants";

const Search = defineAsyncComponent(() => import("./Search.vue"));
const Table = defineAsyncComponent(() => import("./Table.vue"));

let lastUrl,
  lastName = "";
if ((lastUrl = localStorage.getItem("url"))) {
  lastUrl = localStorage.getItem("url").split(",")[0];
  lastName = localStorage.getItem("url").split(",")[1];
}
const inf = (await axios.get(INF_LINES_URL)).data;
const lastUpdated = (await axios.get(LAST_UPDATED_URL)).data;
const lastUpdatedText = lastUpdated.split("-").reverse().join(".");
</script>

<template>
  <HeaderFull />

  <div class="message">
    {{ inf.run[0] }}
    <br />Обновлено: <b>{{ lastUpdatedText }}</b>
  </div>

  <Search class="search-cont" />
  <Table></Table>
  <div class="last-visited" v-if="lastName != ''">
    Последнее просмотренное:
    <router-link :to="lastUrl" v-if="lastName">{{ lastName }}</router-link>
    <router-link :to="lastUrl" v-else>Ссылка</router-link>
  </div>
  <div class="footer">
    <font-awesome-icon class="footer__info-icon fa-2x" icon="circle-info" />
    <div class="footer__info-text">
      <span>Нашли баг? Возник вопрос? </span
      ><a href="https://vk.com/redmaunn">Пишите мне</a>
      <a
        style="display: block; width: fit-content"
        href="https://github.com/RedMaun/npi-schedule"
        >Исходный код</a
      >
    </div>
  </div>
</template>

<style scoped>
* {
  color: #f8f8f2;
}
#one,
#two {
  color: #282a36;
}

.last-visited {
  width: fit-content;
  margin: auto;
  margin-top: 2rem;
  margin-bottom: 4rem;
}

.search-cont {
  margin-top: 3rem;
}
.message {
  width: fit-content;
  margin: auto;
  margin-top: 6rem;
  background-color: #ff5555;
  padding: 1rem;
  border-radius: 1rem;
}
.footer {
  padding: 1rem;
  background-color: #44475a;
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  border-radius: 1rem;
  width: 22rem;
}
.footer__info-text {
  display: inline-block;
  position: relative;
  left: 2.5rem;
}
.footer__info-icon {
  margin: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 1rem;
}
.table-cont {
  width: 30rem;
  border-spacing: 0;
  border-radius: 0.8rem;
  margin: auto;
  margin-top: 4rem;
}
@media only screen and (max-width: 840px) {
  .table-cont {
    width: 90%;
  }
}
@media only screen and (max-width: 600px) {
  * {
    font-size: small;
  }
  .footer__info-icon {
    font-size: 2rem !important;
  }
  .search {
    max-width: 24rem;
  }
  .search-cont {
    margin-top: 2rem;
  }
  .group {
    border-radius: 0 !important;
    background-color: #656981 !important;
    border: none !important;
  }
  .message {
    width: 80%;
  }
}
@media only screen and (max-width: 370px) {
  * {
    font-size: xx-small !important;
  }
}
</style>
