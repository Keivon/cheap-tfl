"use client"
import { useEffect } from 'react';
import init, { find_closest_string } from "@/lib/pkg";
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DropdownProps {
    from: string;
    to: string;
    stationsFrom: string[];
    stationsTo: string[];
    setFrom: (value: string) => void;
    setTo: (value: string) => void;
    setFromOption: (value: string) => void;
    setToOption: (value: string) => void;
    setStationsFrom: (value: string[]) => void;
    setStationsTo: (value: string[]) => void;
}



const Dropdown: React.FC<DropdownProps> = ({from,
    to,
    stationsFrom,
    stationsTo,
    setFrom,
    setTo,
    setFromOption,
    setToOption,
    setStationsFrom,
    setStationsTo}:DropdownProps) => {
    



    useEffect(() => {
        if (typeof window !== 'undefined') {
        // Client-side only code here
        const updateStations = async () => {
          await init({});
          setStationsFrom(find_closest_string(from) as string[]);
        }
    
        updateStations();
        }
      }, [from]);
    
    
      useEffect(() => {
        if (typeof window !== 'undefined') {
        // Client-side only code here
        const updateStations = async () => {
          await init({});
          setStationsTo(find_closest_string(to) as string[]);
        }
       
        updateStations();
      }
      }, [to]);
    

    return (
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
    );
};

export default Dropdown;