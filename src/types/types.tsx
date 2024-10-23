
export interface CheapTflSvgProps {
    width?: string;
    height?: string;
}

export interface ChartProps {
    stationsList?: ChartPoint[];
}


export interface ChartPoint {
    name?: string;
    color?: string;
}

export interface FareData {
    [key: string]: string;
}

export interface Series {
    name: string;
    data: { x: string; y: number; name: string; color: string; }[];
}

export interface Options {
    colors?: string[];
    chart: {
        id: string;
        toolbar: {
            show: boolean;
        };
        padding?: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
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
        padding?: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        };
    };
    padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    };
    markers: {
        size: number;
        hover: {
            sizeOffset: number;
        };
        colors?: string[];
    };
    dataLabels: {
        enabled: boolean;
        formatter: (val: number, opts: any) => string;
        style: {
            fontSize: string;
            colors:string[];
        };
        background?: {
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
