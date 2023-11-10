<script setup>
import { ref, onMounted } from "vue";
import DayCard from "./DayCard.vue";
import Pdf from "./Pdf.vue";
import { useRouter } from "vue-router";
import { useTimesStore } from "../stores/times";
import { useCurrentWeekNumberStore } from "../stores/weekNumber";
import { useColorsStore } from "../stores/colors";
import { useTimeStore } from "../stores/currentTime";
import { COLOR_DESIGN, MONTHS } from "../constants";

const props = defineProps({
  groupName: String,
  info: Array,
  weeks: Array,
  type: String,
  errorMessage: String,
});

const timeSlotsStore = useTimesStore();
const timeStore = useTimeStore();
const times = timeSlotsStore.timeSlots;
const currentWeekNumberStore = useCurrentWeekNumberStore();
const colorsStore = useColorsStore();

timeStore.getTime;
const timeNow = ref(timeStore.time);
onMounted(() => {
  setInterval(() => {
    timeStore.getTime;
    timeNow.value = timeStore.time;
  }, 60000);
});

let errorMessage = props.errorMessage;
const weeks = props.weeks;
console.log(weeks)
if ((weeks[0] || weeks[1]) && weeks[0].length == 0 && weeks[1].length == 0) {
  if (errorMessage != undefined) errorMessage += " Нет расписания!";
  else errorMessage = "Нет расписания!";
}

let currentWeek = ref(null),
  nextDay,
  currentDate = new Date(),
  dayOfWeek = currentDate.getDay();
dayOfWeek = dayOfWeek == 0 ? 7 : dayOfWeek;

function currentWeekIncrement() {
  currentWeek.value = currentWeek.value === 1 ? 2 : 1;
}

function dayOfWeekIncrement(dayOfWeek) {
  if (dayOfWeek + 1 > 7) {
    currentWeekIncrement();
    dayOfWeek = 1;
  } else {
    dayOfWeek++;
  }
  return dayOfWeek;
}

function getNextDayAndWeek(dayOfWeek) {
  let currentDay;
  while (true) {
    for (let i = 0; i < weeks[currentWeek.value - 1].length; i++) {
      if (weeks[currentWeek.value - 1][i].day === dayOfWeek - 1) {
        currentDay = weeks[currentWeek.value - 1][i];
        return [currentDay, dayOfWeek];
      }
    }
    if (currentDay === undefined) {
      dayOfWeek = dayOfWeekIncrement(dayOfWeek);
    } else {
      break;
    }
  }
  return [currentDay, dayOfWeek];
}

function getNextDay(dayOfWeek) {
  let currentDay;
  [currentDay, dayOfWeek] = getNextDayAndWeek(dayOfWeek);

  let todaysDayOfWeek = currentDate.getDay();
  todaysDayOfWeek = todaysDayOfWeek == 0 ? 7 : todaysDayOfWeek;

  if (currentDay.day + 1 !== todaysDayOfWeek) {
    return dayOfWeek;
  }
  let lastClass = currentDay.classes[currentDay.classes.length - 1].class - 1;
  let lastClassTime =
    Number(times[lastClass][1].split(":")[0]) * 60 +
    Number(times[lastClass][1].split(":")[1]);

  if (lastClassTime > timeNow.value) {
    return dayOfWeek;
  } else {
    [currentDay, dayOfWeek] = getNextDayAndWeek(dayOfWeekIncrement(dayOfWeek));
    return dayOfWeek;
  }
}

if (props.type == "st-fin" || props.type == "pr-fin" || errorMessage) {
  currentWeek.value = 1;
  nextDay = [0, 1];
} else {
  await currentWeekNumberStore.getCurrentWeekNumber();
  currentWeek.value = currentWeekNumberStore.currentWeekNumber;
  nextDay = [getNextDay(dayOfWeek) - 1, currentWeek.value];
}
const session = props.info[0];
const semester = props.info[1];
let semesterStart, semesterEnd, sessionStart, sessionEnd;

if (props.info[0] != undefined && props.info[1] != undefined) {
  let dateSemesterStart = new Date(semester.start);
  let dateSemesterEnd = new Date(semester.end);
  let dateSessionStart = new Date(session.start);
  let dateSessionEnd = new Date(session.end);
  semesterStart =
    dateSemesterStart.getDate() +
    " " +
    MONTHS[dateSemesterStart.getMonth()] +
    " " +
    dateSemesterStart.getFullYear();
  semesterEnd =
    dateSemesterEnd.getDate() +
    " " +
    MONTHS[dateSemesterEnd.getMonth()] +
    " " +
    dateSemesterEnd.getFullYear();
  sessionStart =
    dateSessionStart.getDate() +
    " " +
    MONTHS[dateSessionStart.getMonth()] +
    " " +
    dateSessionStart.getFullYear();
  sessionEnd =
    dateSessionEnd.getDate() +
    " " +
    MONTHS[dateSessionEnd.getMonth()] +
    " " +
    dateSessionEnd.getFullYear();
}

function adaptiveTypes(weeks, currentWeek) {
  let week = weeks[currentWeek - 1];
  let types = [];
  for (let i in week) {
    for (let g in week[i].classes) {
      types.push(week[i].classes[g].type);
    }
  }
  return Array.from(new Set(types));
}

let colors = colorsStore.colors;

colors = {
  ...colors,
  ...COLOR_DESIGN,
};

function buttons(val) {
  if (currentWeek.value != val) {
    window.scrollTo({ top: 0 });
  }
  currentWeek.value = val;
}
const router = useRouter();
function sessionButton() {
  router.push({
    path: window.location.pathname.split("/schedule")[0] + "/finals-schedule",
  });
}
function buttonBack() {
  router.push({
    path: window.location.pathname.split("/finals-schedule")[0] + "/schedule",
  });
}
const dragHandler = (dragState) => {
  if (dragState.swipe[0] == 1 && dragState.swipe[1] == 0) {
    buttons(1);
  }
  if (dragState.swipe[0] == -1 && dragState.swipe[1] == 0) {
    buttons(2);
  }
};
let areClassesExists
if (weeks[currentWeek.value - 1])
{
  areClassesExists = weeks[currentWeek.value - 1].length != 0
}
</script>

<template>
  <div v-drag="dragHandler">
    <div class="header">
      <div class="header__logo">
        <router-link to="/"><img src="/logo.png" /></router-link>
      </div>
      <div class="header__groupName">
        {{ groupName }}
        <span v-if="type == 'st-fin' && type == 'pr-fin'">Сессия</span>
      </div>
      <div class="header__row">
        <button
          v-if="type == 'st-fin' || type == 'pr-fin'"
          :style="{ 'margin-right': '0.5rem' }"
          class="header__button"
          id="back"
          @click="buttonBack()"
        >
          Назад
        </button>
        <button
          v-if="type != 'st-fin' && type != 'pr-fin'"
          class="header__button"
          id="firstWeek"
          @click="buttons(1)"
          :style="{
            background: currentWeek == 1 ? '#ff5555' : '#6272a4',
          }"
        >
          1 Неделя
        </button>
        <button
          v-if="type != 'st-fin' && type != 'pr-fin'"
          class="header__button"
          id="secondWeek"
          @click="buttons(2)"
          :style="{
            background: currentWeek == 2 ? '#ff5555' : '#6272a4',
          }"
        >
          2 Неделя
        </button>
        <button
          class="header__button"
          id="session"
          v-if="type != 'au' && type != 'st-fin' && type != 'pr-fin'"
          @click="sessionButton()"
        >
          Сессия
        </button>
        <Pdf
          v-if="type != 'st-fin' && type != 'pr-fin'"
          :usedTypes="usedTypes"
          :info="info"
          :colors="colors"
          :weeks="weeks"
          :group="groupName"
        ></Pdf>
      </div>
    </div>
    <div class="error-message" v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div v-else>
      <div class="info-cont" v-if="type == 'st'">
        <div class="info-cont__semester-text">
          <b>Семестр:</b> {{ semesterStart + " — " + semesterEnd }}
        </div>
        <div class="info-cont__session-text">
          <b>Сессия:</b> {{ sessionStart + " — " + sessionEnd }}
        </div>
      </div>
      <div class="info-cont" v-else style="margin-top: 1rem"></div>
      <div class="main-frame">
        <div
          v-if="areClassesExists"
        >
          <DayCard
            v-for="day in currentWeek == 1 ? weeks[0] : weeks[1]"
            :key="currentWeek + timeNow"
            :colors="colors"
            :timeNow="timeNow"
            :type="type"
            :currentWeek="currentWeek"
            :data="day"
            :times="times"
            :nextDay="nextDay"
          />
        </div>
        <div
          :style="{
            width: 'fit-content',
            margin: 'auto',
            'margin-top': '2rem',
            'margin-bottom': '2rem',
          }"
          v-else
        >
          Нет расписания!
        </div>
      </div>
      <div
        class="discipline-types"
        v-if="areClassesExists"
      >
        <div
          v-for="types in adaptiveTypes(weeks, currentWeek)"
          class="discipline-types__type"
          :style="{ 'background-color': colors[types].color, color: '#282a36' }"
        >
          {{ colors[types].name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.header {
  color: #f8f8f2;
  width: 100%;
  height: 3rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: inline-flex;
  position: fixed;
  top: 0px;
  z-index: 10;
  background-color: #44475a;
  border-bottom: 0.1rem solid #6272a4;
  align-items: center;
  justify-content: center;
}

.header__groupName {
  margin-left: 1rem;
  font-weight: 700;
  font-size: larger;
}
.header__logo {
  height: 3rem;
  width: fit-content;
  cursor: pointer;
  margin-right: 0;
}
.header__logo img {
  height: 3rem;
  width: 4.5rem;
}
.info-cont {
  width: 40rem;
  height: 3rem;
  margin: auto;
  margin-top: 7rem;
  margin-bottom: 2rem;
  color: #f8f8f2;
}
.info-cont__semester-text,
.info-cont__session-text {
  line-height: 1.5rem;
  text-align: center;
}

.discipline-types__type {
  background-color: #6272a4;
  color: #f8f8f2;
  padding: 0.5rem;
  border-radius: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-left: 0.2rem;
  margin-right: 0.2rem;
  display: inline-table;
  white-space: nowrap;
}

.discipline-types {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rem;
  margin: auto;
  margin-bottom: 10rem;
  margin-top: 2rem;
  height: 3rem;
}

.main-frame {
  width: 40rem;
  margin: auto;
}
.header__button {
  transition: 200ms linear;
  white-space: nowrap;
  cursor: pointer;
  outline: none;
  border: none;
  background-color: #6272a4;
  color: #f8f8f2;
  padding: 0.5rem;
  border-radius: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
.header__button + .header__button {
  margin-left: 0.5rem;
}
.header__row {
  margin-left: 1rem;
}
.error-message {
  width: fit-content;
  margin: auto;
  margin-top: 10rem;
}

@media only screen and (max-width: 1000px) {
  .print span {
    display: none;
  }
  .button {
    padding: 0.5rem;
  }

  .header__row {
    height: 3rem;
    display: flex;
  }
  .header__groupName {
    word-break: normal;
    white-space: nowrap;
  }
}
@media only screen and (max-width: 800px) {
  * {
    font-size: small;
  }
  .main-frame,
  .info-cont {
    width: 98%;
  }
  .discipline-types {
    width: fit-content;
    display: block;
    height: fit-content;
    margin: auto;
  }
  .discipline-types__type {
    margin-bottom: 1rem;
  }
}
@media only screen and (max-width: 560px) {
  a {
    text-decoration: underline;
  }
  * {
    font-size: small;
  }
  .info-cont {
    margin-bottom: 2rem;
  }
  .discipline-types {
    max-width: 90%;
    margin-bottom: 5rem;
    margin-top: 1rem;
  }
  .discipline-types__type {
    font-size: small;
    margin-bottom: 0.8rem;
  }
  .info-cont__semester-text,
  .info-cont__session-text,
  b {
    font-size: small;
  }
  .header__row {
    max-width: 60%;
    margin-left: 0.1rem;
  }
  .header {
    display: inline-flexbox;
    max-height: 2rem;
  }
  .header__button + .header__button {
    margin-left: 0.2rem;
  }
  .print {
    width: 2rem;
    padding: 0px;
    height: 2rem;
    margin-top: 0.5rem;
  }
  #firstWeek,
  #secondWeek,
  #session,
  #back {
    margin-top: 0.5rem;
    height: 2rem;
  }
  .button {
    height: fit-content;
    font-size: x-small;
    padding: 0.4rem;
  }
  .header__groupName {
    line-height: 1.5rem;
    margin-left: 0.5rem;
    max-height: 3rem;
    max-width: 10rem;
    font-size: small;
    margin-right: 0.5rem;
    word-break: break-all;
    white-space: normal;
    overflow: hidden;
  }
  .info-cont {
    margin-top: 6rem;
  }
  .dayCont {
    margin-bottom: 0.5rem;
    width: 96%;
  }
  .header__logo {
    margin-right: 0;
    height: 2.5rem;
  }
  .header__logo img {
    height: 2.5rem;
    width: 3.5rem;
  }
  .header {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
