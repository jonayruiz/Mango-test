"use client";
import React, { useRef, useState, useEffect } from "react";

const Range = ({ steps }: { steps: number[] }) => {
  const sortedSteps = steps.sort((a, b) => a - b)
  const [rangeValues, setRangeValues] = useState<number[]>(sortedSteps);
  const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(sortedSteps.length - 1);

  const isDragging = useRef(false);
  const currentHandle = useRef<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<boolean>(false);
  const [loading,setLoading] = useState<boolean>(true)
  
  // useEffect(() => {
  //   const fetchResponse = async () => {
  //     try {
  //       const response = await fetch("https://demo9065139.mockable.io/range");
  //       if (!response.ok) {
  //         throw Error("No response");
  //       } else {
  //         const data = await response.json();
  //         console.log(data);
  //         setMinIndex(data[0]);
  //         setMaxIndex(data[data.length - 1]);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //        setError(true)
  //     } finally {
  //        setLoading(false)
  //     }
  //   };

  //   fetchResponse();
  // }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !currentHandle.current || !containerRef.current)
      return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickPosition / rect.width));
    const closestIndex = Math.round(percentage * (rangeValues.length - 1));

    if (currentHandle.current === "min") {
      if (closestIndex < maxIndex) setMinIndex(closestIndex);
    } else if (currentHandle.current === "max") {
      if (closestIndex > minIndex) setMaxIndex(closestIndex);
    }
  };

  const startDrag = (handle: string) => {
    isDragging.current = true;
    currentHandle.current = handle;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopDrag);
  };

  const stopDrag = () => {
    isDragging.current = false;
    currentHandle.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", stopDrag);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div
        ref={containerRef}
        className="relative w-[calc(100%-120px)] h-4 bg-gray-300 rounded-full"
      >
        <div className="absolute pointer-events-none top-0 -translate-y-full pb-2 -left-[4%]  w-[108%] flex justify-between">
        {rangeValues.map((o, i) => {
          return <div key={`rangeValues-${i}`} className="relative select-none">{o}</div>
        })}
        </div>
        <input
          type="number"
          value={steps[minIndex]}
          readOnly
          className="absolute pointer-events-none select-none selection:bg-transparent top-1/2 -left-12  -translate-x-1/2 w-12  -translate-y-1/2 bg-transparent text-center outline-white"
        />
        <input
          type="number"
          value={steps[maxIndex]}
          className="absolute  pointer-events-none select-none selection:bg-transparent top-1/2 -right-12 translate-x-1/2 -translate-y-1/2 w-12 bg-transparent text-center  outline-white"
          readOnly
        />
        <div
          className="absolute  p-4 top-1/2 -translate-y-1/2 -translate-x-1/2  transition-transform ease-out duration-200 cursor-grab  active:cursor-grabbing group"
          style={{
            left: `${(minIndex / (rangeValues.length - 1)) * 100}%`,
        
           
          }}
          onMouseDown={() => startDrag("min")}
        >
          <div className="w-6 h-6 bg-black rounded-full shadow-sm border-white border-2 shadow-white transition-transform hover:scale-125 group-active:scale-125"></div>
        </div>
        <div
          className="absolute p-4 top-1/2 -translate-y-1/2  -translate-x-1/2 transition-transform ease-out duration-200 cursor-grab  active:cursor-grabbing group"
          style={{
            left: `${(maxIndex / (rangeValues.length - 1)) * 100}%`,
           
          }}
          onMouseDown={() => startDrag("max")}
        >
          <div className="w-6 h-6 bg-black rounded-full shadow-sm border-white border-2 shadow-white transition-transform hover:scale-125 group-active:scale-125"></div>
        </div>
      </div>
    </div>
  );
};

export default Range;
