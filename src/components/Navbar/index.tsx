"use client";

import Link from "next/link";
import "./style.css";
import { Button, IconButton } from "basicui";
import { DarkModeState } from "@/store/ProfileStore";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    DarkModeState.subscribe((message) => {
      setDarkMode(message);
    });
  }, []);

  const toggleDarkMode = () => {
    DarkModeState.next(!DarkModeState.value);
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/project/list">All projects</Link>
        </li>
      </ul>
      <div>
        {darkMode && (
          <IconButton onClick={toggleDarkMode} circle={true}>
          <FontAwesomeIcon icon={faSun} size="xs" />
          </IconButton>
        )}
        {!darkMode && (
          <IconButton onClick={toggleDarkMode} circle={true}>
          <FontAwesomeIcon icon={faMoon} size="xs" />
          </IconButton>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
