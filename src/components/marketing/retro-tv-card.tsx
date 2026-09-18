"use client";

export default function RetroTvCard() {
  return (
    <div
      className="main_wrapper"
      style={{
        "--tv-orange": "#f27405",
        "--tv-orange-dark": "#a85103",
        "--tv-dark": "#171717",
        "--tv-grey": "#353535",
        "--tv-silver": "#979797",
        "--tv-body": "#d36604",
        "--tv-border": "#1d0e01",
        "--tv-highlight": "#e69635",
        "--tv-screen-text": "#252525",
        "--tv-button": "#7f5934",
        "--tv-button-highlight": "#b49577",
        "--tv-button-shadow": "#513721",
        "--tv-base": "#4d4d4d",
      } as React.CSSProperties}
    >
      <div className="main">
        <div className="antenna">
          <div className="antenna_shadow" />
          <div className="a1" />
          <div className="a1d" />
          <div className="a2" />
          <div className="a2d" />
        </div>
        <div className="tv">
          <div className="display_div">
            <div className="screen_out">
              <div className="screen_out1">
                <div className="screen">
                  <span className="notfound_text">NOT FOUND</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lines">
            <div className="line1" />
            <div className="line2" />
            <div className="line3" />
          </div>
          <div className="buttons_div">
            <div className="b1">
              <div />
            </div>
            <div className="b2" />
            <div className="speakers">
              <div className="g1">
                <div className="g11" />
                <div className="g12" />
                <div className="g13" />
              </div>
              <div className="g" />
              <div className="g" />
            </div>
          </div>
        </div>
        <div className="bottom">
          <div className="base1" />
          <div className="base2" />
          <div className="base3" />
        </div>
      </div>
      <div className="text_404">
        <div className="text_4041">4</div>
        <div className="text_4042">0</div>
        <div className="text_4043">4</div>
      </div>

      <style jsx>{`
        .main_wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: min(100%, 30em);
          height: 25em;
          transform: scale(0.85);
        }

        .main {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 5em;
          position: relative;
        }

        .antenna {
          width: 5em;
          height: 5em;
          border-radius: 50%;
          border: 2px solid black;
          background-color: var(--tv-orange);
          margin-bottom: -6em;
          z-index: -1;
        }
        .antenna_shadow {
          position: absolute;
          background-color: transparent;
          width: 50px;
          height: 56px;
          margin-left: 1.68em;
          border-radius: 45%;
          transform: rotate(140deg);
          border: 4px solid transparent;
          box-shadow: inset 0px 16px var(--tv-orange-dark), inset 0px 16px 1px 1px var(--tv-orange-dark);
        }
        .a1 {
          position: relative;
          top: -102%;
          left: -130%;
          width: 12em;
          height: 5.5em;
          border-radius: 50px;
          background-image: linear-gradient(var(--tv-dark), var(--tv-dark), var(--tv-grey), var(--tv-grey), var(--tv-dark));
          transform: rotate(-29deg);
          clip-path: polygon(50% 0%, 49% 100%, 52% 100%);
        }
        .a1d {
          position: relative;
          top: -211%;
          left: -35%;
          transform: rotate(45deg);
          width: 0.5em;
          height: 0.5em;
          border-radius: 50%;
          border: 2px solid black;
          background-color: var(--tv-silver);
          z-index: 99;
        }
        .a2 {
          position: relative;
          top: -210%;
          left: -10%;
          width: 12em;
          height: 4em;
          border-radius: 50px;
          background-image: linear-gradient(var(--tv-dark), var(--tv-dark), var(--tv-grey), var(--tv-grey), var(--tv-dark));
          margin-right: 5em;
          clip-path: polygon(47% 0, 47% 0, 34% 34%, 54% 25%, 32% 100%, 29% 96%, 49% 32%, 30% 38%);
          transform: rotate(-8deg);
        }
        .a2d {
          position: relative;
          top: -294%;
          left: 94%;
          width: 0.5em;
          height: 0.5em;
          border-radius: 50%;
          border: 2px solid black;
          background-color: var(--tv-silver);
          z-index: 99;
        }

        .notfound_text {
          background-color: black;
          padding-left: 0.3em;
          padding-right: 0.3em;
          font-size: 0.75em;
          color: white;
          border-radius: 5px;
          z-index: 10;
        }
        .tv {
          width: 17em;
          height: 9em;
          margin-top: 3em;
          border-radius: 15px;
          background-color: var(--tv-body);
          display: flex;
          justify-content: center;
          border: 2px solid var(--tv-border);
          box-shadow: inset 0.2em 0.2em var(--tv-highlight);
          position: relative;
        }
        .display_div {
          display: flex;
          align-items: center;
          align-self: center;
          justify-content: center;
          border-radius: 15px;
          box-shadow: 3.5px 3.5px 0px var(--tv-highlight);
        }
        .screen_out1 {
          width: 11em;
          height: 7.75em;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }
        .screen {
          width: 13em;
          height: 7.85em;
          border: 2px solid var(--tv-border);
          background: repeating-radial-gradient(#000 0 0.0001%, #fff 0 0.0002%) 50% 0/2500px 2500px,
            repeating-conic-gradient(#000 0 0.0001%, #fff 0 0.0002%) 60% 60%/2500px 2500px;
          background-blend-mode: difference;
          animation: b 0.2s infinite alternate;
          border-radius: 10px;
          z-index: 99;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: var(--tv-screen-text);
          letter-spacing: 0.15em;
          text-align: center;
        }
        @keyframes b {
          100% {
            background-position: 50% 0, 60% 50%;
          }
        }

        .lines {
          display: flex;
          column-gap: 0.1em;
          align-self: flex-end;
          margin-left: 0.4em;
        }
        .line1,
        .line3 {
          width: 2px;
          height: 0.5em;
          background-color: black;
          border-radius: 25px 25px 0px 0px;
          margin-top: 0.5em;
        }
        .line2 {
          width: 2px;
          height: 1em;
          background-color: black;
          border-radius: 25px 25px 0px 0px;
        }

        .buttons_div {
          width: 4.25em;
          align-self: center;
          height: 8em;
          background-color: var(--tv-highlight);
          border: 2px solid var(--tv-border);
          padding: 0.6em;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          row-gap: 0.75em;
          box-shadow: 3px 3px 0px var(--tv-highlight);
          margin-left: 0.6em;
        }
        .b1,
        .b2 {
          width: 1.65em;
          height: 1.65em;
          border-radius: 50%;
          background-color: var(--tv-button);
          border: 2px solid black;
          box-shadow: inset 2px 2px 1px var(--tv-button-highlight), -2px 0px var(--tv-button-shadow), -2px 0px 0px 1px black;
        }
        .b1 div {
          position: absolute;
          margin-top: -0.1em;
          margin-left: 0.65em;
          transform: rotate(45deg);
          width: 0.15em;
          height: 1.5em;
          background-color: #000;
        }

        .speakers {
          display: flex;
          flex-direction: column;
          row-gap: 0.5em;
        }
        .g1 {
          display: flex;
          column-gap: 0.25em;
        }
        .g11,
        .g12,
        .g13 {
          width: 0.65em;
          height: 0.65em;
          border-radius: 50%;
          background-color: var(--tv-button);
          border: 2px solid black;
          box-shadow: inset 1.25px 1.25px 1px var(--tv-button-highlight);
        }
        .g {
          width: auto;
          height: 2px;
          background-color: var(--tv-dark);
        }

        .bottom {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          column-gap: 8.7em;
        }
        .base1,
        .base2 {
          height: 1em;
          width: 2em;
          border: 2px solid var(--tv-dark);
          background-color: var(--tv-base);
          margin-top: -0.15em;
          z-index: -1;
        }
        .base3 {
          position: absolute;
          height: 0.15em;
          width: 17.5em;
          background-color: var(--tv-dark);
          margin-top: 0.8em;
        }

        .text_404 {
          position: absolute;
          display: flex;
          flex-direction: row;
          column-gap: 6em;
          z-index: -5;
          margin-bottom: 2em;
          align-items: center;
          justify-content: center;
          opacity: 0.3;
          font-family: Geist, system-ui, sans-serif;
        }
        .text_4041,
        .text_4042,
        .text_4043 {
          transform: scaleY(20) scaleX(8);
          color: #ffffff30;
        }
      `}</style>
    </div>
  );
}
