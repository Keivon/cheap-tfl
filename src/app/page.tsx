"use client"

import CheapTflSvg from '../components/CheapTflSvg';
import { CheapTflSvgProps } from '../types/types';
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



  const [stations, setStations] = useState<string[]>([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromOption, setFromOption] = useState("");
  const [toOption, setToOption] = useState("");
  const [searchScreen_h, setSearchScreen_h] = useState("screen");
  const [svgprops, setSvgProps] = useState<CheapTflSvgProps>({});

  

  useEffect(() => {
    async function updateStations() {
      await init({});
      setStations(find_closest_string(from) as string[]);
    }
    updateStations();
  }, [from]);


  useEffect(() => {
    async function updateStations() {
      await init({});
      setStations(find_closest_string(to) as string[]);
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
          "to":toOption,
          "from":fromOption
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if(svgprops.width !== "58.5892886390718") {
            console.log("changing view");
          changeViewOnSearch();
          }
        });
      
    } else {
      console.log("Please select a station");
    }
  }

  const changeViewOnSearch = () => {
    setSearchScreen_h("-[10vh]");
    setSvgProps({width: "58.5892886390718", height: "104.915625"});
  }



  return (
    
    <div className={`flex justify-center items-center h-${searchScreen_h}`}>
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
        <Input type="text" placeholder="Search" className="w-full p-2 text-[#137dc5]" value={from} onChange={(e) => setFrom(e.target.value)}  />
      {
        stations.map((station, index) => (
        <SelectItem key={index} value={station} className='text-[#137dc5]'>{station}</SelectItem>
        ))
      }
      </SelectGroup>
      </SelectContent>
    </Select>

    <Select onValueChange={(value) => setToOption(value)}>
      <SelectTrigger className="w-[180px] text-[#137dc5] ">
      <SelectValue placeholder="To"  />
      </SelectTrigger>
      <SelectContent >
      <SelectGroup>
        <Input type="text" placeholder="Search" className="w-full p-2 text-[#137dc5]" value={to} onChange={(e) => setTo(e.target.value)} />
      {
        stations.map((station, index) => (
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
    
   
  );
}