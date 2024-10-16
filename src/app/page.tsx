"use client"

import CheapTflSvg from '../components/CheapTflSvg';
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
    if (from && to) {
      //fetch data
      console.log("fetching data");
      fetch("https://cheap-tfl.keivon-991.workers.dev/api", {
        method: "POST",
        body: JSON.stringify({
          "to":to,
          "from":from
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data["88"]);
        });
      
    } else {
      console.log("Please select a station");
    }
  }



  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='text-center'>
        <CheapTflSvg />
        <br />
      </div>
      <div className='flex space-x-4 ml-9'>
      <Select onValueChange={(value) => value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="From" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <Input type="text" placeholder="Search" className="w-full p-2" value={from} onChange={(e) => setFrom(e.target.value)}  />
        {
          stations.map((station, index) => (
            <SelectItem key={index} value={station}>{station}</SelectItem>
          ))
        }
        </SelectGroup>
      </SelectContent>
    </Select>

    <Select onValueChange={(value) => value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="To" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <Input type="text" placeholder="Search" className="w-full p-2" value={to} onChange={(e) => setTo(e.target.value)} />
        {
          stations.map((station, index) => (
            <SelectItem key={index} value={station}>{station}</SelectItem>
          ))
        }
        </SelectGroup>
      </SelectContent>
    </Select>
    

      </div>
      <div className=" ml-9 ">
        <Button  onClick={search}
        className='custom-blue-start'>
          Search
        </Button>
      </div>
    </div>
   
  );
}