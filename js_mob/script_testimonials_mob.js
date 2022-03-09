// Testimonials-mob

import peopleMob from './data_testimonials_mob.js'

const container = document.querySelector('.slide-container-mob');
const nextBtn = document.querySelector('.next-btn-mob');
const prevBtn = document.querySelector('.prev-btn-mob');

// set slides
container.innerHTML = peopleMob.map((personMob, slideIndexMob) => {
   const {nameMob, jobMob, textMob, numberMob} = personMob
   // more logic later
let positionMob = 'next-mob'
if(slideIndexMob === 0){
  positionMob='active-mob'
}
if(slideIndexMob === peopleMob.length -1){
  positionMob = 'last-mob'
}
return ` <article class="slide ${positionMob}">
<h4 class="mob">${nameMob}</h4>
<p class="title-mob">${jobMob}</p>
<p class="text-mob">${textMob}</p>
<p class="text2-mob">${numberMob}</p>
<div class="quote-icon">
  <div class="fas faquote-right"></div>
</div>
</article> `
}).join('');

const startSliderMob = (type) => {
 const active = document.querySelector('.active-mob')
 const last = document.querySelector('.last-mob')
 let nextMob = active.nextElementSibling
 if(!nextMob) { // if 'next' does not exist then..
  nextMob = container.firstElementChild
 }
 active.classList.remove(['active-mob'])
 last.classList.remove(['last-mob'])
 nextMob.classList.remove(['next-mob'])

 if(type === 'prev-mob'){
   active.classList.add('next-mob')
   last.classList.add('active-mob')
   nextMob = last.previousElementSibling
  if(!nextMob){
    nextMob = container.lastElementChild
  }
  nextMob.classList.remove(['next-mob'])
   nextMob.classList.add('last-mob')
   return
 }

active.classList.add('last-mob')
last.classList.add('next-mob')
nextMob.classList.add('active-mob')

};

nextBtn.addEventListener('click',()=>{
  startSliderMob()
});

prevBtn.addEventListener('click',()=>{
  startSliderMob('prev')
});
