import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Typography, Stack } from '@mui/material'
import { ContentContainer } from '../theme/styled'
import { Colors } from '../helper/colors'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    LineController,
    BarController,
    BarElement
} from 'chart.js'
import { Chart } from 'react-chartjs-2'

import zoomPlugin from 'chartjs-plugin-zoom'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    LineController,
    BarController,
    BarElement,
    zoomPlugin
)



const WeatherChart = ({ forecast }) => {

    const [hourly, setHourly] = useState(true)

    const hourlyTemps = []
    const hourlyTimes = []
    const hourlyIcons = []

    const daysTemps = []
    const daysDates = []
    const daysIcons = []

    const fahrenheit = useSelector((state) => state.weatherState.fahrenheit)

    const dayOneHours = forecast?.[0].hour
    const dayTwoHours = forecast?.[0].hour
    const hours48Length = dayOneHours?.concat(dayTwoHours)

    const date = new Date()
    const currentHour = date.getHours()

    hours48Length?.slice(currentHour).forEach((hour) => {
        const time = new Date(hour.time)
        const convertedTime = time.toLocaleString('en-US', {hour: 'numeric', hour12: true})
        hourlyTemps.push(fahrenheit ? hour?.temp_f : hour?.temp_c)
        hourlyTimes.push(convertedTime)
        hourlyIcons.push(hour.condition.icon)
    })

    forecast?.forEach((days) => {
        const day = new Date(days.date)
        const convertedDay = day.toLocaleDateString()
        daysTemps.push(fahrenheit ? days?.day.maxtemp_f : days?.day.day_maxtemp_c)
        daysDates.push(convertedDay)
        daysIcons.push(days.day.condition.icon)
    })

    const tempData = {
        labels: hourly ? hourlyTimes : daysDates,
        datasets: [
            {
                data: hourly ? hourlyTemps : daysTemps,
                backgroundColor: Colors.blue,
                borderColor: Colors.blue
            },
        ],
    }

    const options = {
        responsive: true,
        scales: {
            yAxis: {
                display: false,
            },
            xAxis: {
                min: 0,
                max: 4,
                offset: true,
                grid: {
                    drawBorder: false,

                    display: false,
                },
                ticks: {
                    padding: 15,
                }
            },
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                display: true,
                color: "black",

                formatter: function (value) {
                    const icon = fahrenheit ? '°F' : '°C'
                    return value + icon;
                }
            },
            zoom: {
                plugins: {
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x',
                        },
                        zoom: {
                            enabled: true,
                            mode: 'y'
                        }
                    }
                },
            },
        },
    };


    return (
        <ContentContainer>
            <Stack direction='row' spaceing={2}>
                <Typography variant='h6'> {`Forecast ${fahrenheit ? '°F' : '°C'}`}  </Typography>
                <Button onClick={() => { hourly ? setHourly(false) : setHourly(true) }} variant="text"> {hourly ? 'Show Daily' : 'Show Hourly'} </Button>
            </Stack>
            <Chart type='bar' options={options} data={tempData} />
        </ContentContainer>
    )
}

export default WeatherChart