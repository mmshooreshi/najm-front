<template>
    <button class="button">
      <!-- Rotating text along a circular path -->
      <svg class="text-circle" viewBox="0 0 200 200">
        <defs>
            <path id="circlePath" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"/>
            

          <!-- <path d="M180,100 A80,80 0 1,0 20,100 A80,80 0 1,0 180,100" /> -->

          <circle  cx="100" cy="100" r="80" />

        </defs>
        <text class="text-d4 circle-text" fill="currentColor"  stroke="currentColor" stroke-width="0" dominant-baseline="bottom" dy="15" >
          <textPath method="align" startOffset="25%" text-anchor="middle" href="#circlePath">
            مشاوره‌‌ی  رایگان
          </textPath>
        </text>

        <text class="text-d4 circle-text" fill="currentColor"  stroke="currentColor" stroke-width="0" dominant-baseline="bottom" dy="15">
            <textPath startOffset="75%" text-anchor="middle" href="#circlePath">
            مشاوره‌‌ی  رایگان
          </textPath>
        </text>

      </svg>
  
      <!-- Icon container -->
      <div class="icon-container -scale-x-100">
        <svg
          viewBox="0 0 14 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="icon send"
          width="14"
        >
          <path
            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
            fill="currentColor"
          />
        </svg>
        <svg
          viewBox="0 0 14 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="icon copy"
          width="14"
        >
          <path
            d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
            fill="black"
          />
        </svg>
      </div>
    </button>
  </template>
  
  <style scoped>
  .button {
    position: relative;
    width: 100px;
    height: 100px;
    border: none;
    border-radius: 50%;
    background: #014439;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    overflow: hidden;
    transition: background 300ms, transform 200ms;
  }
  
  .text-circle {
    width: 100%;
    height: 100%;
    animation: rotate 8s linear infinite;
    transform-origin: center center;
    direction: rtl !important;
  unicode-bidi: bidi-override !important;

  }
  
  .circle-text {
    font-size: 25px;
    /* font-weight: 900; */
    letter-spacing: 5px;
    /* fill: currentColor; */
    /* text-shadow: 0.1px 0 currentColor, -0.1px 0 currentColor; */
    direction: rtl !important;
  unicode-bidi: bidi-override !important;


  }
  
  .icon-container {
    position: absolute;
    width: 40px;
    height: 40px;
    background: #fff;
    color: #014439;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  
  .icon {
    position: absolute;
    width: 14px;
    height: 15px;
    transition: transform 0.3s ease-in-out;
  }
  
  .icon.copy {
    transform: translate(150%, 150%);
    transition-delay: 0.1s;
  }
  
  .button:hover {
    background: #000;
    transform: scale(1.05);
  }
  
  .button:hover .icon.send {
    transform: translate(-150%, -150%);
    
  }
  
  .button:hover .icon.copy {
    transform: translate(0, 0);
  }
  
  @keyframes rotate {
    to {
      transform: rotate(-360deg);
    }
  }
  </style>
  