<script setup>
import {
  TITLE_FULL,
  TITLE_SMALL,
} from "../constants";
import { useCurrentWeekNumberStore } from "../stores/weekNumber";
const currentWeekNumberStore = useCurrentWeekNumberStore();
await currentWeekNumberStore.getCurrentWeekNumber();
const currentWeek = currentWeekNumberStore.currentWeekNumber;
const props = defineProps({
    disableReview: Boolean,
});
</script>

<template>
  <div class="header">
    <a href="/" class="header__logo"><img src="/logo.png" /></a>
    <div class="header__title">
      <span id="one">{{ TITLE_FULL }}</span>
      <span id="two">{{ TITLE_SMALL }}</span>
    </div>
    <div class="header__week">{{ currentWeek }} Неделя</div>
    <router-link v-if="disableReview !== true" to="/reviews" class="header__reviews">Отзывы</router-link>
  </div>
</template>

<style scoped>
.header {
  /* padding: 0.5rem; */
  top: 0px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  position: fixed;
  z-index: 10;
  width: 100%;
  height: 3rem;
  background-color: #44475a;
  border-bottom: 0.1rem solid #6272a4;
}
.header__reviews
{
    background-color: #353744;
    padding: 1rem;
    height: 1rem;
    border-radius: 1rem;
    text-decoration: none;
    color: #f8f8f2;
}
.header__title #two {
  display: none;
}
.header__logo {
  height: 3rem;
  width: 4.5rem;
  /* margin-right: 1rem; */
}
#two
{
    white-space: nowrap;
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
  /* margin-right: 1rem; */
  font-weight: 700;
}
.header__week {
  width: 5rem;
  height: 1rem;
  line-height: 1rem;
  text-align: center;
  white-space: nowrap;
  /* margin-right: 1rem; */
  border-radius: 1rem;
  padding: 1rem;
  background-color: #282a36;
}
@media only screen and (max-width: 910px) {
  .header__title #one {
    display: none;
  }
  .header__title #two {
    display: block;
  }
}
@media only screen and (max-width: 600px) {
  * {
    font-size: small;
  }
  .header
  {
    padding-top: 1rem;
    padding-bottom: 1rem;
    gap: 0.3rem;
  }
  .footer__info-icon {
    font-size: 2rem !important;
  }
  .header__title #one {
    display: none;
  }
  .header__title #two {
    display: block;
  }
  .header__title, .header__week, .header__reviews
  {
    padding-left: 0.4rem;
    padding-right: 0.4rem;
  }

}
@media only screen and (max-width: 370px) {
    #two
    {
        font-size: xx-small;
    }
}
</style>