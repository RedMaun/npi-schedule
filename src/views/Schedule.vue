<script setup>
import MainFrame from '../components/MainFrame.vue'
import Spinner from '../components/Spinner.vue'
import Header from '../components/Header.vue'
</script>
<script> 
import { reactive } from 'vue'
import dataRefactoring from '../js/dataRefactoring'
export default {
    props: ['sort', 'url', 'type', 'name'],
    data() {
        return {
            urlJson: undefined,
            isFetching: reactive({value: true}),
            weeks: undefined,
            groupName: undefined
        };
    },
    async created() {
        [this.urlJson, this.groupName] = await this.getData()
        this.weeks = dataRefactoring.func(this.urlJson, this.sort)
        this.isFetching.value = false
    },
    methods: {
        async getData() {  
            var url = `${this.url.split('$')[0]}`
            url = url.slice(0, url.length - 1)
            for (let i = 1; i < this.url.split('$').length; i++)
            {
                url += `/${this.$route.params[this.url.split('$')[i].split('/')[0]]}/` + `${this.url.split('$')[i].split('/')[1]}`
            }
            const response = await fetch(url)
            const urlJson = await response.json()
            var groupName
            if (this.type != 'au')
            {
                groupName = urlJson[this.name]
            }
            else
            {
                groupName = this.$route.params.auditorium
            }
            localStorage.setItem("url", [window.location.pathname, groupName]);
            return [urlJson, groupName];
        }
    }
}
</script>
<template>
    <Header></Header>
    <Suspense timeout="0">
        <template #default>
            <MainFrame reactive="isFetching" v-if="!isFetching.value" :type="type" :groupName="groupName" :info="[urlJson.finals, urlJson.semester]" :weeks="weeks"></MainFrame>
        </template>
        <template #fallback>
            <Spinner />
        </template>
    </Suspense>
</template>

