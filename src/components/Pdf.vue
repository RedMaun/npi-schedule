<script setup>
import { usePDF } from 'vue3-pdfmake';
const props = defineProps({
        weeks: Array,
        group: String,
        info: Array,
        colors: Object,
        usedTypes: Array
    })
const pdfmake = usePDF({
  autoInstallVFS: true
})
const timesJson = await (await fetch('https://schedule.npi-tu.ru/api/v1/class-intervals/')).json()
var times = []
for (let i = 1; i <= Object.keys(timesJson).length; i++)
{
    times.push(timesJson[String(i)].start + '-' + timesJson[String(i)].end)
}
var pdfWeekOne = [
    [times[0], '', '', '', '', '', ''],
    [times[1], '', '', '', '', '', ''],
    [times[2], '', '', '', '', '', ''],
    [times[3], '', '', '', '', '', ''],
    [times[4], '', '', '', '', '', ''],
    [times[5], '', '', '', '', '', '']
]

var pdfWeekTwo = [
    [times[0], '', '', '', '', '', ''],
    [times[1], '', '', '', '', '', ''],
    [times[2], '', '', '', '', '', ''],
    [times[3], '', '', '', '', '', ''],
    [times[4], '', '', '', '', '', ''],
    [times[5], '', '', '', '', '', '']
]

const weeks = props.weeks
const info = props.info
const usedTypes = props.usedTypes
var semesterStart, semesterEnd, sessionStart, sessionEnd
const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
var infoCont = {}
if (info && info.length > 0)
{
    const session = info[0]
    const semester = info[1]
    if (session != undefined && semester != undefined)
    {
        let dateSemesterStart = new Date(semester.start)
        let dateSemesterEnd = new Date(semester.end)
        let dateSessionStart = new Date(session.start)
        let dateSessionEnd = new Date(session.end)
        semesterStart = dateSemesterStart.getDate() + ' ' + months[dateSemesterStart.getMonth()] + ' ' + dateSemesterStart.getFullYear()
        semesterEnd = dateSemesterEnd.getDate() + ' ' + months[dateSemesterEnd.getMonth()] + ' ' + dateSemesterEnd.getFullYear()
        sessionStart = dateSessionStart.getDate() + ' ' + months[dateSessionStart.getMonth()] + ' ' + dateSessionStart.getFullYear()
        sessionEnd = dateSessionEnd.getDate() + ' ' + months[dateSessionEnd.getMonth()] + ' ' + dateSessionEnd.getFullYear()
        infoCont = {text: 'Семестр: ' + semesterStart + ' — ' +  semesterEnd + '\n' +  'Сессия: ' + sessionStart + ' — ' +  sessionEnd, style: 'info', width: 300}
    }
}


const time = (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()) + '.' + ((Number(new Date().getMonth()) + 1) < 10 ? '0' + (Number(new Date().getMonth()) + 1) : (Number(new Date().getMonth()) + 1)) + '.' + new Date().getFullYear() + ' ' + (new Date().getHours() < 10 ?  '0' + new Date().getHours() : new Date().getHours()) + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes())

if (props.weeks[0] && props.weeks[0].length != 0)
{
    for (let z = 0; z < weeks[0].length; z++)
    {
        for(let x = 0; x < weeks[0][z].classes.length; x++)
        {
            pdfWeekOne[weeks[0][z].classes[x].class - 1][weeks[0][z].day] = {text: weeks[0][z].classes[x].firstRow + ' ' + weeks[0][z].classes[x].type + '\n' + String(weeks[0][z].classes[x].secondRow) + ' ' + weeks[0][z].classes[x].thirdRow}
            //  fillColor: props.colors[weeks[0][z].classes[x].type].color}
        }
    }
}
if (props.weeks[1] && props.weeks[1].length != 0)
{
    for (let z = 0; z < weeks[1].length; z++)
    {
        for(let x = 0; x < weeks[1][z].classes.length; x++)
        {
            pdfWeekTwo[weeks[1][z].classes[x].class - 1][weeks[1][z].day] = {text: weeks[1][z].classes[x].firstRow + ' ' + weeks[1][z].classes[x].type + '\n' + String(weeks[1][z].classes[x].secondRow) + ' ' + weeks[1][z].classes[x].thirdRow}
            // fillColor: props.colors[weeks[1][z].classes[x].type].color}
        }
    }
}


function deleteSpace(arr)
{
    let count
    let arrCopy = [...arr]
    for (let i = 0; i < arr.length; i++)
    {  
        count = 0
        for (let k = 1; k < arr[i].length; k++)
        {
            if (arr[i][k] == '')
            {
                count++
            }
        }
        if (count == 6)
        {
            arrCopy[i] = undefined
        }
    }
    arrCopy = arrCopy.filter(function( element ) {
        return element !== undefined;
    });
    return arrCopy
}

pdfWeekOne = deleteSpace(pdfWeekOne)
pdfWeekTwo = deleteSpace(pdfWeekTwo)


// var typesPdf = []
// if (usedTypes && usedTypes.length != 0)
// {
//     for (let i = 0; i < usedTypes.length; i++)
//     {
//         typesPdf.push({text: props.colors[usedTypes[i]].name})
//             // fillColor: props.colors[usedTypes[i]].color,})
//     }
// }

const onGenPDF = () => {
  pdfmake.createPdf({
    pageOrientation: 'landscape',
    pageMargins: [ 20, 20, 20, 20 ],
    content: [
        {
            columns: [
                {text: time + '\n'},
                {text: props.group, style: 'header'},
                infoCont,
            ]
        },
        {text: '1 Неделя', style: 'week'},
        {
			style: 'table',
			headerRows: 1,
			table: {
                widths: [40, '*', '*', '*', '*', '*', '*'],
				headerRows: 1,
				body: [
					[{text: 'Время', style: 'tableHeader'}, {text: 'Понедельник', style: 'tableHeader'}, {text: 'Вторник', style: 'tableHeader'}, {text: 'Среда', style: 'tableHeader'}, {text: 'Четверг', style: 'tableHeader'}, {text: 'Пятница', style: 'tableHeader'}, {text: 'Суббота', style: 'tableHeader'}],
					...pdfWeekOne
				]
			},
		},
        {text: '2 Неделя', style: 'week'},
        {
			style: 'table',
			headerRows: 1,
			table: {
                widths: [40, '*', '*', '*', '*', '*', '*'],
				headerRows: 1,
				body: [
                    // [{text: '2 Неделя', style: 'week', colSpan: 7}, {}, {}, {}, {}, {}, {},],
					[{text: 'Время', style: 'tableHeader'}, {text: 'Понедельник', style: 'tableHeader'}, {text: 'Вторник', style: 'tableHeader'}, {text: 'Среда', style: 'tableHeader'}, {text: 'Четверг', style: 'tableHeader'}, {text: 'Пятница', style: 'tableHeader'}, {text: 'Суббота', style: 'tableHeader'}],
					...pdfWeekTwo
				]
			},
		},
        // {
        //     style: 'type',
		// 	headerRows: 1,
        //     table: {
        //         widths: [100, 100, 100, 100],
		// 		headerRows: 1,
		// 		body: [
        //             typesPdf,
		// 		]
		// 	},
        // },
    ],
    styles: {
        table:
        {
            width: '100%',
            fontSize: 6,
            alignment: 'center'
        },
        tableHeader:
        {
            bold: true,
            fontSize: 7,
            fillColor: '#ccc'
        },
        header:
        {
			fontSize: 18,
			bold: true,
            alignment: "center"
        },
        info:
        {
            fontSize: 10,
            // margin: [10, 10, 10, 5],
            alignment: "right"
            // absolutePosition: { x: 200, y: 100 }
        },
        week:
        {
            fontSize: 12,
            alignment: "center",
            margin: [0, 5, 0, 5],
        },
        type:
        {
            fontSize: 10,
            margin: [0, 5, 0, 0],
            alignment: "center",
            fillColor: "#ccc"
        }
    }
  }).print();
}
</script>

<template>
  <!-- <button @click="onGenPDF">Click here for download demo pdf</button> -->
  <button @click="onGenPDF" class="button fa-1x" id="print"><font-awesome-icon icon="print" /><span> печать</span></button>
</template>