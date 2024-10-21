
import { useState, useEffect } from 'react';
import LineChart from "react-apexcharts";
import {ChartProps} from '@/types/types';

const Chart: React.FC<ChartProps> = ( {stationsList} ) => {


    interface Series {
        name: string;
        data: { x: string; y: number; name: string }[];
    }

    interface Options {
        chart: {
            id: string;
            toolbar: {
                show: boolean;
            };
        };
        xaxis: {
            type: "category";
            labels: {
                show: boolean;
            };
            axisBorder: {
                show: boolean;
            };
            axisTicks: {
                show: boolean;
            };
        };
        yaxis: {
            show: boolean;
        };
        grid: {
            show: boolean;
        };
        markers: {
            size: number;
            hover: {
                sizeOffset: number;
            };
        };
        dataLabels: {
            enabled: boolean;
            formatter: (val: number, opts: any) => string;
            style: {
                fontSize: string;
                colors: string[];
            };
            background: {
                enabled: boolean;
                borderRadius: number;
            };
        };
        stroke: {
            curve: "smooth";
        };
        tooltip: {
            enabled: boolean;
        };
        legend: {
            show: boolean;
        };
    }

    const [series, setSeries] = useState<Series[]>([]);
    const [options, setOptions] = useState<Options>();


    useEffect(() => {
        const options = {
            chart: {
              id: "line-chart",
              toolbar: {
                show: false, // Hide the toolbar (zoom, pan, etc.)
              },
            },
            xaxis: {
              type: "category" as "category",
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
            },
            markers: {
              size: 9,
              hover: {
                sizeOffset: 3,
              },
            },
            dataLabels: {
              enabled: true,
              formatter: function (val:any, opts: any) {
                // Get the marker name from the data series
                return opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].name;
              },
              style: {
                fontSize: "12px",
                colors: ["#000"],
              },
              background: {
                enabled: true,
                borderRadius: 2,
              },
            },
            stroke: {
              curve: "smooth" as "smooth",
            },
            tooltip: {
              enabled: false, // Disable tooltips
            },
            legend: {
              show: false, // Hide legend
            },
          };
          setOptions(options);

            const series = [
                {
                name: "Line 1",
                data: stationsList?.map((station, index) => ({
                    x: index.toString(),
                    y: Math.floor(index  * 10),
                    name: station,
                })) || [],
                },
            ];
            setSeries(series);
    }, []);





    return (
        <div className='h-[68vh] w-[58vw]'>{
            options && series &&
        <LineChart options={options} series={series} type="line"  />
}
        </div>
    );
};

export default Chart;