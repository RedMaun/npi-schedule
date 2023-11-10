<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import axios from "axios";
import { defineAsyncComponent } from "vue";
import { INF_LINES_URL, LAST_UPDATED_URL } from "../constants";
import { useCurrentWeekNumberStore } from "../stores/weekNumber";

const Search = defineAsyncComponent(() => import("./Search.vue"));
const Table = defineAsyncComponent(() => import("./Table.vue"));
const currentWeekNumberStore = useCurrentWeekNumberStore();
await currentWeekNumberStore.getCurrentWeekNumber();

let lastUrl,
  lastName = "";
if ((lastUrl = localStorage.getItem("url"))) {
  lastUrl = localStorage.getItem("url").split(",")[0];
  lastName = localStorage.getItem("url").split(",")[1];
}
const currentWeek = currentWeekNumberStore.currentWeekNumber
const inf = (await axios.get(INF_LINES_URL)).data
const lastUpdated = (await axios.get(LAST_UPDATED_URL)).data
</script>

<template>
  <div class="header">
    <div class="header__logo"><img src="/logo.png" /></div>
    <div class="header__title">
      <span id="one">ФГБОУ ВО "ЮРГПУ (НПИ) имени М.И.Платова". Расписание</span>
      <span id="two">ЮРГПУ НПИ Расписание</span>
    </div>
    <div class="header__week">{{ currentWeek }} Неделя</div>
  </div>

  <div class="message">
    {{ inf.run[0] }}
    <br />Обновлено: <b>{{ lastUpdated.split("-").reverse().join(".") }}</b>
  </div>

  <Search class="search-cont "/>
  <Table class="table"></Table>
  <div class="last-visited" v-if="lastName != ''">
    Последнее просмотренное:
    <router-link :to="lastUrl" v-if="lastName">{{ lastName }}</router-link>
    <router-link :to="lastUrl" v-else>Ссылка</router-link>
  </div>
  <div class="footer">
    <font-awesome-icon
      class="footer__info-icon fa-2x"
      icon="circle-info"
    />
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
.header {
  padding: 0.5rem;
  top: 0px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 10;
  width: 100%;
  height: 3rem;
  background-color: #44475a;
  border-bottom: 0.1rem solid #6272a4;
}
.header__title #two {
  display: none;
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
.footer__info-text
{
  display: inline-block; 
  position: relative; 
  left: 2.5rem;
}
.footer__info-icon 
{
  margin: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 1rem;
}
.header__logo {
  height: 3rem;
  width: 4.5rem;
  margin-right: 1rem;
}
.header__logo img {
  height: 3rem;
  width: 4.5rem;
}
.header__title {
  width: fit-content;
  min-height: 1rem;
  line-height: 1rem;
  border-radius: 1rem;
  padding: 1rem;
  background-color: #f8f8f2;
  color: #282a36;
  margin-right: 1rem;
  font-weight: 700;
}
.header__week {
  width: 5rem;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  white-space: nowrap;
  margin-right: 1rem;
  border-radius: 1rem;
  padding: 1rem;
  background-color: #282a36;
}

@media only screen and (max-width: 840px) {
  .header__title #one {
    display: none;
  }
  .header__title #two {
    display: block;
  }
  .table {
    width: 90%;
  }
}
@media only screen and (max-width: 600px) {
  * {
    font-size: small;
  }
  .header
  {
    padding: 1rem;
  }
  .footer__info-icon  {
    font-size: 2rem !important;
  }
  .header__title #one {
    display: none;
  }
  .header__title #two {
    display: block;
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
</style>
