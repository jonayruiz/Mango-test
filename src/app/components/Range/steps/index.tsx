"use client";
import React, { useRef, useState, useEffect } from "react";

const Range = () => {
  const [rangeValues, setRangeValues] = useState<number[]>();
  const [minIndex, setMinIndex] = useState<number>(0);
  const [maxIndex, setMaxIndex] = useState<number>(0);

  const isDragging = useRef(false);
  const currentHandle = useRef<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await fetch("http://demo6457468.mockable.io/range2");
        if (!response.ok) {
          throw Error("No response");
        } else {
          const data = await response.json();
          const sortedSteps =
            data.steps?.sort((a: number, b: number) => a - b) || [];

          setRangeValues(sortedSteps);
          setMinIndex(0);
          setMaxIndex(sortedSteps.length - 1);
        }
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchResponse();
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !currentHandle.current || !containerRef.current)
      return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickPosition / rect.width));
    const closestIndex = rangeValues
      ? Math.round(percentage * (rangeValues.length - 1))
      : 0;

    if (currentHandle.current === "min") {
      if (closestIndex < (maxIndex ?? 0)) setMinIndex(closestIndex);
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
  const hasError = error ? (
    <div className="text-red-500">Error fetching data</div>
  ) : null;
  return (
    <div className="w-full flex flex-col items-center">
      {hasError}
      {loading ? (
        "Loading..."
      ) : (
        <div
          ref={containerRef}
          className="relative w-[calc(100%-120px)] h-4 bg-gray-300 rounded-full"
        >
          <div className="absolute pointer-events-none top-0 -translate-y-full pb-2 -left-[4%]  w-[108%] flex justify-between">
            {rangeValues?.map((o, i) => {
              return (
                <div key={`rangeValues-${i}`} className="relative select-none">
                  {o}
                </div>
              );
            })}
          </div>
          <div
            className="absolute top-0 h-full bg-blue-600 rounded-full"
            style={{
              left: `${
                rangeValues ? (minIndex / (rangeValues.length - 1)) * 100 : ""
              }%`,
              right: `${
                rangeValues
                  ? 100 - (maxIndex / (rangeValues.length - 1)) * 100
                  : ""
              }%`,
            }}
          />
          <input
            type="number"
            value={rangeValues?.[minIndex]}
            readOnly
            className="absolute pointer-events-none select-none selection:bg-transparent top-1/2 -left-16  max-w-20 -translate-x-1/2 border-2 border-white rounded-md   -translate-y-1/2 bg-transparent text-center outline-white"
          />
          <input
            type="number"
            value={rangeValues?.[maxIndex]}
            className="absolute  pointer-events-none select-none selection:bg-transparent top-1/2 -right-16 max-w-20 translate-x-1/2  border-2 border-white rounded-md -translate-y-1/2  bg-transparent text-center  outline-white"
            readOnly
          />
          <div
            className="absolute  p-4 top-1/2 -translate-y-1/2 -translate-x-1/2  transition-transform ease-out duration-200 cursor-grab  active:cursor-grabbing group"
            style={{
              left: `${
                rangeValues ? (minIndex / (rangeValues.length - 1)) * 100 : ""
              }%`,
            }}
            onMouseDown={() => startDrag("min")}
          >
            <div className="w-6 h-6 bg-black rounded-full shadow-sm border-white border-2 shadow-white transition-transform hover:scale-125 group-active:scale-125"></div>
          </div>
          <div
            className="absolute p-4 top-1/2 -translate-y-1/2  -translate-x-1/2 transition-transform ease-out duration-200 cursor-grab  active:cursor-grabbing group"
            style={{
              left: `${
                rangeValues ? (maxIndex / (rangeValues.length - 1)) * 100 : ""
              }%`,
            }}
            onMouseDown={() => startDrag("max")}
          >
            <div className="w-6 h-6 bg-black rounded-full shadow-sm border-white border-2 shadow-white transition-transform hover:scale-125 group-active:scale-125"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Range;
