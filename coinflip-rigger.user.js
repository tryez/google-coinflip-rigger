// ==UserScript==
// @name         Google Coin Flip Rigger
// @namespace    https://github.com/tryez/google-coinflip-rigger
// @version      1.0
// @description  Rig Google coin flip to always land as you want.
// @author       George Uznadze
// @match        https://www.google.com/search*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';


    const maxTries = 20;
    let tries = 0;
  
    const waitForCoinFlip = () => {
      tries++;

      if(tries >= maxTries){
        return;
      }

      const canvas = document.querySelector('canvas');
      const controller = canvas?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.__jscontroller;
      if (!canvas || !controller) {
        setTimeout(waitForCoinFlip, 500);
        return;
      }
      

      let backToNormal = false;
      let onlyHeads = true;
      
      const targetObject = controller.pending.value.__proto__;
      const origFlip = targetObject.flip;
  
      targetObject.flip = function() {
        const oldMathRandom = Math.random;
  
        if (!backToNormal) {
          Math.random = () => {
            return onlyHeads ? 0.1 : 0.9;
          };
        }
  
        try {
          return origFlip.call(this);
        } finally {
          Math.random = oldMathRandom;
        }
      };

      function toggleHeadsOrTails(){
        backToNormal = false;
        onlyHeads = !onlyHeads;
      }

      function setBackToNormal(){
        backToNormal = true;
      }
  
      document.querySelector('g-inline-expansion-bar').addEventListener('mouseenter', () => {
        toggleHeadsOrTails();
      });
  
      const share = document.querySelector('csf-share');
      if (share) {
        share.addEventListener('mouseenter', () => {
          setBackToNormal();
        });
      }
  
    };
  

    waitForCoinFlip();
  })();