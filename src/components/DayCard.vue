<script setup>
import DayRow from "./DayRow.vue";
import { WEEK_DAYS } from "../constants";
import { ref, onMounted } from "vue";

const props = defineProps({
  currentWeek: Number,
  data: Object,
  nextDay: Array,
  type: String,
  colors: Object,
  timeNow: Number,
  times: Object,
});

const { day, classes } = props.data;
let date;
if (props.data.date) {
  date = props.data.date.split("-").reverse().join(".");
}
const isCurrentDay =
  props.nextDay[0] === day && props.currentWeek === props.nextDay[1];
const activeClass = ref(null);

onMounted(() => {
  if (isCurrentDay) {
    activeClass.value.scrollIntoView({ block: "start" });
    let headerHeight =
      document.getElementsByClassName("header")[0].offsetHeight;
    window.scroll(0, window.scrollY - headerHeight - 10);
  }
});
</script>

<template>
  <article class="day" ref="activeClass">
    <header
      :class="!isCurrentDay ? 'day__dayOfWeek' : 'day__dayOfWeek_isCurrentDay'"
    >
      <span v-if="type !== 'st-fin' && type !== 'pr-fin'">{{
        WEEK_DAYS[day]
      }}</span>
      <span v-else>{{ date }}</span>
    </header>
    <main :class="!isCurrentDay ? 'day__content' : 'day__content_isCurrentDay'">
      <div class="day_info">
        <span>Время</span>
        <span>Дисциплина</span>
      </div>
      <DayRow
        v-for="(classItem, index) in classes"
        :isCurrentDay="isCurrentDay"
        :index="index"
        :pageType="type"
        :timeNow="timeNow"
        :colors="colors"
        :times="times"
        :data="classItem"
        :day="day"
      />
    </main>
  </article>
</template>

<style scoped>
.day {
  width: 40rem;
  margin: auto;
  margin-bottom: 1rem;
  background-color: #282a36;
  color: #f8f8f2;
  border-radius: 0.5rem;
}
.day__dayOfWeek,
.day__dayOfWeek_isCurrentDay {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  height: 2.5rem;
  line-height: 2.5rem;
  width: 100%;
  display: block;
  text-align: center;
  background: #6272a4;
  color: #f8f8f2;
}
.day__content,
.day__content_isCurrentDay {
  padding: 1rem;
  border: 0.1rem solid #6272a4;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
.day_info {
  display: flex;
  flex-direction: row;
  gap: 1.8rem;
  padding-left: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 0.1rem solid #44475a;
}
.day__dayOfWeek_isCurrentDay {
  background: #ff5555;
}
.day__content_isCurrentDay {
  border: 0.1rem solid #ff5555;
}
@media only screen and (max-width: 560px) {
  .day {
    width: 96%;
  }
  .dayClass {
    width: 96%;
  }
}
</style>
