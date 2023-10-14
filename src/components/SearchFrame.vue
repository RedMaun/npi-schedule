<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
    import { defineAsyncComponent} from 'vue'
    const Search = defineAsyncComponent(() =>
        import('./Search.vue')
    )
    const Table = defineAsyncComponent(() =>
        import('./Table.vue')
    )
    var lastUrl, lastName = ''
    if (lastUrl = localStorage.getItem('url'))
    {
        lastUrl = localStorage.getItem('url').split(',')[0]
        lastName = localStorage.getItem('url').split(',')[1]
    }    
    const currentWeek = await (await fetch('https://schedule.npi-tu.ru/api/v1/current-week')).json()
    const inf = await (await fetch('https://schedule.npi-tu.ru/api/v1/inf-lines/')).json()
    const lastUpdated = await (await fetch('https://schedule.npi-tu.ru/api/v1/last-updated/')).json()

</script>

<template>
    <div id="headerH">
        <div id="logo"><img src="/logo.png"/></div>
        <div id="title">
            <span id="one">ФГБОУ ВО "ЮРГПУ (НПИ) имени М.И.Платова". Расписание</span>
            <span id="two">ЮРГПУ НПИ Расписание</span>
        </div>
        <div id="week" >{{ currentWeek }} Неделя</div>
    </div> 
   
    <div id="message" >
        {{ inf.run[0]  }} 
        <br>Обновлено: <b>{{ lastUpdated.split('-').reverse().join('.') }}</b>
    </div>
    

    <Search id="searchCont"/>
    <Table id="table"></Table>
    <div id="lastVisited" v-if="lastName != ''">Последнее просмотренное: 
        <router-link :to="lastUrl" v-if="lastName">{{ lastName }}</router-link>
        <router-link :to="lastUrl" v-else>Ссылка</router-link>
    </div>
    <div id="footer">
        <font-awesome-icon id="infoIcon" style="margin: 0; position: absolute; top: 50%; transform: translateY(-50%); left: 1rem;" class="fa-2x" icon="circle-info" />
        <div style="display: inline-block; position: relative; left: 2.5rem;">
            <span>Нашли баг? Возник вопрос? </span><a href="https://vk.com/redmaunn">Пишите мне</a>
            <a style="display: block; width: fit-content" href="https://github.com/RedMaun/npi-schedule">Исходный код</a>
        </div>
    </div>
</template>

<style scoped>
    *{
        color: #f8f8f2;
    }
    #one, #two
    {
        color: #282a36;
    }

    #lastVisited
    {
        width: fit-content;
        margin: auto;
        margin-top: 2rem;
        margin-bottom: 4rem;
    }
    #headerH
    {
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
    #title #two
    {
        display: none;
    }
    #searchCont
    {
        margin-top: 3rem;
    }
    #message
    {
        width: fit-content;
        margin: auto;
        margin-top: 6rem;
        background-color: #ff5555;
        padding: 1rem;
        border-radius: 1rem;
                
    }
    #footer
    {
        /* height: 10rem; */
        padding: 1rem;
        background-color: #44475a;
        /* position: fixed; */
        position: absolute;
        bottom: 1rem;
        left: 1rem;
        border-radius: 1rem;
        width: 22rem;

        /* left: 0; */
    }
    #table
    {
        margin: auto;
        margin-top: 4rem;
        width: 30rem;
    }
    /* #search
    {
        margin-top: 10rem;
    } */
    #logo
    {
        height: 3rem;
        width: 4.5rem;
        margin-right: 1rem;
        /* background-color: #f8f8f2; */
        /* border-radius: 1rem; */
    }
    #logo img
    {
        height: 3rem;
        width: 4.5rem;
    }
    #title
    {
        width: fit-content;
        min-height: 1rem;
        line-height: 1rem;
        border-radius: 1rem;
        padding: 1rem;
        background-color: #f8f8f2;
        color: #282a36;
        margin-right: 1rem;
        font-weight: 700;
        /* border: 0.1rem solid #cccccc; */
    }
    #week
    {
        width: 5rem;
        height: 1rem;
        line-height: 1rem;
        text-align: center;
        white-space: nowrap;
        margin-right: 1rem;
        border-radius: 1rem;
        padding: 1rem;
        background-color: #282a36;
        /* color: #282a36; */
    }
    @media only screen and (max-width: 550px) {
        #headerH
        {
            height: 4rem !important;
        }
        #infoIcon
        {
            font-size: 2rem !important;
        }
    }
    @media only screen and (max-width: 840px) {
        #title #one
        {
            display: none;
        }
        #title #two
        {
            display: block;
        }
        /* #buttonsCont, #message
        {
            width: 90%;
        } */
        /* #message
        {
            width: 90%;
        } */

        #table
        {
            width: 90%;
        }

    }
    @media only screen and (max-width: 600px) {
        *{
            font-size: small ;
        }
        #infoIcon
        {
            font-size: 2rem !important;
        }
        #title #one
        {
            display: none;
        }
        #title #two
        {
            display: block;
        }
        #searchIcon
        {
            display: none;
        }
        #search
        {
            max-width: 24rem;
        }
        #searchCont
        {
            margin-top: 2rem;
        }
        /* #message
        {
            width: 80%;
            margin-top: 6rem;
        } */
        #buttonsCont
        {
            background-color: #44475a;
            max-width: 28rem;
            overflow:hidden; overflow-y:scroll;
        }
        .group
        {
            border-radius: 0 !important;
            background-color: #656981 !important;
            border: none !important;
        }
        #message
        {
            width: 80%;
        }
    }
</style>