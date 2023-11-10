<script setup>
import currentClass from "../utils/currentClass";
import CustomIcon from "./CustomIcon.vue";
import { useTimeStore } from "../stores/currentTime";
import { computed } from "vue";

const props = defineProps({
  data: Object,
  times: Object,
  colors: Object,
  pageType: String,
  index: Number,
  isCurrentDay: Boolean,
});

const fullNameChecker = (name) => {
  const splittedName = name.split(" ");
  if (splittedName.length < 3) {
    return false;
  }

  return splittedName[1].length == 1 && splittedName[2].length == 1;
};

const groupNameChecker = (name) => {
  return name.split("-").length === 3;
};

const hrefForLecturer = (name) => {
  const splittedName = name.split(" ");
  const encodedURI = `${splittedName[0]} ${splittedName[1]} ${splittedName[2]}`;
  return `/lecturers/${encodedURI}/schedule`;
};

function hrefForAuditorium(name) {
  return "/auditoriums/" + name + "/schedule";
}

const { type, firstRow, secondRow, thirdRow } = props.data;
const classNum = props.data.class;
const timeStore = useTimeStore();
timeStore.getTime;
const time = timeStore.time;
const isCurrent =
  currentClass.isCurrent(props.times, classNum - 1, time) && props.isCurrentDay;
const isGroup = computed(() =>
  props.pageType === "pr" ? "user-group" : "user"
);
const isAuditorium = computed(() =>
  props.pageType === "st" || props.pageType === "pr" ? "compass" : "user-group"
);
const bookmarkColor = props.colors[type].color;
</script>

<template>
  <div class="day-row">
    <div class="day-row__number">
      <span>{{ classNum }}</span>
    </div>
    <div class="day-row__time">
      <span class="day-row__start">{{ times[classNum - 1][0] }}</span>
      <span class="day-row__end">{{ times[classNum - 1][1] }}</span>
    </div>
    <div class="day-row__content">
      <div class="box">
        <div class="box__icon">
          <CustomIcon name="bookmark" :color="bookmarkColor" />
        </div>
        <div :class="isCurrent ? 'box__text_selected' : 'box__text'">
          <b>{{ firstRow }}</b>
        </div>
      </div>
      <div class="box">
        <div class="box__icon">
          <CustomIcon :name="isGroup" />
        </div>
        <div class="box__text">
          <div v-for="item in secondRow">
            <a v-if="fullNameChecker(item)" :href="hrefForLecturer(item)">{{
              item
            }}</a>
            <span v-else>{{ item }}</span>
          </div>
        </div>
      </div>

      <div class="box">
        <div class="box__icon">
          <CustomIcon :name="isAuditorium" />
        </div>
        <div class="box__text">
          <div v-for="item in thirdRow">
            <a v-if="!groupNameChecker(item)" :href="hrefForAuditorium(item)">{{
              item
            }}</a>
            <span v-else>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
a {
  color: #f8f8f2;
  text-decoration: none;
}
a:hover {
  color: #adadad;
}
a:active {
  color: #797979;
}
.day-row {
  display: flex;
  flex-direction: row;
}

.day-row:nth-child(even) {
  background-color: #2b2e3b;
}
.day-row__content,
.day-row__time,
.day-row__number {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
}
.day-row__number,
.day-row__time {
  align-items: left;
  justify-content: center;
}
.day-row__number {
  background: #44475a1a;
}
.day-row__number span {
  font-weight: 700;
}
.day-row__start,
.day-row__end {
  font-weight: 700;
}
.day-row__start {
  font-size: 1.1rem;
}
.day-row__end {
  font-size: 0.8rem;
  color: #f8f8f2ad;
}
.box__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
}
.box_text {
  display: flex;
  flex-direction: column;
  flex-flow: column;
}
.box {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
}
.day-row__time {
  padding-right: 0.8rem;
  padding-left: 1rem;
}
.day-row__content {
  gap: 0.3rem;
  border-left: 0.1rem solid #44475a;
  padding-left: 1rem;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  flex-wrap: wrap;
}
.box__text_selected {
  padding: 0.3rem;
  border-radius: 0.5rem;
  background: #44475a;
}
</style>
