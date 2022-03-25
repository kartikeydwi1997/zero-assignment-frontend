import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function BarChart(chartData, populationData) {
    // const [data, setData] = useState(chartData);
    const [label, setLabel] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        console.log('called');
        console.log(chartData);
        console.log(populationData);


        const fetchData = async () => {
            setData(chartData.population);
            setLabel(chartData.data);
        }
        fetchData()
    }, []);

    const barchart = (
        <Bar
            data={{
                labels: label,
                datasets: [{
                    label: 'Poulation Dataset ',
                    borderColor:   '#501800',
                    backgroundColor: [
                        '#B21F00',
                        '#C9DE00',
                        '#2FDE00',
                        '#00A6B4',
                        '#6800B4'
                    ],
                    hoverBackgroundColor: [
                        '#501800',
                        '#4B5000',
                        '#175000',
                        '#003350',
                        '#35014F'
                    ],
                    data: data
                }]
            }}
            options={{
                responsive: true,
                maintainAspectRatio: true,
                radius:'45%',
                plugins: {
                title: {
                    display: true,
                    text: 'Bar Chart - Population of nearest 5 neighboring zipcodes',
                    color:'lightblue',
                    font: {

                        size: 25
                    },
                    padding: {
                        top: 30,
                        bottom: 30
                    },
                    responsive: true,
                    animation: {
                        animateScale: true,
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            }
            }}
        />

    );


    return (
        <div>
            {barchart}
        </div>
    )
}

export default BarChart;