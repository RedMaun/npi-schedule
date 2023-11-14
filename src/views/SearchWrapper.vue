<script setup>
import SearchView from "../components/SearchFrame.vue";
import Spinner from "../components/Spinner.vue";
import Header from "../components/Header.vue";
</script>

<template>
  <Header></Header>
  <Suspense timeout="0">
    <template #default>
      <SearchView></SearchView>
    </template>
    <template #fallback>
      <Spinner />
    </template>
  </Suspense>
</template>

<style></style>
