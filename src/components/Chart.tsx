"use client"
import { useState, useEffect } from 'react';
import LineChart from "react-apexcharts";
import { ChartProps, Options, Series } from '@/types/types';

const Chart: React.FC<ChartProps> = ({ stationsList }) => {


    const [series, setSeries] = useState<Series[]>([]);
    const [options, setOptions] = useState<Options>();


    useEffect(() => {
       
        const series = [
            {
                name: "Line 1",
                data: stationsList?.map((station, index) => (
                    {
                    x: index.toString(),
                    y: Math.floor(index * 10),
                    name: station.name || "Unknown",
                    color: station.color || "#000000",
                })) || [],
            },
        ];
        setSeries(series);


        const options = {
            chart: {
                id: "line-chart",
                toolbar: {
                    show: false, // Hide the toolbar (zoom, pan, etc.)
                },
            },
            xaxis: {
                type: "category" as const,
                labels: {
                    show: false, // Hide x-axis labels
                },
                axisBorder: {
                    show: false, // Hide the x-axis border line
                },
                axisTicks: {
                    show: false, // Hide x-axis ticks
                },
            },
            yaxis: {
                show: false, // Hide the y-axis
            },
            grid: {
                show: false, // Remove grid lines
                padding: {
                    top: 0,
                    right: 110,
                    bottom: 0,
                    left: 110,
                  },
            },
            markers: {
                size: 6,
                hover: {
                    sizeOffset: 3,
                },
            },
            
            dataLabels: {
                enabled: true,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter: function (_val: any, opts: any) {
                    // Get the marker name from the data series
                    return opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].name;
                },
                style: {
                    fontSize: "12px",
                    colors: series[0].data.map((point) => point.color),
                },
            },
            stroke: {
                curve: "smooth" as const,
            },
            tooltip: {
                enabled: false, // Disable tooltips
            },
            legend: {
                show: false, // Hide legend
            },
        };
        setOptions(options);

    }, [stationsList]);





    return (
        <div>{
            options && series &&
            <LineChart options={options} series={series} type="line" />
        }
        </div>
    );
};

export default Chart;