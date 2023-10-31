
<script setup>
  import { reactive, ref } from 'vue'
  import Day from './Day.vue'
  import Pdf from './Pdf.vue'

  var props = defineProps({
        groupName: String,
        info: Array,
        weeks: Array,
        type: String,
        errorMessage: String
  })
  var errorMessage = props.errorMessage
  async function getNextDay(currentWeek, weeks, currentDate)
  {
    var nextDay
    var dayOfWeek = currentDate.getDay()
    dayOfWeek = dayOfWeek == 0 ? 7 : dayOfWeek
    const timesJson = await (await fetch('https://schedule.npi-tu.ru/api/v1/class-intervals/')).json()
    
    var lastDiscipline = []
    try {
      for (let i in weeks[currentWeek.value - 1])
      {
        if(weeks[currentWeek.value - 1][i].day == dayOfWeek)
        {
          lastDiscipline = timesJson[ weeks[currentWeek.value - 1][i].classes[weeks[currentWeek.value - 1][i].classes.length - 1].class ].end.split(':')
        }
      }
    } catch(e) {
      lastDiscipline = []
    }
    function getNextDayPnPt(currentWeek, weeks, dayOfWeek)
    {
      var nextDay
      var week = weeks[currentWeek - 1]
      var nextWeek = weeks[Number((currentWeek - 1) != true)]
      if (week.length == 0)
      { 
        return [ weeks[Number((currentWeek - 1) != true)][0].day, Number((currentWeek - 1) != true) + 1]
      }
      if (weeks[Number((currentWeek - 1) != true)].length == 0)
      {
        return [week[0].day, currentWeek]
      }
      const firstDay = Number(week[0].day)
      if (dayOfWeek < firstDay)
      {
        return [firstDay, currentWeek]
      }
      else
      {
        if (dayOfWeek <= week[week.length - 1].day)
        {
          for (let i = dayOfWeek - 1; i >= 0; i--)
          {
            if (week[i] != undefined && week[i].day != undefined)
            {
              nextDay = [week[i].day, currentWeek] 
              break
            }
          }
        }
        else
        {
          return [nextWeek[0].day, Number((currentWeek - 1) != true) + 1]
        }
      }
      return nextDay
    }

    const CurrentTimeMoreThanLastDiscipline = currentDate.getHours()*60 + currentDate.getMinutes() > Number(lastDiscipline[0])*60 + Number(lastDiscipline[1])
    const isDisciplineToday = lastDiscipline.length != 0
    if (!isDisciplineToday && dayOfWeek <= 5) // Сегодня пар нет, пн-пт 
    {
      nextDay = getNextDayPnPt(currentWeek.value, weeks, dayOfWeek)
      currentWeek.value = nextDay[1]
    }
    else if (!isDisciplineToday && dayOfWeek > 5) // Сегодня пар нет, сб-вс
    {
      currentWeek.value = currentWeek.value == 2 ? 1 : 2
      nextDay = [weeks[currentWeek.value - 1][0].day, currentWeek.value]
    }
    
    if (isDisciplineToday && dayOfWeek <= 5) // Сегодня есть пары, пн-пт
    {
      if (CurrentTimeMoreThanLastDiscipline)
      {
        dayOfWeek++
        nextDay = getNextDayPnPt(currentWeek.value, weeks, dayOfWeek)
        currentWeek.value = nextDay[1]
      }
      else
      {
        nextDay = [dayOfWeek, currentWeek.value]
      }
    }
    else if (isDisciplineToday && dayOfWeek > 5) // Сегодня есть пары, сб-вс
    {
      if (CurrentTimeMoreThanLastDiscipline)
      {
        currentWeek.value = currentWeek.value == 2 ? 1 : 2
        nextDay = [weeks[currentWeek.value - 1][0].day, currentWeek.value]
      }
      else
      {
        nextDay = [dayOfWeek, currentWeek.value]
      }
    }
    return nextDay
  }

  const weeks = props.weeks
  if (weeks[0] && weeks[1] && weeks[0].length == 0 && weeks[1].length == 0)
  {
    if (errorMessage != undefined)
      errorMessage += ' Нет расписания!'
    else
      errorMessage = 'Нет расписания!'
  }

  var currentDate = new Date()

  var currentWeek, nextDay 
  if (props.type == 'st-fin' || props.type == 'pr-fin' || errorMessage)
  {
    currentWeek = 1
    currentWeek = reactive({value: currentWeek})
    nextDay = [0, 1]
  }
  else
  {
    currentWeek = await (await fetch('https://schedule.npi-tu.ru/api/v1/current-week')).json()
    currentWeek = reactive({value: currentWeek})
    nextDay = await getNextDay(currentWeek, weeks, currentDate)
  }

  const groupName = props.groupName
  const session = props.info[0]
  const semester = props.info[1]
  var semesterStart, semesterEnd, sessionStart, sessionEnd
  
  if (props.info[0] != undefined && props.info[1] != undefined)
  {
    const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
    let dateSemesterStart = new Date(semester.start)
    let dateSemesterEnd = new Date(semester.end)
    let dateSessionStart = new Date(session.start)
    let dateSessionEnd = new Date(session.end)
    semesterStart = dateSemesterStart.getDate() + ' ' + months[dateSemesterStart.getMonth()] + ' ' + dateSemesterStart.getFullYear()
    semesterEnd = dateSemesterEnd.getDate() + ' ' + months[dateSemesterEnd.getMonth()] + ' ' + dateSemesterEnd.getFullYear()
    sessionStart = dateSessionStart.getDate() + ' ' + months[dateSessionStart.getMonth()] + ' ' + dateSessionStart.getFullYear()
    sessionEnd = dateSessionEnd.getDate() + ' ' + months[dateSessionEnd.getMonth()] + ' ' + dateSessionEnd.getFullYear()
  }

  function adaptiveTypes(weeks, currentWeek)
  {
    let week = weeks[currentWeek.value - 1]
    let types = []
    for(let i in week)
    {
      for (let g in week[i].classes)
      {
        types.push(week[i].classes[g].type)
      }
    }
    return Array.from(new Set(types))
  }
  // const usedTypes = adaptiveTypes(weeks, currentWeek)
  
  const colorsDesign = {".": {"color": "#fff", "name": "Пусто"}, "ПР": {"color": "#8be9fd", "name": "Практика"}, "СЕМ": {"color": "#ffb86c", "name": "Семинар"}, "ЛЕК": {"color":"#50fa7b", "name": "Лекция"}, "ЛАБ": {"color":"#bd93f9", "name": "Лабораторная работа"}, "ЭКЗ": {"color": "#ff79c6", "name": "Экзамен"}, "ЗАЧ": {"color": "#f1fa8c", "name": "Зачет"}}
  var colors = await (await fetch('https://schedule.npi-tu.ru/api/v1/class-types/')).json()

  colors = {
      ...colors,
      ...colorsDesign
  }
  function buttons(val)
  {
    if (currentWeek.value != val)
    {
      window.scrollTo({top: 0});
    }
    currentWeek.value = val
  }
  import { useRouter } from 'vue-router'
  const router = useRouter()
  function sessionButton()
  {
    router.push({ path: window.location.pathname.split('/schedule')[0] + '/finals-schedule' })
  }
  function buttonBack()
  {
    router.push({ path: window.location.pathname.split('/finals-schedule')[0] + '/schedule' })
  }
  const dragHandler = (dragState) => {
    if (dragState.swipe[0] == 1 && dragState.swipe[1] == 0)
    {
      buttons(1)
    }
    if (dragState.swipe[0] == -1 && dragState.swipe[1] == 0)
    {
      buttons(2)
    }
  }
  const timeNow = ref(new Date().getHours() * 60 + new Date().getMinutes())
  import { onMounted } from 'vue'
  onMounted(() => {
    setInterval(() => {
        timeNow.value = new Date().getHours() * 60 + new Date().getMinutes()
    }, 60000)
  })
</script>

<template>
  <div v-drag="dragHandler">
    <div id="header">
      <div id="logo"><router-link to="/"><img src="/logo.png"/></router-link></div>
      <div id="groupName">
        {{ groupName }}
        <span v-if="props.type == 'st-fin' && props.type == 'pr-fin'">Сессия</span>
      </div>
      <div id="row">
        <button v-if="props.type == 'st-fin' || props.type == 'pr-fin'" :style="{'margin-right': '0.5rem'}" class="button" id="back" @click="buttonBack()">Назад</button>
        <button v-if="props.type != 'st-fin' && props.type != 'pr-fin'" class="button" id="firstWeek" @click="buttons(1)" :style="{background: currentWeek.value == 1 ? '#ff5555' : '#6272a4'}">1 Неделя</button>
        <button v-if="props.type != 'st-fin' && props.type != 'pr-fin'" class="button" id="secondWeek" @click="buttons(2) " :style="{background: currentWeek.value == 2 ? '#ff5555' : '#6272a4'}">2 Неделя</button>
        <button class="button" id="session" v-if="props.type != 'au' && props.type != 'st-fin' && props.type != 'pr-fin'" @click="sessionButton()">Сессия</button>
        <Pdf :usedTypes="usedTypes" :info="info" :colors="colors" :weeks="weeks" :group="groupName"></Pdf>
      </div>
    </div>
    <div :style="{width: 'fit-content', 'margin': 'auto', 'margin-top': '10rem'}" v-if="errorMessage != undefined">{{ errorMessage }}</div>
    <div v-else>
      <div id="infoCont" v-if="props.type == 'st'">
          <div id="semesterText"><b>Семестр:</b> {{ semesterStart + ' — ' +  semesterEnd}}</div>
          <div id="sessionText"><b>Сессия:</b> {{ sessionStart + ' — ' +  sessionEnd }}</div>
      </div>
      <div id="infoCont" v-else style="margin-top: 1rem;"></div>
      <div id="mainFrame">
        <div reactive="currentWeek" v-if="weeks[currentWeek.value - 1] && weeks[currentWeek.value - 1].length != 0">
          <Day v-for="(i, index) in currentWeek.value == 1 ? weeks[0] : weeks[1]" :key="index" reactive="currentWeek" :colors="colors" :timeNow="timeNow" :type="props.type" :week=currentWeek.value :data=i :nextDay=nextDay></Day>
        </div>
        <div :style="{width: 'fit-content', 'margin': 'auto', 'margin-top': '2rem', 'margin-bottom': '2rem'}" v-else>Нет расписания!</div>
        </div>
      <div reactive="currentWeek" id="disciplineTypes" v-if="weeks[currentWeek.value - 1] && weeks[currentWeek.value - 1].length != 0">
        <div v-for="(i, index) in adaptiveTypes(weeks, currentWeek)" class="disciplineType" :key="index" :style="{'background-color': colors[i].color, 'color': '#282a36'}">{{colors[i].name}}</div>
      </div>
    </div>
  </div>
</template>

<style>
  a
  {
    color: #f8f8f2;
  }
  #header
  {
    color: #f8f8f2;
    width: 100%;
    height: 3rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    display:inline-flex;
    position: fixed;
    top: 0px;
    z-index: 10;
    background-color: #44475a;
    border-bottom: 0.1rem solid #6272a4;
    align-items: center;
    justify-content: center;
  }

  #groupName
  {
    margin-left: 1rem;
    font-weight: 700;
    font-size: larger;
  }
  #logo
  {
    height: 3rem;
    width: fit-content;
    cursor: pointer;
    margin-right: 0;
  }
  #logo img
  {
    height: 3rem;
    width: 4.5rem;
  }
  #infoCont
  {
    width: 40rem;
    height: 3rem;
    /* display: flexbox; */
    margin: auto;
    /* position: relative; */
    margin-top: 7rem;
    margin-bottom: 2rem;
    color: #f8f8f2;
    /* align-items: center;
    justify-content: center; */

  }
  #semesterText, #sessionText
  {
    line-height: 1.5rem;
    text-align: center;
  }

  .disciplineType
  {
    background-color: #6272a4;
    color: #f8f8f2;
    padding: 0.5rem;
    border-radius: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    margin-left: 0.2rem;
    margin-right: 0.2rem;
    display:inline-table;
    white-space: nowrap;
  }

  #disciplineTypes
  {
    display: flex;
    align-items:center;
    justify-content: center;
    width: 40rem;
    margin: auto;
    margin-bottom: 10rem;
    margin-top: 2rem;
    height: 3rem;
    
  }

  #mainFrame
  {
    width: 40rem;
    /* position: relative; */
    margin: auto;
    /* top: 5rem; */
  }
  .button
  {
    transition: 200ms linear;
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    border: none;
    background-color: #6272a4;
    color: #f8f8f2;
    padding: 0.5rem;
    border-radius: 1rem;
    /* margin-right: 0.5rem; */
    padding-left: 1rem;
    padding-right: 1rem;
    
  }
  .button + .button
  {
    margin-left: 0.5rem;
  }
  #row
  {
    margin-left: 1rem;
  }

  @media only screen and (max-width: 1000px) {
    #print span {
      display: none;
    }
    .button
    {
      padding: 0.5rem;
    }
    #header
    {
      height: 4rem;
    }

    #row
    {
      height: 3rem;
      display: flex;

    }
    #groupName
    {
      /* font-size: xx-small; */
      word-break: normal;
      white-space: nowrap;
    }
  }
  @media only screen and (max-width: 800px) {
    *{
      font-size: small;
    }
    #mainFrame, #infoCont
    {
      width: 98%;
    }
    #disciplineTypes
    {
      width: fit-content;
      display: block;
      height: fit-content;
      margin: auto;
      
    }
    .disciplineType
    {
      margin-bottom: 1rem;
    }
  }
  @media only screen and (max-width: 560px) {
      a
      {
        text-decoration:underline

      }
      *
      {
        font-size: small;
      }
      #infoCont
      {
        /* margin-top: 10rem; */
        margin-bottom: 2rem;
      }
      #disciplineTypes
      {
        max-width: 90%;
        margin-bottom: 5rem;
        margin-top: 1rem;
      }
      .disciplineType
      {
        font-size: small;
        margin-bottom: 0.8rem;
      }
      #semesterText, #sessionText, b
      {
        font-size: small;
      }
      #row
      {
        max-width: 60%;
        margin-left: 0.1rem;
      }
      #header
      {
        display:inline-flexbox;
        max-height: 2rem;
      }
      .button + .button
      {
        margin-left: 0.2rem;
      }
      #print
      {
        width: 2rem;
        padding: 0px;
        height: 2rem;
        margin-top: 0.5rem;

      }
      #firstWeek, #secondWeek, #session, #back
      {
        margin-top: 0.5rem;
        height: 2rem;
      }
      .button
      {
        /* margin-top: 0.5rem; */
        /* height: 2rem; */
        height: fit-content;
        font-size: x-small;
        padding: 0.4rem;
      }
      #groupName
      {
        line-height: 1.5rem;
        margin-left: 0.5rem;
        max-height: 3rem;
        max-width: 10rem;
        font-size: small;
        margin-right: 0.5rem;
        word-break: break-all;
        white-space: normal;
        overflow: hidden;
      }
      #infoCont
      {
          margin-top: 6rem;
      }
      .dayCont
      {
        margin-bottom: 0.5rem;
        width: 96%;
      }
      #logo
      {
        margin-right: 0;
        height: 2.5rem;
      }
      #logo img
      {
        height: 2.5rem;
        width: 3.5rem;
      }
      #header
      {
        padding-left: 0;
        padding-right: 0;
      }
    }
</style>
