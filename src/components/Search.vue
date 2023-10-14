
<script setup>
    import { reactive } from 'vue'
    const inputSearch = reactive({value: []})

    async function getData(val)
    {
        if (val == '')
        {
            inputSearch.value = []
        }
        else
        {
            var respGr = await (await fetch('https://schedule.npi-tu.ru/api/v1/groups/' + encodeURI(val))).json()
            respGr =  Object.entries(respGr)

            var respLe = await (await fetch('https://schedule.npi-tu.ru/api/v1/lecturers/' + encodeURI(val))).json()
            respLe =  respLe
            var respAu = await (await fetch('https://schedule.npi-tu.ru/api/v1/auditoriums/' + encodeURI(val))).json()
            let respAuTemp = Object.entries(respAu)
            respAu = []
            for (let i of respAuTemp)
            {
                respAu.push(i[1][0][0])
            }
            respAu = respAu
            inputSearch.value = [respGr.splice(0, 6), respLe.splice(0, 6), respAu.splice(0, 6)]
        }
    }
    

</script>

<template>
    <div id="searchCont">
        <div id="inputCont">
            <input autocomplete="off" id="search"  v-model="message" reactive="inputSearch" :placeholder="'Поиск'" @input="getData(message); ">
            <div id="searchIcon">
                <font-awesome-icon icon="search" class="fa-2x" />
            </div>
        </div>
        <div id="buttonsCont" reactive="inputSearch" v-if="inputSearch.value[0] && inputSearch.value[0] != '' || inputSearch.value[1] && inputSearch.value[1] != '' || inputSearch.value[2] && inputSearch.value[2] != ''">
            <div reactive="inputSearch" v-if="inputSearch.value[0]">
                <div v-for="(i, index) in inputSearch.value[0]" :key=index>
                    <router-link :to="'/faculties/' + i[1].faculty + '/years/' + i[1].year + '/groups/' + encodeURI(i[1].group) + '/schedule'" >
                        <button  class="group" >
                            {{ i[0] }}
                                <span class="type">- Группа</span>
                        </button>
                    </router-link>
                </div>
            </div>

            <div reactive="inputSearch" v-if="inputSearch.value[1]">
                <div v-for="(i, index) in inputSearch.value[1]" :key=index>
                    <router-link :to="'/lecturers/' + i + '/schedule'" >
                        <button class="group" >
                            {{ i }}
                                <span class="type">- Преподаватель</span>
                        </button>
                    </router-link>
                </div>
            </div>

            <div reactive="inputSearch" v-if="inputSearch.value[2]">
                <div v-for="(i, index) in inputSearch.value[2]" :key=index>
                    <router-link :to="'/auditoriums/' + i + '/schedule'"  >
                        <button class="group" >
                            {{ i }}
                            <span class="type">- Аудитория</span>
                        </button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
    router-link
    {
        width: 100%;
    }
    #searchCont
    {
        position: relative;
        height: auto;
        border-radius: 1rem;
    }
    #searchIcon
    {
        position: absolute;
        width: fit-content;
        height: fit-content;
        top: 0.9rem;
        right: 1.2rem;
    }
    .type
    {
        color: #f8f8f296;
    }
    #buttonsCont
    {
        width: 32rem;
        height: 10rem;
        border-radius: 0.5rem;
        margin: auto;
        position: absolute;
        left: 0; 
        right: 0; 
        margin-left: auto; 
        margin-right: auto; 

    }
    #search
    {
        font-size: larger;
        width: 30rem;
        height: 1.6rem;
        border-radius: 1rem;
        padding: 1rem;
        border: 0.1rem solid #44475a;
        background-color: #282a36;
        outline: none;
        margin: auto;
    }
    #search:focus
    {
        border: 0.1rem solid #6272a4;
    }
    #search::placeholder
    {
        color: #f8f8f2af;
    }
    #inputCont
    {
        max-width: fit-content;
        margin: auto;
        margin-bottom: 0.2rem;   
        position: relative;
    }
    #buttons
    {
        max-width: fit-content;
        margin: auto;
        display: grid;
        grid-template-columns: auto auto;
        row-gap: 0.5rem;
        column-gap: 0.5rem;
        margin-bottom: 1rem;
    }
    .group
    {
        width: 100%;
        outline: none;
        height: 1rem;
        border: 0.1rem solid rgb(87, 91, 112);
        background-color: #44475a;
        padding: 0.5rem;
        height: fit-content;
        cursor: pointer;
        text-align: left;
        border-radius: 0.5rem;
        /* margin-top: 0.2rem; */
        position: relative;
        
    }
    .group:hover
    {
        background-color: #6272a4;
    }
    @media only screen and (max-width: 550px) {
        .group, .type
        {
            font-size: small;
            width: 100%;
        }
        #buttonsCont
        {
            background-color: #44475a;
            width: 96%;
            overflow-y:scroll;
            height: 15rem;
        }
        #search
        {
            width: 20rem;
        }
    }
</style>