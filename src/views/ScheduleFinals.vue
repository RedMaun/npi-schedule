<script setup>
import MainFrame from '../components/MainFrame.vue'
import Spinner from '../components/Spinner.vue'
import Header from '../components/Header.vue'
</script>
<script>
import { reactive } from 'vue'
import finalsDataRefactoring from '../js/finalsDataRefactoring'
export default {
    props: ['urlSchedule', 'urlName', 'sort', 'type'],
    data() {
        return {
            urlJson: undefined,
            isFetching: reactive({value: true}),
            weeks: undefined,
            errorMessage: undefined,
            group: undefined,
            timesJson: undefined
        };
    },
    async created() {
        [this.urlJson, this.group] = await this.getData()
        this.timesJson = await (await fetch('https://schedule.npi-tu.ru/api/v1/class-intervals/')).json()
        localStorage.setItem("url", [window.location.pathname, 'Сессия ' + this.group]);
        if ( (JSON.parse(JSON.stringify(this.urlJson)).length == 0))
        {
            this.errorMessage = 'Даты экзаменов/переэкзаменовок не назначены!'
            this.weeks = []
        }
        else
        {
            this.weeks = finalsDataRefactoring.func(this.urlJson, this.sort, this.timesJson)
        }
        this.isFetching.value = false
    },
    methods: {
        async getData() 
        {
            var urlSchedule = `${this.urlSchedule.split('$')[0]}`
            urlSchedule = urlSchedule.slice(0, urlSchedule.length - 1)
            for (let i = 1; i < this.urlSchedule.split('$').length; i++)
            {
                urlSchedule += `/${this.$route.params[this.urlSchedule.split('$')[i].split('/')[0]]}/` + `${this.urlSchedule.split('$')[i].split('/')[1]}`
            }
            const response = await fetch(urlSchedule)
            const urlJson = await response.json()

            if (this.type == 'st-fin')
            {
                const urlName = this.urlName.split('$')[0] + this.$route.params[this.urlName.split('$')[this.urlName.split('$').length - 1].split('/')[0]]
                const groupResp = await fetch(urlName)
                const group = await groupResp.json()
                return [urlJson, Object.keys(group)[0]];
            }
            else if (this.type == 'pr-fin')
            {
                const urlName = this.urlName.split('$')[0] + this.$route.params[this.urlName.split('$')[1]]
                const groupResp = await fetch(urlName)
                const group = await groupResp.json()
                return [urlJson, group[0]];
            }
        }
    }
}
</script>
<template>
    <Header></Header>
    <Suspense timeout="0">
        <template #default>
            <MainFrame reactive="isFetching" v-if="!isFetching.value" :type="type" :groupName="group" :info="[]" :weeks="weeks" :errorMessage="errorMessage"></MainFrame>
        </template>
        <template #fallback>
            <Spinner />
        </template>
    </Suspense>
</template>
