<!-- components/sections/CustomPackage.vue -->
<template>
    <div dir="rtl" class="transition-all text-d4 flex flex-col items-start w-full h-full max-w-3xl  bg-[#DFEED7]/100  rounded-3xl p-6 ">
      <!-- Header Icon -->
      <div class="p-2 flex  bg-[#EAFED3]/100  self-start items-center justify-center rounded-3xl ">
        <PuzzleIcon />
      </div>
  
      <!-- Title -->
      <h2 class="text-lg font-extrabold text-center mt-4">
        پکیج اختصاصی خودتو بساز!
      </h2>
  
      <!-- Description -->
      <p class="text-xs  mt-1 text-gray-700 leading-4">
        محصولاتتو توی یه پکیج سفارشی انتخاب کن یا به پکیج‌های موجود اضافه کن و به ازای هر آیتم، تخفیف بیشتری بگیر! هرچقدر لیست بزرگ‌تر بشه،
        قیمتش کمتر میشه.
      </p>
  
      <!-- Package Selection Icons -->
      <div class="flex flex-col items-center mt-6 space-y-0 mx-auto">
        <div class="hover:-translate-y-1 hover:rotate-[5deg] hover:scale-101 transition-all duration-300 cursor-pointer grid grid-cols-3 gap-0 bg-white/50 px-2 py-2 rounded-full  rotate-[12deg] translate-x-[10px]">
            <div class="flex items-center justify-center">
                <CloseIcon/>
            </div>
            <div class="flex items-center justify-center">
            <CheckIcon/>
            </div>
            <div class="flex items-center justify-center">
            <BagIcon/>
            </div>
        </div>
        <div class="hover:-translate-y-[5px] hover:rotate-[-5deg] hover:scale-101 transition-all duration-300 cursor-pointer grid grid-cols-3 gap-0 bg-white/81 px-2 py-2 rounded-full  rotate-[-12deg] -translate-x-[27px]">
            <div class="flex items-center justify-center">
                <CloseIcon/>
            </div>
            <div class="flex items-center justify-center">
            <CheckIcon/>
            </div>
            <div class="flex items-center justify-center">
            <StickerIcon/>
            </div>
        </div>
        <div class="hover:-translate-y-[30px] hover:scale-101 transition-all duration-300 cursor-pointer grid grid-cols-3 gap-0 bg-white px-2 py-2 rounded-full  translate-x-[40px] -translate-y-[27px]">
            <div class="flex items-center justify-center">
                <CloseIcon/>
            </div>
            <div class="flex items-center justify-center">
            <CheckIcon/>
            </div>
            <div class="flex items-center justify-center">
            <ReceiptIcon/>
            </div>
        </div>
        <div class="hover:-translate-y-[30px] hover:scale-101 transition-all duration-300 cursor-pointer grid grid-cols-2 gap-1 bg-white px-2 py-2 rounded-full  -translate-x-[24px] -translate-y-[23px]">
            <div class="flex items-center justify-center">
                <CircleIcon/>
            </div>
            <div class="flex items-center justify-center">
            <MapIcon/>
            </div>
        </div>
        <div class="cursor-pointer hover:bg-black/25  grid grid-cols-1 gap-1 bg-white px-2 py-2 rounded-full  border-dashed border border-black border-1 translate-x-[40px] -translate-y-[57px]">
            <div class=" flex items-center justify-center">
                <PlusIcon/>
            </div>
        </div>
        <div class="cursor-pointer hover:bg-black/25 grid grid-cols-2 border border-[1.5px] bg-opacity-0 border-dashed border-[#BEDFAC] gap-1 bg-white px-2 py-2 rounded-full ">
            <div class="flex items-center justify-center">
                
                <PlusCircleIcon/>
            </div>
            <div class="flex items-center justify-center">
                <HelpCircleIcon/>
            </div>
        </div>

    </div>

      <!-- Button -->
      <button class="hover:tracking-wide transition-all mx-auto mt-6 bg-white text-xs text-d4 text-demibold px-6 py-3 rounded-full ">
        ساخت پکیج اختصاصی
      </button>

    </div>
  </template>
  
  <script setup lang="ts">
  import PuzzleIcon from "~/assets/icons/Custom/puzzle-icon.svg";
  import CheckIcon from "~/assets/icons/Custom/check-circle-icon.svg";
  import CloseIcon from "~/assets/icons/Custom/close-circle-icon.svg";
  import BagIcon from "~/assets/icons/Custom/shopping-bag-icon.svg";
  import PlusIcon from "~/assets/icons/Custom/plus-icon-2.svg";
  import StickerIcon from "~/assets/icons/Custom/sticker-circle-icon.svg";
  import ReceiptIcon from "~/assets/icons/Custom/receipt-icon.svg";
  import MapIcon from "~/assets/icons/Custom/map-icon.svg";
  import CircleIcon from "~/assets/icons/Custom/circle-icon.svg";

  import HelpCircleIcon from "~/assets/icons/Custom/help-circle-icon.svg";
  import PlusCircleIcon from "~/assets/icons/Custom/plus-circle-icon.svg";


  </script>
  