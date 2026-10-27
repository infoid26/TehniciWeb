(() => {
  'use strict';
  document.addEventListener('keydown',event=>{
    if(event.key==='Tab')document.documentElement.classList.add('keyboard-navigation');
  },true);
  document.addEventListener('pointerdown',()=>{
    document.documentElement.classList.remove('keyboard-navigation');
  },true);
})();
