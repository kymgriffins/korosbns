
import React from 'react';
import styled from 'styled-components';

const Switch = () => {
  return (
    <StyledWrapper>
      <div>
        <input type="checkbox" id="checkbox" />
        <label htmlFor="checkbox" className="toggle">
          <div className="bars" id="bar1" />
          <div className="bars" id="bar2" />
          <div className="bars" id="bar3" />
        </label>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  #checkbox {
    display: none;
  }

  .toggle {
    position: relative;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition-duration: .5s;
  }

  .bars {
    width: 100%;
    height: 4px;
    background-color: rgb(176, 92, 255);
    border-radius: 4px;
  }

  #bar2 {
    transition-duration: .8s;
  }

  #bar1,#bar3 {
    width: 70%;
  }

  #checkbox:checked + .toggle .bars {
    position: absolute;
    transition-duration: .5s;
  }

  #checkbox:checked + .toggle #bar2 {
    transform: scaleX(0);
    transition-duration: .5s;
  }

  #checkbox:checked + .toggle #bar1 {
    width: 100%;
    transform: rotate(45deg);
    transition-duration: .5s;
  }

  #checkbox:checked + .toggle #bar3 {
    width: 100%;
    transform: rotate(-45deg);
    transition-duration: .5s;
  }

  #checkbox:checked + .toggle {
    transition-duration: .5s;
    transform: rotate(180deg);
  }`;

export default Switch;
import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        <div className="top">
          <div className="pfp">
            <div className="playing">
              <div className="greenline line-1" />
              <div className="greenline line-2" />
              <div className="greenline line-3" />
              <div className="greenline line-4" />
              <div className="greenline line-5" />
            </div>
          </div>
          <div className="texts">
            <p className="title-1">Soldiers Rage</p>
            <p className="title-2">Tha Mechanic</p>
          </div>
        </div>
        <div className="controls">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={20} width={24} className="volume_button">
            <path clipRule="evenodd" d="M11.26 3.691A1.2 1.2 0 0 1 12 4.8v14.4a1.199 1.199 0 0 1-2.048.848L5.503 15.6H2.4a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 1.2 0 0 1 1.2-1.2h3.103l4.449-4.448a1.2 1.2 0 0 1 1.308-.26Zm6.328-.176a1.2 1.2 0 0 1 1.697 0A11.967 11.967 0 0 1 22.8 12a11.966 11.966 0 0 1-3.515 8.485 1.2 1.2 0 0 1-1.697-1.697A9.563 9.563 0 0 0 20.4 12a9.565 9.565 0 0 0-2.812-6.788 1.2 1.2 0 0 1 0-1.697Zm-3.394 3.393a1.2 1.2 0 0 1 1.698 0A7.178 7.178 0 0 1 18 12a7.18 7.18 0 0 1-2.108 5.092 1.2 1.2 0 1 1-1.698-1.698A4.782 4.782 0 0 0 15.6 12a4.78 4.78 0 0 0-1.406-3.394 1.2 1.2 0 0 1 0-1.698Z" fillRule="evenodd" />
          </svg>
          <div className="volume">
            <div className="slider">
              <div className="green" />
            </div>
            <div className="circle" />
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={24} width={24}>
            <path clipRule="evenodd" d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm.848-12.352a1.2 1.2 0 0 0-1.696-1.696l-3.6 3.6a1.2 1.2 0 0 0 0 1.696l3.6 3.6a1.2 1.2 0 0 0 1.696-1.696L11.297 13.2H15.6a1.2 1.2 0 1 0 0-2.4h-4.303l1.551-1.552Z" fillRule="evenodd" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={24} width={24}>
            <path clipRule="evenodd" d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z" fillRule="evenodd" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" height={24} width={24}>
            <path clipRule="evenodd" d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm4.448-10.448-3.6-3.6a1.2 1.2 0 0 0-1.696 1.696l1.551 1.552H8.4a1.2 1.2 0 1 0 0 2.4h4.303l-1.551 1.552a1.2 1.2 0 1 0 1.696 1.696l3.6-3.6a1.2 1.2 0 0 0 0-1.696Z" fillRule="evenodd" />
          </svg>
          <div className="air" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="none" height={20} width={24}>
            <path d="M3.343 7.778a4.5 4.5 0 0 1 7.339-1.46L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 20.364l-7.682-7.682a4.501 4.501 0 0 1-.975-4.904Z" />
          </svg>
        </div>
        <div className="time">
          <div className="elapsed" />
        </div>
        <p className="timetext time_now">1:31</p>
        <p className="timetext time_full">3:46</p>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* Spotify music card made by: csozi | Website: www.csozi.hu*/

  .card {
    position: relative;
    width: 250px;
    height: 120px;
    background: #191414;
    border-radius: 10px;
    padding: 10px;
  }

  .top {
    position: relative;
    width: 100%;
    display: flex;
    gap: 10px;
  }

  .pfp {
    position: relative;
    top: 5px;
    left: 5px;
    height: 40px;
    width: 40px;
    background-color: #d2d2d2;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title-1 {
    color: white;
    font-size: 25px;
    font-weight: bolder;
  }

  .title-2 {
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  .time {
    width: 90%;
    background-color: #5e5e5e;
    height: 6px;
    border-radius: 3px;
    position: absolute;
    left: 5%;
    bottom: 22px;
  }

  .elapsed {
    width: 42%;
    background-color: #1db954;
    height: 100%;
    border-radius: 3px;
  }

  .controls {
    color: white;
    display: flex;
    position: absolute;
    bottom: 30px;
    left: 0;
    width: 100%;
    justify-content: center;
  }

  .volume {
    height: 100%;
    width: 48px;
  }

  .air {
    height: 100%;
    width: 48px;
  }

  .controls svg {
    cursor: pointer;
    transition: 0.1s;
  }

  .controls svg:hover {
    color: #1db954;
  }

  .volume {
    opacity: 0;
    position: relative;
    transition: 0.2s;
  }

  .volume .slider {
    height: 4px;
    background-color: #5e5e5e;
    width: 80%;
    border-radius: 2px;
    margin-top: 8px;
    margin-left: 10%;
  }

  .volume .slider .green {
    background-color: #1db954;
    height: 100%;
    width: 80%;
    border-radius: 3px;
  }

  .volume .circle {
    background-color: white;
    height: 6px;
    width: 6px;
    border-radius: 3px;
    position: absolute;
    right: 20%;
    top: 60%;
  }

  .volume_button:hover ~ .volume {
    opacity: 1;
  }

  .timetext {
    color: white;
    font-size: 8px;
    position: absolute;
  }

  .time_now {
    bottom: 11px;
    left: 10px;
  }

  .time_full {
    bottom: 11px;
    right: 10px;
  }

  .playing {
    display: flex;
    position: relative;
    justify-content: center;
    gap: 1px;
    width: 30px;
    height: 20px;
  }

  .greenline {
    background-color: #1db954;
    height: 20px;
    width: 2px;
    position: relative;
    transform-origin: bottom;
  }

  .line-1 {
    animation: infinite playing 1s ease-in-out;
    animation-delay: 0.2s;
  }

  .line-2 {
    animation: infinite playing 1s ease-in-out;
    animation-delay: 0.5s;
  }

  .line-3 {
    animation: infinite playing 1s ease-in-out;
    animation-delay: 0.6s;
  }

  .line-4 {
    animation: infinite playing 1s ease-in-out;
    animation-delay: 0s;
  }

  .line-5 {
    animation: infinite playing 1s ease-in-out;
    animation-delay: 0.4s;
  }

  @keyframes playing {
    0% {
      transform: scaleY(0.1);
    }

    33% {
      transform: scaleY(0.6);
    }

    66% {
      transform: scaleY(0.9);
    }

    100% {
      transform: scaleY(0.1);
    }
  }`;

export default Card;
import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card work">
        <div className="img-section">
          <svg xmlns="http://www.w3.org/2000/svg" height={77} width={76}><path fillRule="nonzero" fill="#3F9CBB" d="m60.91 71.846 12.314-19.892c3.317-5.36 3.78-13.818-2.31-19.908l-26.36-26.36c-4.457-4.457-12.586-6.843-19.908-2.31L4.753 15.69c-5.4 3.343-6.275 10.854-1.779 15.35a7.773 7.773 0 0 0 7.346 2.035l7.783-1.945a3.947 3.947 0 0 1 3.731 1.033l22.602 22.602c.97.97 1.367 2.4 1.033 3.732l-1.945 7.782a7.775 7.775 0 0 0 2.037 7.349c4.49 4.49 12.003 3.624 15.349-1.782Zm-24.227-46.12-1.891-1.892-1.892 1.892a2.342 2.342 0 0 1-3.312-3.312l1.892-1.892-1.892-1.891a2.342 2.342 0 0 1 3.312-3.312l1.892 1.891 1.891-1.891a2.342 2.342 0 0 1 3.312 3.312l-1.891 1.891 1.891 1.892a2.342 2.342 0 0 1-3.312 3.312Zm14.19 14.19a2.343 2.343 0 1 1 3.315-3.312 2.343 2.343 0 0 1-3.314 3.312Zm0 7.096a2.343 2.343 0 0 1 3.313-3.312 2.343 2.343 0 0 1-3.312 3.312Zm7.096-7.095a2.343 2.343 0 1 1 3.312 0 2.343 2.343 0 0 1-3.312 0Zm0 7.095a2.343 2.343 0 0 1 3.312-3.312 2.343 2.343 0 0 1-3.312 3.312Z" /></svg>              </div>
        <div className="card-desc">
          <div className="card-header">
            <div className="card-title">Play</div>
            <div className="card-menu">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
          </div>
          <div className="card-time">32hrs</div>
          <p className="recent">Last Week-36hrs</p>
        </div></div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
   --primary-clr: #1C204B;
   --dot-clr: #BBC0FF;
   --play: hsl(195, 74%, 62%);
   width: 200px;
   height: 170px;
   border-radius: 10px;
  }

  .card {
   font-family: "Arial";
   color: #fff;
   display: grid;
   cursor: pointer;
   grid-template-rows: 50px 1fr;
  }

  .card:hover .img-section {
   transform: translateY(1em);
  }

  .card-desc {
   border-radius: 10px;
   padding: 15px;
   position: relative;
   top: -10px;
   display: grid;
   gap: 10px;
   background: var(--primary-clr);
  }

  .card-time {
   font-size: 1.7em;
   font-weight: 500;
  }

  .img-section {
   transition: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
   border-top-left-radius: 10px;
   border-top-right-radius: 10px;
   background: hsl(195, 74%, 62%);
  }

  .card-header {
   display: flex;
   align-items: center;
   width: 100%;
  }

  .card-title {
   flex: 1;
   font-size: 0.9em;
   font-weight: 500;
  }

  .card-menu {
   display: flex;
   gap: 4px;
   margin-inline: auto;
  }

  .card svg {
   float: right;
   max-width: 100%;
   max-height: 100%;
  }

  .card .dot {
   width: 5px;
   height: 5px;
   border-radius: 50%;
   background: var(--dot-clr);
  }

  .card .recent {
   line-height: 0;
   font-size: 0.8em;
  }`;

export default Card;
