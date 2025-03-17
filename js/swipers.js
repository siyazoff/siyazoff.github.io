const swiperRules = new Swiper(".swiper-rules", {
  speed: 800,
  grabCursor: true,
  slidesPerView: 3,
  spaceBetween: 23,
  allowSlideNext: true,
  allowSlidePrev: true,

  navigation: {
    prevEl: ".swiper-rules__prev",
    nextEl: ".swiper-rules__next",
  },

  on: {
    init: function () {
      // Добавим класс visible для первых трех слайдов (0,1,2)
      this.slides.forEach((slide) => {
        slide.classList.remove("visible");
      });
      for (
        let i = this.activeIndex;
        i < this.activeIndex + 3 && i < this.slides.length;
        i++
      ) {
        this.slides[i].classList.add("visible");
      }
    },
    slideChange: function () {
      // При смене слайда убираем visible у всех и назначаем новым трем
      this.slides.forEach((slide) => {
        slide.classList.remove("visible");
      });
      for (
        let i = this.activeIndex;
        i < this.activeIndex + 3 && i < this.slides.length;
        i++
      ) {
        this.slides[i].classList.add("visible");
      }
    },
  },
});

const swiperMainPrize = new Swiper(".swiper-main-prize", {
  speed: 800,
  slidesPerView: 1,
  spaceBetween: 20,

  navigation: {
    prevEl: ".swiper-main-prize__prev",
    nextEl: ".swiper-main-prize__next",
  },

  pagination: {
    el: ".swiper-main-prize__pagi",
    clickable: true,
  },
});

const modalRuleSwipers = {};

const buildModalRuleSwiper = (sliderElm) => {
  let sliderIdentifier = sliderElm.dataset.id;

  // Инициализируем три связанных Swiper'а для одной группы
  const swiperTitle = new Swiper(
    `.swiper-modal-rule-title-${sliderIdentifier}`,
    {
      speed: 800,
      slidesPerView: 1,
      spaceBetween: 20,
      allowTouchMove: false, // Только winners можно свайпить вручную
    }
  );

  const swiperWinners = new Swiper(
    `.swiper-modal-rule-winners-${sliderIdentifier}`,
    {
      speed: 1000,
      slidesPerView: 1,
      spaceBetween: 20,
      allowTouchMove: true, // Этот Swiper можно листать вручную
      navigation: {
        nextEl: `.swiper-modal-rule__next-${sliderIdentifier}`,
        prevEl: `.swiper-modal-rule__prev-${sliderIdentifier}`,
      },
    }
  );

  const swiperCriteria = new Swiper(
    `.swiper-modal-rule-criteria-${sliderIdentifier}`,
    {
      speed: 1200,
      slidesPerView: 1,
      spaceBetween: 20,
      allowTouchMove: false,
    }
  );

  // Связываем все три Swiper'а внутри одной группы
  swiperWinners.on("slideChange", () => {
    let index = swiperWinners.activeIndex;
    swiperTitle.slideTo(index);
    swiperCriteria.slideTo(index);
  });

  swiperTitle.on("slideChange", () => {
    let index = swiperTitle.activeIndex;
    swiperWinners.slideTo(index);
    swiperCriteria.slideTo(index);
  });

  swiperCriteria.on("slideChange", () => {
    let index = swiperCriteria.activeIndex;
    swiperTitle.slideTo(index);
    swiperWinners.slideTo(index);
  });

  modalRuleSwipers[sliderIdentifier] = {
    swiperTitle,
    swiperWinners,
    swiperCriteria,
  };
};

// Находим все группы Swiper'ов и инициализируем их
const allModalRuleSwipers = document.querySelectorAll(
  ".swiper-modal-rule-title"
);

allModalRuleSwipers.forEach((slider) => buildModalRuleSwiper(slider));
