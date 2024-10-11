"use client"

import CheapTflSvg from '../components/CheapTflSvg';

import init, { find_closest_string } from "../lib/pkg";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Home() {

  async function loadWasm() {
    await init({});
    console.log(find_closest_string("ban")); 
  }
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='text-center'>
        <CheapTflSvg />
        <br />
      </div>
      <div className='flex space-x-4 '>
        <div className='flex space-x-4 '>
          <label htmlFor="from" className="block ml-9 text-sm font-medium text-gray-700">
            From
          </label>
          <Input id="from" name="from" type="text" className="mt-1 block w-full" />
        </div>

        <div className='flex space-x-4 '>
          <label htmlFor="to" className="block text-sm font-medium text-gray-700">
            To
          </label>
          <Input id="to" name="to" type="text" className="mt-1 block w-full" />
        </div>
      </div>
      <div className=" ml-9 ">
        <Button onClick={() => {
          loadWasm();
        }
        } className='custom-blue-start'>
          Search
        </Button>
      </div>

    </div>
  );
}