import CheapTflSvg from '@/components/CheapTflSvg';
import { CheapTflSvgProps, FareData, ChartProps, ChartPoint } from '@/types/types';
import { useState, useEffect } from 'react';
import init, { find_closest_string } from "@/lib/pkg";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Chart from "@/components/Chart"



export default function Home() {



  const [stationsFrom, setStationsFrom] = useState<string[]>([]);
  const [stationsTo, setStationsTo] = useState<string[]>([]);
  const [stationsList, setStationsList] = useState<ChartProps>({});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromOption, setFromOption] = useState("");
  const [toOption, setToOption] = useState("");


  const [data, setData] = useState<FareData>({});
  const [searchScreen_h, setSearchScreen_h] = useState("h-[100vh]");
  const [svgprops, setSvgProps] = useState<CheapTflSvgProps>({});





  useEffect(() => {
    async function updateStations() {
      await init({});
      setStationsFrom(find_closest_string(from) as string[]);
    }
    updateStations();
  }, [from]);


  useEffect(() => {
    async function updateStations() {
      await init({});
      setStationsTo(find_closest_string(to) as string[]);
    }
    updateStations();
  }, [to]);

  const search = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (fromOption && toOption) {
      console.log("fetching data");
      fetch("https://cheap-tfl.keivon-991.workers.dev/api", {
        method: "POST",
        body: JSON.stringify({
          "to": toOption,
          "from": fromOption
        }),
      })
        .then((response) => response.json())
        .then((data) => {

          if (typeof data === "string") {
            console.log("No data available");
            return
          }
          setData(data);
          if (data["103"]){
          setStationsList({stationsList:[...addcolor(createMapOfStations(data["103"]))]});
          } else {
            setStationsList({ stationsList:[{name:fromOption, color:"#000000"}, {name:toOption, color: "#000000"}] });
          }
          if (svgprops.width !== "58.5892886390718") {
            changeViewOnSearch();
          }
        });

    } else {
      console.log("Please select a station");
    }
  }

  const changeViewOnSearch = () => {
    setSearchScreen_h("h-[20vh]");
    setSvgProps({ width: "58.5892886390718", height: "104.915625" });
  }


  const createMapOfStations = (sentence: string) => {
    let stations = sentence.split("interchanging at ")[1].split(" and ");
    stations = stations.flatMap((station) => station.split(","));
    stations = [fromOption, ...stations, toOption];
    return stations;
  }

  const addcolor = (stations: string[]): ChartPoint[] => {
    return stations.map((station) => {
      if (station === fromOption || station === toOption) {
        return { name: station, color: "#000000" };
      } else {
        return { name: station, color: "#fb9c2a" };
      }
    });
  }
 


  return (
    <div>
      <form  onSubmit={search} className={`flex justify-center items-center transition-all duration-700 ease-in-out ${searchScreen_h} ? 'h-100vh' : h-20vh`}>
        <div className='text-center'>
          <CheapTflSvg {...svgprops} />
          <br />
        </div>
        <div className='flex space-x-4 ml-9'>
          <Select required onValueChange={(value) => setFromOption(value)}>
            <SelectTrigger className="w-[180px] text-[#137dc5]">
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectGroup>
                <Input autoFocus type="text" placeholder="Search" className="w-full p-2 text-[#137dc5]" value={from} onChange={(e) => setFrom(e.target.value)} />
                {
                  stationsFrom.map((station, index) => (
                    <SelectItem key={index} value={station} className='text-[#137dc5]'>{station}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select required onValueChange={(value) => setToOption(value)}>
            <SelectTrigger className="w-[180px] text-[#137dc5] ">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectGroup>
                <Input autoFocus type="text" placeholder="Search" className="w-full p-2 text-[#137dc5]" value={to} onChange={(e) => setTo(e.target.value)} />
                {
                  stationsTo.map((station, index) => (
                    <SelectItem key={index} value={station} className='text-[#137dc5]'>{station}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className=" ml-9 ">
          <Button  className='bg-[#fb9c2a] hover:bg-[#fb9c2a] text-white'>
            Search
          </Button>
        </div>
        </form>
      {searchScreen_h === "h-[20vh]" &&  data["10"]?
      <div className='flex justify-center items-center'>
        <p className='text-[#137dc5] m-6 text-2xl'>{data["10"]}</p>
        </div>
      :
        <div className='flex'>
          <div className='h-[70vh] w-[60vw]'>
            <h2 className='text-[#137dc5] text-2xl text-center'>Journey</h2>
            {
              stationsList &&
            <Chart {...stationsList} />
            }
          </div>

          <div className='h-[70vh] w-[40vw] border-l border-[#fb9c2a] overflow-y-scroll'>
            <h2 className='text-[#137dc5] text-2xl text-center'>Results</h2>
            <br />
            <h3 className='text-[#137dc5] text-2xl ml-2'>Standard fare:</h3>
            {data["31"] && //Will only show if data[31] is available
              <p className='text-[#137dc5] ml-4 text-sm md:text-base lg:text-lg xl:text-xl'>
                {`Peak : £${data["31"].slice(-4)}`} <br />
                <br />
                (Monday to Friday from 06:30 to 09:30) <br />
                Off Peak : {`£${data["35"].slice(-4)} `}
              </p>
            }
            <br />
            <h3 className='text-[#137dc5] text-2xl ml-2'>Unorthodox fare:</h3>
            {data["84"] && // Will only show if data[84] is available
              <p className='text-[#137dc5]  ml-4 text-sm md:text-base lg:text-lg xl:text-xl'>
                {`Peak : £${data["84"].slice(-4)}`} <br />
                <br />
                (Monday to Friday from 06:30 to 09:30) <br />
                Off Peak : {`£${data["88"].slice(-4)} `}
                <br />
                <br />
                <br />
                {`${data["67"]}`} <br />
                <br />
                {`${data["103"]}`} <br />
              </p>
            }
          </div>
        </div>
      }

    </div>

  );
}