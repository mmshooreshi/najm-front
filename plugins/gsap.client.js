import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { SplitText } from 'gsap/SplitText'
import {CustomEase} from 'gsap/CustomEase'

import { Draggable } from 'gsap/Draggable';

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Draggable, MotionPathPlugin);
  }

  return {
    provide: {
      gsap,
      Draggable,
      ScrollTrigger,
      MotionPathPlugin,
      SplitText,
      CustomEase
      
    },
  };
});
