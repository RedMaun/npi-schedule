let exports = {};

exports.isCurrent = (timesJson, index, time) =>
{
    if (index < Object.keys(timesJson).length - 1)
    {
        if ((Number(timesJson[String(index + 2)].start.split(':')[0]) * 60 + Number(timesJson[String(index + 2)].start.split(':')[1])) > time && ((Number(timesJson[String(index + 1)].start.split(':')[0]) * 60 + Number(timesJson[String(index + 1)].start.split(':')[1]))) < time)
        {
            return true
        }
    }
    else if(index == Object.keys(timesJson).length - 1 )
    {
        if ((Number(timesJson[String(index + 1)].end.split(':')[0]) * 60 + Number(timesJson[String(index + 1)].end.split(':')[1])) > time && (Number(timesJson[String(index + 1)].start.split(':')[0]) * 60 + Number(timesJson[String(index + 1)].start.split(':')[1])) < time)
        {
            return true
        }
    }
    return false
}


export default exports;