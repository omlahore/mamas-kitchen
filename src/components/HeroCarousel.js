// src/components/HeroCarousel.js

import { gsap } from "gsap";

export function HeroCarousel(container) {
  // 1) Image URLs
  const images = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"];

  // 2) Wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "relative w-full h-64 sm:h-80 lg:h-96 overflow-hidden";
  
  // 3) Create absolutely-stacked imgs, initially hidden
  const imgEls = images.map(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    Object.assign(img.style, {
      position:    "absolute",
      top:         "0",
      left:        "0",
      width:       "100%",
      height:      "100%",
      objectFit:   "cover",
      opacity:     "0"
    });
    wrapper.append(img);
    return img;
  });

  // 4) Overlay title
  const title = document.createElement("div");
  title.className = "absolute inset-0 flex items-center justify-center pointer-events-none";
  title.innerHTML = `
 <img
    src="/logo.png"
    alt="Mama’s Kitchen Logo"
    class="h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] drop-shadow-lg"
  />
  `;
  wrapper.append(title);

  // 5) Append to container
  container.append(wrapper);

  // 6) Build GSAP timeline for fade loop
  const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power1.inOut" } });
  imgEls.forEach(img => {
    tl.to(img, { opacity: 1, duration: 1 });  // fade in
    tl.to(img, { opacity: 1, duration: 4 });  // hold
    tl.to(img, { opacity: 0, duration: 1 });  // fade out
  });
}
