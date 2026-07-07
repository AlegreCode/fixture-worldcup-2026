import gsap from 'gsap';

export const fadeInUp = (element, delay = 0) => {
  gsap.fromTo(element, 
    { y: 50, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay }
  );
};

export const staggerCards = (selector, staggerTime = 0.1) => {
  gsap.fromTo(selector,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, stagger: staggerTime, ease: "back.out(1.7)" }
  );
};

export const pageTransition = (container) => {
  gsap.fromTo(container,
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: "power2.inOut" }
  );
};
