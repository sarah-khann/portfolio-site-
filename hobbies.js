'use strict';
const hobbyTrack = document.querySelector('#hobby-track');
const hobbySlides = [...hobbyTrack.children];
const previousPhoto = document.querySelector('#hobby-prev');
const nextPhoto = document.querySelector('#hobby-next');
const photoPosition = document.querySelector('#hobby-position');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function currentPhoto() {
 const width = hobbyTrack.clientWidth;
 return width ? Math.max(0, Math.min(hobbySlides.length - 1, Math.round(hobbyTrack.scrollLeft / width))) : 0;
}
function showPhoto(index, animate = true) {
 const target = (index + hobbySlides.length) % hobbySlides.length;
 hobbyTrack.scrollTo({left: target * hobbyTrack.clientWidth, behavior: animate && !reducedMotion.matches ? 'smooth' : 'instant'});
}
function updatePhoto() {
 photoPosition.textContent = `${currentPhoto() + 1} / ${hobbySlides.length}`;
}
hobbySlides.forEach((slide, index) => slide.setAttribute('aria-label', `${index + 1} of ${hobbySlides.length}`));
previousPhoto.addEventListener('click', () => showPhoto(currentPhoto() - 1));
nextPhoto.addEventListener('click', () => showPhoto(currentPhoto() + 1));
hobbyTrack.addEventListener('scroll', updatePhoto, {passive: true});
hobbyTrack.addEventListener('keydown', event => {
 if(event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
  event.preventDefault();
  showPhoto(currentPhoto() + (event.key === 'ArrowLeft' ? -1 : 1));
 }
});
// Keep the selected photo aligned when its container changes size.
let previousWidth = hobbyTrack.clientWidth;
let selectedPhoto = 0;
hobbyTrack.addEventListener('scroll', () => { selectedPhoto = currentPhoto(); }, {passive: true});
window.addEventListener('resize', () => {
 if (previousWidth !== hobbyTrack.clientWidth) {
  showPhoto(selectedPhoto, false);
  previousWidth = hobbyTrack.clientWidth;
 }
});
updatePhoto();
