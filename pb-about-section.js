gsap.registerPlugin(ScrollTrigger);

const cardSlider = document.querySelector(".card-slider");
const sliderCard = document.querySelectorAll(".card-slider__slide");

let currentSlideIndex = 0;
let totalSlides = sliderCard.length;
let randomAngles;

// set required classes for each cards
const setClasses = () => {
  sliderCard.forEach((slide, i) => {
    slide.classList.toggle("slide-active", i === currentSlideIndex);
  });
};

// set z-index for each cards
const setStackIndex = () => {
  sliderCard.forEach((slide, i) => {
    slide.style.zIndex = totalSlides - i;
  });
};

// set rotation angles for each cards
const setRotateCard = () => {
  const minAngle = -10;
  const maxAngle = 10;
  randomAngles = [...Array(10)].map(
    () => Math.floor(Math.random() * (maxAngle - minAngle + 1)) + minAngle
  );
  sliderCard.forEach((slide, i) => {
    if (i !== currentSlideIndex) {
      slide.style.transform = `rotate(${randomAngles[i]}deg)`;
    } else {
      slide.style.transform = `rotate(0deg)`;
    }
  });
};

// slide to previous
const slidePrev = () => {
  if (currentSlideIndex > 0) {
    sliderCard[currentSlideIndex - 1].style.transform = `translateX(0)`;
    sliderCard[currentSlideIndex - 1].style.transform = `rotate(0deg)`;
    currentSlideIndex > 0 ? (currentSlideIndex -= 1) : currentSlideIndex;
    setTimeout(() => {
      sliderCard[currentSlideIndex + 1].style.transform = `rotate(${
        randomAngles[currentSlideIndex + 1]
      }deg)`;
    }, 300);
    setClasses();
  }
};

// slide to next
const slideNext = () => {
  if (currentSlideIndex < sliderCard.length) {
    sliderCard[currentSlideIndex].style.transform = `translateX(100vw)`;
    currentSlideIndex < totalSlides - 1
      ? (currentSlideIndex += 1)
      : currentSlideIndex;
    sliderCard[currentSlideIndex].style.transform = `rotate(0deg)`;
    setClasses();
  }
};

// slider reset functions
const resetClasses = () => {
  sliderCard.forEach((slide, i) => {
    slide.classList.remove("slide-active");
  });
};

const resetStackIndex = () => {
  sliderCard.forEach((slide, i) => {
    slide.style.zIndex = 1;
  });
};

const resetRotateCard = () => {
  sliderCard.forEach((slide, i) => {
    slide.style.transform = `rotate(0deg)`;
  });
};

// slider initialization function
const initSlider = () => {
  // set classes & styles
  setClasses();
  setStackIndex();
  setRotateCard();

  // pinning animation
  gsap.utils.toArray(".pb-about-slider").forEach((container) => {
    let children = gsap.utils.toArray(container.children);
    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.closest(".pin-section"),
        start: "center center",
        end: `+=${children[0].offsetWidth * sliderCard.length * 2}`,
        anticipatePin: 1,
        scrub: true,
        pin: container.closest(".pin-section"),
      },
    });
    let changeSlide = () =>
      tl.scrollTrigger.direction < 0 ? slidePrev() : slideNext();
    children.forEach((child, i) => tl.add(changeSlide, i + 1));
    tl.set({}, { delay: 1 });
  });
};

// initializing slider
initSlider();

// adjust card title font size based on card width (optional)
const aboutCard = document.querySelectorAll(".pb-about-slider__card");
aboutCard.forEach((card, i) => {
  const cardText = card.querySelector(".pb-about-slider__cardTitle");
  const cardWidth =
    card.offsetWidth -
    parseFloat(getComputedStyle(card).paddingLeft) -
    parseFloat(getComputedStyle(card).paddingRight) -
    parseFloat(getComputedStyle(card).marginLeft) -
    parseFloat(getComputedStyle(card).marginRight) -
    parseFloat(getComputedStyle(card).borderLeftWidth) -
    parseFloat(getComputedStyle(card).borderRightWidth);
  const textWidth = cardText.offsetWidth;
  if (cardWidth < textWidth) {
    const textLen = cardText.innerText.length;
    let fSize = `${(cardWidth / textLen) * 1.6}px`;
    card.style.setProperty("--card-title-size", fSize);
    card.style.setProperty("--card-title-size-2", fSize);
    card.style.setProperty("--card-title-size-3", fSize);
  }
});
