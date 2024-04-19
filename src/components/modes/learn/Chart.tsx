import React, { useState } from 'react';
import './Chart.css'
import Chart from 'react-google-charts';
import { useTheme } from '../../../App';

// interface for input
interface Props {
    type: string;
    data: TopicState[] | ChartData;
}

//define interface for topics
interface TopicState {
    frequency: number;
    mastery: 'struggling' | 'learning' | 'mastered';
    score: number;
    topic: string;
}

// interface for line chart data (time analysis)
interface ChartData {
    [topic: string]: {
        dates: string[];
        average_scores: number[];
    };
}

const SummaryChart: React.FC<Props> = ({ type, data } ) => {
    // use theme context
    const { theme } = useTheme();
    console.log(theme);
    
    const fontColor = theme === 'light' ? '#18181B' : '#FFFFFF'

    // options for the piechart
    const pieOptions = {
        backgroundColor: "transparent",
        pieHole: 0.4,
        is3D: false,
        legend: {
            alignment: 'center',
            textStyle: {
                color: fontColor,
                fontName: 'Montserrat',
                fontSize: 24
            }
        },
        pieSliceTextStyle: {
            color: '#333333',
            fontName: 'Montserrat',
            bold: true
        },
        pieSliceBorderColor: 'var(--contrast)',
        colors: ['#A6FF86', '#FF4E2E', '#FFFF4E']
    };

    // options for the scatter chart
    const scatterOptions = {
        lineWidth: 5,
        interpolateNulls: true,
        hAxis: { 
            title: 'Date',
            textStyle: {
                color: fontColor,
                fontName: 'Montserrat',
                fontSize: 12
            },
            titleTextStyle: {
                color: fontColor,
                fontName: 'Montserrat',
                fontSize: 16
            }
        },
        vAxis: { 
            title: 'Average Score',
            textStyle: {
                color: fontColor,
                fontName: 'Montserrat',
                fontSize: 12
            },
            titleTextStyle: {
                color: fontColor,
                fontName: 'Montserrat',
                fontSize: 16
            }
        },
        backgroundColor: "transparent",
        legend: {
            position: 'bottom',
            alignment: 'center',
            textStyle: {
                color: fontColor,
                fontName: 'Montserrat',
                fontSize: 16
            }
        }
    }

    // function to format input data for linechart
    const formatLineChartData = (chartData: ChartData) => {
        const datesSet = new Set<string>();
        const dataValues: { [date: string]: number[] } = {};
      
        Object.keys(chartData).forEach((key) => {
          chartData[key].dates.forEach((date, index) => {
            // add date to set of uniques
            datesSet.add(date);
            // if date doesnt exist yet, make new array filled with null
            if (!dataValues[date]) {
              dataValues[date] = new Array(Object.keys(chartData).length).fill(null);
            }
            // set values
            dataValues[date][Object.keys(chartData).indexOf(key)] = chartData[key].average_scores[index];
          });
        });
      
        // format rows
        const dates = Array.from(datesSet).sort();
        const result = dates.map((date) => {
          const rowData = [date, ...dataValues[date]];
          return rowData;
        });
      
        // formatting for the header
        const header = ['Date', ...Object.keys(chartData)];
        // append rest of the rows to the end
        return [header, ...result];
    };

    // function to format input data for piechart
    const formatPieChartData = (data: TopicState[]) => {
        // create map for category + frequency
        const masteryCounts: { [key: string]: number } = {
            'mastered': 0,
            'struggling': 0,
            'learning': 0
        };
    
        // fill in frequencies
        data.forEach(topic => {
            masteryCounts[topic.mastery]++;
        });
    
        // format data
        const chartData: [string, number | string][] = [
            ["Mastery", "Number of Topics"],
            ["Mastered", masteryCounts['mastered']],
            ["Struggling", masteryCounts['struggling']],
            ["Learning", masteryCounts['learning']]
        ];
    
        return chartData;
    }
    
    return (
        <div className={`chart-container ${type}`}>
            {type === 'pie' ?
                <Chart
                    chartType="PieChart"
                    width="100%"
                    height="400px"
                    data={formatPieChartData(data as TopicState[])}
                    options={pieOptions}
                /> :
                <Chart
                    chartType="ScatterChart"
                    width="100%"
                    height="400px"
                    data={formatLineChartData(data as ChartData)}
                    options={scatterOptions}
                />
            }
        </div>
    )
}

export default SummaryChart;