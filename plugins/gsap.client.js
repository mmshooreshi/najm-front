import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { SplitText } from 'gsap/SplitText'
import {CustomEase} from 'gsap/CustomEase'
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Flip } from 'gsap/Flip'

import { Draggable } from 'gsap/Draggable';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother, Draggable, MotionPathPlugin);
    
  }

  // nuxtApp.provide('gsap', gsap)
  // nuxtApp.provide('Draggable', Draggable)
  // nuxtApp.provide('ScrollTrigger', ScrollTrigger)
  // nuxtApp.provide('MotionPathPlugin', MotionPathPlugin)
  // nuxtApp.provide('SplitText', SplitText)
  // nuxtApp.provide('CustomEase', CustomEase)
  // nuxtApp.provide('ScrollSmoother', ScrollSmoother)
  return {
    provide: {
      gsap,
      Draggable,
      ScrollTrigger,
      MotionPathPlugin,
      SplitText,
      CustomEase,
      ScrollSmoother,
      Flip
      
    },
  };
});
