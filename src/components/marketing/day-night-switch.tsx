"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function DayNightSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div
      className="toggleWrapper"
      style={{
        "--dn-sky-day": "#83d8ff",
        "--dn-sky-label": "#749ed7",
        "--dn-sun": "#ffcf96",
        "--dn-sun-shadow": "rgba(0, 0, 0, 0.3)",
        "--dn-crater": "#e8cda5",
        "--dn-sky-night": "#749dd6",
        "--dn-moon": "#ffe5b5",
      } as React.CSSProperties}
    >
      <input
        className="input"
        id="dn"
        type="checkbox"
        checked={isDark}
        onChange={toggle}
        aria-label="Toggle theme mode"
      />
      <label className="toggle" htmlFor="dn">
        <span className="toggle__handler">
          <span className="crater crater--1" />
          <span className="crater crater--2" />
          <span className="crater crater--3" />
        </span>
        <span className="star star--1" />
        <span className="star star--2" />
        <span className="star star--3" />
        <span className="star star--4" />
        <span className="star star--5" />
        <span className="star star--6" />
      </label>

      <style jsx>{`
        .toggleWrapper {
          position: relative;
          overflow: hidden;
          color: white;
        }

        .input {
          position: absolute;
          left: -99em;
        }

        .toggle {
          cursor: pointer;
          display: inline-block;
          position: relative;
          width: 90px;
          height: 50px;
          background-color: var(--dn-sky-day);
          border-radius: 84px;
          transition: background-color 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
        }

        .toggle:before {
          content: "AM";
          position: absolute;
          left: -44px;
          top: 14px;
          font-size: 14px;
          color: var(--dn-sky-label);
        }

        .toggle:after {
          content: "PM";
          position: absolute;
          right: -42px;
          top: 14px;
          font-size: 14px;
        }

        .toggle__handler {
          display: inline-block;
          position: relative;
          z-index: 1;
          top: 3px;
          left: 3px;
          width: 44px;
          height: 44px;
          background-color: var(--dn-sun);
          border-radius: 50px;
          box-shadow: 0 2px 6px var(--dn-sun-shadow);
          transition: all 400ms cubic-bezier(0.25, 0.1, 0.25, 1);
          transform: rotate(-45deg);
        }

        .toggle__handler .crater {
          position: absolute;
          background-color: var(--dn-crater);
          opacity: 0;
          transition: opacity 200ms ease-in-out;
          border-radius: 100%;
        }

        .toggle__handler .crater--1 {
          top: 18px;
          left: 10px;
          width: 4px;
          height: 4px;
        }

        .toggle__handler .crater--2 {
          top: 28px;
          left: 22px;
          width: 6px;
          height: 6px;
        }

        .toggle__handler .crater--3 {
          top: 10px;
          left: 25px;
          width: 8px;
          height: 8px;
        }

        .star {
          position: absolute;
          background-color: #fff;
          transition: all 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
          border-radius: 50%;
        }

        .star--1 {
          top: 10px;
          left: 35px;
          z-index: 0;
          width: 30px;
          height: 3px;
        }

        .star--2 {
          top: 18px;
          left: 28px;
          z-index: 1;
          width: 30px;
          height: 3px;
        }

        .star--3 {
          top: 27px;
          left: 40px;
          z-index: 0;
          width: 30px;
          height: 3px;
        }

        .star--4,
        .star--5,
        .star--6 {
          opacity: 0;
          transition: all 300ms 0 cubic-bezier(0.445, 0.05, 0.55, 0.95);
        }

        .star--4 {
          top: 16px;
          left: 11px;
          z-index: 0;
          width: 2px;
          height: 2px;
          transform: translate3d(3px, 0, 0);
        }

        .star--5 {
          top: 32px;
          left: 17px;
          z-index: 0;
          width: 3px;
          height: 3px;
          transform: translate3d(3px, 0, 0);
        }

        .star--6 {
          top: 36px;
          left: 28px;
          z-index: 0;
          width: 2px;
          height: 2px;
          transform: translate3d(3px, 0, 0);
        }

        .input:checked + .toggle {
          background-color: var(--dn-sky-night);
        }

        .input:checked + .toggle:before {
          color: #fff;
        }

        .input:checked + .toggle:after {
          color: var(--dn-sky-label);
        }

        .input:checked + .toggle .toggle__handler {
          background-color: var(--dn-moon);
          transform: translate3d(40px, 0, 0) rotate(0);
        }

        .input:checked + .toggle .toggle__handler .crater {
          opacity: 1;
        }

        .input:checked + .toggle .star--1 {
          width: 2px;
          height: 2px;
        }

        .input:checked + .toggle .star--2 {
          width: 4px;
          height: 4px;
          transform: translate3d(-5px, 0, 0);
        }

        .input:checked + .toggle .star--3 {
          width: 2px;
          height: 2px;
          transform: translate3d(-7px, 0, 0);
        }

        .input:checked + .toggle .star--4,
        .input:checked + .toggle .star--5,
        .input:checked + .toggle .star--6 {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .input:checked + .toggle .star--4 {
          transition: all 300ms 200ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
        }

        .input:checked + .toggle .star--5 {
          transition: all 300ms 300ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
        }

        .input:checked + .toggle .star--6 {
          transition: all 300ms 400ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
        }
      `}</style>
    </div>
  );
}
