<template>
    <div dir="rtl" class="relative max-w-2xl mx-auto text-center rounded-3xl">
      <h2 class="text-2xl font-extrabold text-[#000000] text-d4">دقیق، کارآمد، بدون واسطه</h2>
      <p class="text-xs text mt-2">
        تمامی مراحل <span>چاپ</span> در مجموعه‌ی خود ما انجام میشه، بدون دخالت واسطه‌ها.
        
        ما فقط نمی‌فروشیم، ما <span>تولید</span> می‌کنیم و این یعنی:
      </p>



      <div class="mt-4 text-d4 flex flex-wrap flex-col justify-center items-center space-y-[7px] text-2xl font-black">
        <span class="highlight highlight-yellow">کیفیت بالاتر</span>
        <span class="highlight highlight-blue">کنترل بهتر روی جزئیات</span>
        <span class="highlight highlight-purple">قیمت منصفانه‌تر</span>
      </div>

    </div>
  </template>
  
  <style scoped>
  .text {
    font-family: 'IRANSansX', sans-serif;
    font-style: normal;
  }
  .text-d4{
    font-family: 'IRANSansX-d4', sans-serif;
    font-style: normal;
  }
  
  .highlight {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 0px 8px;
    border-radius: 12px;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1.2), box-shadow 0.4s ease-in-out;
    cursor: pointer;
  }
  
  .highlight-yellow { background: #F4FFD0; transform: rotate(-3deg); }
  .highlight-blue { background: #ADFAFF; transform: rotate(-4deg); }
  .highlight-purple { background: #B9ADFF; transform: rotate(3deg); }
  
  .highlight:hover { background: black; transform: rotate(0); color: white; }
  .text-demibold {
	font-weight: 600;
}
  </style>
