<script setup>
    import currentClass from '../js/currentClass'
    const timesJson = await (await fetch('https://schedule.npi-tu.ru/api/v1/class-intervals/')).json()
    let times = []
    for (let i in timesJson)
    {
        let breakTime
        if (i < Object.keys(timesJson).length)
        {
            breakTime = (Number(timesJson[String(Number(i) + 1)].start.split(':')[0]) * 60 + Number(timesJson[String(Number(i) + 1)].start.split(':')[1])) - (Number(timesJson[i].end.split(':')[0]) * 60 + Number(timesJson[i].end.split(':')[1]))
        }
        else
        {
            breakTime = '-'
        }
        times.push([timesJson[i].start + '-' + timesJson[i].end, breakTime])
    }
    const time = new Date().getHours() * 60 + new Date().getMinutes()

</script>

<template>
    <div id="tableCont">
        <table>
            <thead>
                <tr id="tableHead">
                    <th>#</th>
                    <th>Время</th>
                    <!-- <th>Перерыв</th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="(i, index) in times" :key="index" :style="{background: currentClass.isCurrent(timesJson, index, time) ? '#3d3f51' : 'inrehit'}">
                    <td v-if="times.length - 1 == index" :style="{'border-bottom-left-radius': '0.8rem'}"><b>{{ index + 1 + ' Пара' }}</b></td>
                    <td v-else><b>{{ index + 1 + ' Пара' }}</b></td>
                    <td v-if="times.length - 1 == index" :style="{'border-bottom-right-radius': '0.8rem'}">{{ i[0] }}</td>
                    <td v-else>{{ i[0] }}</td>
                    <!-- <td v-if="i[1] != '-'">
                        {{ i[1] + ' Минут'}}
                    </td>
                    <td v-else-if="times.length - 1 == index" :style="{'border-bottom-right-radius': '0.8rem'}">
                        {{  i[1] }}
                    </td> -->
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
    *
    {
        font-size: medium;
    }
    table
    {
        color: #f8f8f2;
        border: 0.1rem solid #44475a;
        width: 100%;
        background-color: #282a36;
        text-align: left;
        border-radius: 0.8rem;
        border-spacing: 0rem;
    }
    td, th
    {
        text-align: center;
        padding: 0.8rem;
        /* border-left: 0.05rem solid #44475a; */
        border: 0.1rem solid #44475a;
    }

    th
    {
        background-color: 	#6272a4;
        /* border-bottom: 0.05rem solid #44475a; */
    }
    th:first-child
    {
        border-top-left-radius: 0.8rem;
    
    }
    th:last-child
    {
        border-top-right-radius: 0.8rem;
    }
    #tableCont
    {
        border-spacing: 0;
        /* border-top-left-radius: 1rem;
        border-top-right-radius: 1rem; */
        border-radius: 0.8rem;
    }
    @media only screen and (max-width: 600px) {
        *{
            font-size: small ;
        }
    }
</style>