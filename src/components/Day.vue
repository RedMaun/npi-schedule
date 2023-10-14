<script setup>
    import currentClass from '../js/currentClass'

    var props = defineProps({
        week: Number,
        data: Object,
        nextDay: Array,
        type: String,
        colors: Object
    })
    
    const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']

    const timesJson = await (await fetch('https://schedule.npi-tu.ru/api/v1/class-intervals/')).json()
    var times = []
    for (let i = 1; i <= Object.keys(timesJson).length; i++)
    {
        times.push([timesJson[String(i)].start, timesJson[String(i)].end])
    }

    function isEmptyDay()
    {
        var counter = 0
        for (var i of props.data.classes)
        { 
            if(i.firstRow == '-' || i.firstRow == '' && i.secondRow == '-' || i.secondRow == '' && i.thirdRow == '-' || i.thirdRow == '')
            {
                counter++
            }
        }
        return counter == props.data.classes.length
    }
    function lecturerClickable(name)
    {
        try{
            return name.split(' ')[1].length == 1 && name.split(' ')[2].length == 1
        }
        catch(e) {
            
        }
    }
    var dayOfWeek = new Date().getDay()
    dayOfWeek = dayOfWeek == 0 ? 7 : dayOfWeek

    const isCurrentClass = props.data.day == props.nextDay[0] && props.week == props.nextDay[1]

    import { ref, onMounted } from 'vue'
    const activeClass = ref(null)
    onMounted(() => {
        if (isCurrentClass)
        {
            activeClass.value.scrollIntoView({block: "center", inline: "start"})
        }
    })
</script>

<script>
    import { reactive } from 'vue'
    export default {

        data() {
        return {
                timeNow: reactive({value: new Date().getHours() * 60 + new Date().getMinutes()}),
            };
        },
        props: ['week', 'data', 'nextDay', 'type'],
        mounted() {

            setInterval(() => {
                this.timeNow.value = new Date().getHours() * 60 + new Date().getMinutes()
            }, 60000)
        }
    }
</script>

<template>
    <div v-if="data.classes.length > 0 && !isEmptyDay()" class="dayCont" ref="activeClass">
        <div v-if="props.type != 'st-fin' && props.type != 'pr-fin' " class="dayTitle" :style="{background: data.day == nextDay[0] && week == nextDay[1] ? '#ff5555' : '#6272a4'}">{{ days[data.day - 1] }}</div>
        <div v-else class="dayTitle" :style="{background: data.day == nextDay[0] && week == nextDay[1] ? '#ff5555' : '#6272a4'}">{{ data.date.split('-').reverse().join('.') }}</div>

        <div class="tableCont" :style="{border: data.day == nextDay[0] && week == nextDay[1] ? '0.1rem solid #ff5555' : '0.1rem solid #6272a4'}">
            <table class="day">
                <tr class="textTitle">
                    <td ></td>
                    <td class="timeText">Время</td>
                    <td class="disciplineText">Дисциплина</td>
                </tr>
                <tr v-for="(i, index) in data.classes" :key="index"  class="dayClass" :style="{'background': index % 2 !== 0 ? '#2b2e3b' : 'inherit'}">
                    <td class="row0">
                        <span>{{ i.class }}</span>
                    </td>
                    <td class="row1">
                        <div class="timeCont">
                            <span class="classStart">{{ times[i.class - 1][0] }}</span>
                            <span class="classEnd">{{ times[i.class - 1][1] }}</span>
                        </div>
                    </td>
                    <td  class="dayDiscipline" >
                        <div class="disciplineName" reactive="timeNow">
                            <div class="disciplineNameText " v-if="i.firstRow !== '-' && i.firstRow != '' && i.firstRow !== '.' && i.type != '' && i.type != '-' && i.type != '.'" >
                                <font-awesome-icon icon="bookmark"  class="fa-1x" :style="{'margin-right': '0.5rem', color: props.colors[i.type].color }"/>
                                <div class="spanCont">
                                    <div :class="data.day == dayOfWeek && dayOfWeek == nextDay[0] && week == nextDay[1] && currentClass.isCurrent(timesJson, index, timeNow.value) ? 'activeCl' : ''" >{{ i.firstRow }}</div>
                                    <!-- <div class="currentCl" v-if="data.day == dayOfWeek && dayOfWeek == nextDay[0] && week == nextDay[1] && currentClass.isCurrent(timesJson, index, timeNow.value)" >Текущая пара</div> -->
                                </div>    
                            </div>
                            <div class="disciplineNameText " v-else-if="i.firstRow !== '-' && i.firstRow != '' && i.firstRow !== '.'"> 
                                <font-awesome-icon icon="bookmark"  class="fa-1x" :style="{'margin-right': '0.5rem'}"/>
                                <div class="spanCont">
                                    <div :class="data.day == dayOfWeek && dayOfWeek == nextDay[0] && week == nextDay[1] && currentClass.isCurrent(timesJson, index, timeNow.value) ? 'activeCl' : ''" >{{ i.firstRow }}</div>
                                    <!-- <div class="currentCl" v-if="data.day == dayOfWeek && dayOfWeek == nextDay[0] && week == nextDay[1] && currentClass.isCurrent(timesJson, index, timeNow.value)" >Текущая пара</div> -->
                                </div>
                            </div>
                            <div class="disciplineNameText " v-else> 
                                <font-awesome-icon icon="bookmark"  class="fa-1x" :style="{'margin-right': '0.5rem'}"/>
                                <div class="spanCont">
                                    <div :class="data.day == dayOfWeek && dayOfWeek == nextDay[0] && week == nextDay[1] && currentClass.isCurrent(timesJson, index, timeNow.value) ? 'activeCl' : ''" >Пусто</div>
                                    <!-- <div class="currentCl" v-if="data.day == dayOfWeek && dayOfWeek == nextDay[0] && week == nextDay[1] && currentClass.isCurrent(timesJson, index, timeNow.value)" >Текущая пара</div> -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="disciplinelecturer" v-if="Array.isArray(i.secondRow) && props.type == 'au' || props.type == 'st' " >  
                            <div v-for="(g, ind) in i.secondRow" :key="ind" style="padding-top: 0.2rem;">
                                <div>
                                    <router-link v-if="lecturerClickable(g)" :to="'/lecturers/' + encodeURI(g.split(' ')[0] + ' ' + g.split(' ')[1] + ' ' + g.split(' ')[2]) + '/schedule'">
                                        <div v-if="g !== '-' && g != '' && g !== '.'">
                                            <font-awesome-icon icon="user" :style="{'margin-right': '0.4rem'}" class="fa-1x"/>
                                            <span>{{ g }}</span> 
                                        </div>
                                        <div v-else>
                                            <font-awesome-icon icon="user" :style="{'margin-right': '0.4rem'}" class="fa-1x"/>
                                            <span>Пусто</span> 
                                        </div>
                                    </router-link>
                                    <div v-else>
                                        <div v-if="g !== '-' && g != '' && g !== '.'">
                                            <font-awesome-icon icon="user" :style="{'margin-right': '0.4rem'}" class="fa-1x"/>
                                            <span>{{ g }}</span> 
                                        </div>
                                        <div v-else>
                                            <font-awesome-icon icon="user" :style="{'margin-right': '0.4rem'}" class="fa-1x"/>
                                            <span>Пусто</span> 
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="disciplinelecturer" v-else-if="Array.isArray(i.secondRow) && props.type != 'au'">  
                            <div v-for="(g, ind) in i.secondRow" :key="ind" style="padding-top: 0.2rem;">
                                <div v-if="g !== '-' && g != '' && g !== '.'">
                                    <font-awesome-icon icon="user-group" :style="{'margin-right': '0.4rem'}" class="fa-1x"/>
                                    <span>{{ g }}</span> 
                                </div>
                                <div v-else>
                                    <font-awesome-icon icon="user-group" :style="{'margin-right': '0.4rem'}" class="fa-1x"/>
                                    <span>Пусто</span> 
                                </div>
                            </div>
                        </div>
                        <div class="disciplinelecturer" v-else> <font-awesome-icon icon="user"  class="fa-1x" :style="{'margin-right': '0.4rem'}" /> Пусто</div>

                        <div class="disciplineAuditorium" v-if="i.thirdRow !== '-' && i.thirdRow != '' && i.thirdRow !== '.' && Array.isArray(i.thirdRow) && props.type == 'au'"> 
                            <div v-for="(g, ind) in i.thirdRow" :key="ind">
                                <font-awesome-icon icon="user-group" :style="{'margin-right': '0.4rem'}" class="fa-1x"/>
                                <span>{{ g }}</span> 
                            </div>
                        </div>
                        <div  v-else-if="i.thirdRow !== '-' && i.thirdRow != '' && i.thirdRow !== '.'">
                            <router-link v-for="(z, ind) in i.thirdRow" :to="`/auditoriums/${z}/schedule`" class="disciplineAuditorium"> 
                                <div style="display: block;">
                                    <div v-if="ind > 0">
                                        <font-awesome-icon icon="compass" class="fa-1x" :style="{'margin-right': '0.4rem', 'margin-top': '0.4rem'}"/>
                                        <span>{{ z }}</span>
                                    </div>
                                    <div v-else>
                                        <font-awesome-icon icon="compass" class="fa-1x" :style="{'margin-right': '0.4rem'}"/>
                                        <span>{{ z }}</span>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                        <div class="disciplineAuditorium" v-else> <font-awesome-icon icon="compass"  class="fa-1x" /> Пусто</div>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<style scoped>
    a
    {
        text-decoration: none;
    }
    .disciplinelecturer, .disciplineAuditorium
    {
        padding-bottom: 0.2rem;
    }
    .disciplinelecturer 
    {
        padding-top: 0.2rem;
        padding-bottom: 0.6rem;
    }
    .disciplineNameText
    {
        display: inline-block;
        position: relative;
        /* left: 5rem; */
    }
    .dayCont
    {
        width: 40rem;
        margin: auto;
        margin-bottom: 1rem;
        background-color: #282a36;
        color: #f8f8f2;
        border-radius: 0.5rem;
    }
    .day
    {
        width: 100%;
        word-break: normal;
        border-collapse: collapse; 
    }
    .dayTitle
    {
        transition: none;
    }
    .tableCont
    {
        padding: 1rem;
        padding-top: 0.5rem;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
        border: 0.1rem solid #6272a4;
    }
    .dayTitle 
    {
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        height: 2.5rem;
        line-height: 2.5rem;
        width: 100%;
        display: block;
        text-align: center;
        background: #6272a4;
        color: #f8f8f2
        
    }

    tr, th, td
    {
        /* border: 2px solid #69c; */
        text-decoration: none;
        font-weight: normal;
        padding: 0.5rem;
        
    }
    .dayClassCont
    {
        padding: 0.5rem;
    }
    .dayClass
    {
        padding: 0.5rem;
    }
    .row1, .row2, .timeText
    {
        padding: 0.5rem;
        
    }
    .dayDiscipline
    {
        text-align: left;
        padding-top: 1rem;
        padding-left: 1rem;
        border-left: 0.1rem solid #44475a;
        text-wrap: normal;
    }
    .timeText
    {
        text-align: center;
    }
    .row1
    {
        width: 2rem;
        padding-left: 1rem;
        padding-right: 0.75rem;
        /* padding-left: 0.25rem; */
    }
    .row0
    {
        width: 0rem;
        background-color: #44475a1a;
        /* padding-right: 0rem; */
        /* background: #44475a; */
    }
    .row0 span
    {
        font-size: 1.1rem;
    }
    .timeCont
    {
        margin: auto;
        width: fit-content;
    }
    .classStart
    {
        display: block;
        width: fit-content;
        font-size: 1.1rem;
    }
    .classEnd
    {
        display: block;
        width: fit-content;
        font-size: 0.8rem;
       color:#f8f8f2ad;
    }
    .row1, .disciplineNameText, .row0 span
    {
        font-weight: 700;
    }
    .textTitle
    {
        border-bottom: 0.1rem solid #44475a;
    }
    .disciplineText
    {
        padding-left: 1rem;
    }
    .currentCl
    {
        display: inline-block;
        width: fit-content;
        background: #44475a; 
        padding: 0.2rem; 
        padding-left: 0.4rem; 
        padding-right: 0.4rem;
        white-space: nowrap;
        border-radius: 0.5rem;
    }
    .spanCont
    {
        /* display: inline-block; */
        /* position: absolute; */
        position: relative;
        left: 1.3rem;
        padding-right: 1.3rem;
        top: 0;
        /* position: absolute; */
        width: fit-content;
        /* display: table-cell; */
    }
    .fa-bookmark
    {
        /* color: red !important; */
        margin: 0;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0;
        /* bottom: 0; */
        /* top: 0;
        bottom: 0;
        left: 0; */
        /* margin: auto 0; */
    }
    .activeCl
    {
        border-radius: 0.5rem;
        background: #44475a; 
        padding: 0.2rem; 
        padding-left: 0.4rem; 
        padding-right: 0.4rem;
    }
    .spanCont
    {
        white-space: normal;
        word-break: break-word;
        word-wrap: break-word;
    }
    @media only screen and (max-width: 560px) {
        .dayCont
        {
            width: 96%;
        }
        .dayClass
        {
            width: 96%;
        }
    }   
    /*
        @media only screen and (max-width: 560px) {
        *
        {
            font-size: x-small;
        }
        .dayCont
        {
            width: 98%;
        }
        .row1
        {
            padding: 0.1rem;
            width: fit-content;
        }
        .tableCont
        {
            padding: 1rem;
        }
        .dayDiscipline
        {
            padding: 0.5rem;
        }
        .dayTitle
        {
            height: 2rem;
            line-height: 2rem;
        }
        .disciplineName
        {
            padding-bottom: 0.1rem;
        }
        .disciplinelecturer 
        {
            padding-bottom: 0.3rem;
        }
    }
    */
</style>