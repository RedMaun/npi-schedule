import "./assets/main.css";

import { createApp, h } from "vue/dist/vue.esm-bundler";
import { createRouter, createWebHistory } from "vue-router";
import { PDFPlugin } from "vue3-pdfmake";
import { GesturePlugin } from "@vueuse/gesture";
import SearchWrapper from "./views/SearchWrapper.vue";
import NotFound from "./views/NotFound.vue";
import Schedule from "./views/Schedule.vue";
import ScheduleFinals from "./views/ScheduleFinals.vue";
import Reviews from "./views/Reviews.vue"
import ReviewsLecturer from "./views/ReviewsLecturer.vue"
import App from "./App.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { createPinia } from "pinia";
const pinia = createPinia();
import {
  faBookmark,
  faUser,
  faCompass,
  faPrint,
  faUserGroup,
  faSearch,
  faCircleInfo,
  faPlus,
  faStar,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

import "./registerServiceWorker";

library.add([
  faBookmark,
  faUser,
  faCompass,
  faPrint,
  faUserGroup,
  faSearch,
  faCircleInfo,
  faPlus,
  faStar,
  faArrowLeft
]);
const routes = [
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  {
    path: "/pwa",
    redirect: (to) => {
      let lastUrl =
        localStorage.getItem("url") === null
          ? "/"
          : localStorage.getItem("url").split(",")[0];
      return { path: lastUrl };
    },
    component: SearchWrapper,
  },
  { path: "/", component: SearchWrapper },
  {
    path: "/faculties/:faculty/years/:year/groups/:group/schedule",
    component: Schedule,
    props: {
      sort: ["discipline", "lecturer", "auditorium"],
      url: "https://schedule.npi-tu.ru/api/v2/faculties/$faculty/years/$year/groups/$group/schedule",
      type: "st",
      name: "group",
    },
  },
  {
    path: "/lecturers/:lecturer/schedule",
    component: Schedule,
    props: {
      sort: ["discipline", "auditorium", "groups"],
      url: "https://schedule.npi-tu.ru/api/v2/lecturers/$lecturer/schedule",
      type: "pr",
      name: "lecturer",
    },
  },
  {
    path: "/auditoriums/:auditorium/schedule/",
    component: Schedule,
    props: {
      sort: ["discipline", "lecturer", "groups"],
      url: "https://schedule.npi-tu.ru/api/v2/auditoriums/$auditorium/schedule",
      type: "au",
    },
  },
  {
    path: "/faculties/:faculty/years/:year/groups/:group/finals-schedule",
    component: ScheduleFinals,
    props: {
      urlSchedule:
        "https://schedule.npi-tu.ru/api/v1/faculties/$faculty/years/$year/groups/$group/finals-schedule",
      urlName: "https://schedule.npi-tu.ru/api/v1/groups/$group",
      sort: "lecturer",
      type: "st-fin",
    },
  },
  {
    path: "/lecturers/:lecturer/finals-schedule",
    component: ScheduleFinals,
    props: {
      urlSchedule:
        "https://schedule.npi-tu.ru/api/v1/lecturers/$lecturer/finals-schedule/",
      urlName: "https://schedule.npi-tu.ru/api/v1/lecturers/$lecturer",
      sort: "groups",
      type: "pr-fin",
    },
  },
  {
    path: "/reviews",
    component: Reviews,
  },
  {
    path: "/reviews/:lecturer",
    component: ReviewsLecturer,
  }
];

const router = createRouter({
  mode: "history",
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const app = createApp({
  render: () => h(App),
});
app
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(GesturePlugin)
  .use(PDFPlugin)
  .use(pinia)
  .mount("#app");
