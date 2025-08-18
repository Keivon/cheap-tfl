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
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function updateStations() {
      await init({});
      setStationsFrom(find_closest_string(from) as string[]);
    }
     const timeoutId = setTimeout(() => {
      updateStations();
    }, 50);
    return () => {
      clearTimeout(timeoutId);
    };
    
  }, [from]);


  useEffect(() => {
    async function updateStations() {
      await init({});
      setStationsTo(find_closest_string(to) as string[]);
    }
     const timeoutId = setTimeout(() => {
      updateStations();
    }, 50);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [to]);

  // tiny spinner components
  const InlineSpinner = ({ className = "" }) => (
    <span className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white ${className}`} />
  );
  const CenterSpinner = () => (
    <div className="flex justify-center items-center py-16">
      <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#137dc5]/30 border-t-[#137dc5]" />
    </div>
  );

  const search = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!(fromOption && toOption)) {
      console.log("Please select a station");
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch("https://cheap-tfl.keivon-991.workers.dev/api", {
        method: "POST",
        body: JSON.stringify({ to: toOption, from: fromOption }),
      });
      const data = await res.json();

      if (typeof data === "string") {
        console.log("No data available");
        return;
      }

      setData(data);
      if (data["103"]) {
        setStationsList({ stationsList: [...addcolor(createMapOfStations(data["103"]))] });
      } else {
        setStationsList({ stationsList: [{ name: fromOption, color: "#000000" }, { name: toOption, color: "#000000" }] });
      }
      if (svgprops.width !== "58.5892886390718") {
        changeViewOnSearch();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  }

  const changeViewOnSearch = () => {
    setSearchScreen_h("h-[20vh]");
    setSvgProps({ width: "58.5892886390718", height: "104.915625" });
  }


  const toAmount = (raw?: string) => {
    if (!raw) return 0;
    const m = raw.match(/(\d+\.\d{2})/);
    return m ? parseFloat(m[1]) : parseFloat(raw.replace(/[^\d.]/g, "")) || 0;
  };

  const peakStandard = toAmount(data["31"]);
  const offStandard  = toAmount(data["35"]);
 
  const hasAltFare = Boolean(data["84"] || data["88"]);

  const peakAlt = hasAltFare ? toAmount(data["84"]) : 0;
  const offAlt  = hasAltFare ? toAmount(data["88"]) : 0;

  const maxPeak = Math.max(peakStandard, hasAltFare ? peakAlt : peakStandard, 1);
  const maxOff  = Math.max(offStandard,  hasAltFare ? offAlt  : offStandard,  1);

  const money = (n: number) => `£${n.toFixed(2)}`;
  const peakSaving = hasAltFare ? Math.max(peakStandard - peakAlt, 0) : 0;
  const offSaving  = hasAltFare ? Math.max(offStandard  - offAlt,  0) : 0;

 
  const PriceBar = ({
    label, value, max, colorClass
  }: { label: string; value: number; max: number; colorClass: string }) => {
    const w = Math.max(12, (value / max) * 100); // keep visible
    return (
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <div className="h-3 rounded bg-gray-100">
            <div className={`h-3 rounded ${colorClass}`} style={{ width: `${w}%` }} />
          </div>
          <div className="mt-1 text-xs text-gray-600">{label}</div>
        </div>
        <div className="w-16 text-right font-semibold text-[#137dc5]">{money(value)}</div>
      </div>
    );
  };

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
    <div className="min-h-screen bg-slate-50">
      <div className='mb-40 md:mb-0'>
      <form onSubmit={search} className={`flex flex-col md:flex-row justify-center items-center transition-all duration-700 ease-in-out ${searchScreen_h} ? 'h-100vh' : h-20vh`} aria-busy={isSearching}>
        <div className='text-center mt-[25vh] md:mt-8 '>
          <CheapTflSvg {...svgprops} />
          <br />
        </div>
        <div className='flex space-x-1 md:flex-row md:space-x-4 ml-0 md:ml-9'>
          <div className="mb-2 md:mb-0">
            <Select required value={fromOption} onValueChange={(value) => {
              setFromOption(value);
            }}>
              <SelectTrigger className="w-[180px] text-[#137dc5]">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectGroup>
                  <Input ref={input => input && input.focus()} type="text" placeholder="Search" className="w-full p-2 text-[#137dc5]" value={from} onChange={(e) =>{ 
                    setFromOption("");
                    setFrom(e.target.value)}} />
                  {
                    stationsFrom.map((station, index) => (
                      <SelectItem key={index} value={station} className='text-[#137dc5]'>{station}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select required value={toOption} onValueChange={(value) =>{ 
              setToOption(value)}}>
              <SelectTrigger className="w-</SelectItem>[180px] text-[#137dc5] ">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectGroup>
                  <Input ref={input => input && input.focus()} type="text" placeholder="Search" className="w-full p-2 text-[#137dc5]" value={to} onChange={(e) =>{ 
                    setToOption("");
                    setTo(e.target.value)}} />
                  {
                    stationsTo.map((station, index) => (
                      <SelectItem key={index} value={station} className='text-[#137dc5]'>{station}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:ml-9 ">
          <Button disabled={isSearching} className='bg-[#fb9c2a] hover:bg-[#fb9c2a] text-white'>
            {isSearching ? (<><InlineSpinner /><span className="ml-2">Searching...</span></>) : "Search"}
          </Button>
        </div>
      </form>
      </div>

      {searchScreen_h === "h-[20vh]" ? (
        isSearching ? (
          <CenterSpinner />
        ) : data["10"] ? (
          <div className="flex mt-[10vh] md:mt-0 justify-center items-center">
            <p className="text-[#137dc5] m-6 text-2xl">{data["10"]}</p>
          </div>
        ) : (
          <div className="mx-auto max-w-5xl p-4 md:p-8 space-y-6">
            {/* Header */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
              <h1 className="text-2xl font-semibold text-[#137dc5]">TfL Journey Planner</h1>
              <div className="mt-2 flex items-center text-gray-600">
                <span className="mr-2">📍</span>
                <span className="font-medium">
                  {(fromOption || from || "From")} → {(toOption || to || "To")}
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                {/* Journey Route */}
                <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-6">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <h2 className="text-lg font-semibold">Journey Route</h2>
                  </div>
                  <div className="mt-6">
                    {stationsList && <Chart {...stationsList} />}
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                <div>
                  {/* Fare cards */}
                  <div className={hasAltFare ? `grid md:grid-cols-2 gap-6` : `grid md:grid-cols-1 gap-6`}>
                    <div className="rounded-2xl p-6 bg-blue-50 ring-1 ring-blue-100">
                      <div className="flex items-start justify-between">
                        <div className="text-[#137dc5] font-medium">Standard Fare</div>
                        <div className="text-right">
                          <div className="flex flex-col items-end space-y-1">
                          <div className="flex items-baseline space-x-2">
                            <span className="text-xs text-gray-500">Peak</span>
                            <span className="text-[#137dc5] font-semibold">{money(peakStandard)}</span>
                          </div>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-xs text-gray-500">Off-peak</span>
                            <span className="text-green-600 font-semibold">{money(offStandard)}</span>
                          </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-600">
                        Monday to Friday from 06:30 to 09:30
                      </div>
                    </div>

                    {hasAltFare && (
                      <div className="rounded-2xl p-6 bg-[#fb9c2a]/5 ring-1 ring-[#fb9c2a]/60">
                        <div className="flex items-start justify-between">
                          <div className="text-[#fb9c2a]/100 font-medium">Unorthodox Fare</div>
                            <div className="text-right">
                            <div className="flex flex-col items-end space-y-1">
                              <div className="flex items-baseline space-x-2">
                              <span className="text-xs text-gray-500">Peak</span>
                              <span className="text-[#fb9c2a]/100 font-semibold">{money(peakAlt)}</span>
                              </div>
                              <div className="flex items-baseline space-x-2">
                              <span className="text-xs text-gray-500">Off-peak</span>
                              <span className="text-green-600 font-semibold">{money(offAlt)}</span>
                              </div>
                            </div>
                            </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-600">
                          Monday to Friday from 06:30 to 09:30
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  {/* Fare Comparison */}
                  <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-6">
                    <h3 className="text-base font-semibold text-gray-800 mb-4">
                      Fare Comparison
                    </h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-3">Peak Times</div>
                        <PriceBar label="Standard" value={peakStandard} max={maxPeak} colorClass="bg-blue-500" />
                        {hasAltFare && (
                          <div className="mt-3">
                            <PriceBar label="Unorthodox" value={peakAlt} max={maxPeak} colorClass="bg-[#fb9c2a]/100" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-3">Off-Peak Times</div>
                        <PriceBar label="Standard" value={offStandard} max={maxOff} colorClass="bg-blue-500" />
                        {hasAltFare && (
                          <div className="mt-3">
                            <PriceBar label="Unorthodox" value={offAlt} max={maxOff} colorClass="bg-[#fb9c2a]/100" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

                {(data["67"] || data["103"]) && (
                  <div>
                    {/* Info Alert */}
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6">
                      <div className="flex items-center space-x-2 text-amber-800 font-semibold">
                        <span>⚠️</span>
                        <span>Important Journey Information</span>
                      </div>
                      <ul className="mt-3 space-y-2 text-amber-900 list-disc pl-6">
                        {data["103"] && <li>{data["103"]}</li>}
                        {data["67"] && <li>{data["67"]}</li>}
                      </ul>
                    </div>
                  </div>
                )}

                {hasAltFare && (peakSaving > 0 || offSaving > 0) && (
                  <div>
                    {/* Savings */}
                    <div className="rounded-2xl bg-green-50 ring-1 ring-green-100 p-6">
                      <h3 className="text-base font-semibold text-green-900 mb-4">
                        Potential Savings with Unorthodox Route
                      </h3>
                      <div className="grid grid-cols-2 gap-6 text-center">
                        <div>
                          <div className="text-3xl font-bold text-green-700">
                            {money(peakSaving)}
                          </div>
                          <div className="text-sm text-green-900/80">Peak Time Savings</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-green-700">
                            {money(offSaving)}
                          </div>
                          <div className="text-sm text-green-900/80">Off-Peak Savings</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
          </div>
        )
      ) : null}
    </div>

  );
}