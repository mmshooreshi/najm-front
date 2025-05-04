<template>
    <div dir="rtl" class="relative max-w-2xl mx-auto text-center rounded-3xl mt-6 md:mt-0">
      <h2  v-motion-pop-visible  class="text-2xl font-extrabold text-[#000000] text-d4">بیشتر از یه چاپخونه، یه هم‌تیمی خوب</h2>
      <p   v-motion-pop-visible  class="text-sm text-d4 mt-4">
      
        از طراحی تا اجرا، همه چیز در یک مجموعه.
      <br>
         با راهکارهای خلاقانه و انعطاف‌پذیر ما اینجا هستیم تا داستان شما را تبدیل به یک تجربه‌ی ماندگار کنیم.      </p>



      <!-- <div class="mt-4 text-d4 flex flex-wrap flex-col justify-center items-center space-y-[7px] text-2xl font-black">
        <span class="highlight highlight-yellow">کیفیت بالاتر</span>
        <span class="highlight highlight-blue">کنترل بهتر روی جزئیات</span>
        <span class="highlight highlight-purple">قیمت منصفانه‌تر</span>
      </div> -->

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
