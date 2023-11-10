import { defineStore } from "pinia";

export const useTimeStore = defineStore("time", {
  getters: {
    state: () => ({
      time: null,
    }),
    getTime: (state) => {
      state.time = new Date().getHours() * 60 + new Date().getMinutes();
    },
  },
});
