"use client"

import CheapTflSvg from '../components/CheapTflSvg';
import { CheapTflSvgProps, FareData } from '../types/types';
import { useState, useEffect } from 'react';
import init, { find_closest_string } from "../lib/pkg";
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


export default function Home() {



  const [stationsFrom, setStationsFrom] = useState<string[]>([]);
  const [stationsTo, setStationsTo] = useState<string[]>([]);
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

  const search = async () => {
    console.log(fromOption, toOption);
    if (fromOption && toOption) {
      //fetch data
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
          //do a check here to see if data is string or object
          if (typeof data === "string") {
            console.log("No data available");
            return
          }
          setData(data);
          console.log(data);
          console.log(data["111"]);
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



  return (
    <div>
      <div className={`flex justify-center items-center transition-all duration-700 ease-in-out ${searchScreen_h} ? 'h-100vh' : h-20vh`}>
        <div className='text-center'>
          <CheapTflSvg {...svgprops} />
          <br />
        </div>
        <div className='flex space-x-4 ml-9'>
          <Select onValueChange={(value) => setFromOption(value)}>
            <SelectTrigger className="w-[180px] text-[#137dc5]">
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <Input type="text" placeholder="Search" className="w-full p-2 text-[#137dc5]" value={from} onChange={(e) => setFrom(e.target.value)} />
                {
                  stationsFrom.map((station, index) => (
                    <SelectItem key={index} value={station} className='text-[#137dc5]'>{station}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setToOption(value)}>
            <SelectTrigger className="w-[180px] text-[#137dc5] ">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent >
              <SelectGroup>
                <Input type="text" placeholder="Search" className="w-full p-2 text-[#137dc5]" value={to} onChange={(e) => setTo(e.target.value)} />
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
          <Button onClick={search} className='bg-[#fb9c2a] hover:bg-[#fb9c2a] text-white'>
            Search
          </Button>
        </div>
      </div>
      { searchScreen_h === "h-[20vh]" &&
      <div className='flex'>
        <div className='h-[70vh] w-[60vw]'>


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
              <br/>
              <br/>
              <br/>
              {`${data["67"]}`} <br />
              <br/>
              {`${data["103"]}`} <br />
            </p>
          }
        </div>
      </div>
}

    </div>

  );
}