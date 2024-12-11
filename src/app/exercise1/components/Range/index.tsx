"use client";
import React, { useRef, useState, useEffect } from "react";

const Range = () => {
  const [minValue, setMinValue] = useState<number>(1);
  const [maxValue, setMaxValue] = useState<number>(100);
  const [rangeMin, setRangeMin] = useState<number>(2);
  const [rangeMax, setRangeMax] = useState<number>(40);

  const [mappedMinHandle, setMappedMinHandle] = useState(0);
  const [mappedMaxHandle, setMappedMaxHandle] = useState(0);

  const isDragging = useRef(false);
  const currentHandle = useRef<string | null>(null);

  const refContainer = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading,setLoading] = useState<boolean>(true)
  
  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await fetch("https://demo9065139.mockable.io/range");
        if (!response.ok) {
          throw Error("No response");
        } else {
          const data = await response.json();
          console.log(data);
          setMinValue(data.min);
          setMaxValue(data.max);
          setRangeMin(data.min);
          setRangeMax(data.max);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
          setError(true)
        } else {
          console.error("Unexpected error", err);
        }
       
      } finally {
         setLoading(false)
      }
    };

    fetchResponse();
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !currentHandle.current || !refContainer.current)
      return;

    const rect = refContainer.current.getBoundingClientRect();
    const rectLeft = rect.left;
    const rectWidth = rect.width;
    const clickPosition = e.clientX - rectLeft;

    const newValue = Math.round(
      (clickPosition / rectWidth) * (maxValue - minValue) + minValue
    );

    if (currentHandle.current === "min") {
      if (newValue >= minValue && newValue < rangeMax)
        setRangeMin(Math.max(minValue, Math.min(newValue, rangeMax)));
    } else {
      if (newValue > rangeMin && newValue <= maxValue)
        setRangeMax(Math.min(maxValue, Math.max(newValue, rangeMin)));
    }
  };

  const startDrag = (e: React.MouseEvent, handle: string) => {
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

  useEffect(() => {
    setMappedMinHandle(((rangeMin - minValue) / (maxValue - minValue)) * 100);
    setMappedMaxHandle(((rangeMax - minValue) / (maxValue - minValue)) * 100);
    setRangeMin((prev) => Math.max(minValue, Math.min(prev, rangeMax)));
    setRangeMax((prev) => Math.min(maxValue, Math.max(prev, rangeMin)));
  }, [minValue, maxValue, rangeMax, rangeMin]);

  const validateInput = (value: number, isMin: boolean) => {
    if (isMin) {
      return Math.min(value, maxValue - 1);
    } else {
      return Math.max(value, minValue + 1);
    }
  };
  const hasError = error ? <div className="text-red-500">Error fetching data</div> : null
  return (
    <>
    {hasError}
    {loading?'Loading...':
    <div className="w-full relative">
      <>
        <input
          type="number"
          value={minValue}
          min={minValue}
          max={rangeMax}
          className="absolute top-1/2 left-0 -translate-x-1/2 w-12  -translate-y-1/2 bg-transparent text-center border-2 border-white rounded-md outline-white"
          onChange={(e) => {
            const value = Number(e.target.value);
            setMinValue(validateInput(value, true));
          }}
        />
        <input
          type="number"
          min={minValue}
          max={rangeMax}
          value={maxValue}
          className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-12 bg-transparent text-center border-2 border-white rounded-md outline-white"
          onChange={(e) => {
            const value = Number(e.target.value);
            setMaxValue(validateInput(value, false));
          }}
        />
      </>

      <div ref={refContainer} className="w-[calc(100%-120px)] mx-auto relative">
        <div className="h-4 w-full bg-white rounded-full" />
        <>
          <div
            className="absolute z-20 top-1/2 -translate-y-1/2 -translate-x-1/2  transition-transform ease-out duration-200 cursor-grab  active:cursor-grabbing group"
            style={{
              left: `${mappedMaxHandle}%`,
            }}
            onMouseDown={(e) => startDrag(e, "max")}
          >
            <div className="absolute -translate-y-full left-1/2 -translate-x-1/2 select-none">
              {rangeMax}
            </div>

            <div className="w-6 h-6 bg-black rounded-full shadow-sm shadow-white border-2 transition-transform hover:scale-125"></div>
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2  -translate-x-1/2 transition-transform ease-out duration-200 cursor-grab  active:cursor-grabbing group"
            onMouseDown={(e) => startDrag(e, "min")}
            style={{
              left: `${mappedMinHandle}%`,
              transform: `translate(-50%, -50%) scale(${
                rangeMax - rangeMin < 3 ? 2 : 1
              })`,
            }}
          >
            <div className="absolute -translate-y-full left-1/2 -translate-x-1/2 select-none">
              {rangeMin}
            </div>
            <div className="w-6 h-6 bg-black rounded-full shadow-sm border-white border-2 shadow-white transition-transform hover:scale-125 group-active:scale-125"></div>
          </div>
        </>
      </div>
    </div>
    }
    </>
  );
};

export default Range;
