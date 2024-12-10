"use client";
import React, { useRef, useState, useEffect } from "react";

const Range = () => {
  const [minValue, setMinValue] = useState<number>(1);
  const [maxValue, setMaxValue] = useState<number>(100);
  const [rangeMin, setRangeMin] = useState<number>(minValue);
  const [rangeMax, setRangeMax] = useState<number>(maxValue);

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<any>()

  const [mappedMinHandle, setMappedMinHandle] = useState(0);
  const [mappedMaxHandle, setMappedMaxHandle] = useState(0);

  const isDragging = useRef(false);
  const currentHandle = useRef<string | null>(null);

  const refContainer = useRef<HTMLInputElement>(null);
  const refThumb = useRef<HTMLInputElement>(null);

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
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    };

    fetchResponse();
  }, []);

  const handleMouseMove = (e: any) => {
    if (
      !isDragging.current ||
      !currentHandle.current ||
      !refContainer.current ||
      !refThumb.current
    )
      return;

    const rect = refContainer.current.getBoundingClientRect();
    // const rectThumb = refThumb.current.getBoundingClientRect();
    const rectLeft = rect.left;
    const rectWidth = rect.width;
    const clickPosition = e.clientX - rectLeft;

    const newValue = Math.round(
      (clickPosition / rectWidth) * (maxValue - minValue) + minValue
    );

    if (currentHandle.current === "min") {
      if (newValue < rangeMax && newValue >= minValue) setRangeMin(newValue);
    } else {
      if (newValue > rangeMin && newValue <= maxValue) setRangeMax(newValue);
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

    if (rangeMin < minValue || rangeMin >= rangeMax) {
      setRangeMin(Math.min(minValue, rangeMax - 1));
    }

    if (rangeMax > maxValue || rangeMax <= rangeMin) {
      setRangeMax(Math.max(rangeMin + 1, maxValue));
    }
  }, [rangeMax, rangeMin, minValue, maxValue]);


  return (
    <div className="w-full relative ">
      {!loading?<><input
        type="number"
        value={rangeMin}
        min={minValue}
        max={rangeMax}
        className="absolute top-1/2 left-0 -translate-x-1/2 w-12  -translate-y-1/2 bg-transparent text-center border-2 border-white rounded-md outline-white"
        onChange={(e) => {
          const value = Number(e.target.value);
          setRangeMin(value);
        }}
   
      />
      <input
        type="number"
        value={rangeMax}
        min={rangeMin}
        max={maxValue}
        className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-12 bg-transparent text-center border-2 border-white rounded-md outline-white"
        onChange={(e) => {
          const value = Number(e.target.value);
          setRangeMax(value);
        }}
   
      /></>:''}

      <div ref={refContainer} className="w-[calc(100%-120px)] mx-auto relative">
        <div className="h-4 w-full bg-white rounded-full" />
      {!loading?  <>
        <div
          className="absolute  p-4 top-1/2 -translate-y-1/2 -translate-x-1/2  transition-all ease-out duration-200 cursor-grab  active:cursor-grabbing group"
          style={{
            left: `${mappedMaxHandle}%`,
          }}
          onMouseDown={(e) => startDrag(e, "max")}
        >
          <div className="w-6 h-6 bg-black rounded-full shadow-sm shadow-white border-2 transition-transform hover:scale-125"></div>
        </div>
        <div
          ref={refThumb}
          className="absolute p-4 top-1/2 -translate-y-1/2  -translate-x-1/2 transition-all ease-out duration-200 cursor-grab  active:cursor-grabbing group"
          onMouseDown={(e) => startDrag(e, "min")}
          style={{
            left: `${mappedMinHandle}%`,
          }}
        >
          <div className="w-6 h-6 bg-black rounded-full shadow-sm border-white border-2 shadow-white transition-transform hover:scale-125 group-active:scale-125"></div>
        </div>
        </>:''}
      </div>
    </div>
  );
};

export default Range;
