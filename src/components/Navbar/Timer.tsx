"use client";

import "./style.css";

import { DarkModeState } from "@/store/ProfileStore";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

const Timer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const startTime = useRef<Date>();
  const isRunningRef = useRef(false);

  const start = () => {
    isRunningRef.current = true;
    setIsRunning(true);
    // counterRef.current = 600;
    // setCounter(600);
    startTime.current = new Date();
  };

  const stop = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    // setCounter(0);
    // counterRef.current = 0;
    startTime.current = undefined;
    setCounter(0);
  };

  const [counter, setCounter] = useState(0);
  const counterRef = useRef(0);

  useEffect(() => {
    // counterRef.current > 1 &&
    //   setTimeout(() => {
    //     const _new = counterRef.current - 1;
    //     counterRef.current = _new;
    //     setCounter(_new);
    //   }, 1000);
    updateTime();
  }, []);

  const updateTime = () => {
    if (isRunningRef.current && startTime.current) {
      setCounter(
        Math.round((new Date().getTime() - startTime.current.getTime()) / 1000)
      );
    }
    setTimeout(() => updateTime(), 1000);
  };

  return (
    <div className="timer">
      {isRunning && (
        <div>{`${Math.floor(counter / 60)}:${
          counter - Math.floor(counter / 60) * 60
        }`}</div>
      )}
      {isRunning && (
        <button onClick={stop}>
          <FontAwesomeIcon icon={faStop} />
        </button>
      )}
      {!isRunning && (
        <button onClick={start}>
          <FontAwesomeIcon icon={faPlay} />
        </button>
      )}
    </div>
  );
};

export default Timer;
