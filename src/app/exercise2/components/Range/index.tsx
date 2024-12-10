"use client";
import React, { useRef, useState, useEffect } from "react";

const Range = ({ steps }: { steps: number[] }) => {
  const sortedSteps = steps.sort((a, b) => a - b)
  const [rangeValues, setRangeValues] = useState<number[]>(sortedSteps);
  const [minIndex, setMinIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(sortedSteps.length - 1);
  const [minLabel, setMinLabel] = useState(sortedSteps[0]);
  const [maxLabel, setMaxLabel] = useState(sortedSteps[sortedSteps.length - 1]);
  const isDragging = useRef(false);
  const currentHandle = useRef<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);


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
        <input
          type="number"
          value={minLabel}
          readOnly
          className="absolute pointer-events-none select-none selection:bg-transparent top-1/2 -left-12 -translate-x-1/2 w-12  -translate-y-1/2 bg-transparent text-center outline-white"
        />
        <input
          type="number"
          value={maxLabel}
          className="absolute  pointer-events-none select-none selection:bg-transparent top-1/2 -right-12 translate-x-1/2 -translate-y-1/2 w-12 bg-transparent text-center  outline-white"
          readOnly
        />
        <div
          className="absolute  p-4 top-1/2 -translate-y-1/2 -translate-x-1/2  transition-all ease-out duration-200 cursor-grab  active:cursor-grabbing group"
          style={{
            left: `${(minIndex / (rangeValues.length - 1)) * 100}%`,
        
           
          }}
          onMouseDown={() => startDrag("min")}
        >
          <div className="w-6 h-6 bg-black rounded-full shadow-sm border-white border-2 shadow-white transition-transform hover:scale-125 group-active:scale-125"></div>
        </div>
        <div
          className="absolute p-4 top-1/2 -translate-y-1/2  -translate-x-1/2 transition-all ease-out duration-200 cursor-grab  active:cursor-grabbing group"
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
