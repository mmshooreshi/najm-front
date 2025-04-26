<!-- components/Checkbox4.vue -->
<template>
    <div class="checkbox-wrapper-4">
        <svg class="inline-svg" aria-hidden="true">
        <symbol id="check-4" viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </symbol>
      </svg>

        <input
        :id="id"
        class="inp-cbx"
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <label class="cbx" :for="id">
  <span>
    <svg width="12" height="10"><use xlink:href="#check-4" /></svg>
  </span>
  <span><slot>{{ label }}</slot></span>
</label>

    </div>
  </template>
  
  <script setup>
//   import { useId } from '#app' // Nuxt utility to generate unique IDs
  
  // Props
  defineProps({
    /** The v-model binding (checked state) */
    modelValue: {
      type: Boolean,
      default: false
    },
    /** Fallback label text (or you can just slot it) */
    label: {
      type: String,
      default: ''
    },
    /** Optional id override; if not provided a unique one is generated */
    id: {
      type: String,
      default: () => useId('checkbox-4-')
    }
  })
  
  // Emit
  defineEmits(['update:modelValue'])
  </script>
  
  <style scoped>
  .checkbox-wrapper-4 * {
    box-sizing: border-box;
  }
  .checkbox-wrapper-4 .cbx {
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
    padding: 6px 8px;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.2s ease;
    display: inline-block;
  }
  .checkbox-wrapper-4 .cbx:not(:last-child) {
    margin-right: 6px;
  }
  .checkbox-wrapper-4 .cbx:hover {
    background: rgba(0,119,255,0.06);
  }
  .checkbox-wrapper-4 .cbx span {
    float: right;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
  }
  .checkbox-wrapper-4 .cbx span:first-child {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    transform: scale(1);
    border: 1px solid #cccfdb;
    transition: all 0.2s ease;
    box-shadow: 0 1px 1px rgba(0,16,75,0.05);
  }
  .checkbox-wrapper-4 .cbx span:first-child svg {
    position: absolute;
    top: 3px;
    left: 2px;
    fill: none;
    stroke: #fff;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 16px;
    stroke-dashoffset: 16px;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
  }
  .checkbox-wrapper-4 .cbx span:last-child {
    padding-right: 10px;
    line-height: 18px;
  }
  .checkbox-wrapper-4 .cbx:hover span:first-child {
    border-color: #07f;
  }
  .checkbox-wrapper-4 .inp-cbx {
    position: absolute;
    visibility: hidden;
  }
  .checkbox-wrapper-4 .inp-cbx:checked + .cbx span:first-child {
    background: #07f;
    border-color: #07f;
    animation: wave-4 0.4s ease;
  }
  .checkbox-wrapper-4 .inp-cbx:checked + .cbx span:first-child svg {
    stroke-dashoffset: 0;
  }
  .checkbox-wrapper-4 .inline-svg {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
    user-select: none;
  }
  @media screen and (max-width: 640px) {
    .checkbox-wrapper-4 .cbx {
      width: 100%;
      display: inline-block;
    }
  }
  @keyframes wave-4 {
    50% { transform: scale(0.9); }
  }
  </style>
  