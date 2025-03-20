document.addEventListener("DOMContentLoaded", () => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const img = document.querySelector(
    isMobile ? ".main__img_mobile" : ".main__img_desk"
  );

  if (img.complete) {
    img.classList.add("loaded");
  } else {
    img.addEventListener("load", () => {
      img.classList.add("loaded");
    });
  }

  const allTabs = document.querySelectorAll("[data-tabs]");

  if (allTabs.length > 0) {
    allTabs.forEach((tabElement) => {
      const selector = `[data-tabs="${tabElement.getAttribute("data-tabs")}"]`;
      const tabs = new Tabby(selector);
    });
  }

  const faq = document.querySelectorAll(".faq-item");

  faq.forEach((el) => {
    el.addEventListener("click", function () {
      this.classList.toggle("active");
      let faqBody = this.querySelector(".faq-item__body");
      if (faqBody.style.maxHeight) {
        faqBody.style.maxHeight = null;
      } else {
        faqBody.style.maxHeight = faqBody.scrollHeight + "px";
      }
    });
  });

  const ruleItems = document.querySelectorAll(".rule-item");

  ruleItems.forEach(function (item) {
    const content = item.querySelector(".rule-item__content");

    // Считываем изначальную высоту rule-item__content
    const contentHeight = content.offsetHeight;
    content.style.marginBottom = `-${contentHeight + 20}px`;

    // Функция для открытия контента
    function openContent() {
      item.classList.add("hovered");
      content.style.marginBottom = "0px"; // Раскрытие содержимого
    }

    // Функция для закрытия контента
    function closeContent() {
      item.classList.remove("hovered");
      content.style.marginBottom = `-${contentHeight + 20}px`;
    }

    // События для десктопа
    if (!isMobile) {
      item.addEventListener("mouseenter", openContent);
      item.addEventListener("mouseleave", closeContent);
    }

    // Открытие/закрытие по клику на мобильных устройствах
    if (isMobile) {
      item.addEventListener("click", function (event) {
        event.preventDefault(); // Предотвращаем выделение/прокрутку

        const isOpen = item.classList.contains("hovered");

        // Закрываем все другие элементы перед открытием текущего
        ruleItems.forEach((el) => {
          el.classList.remove("hovered");
          el.querySelector(".rule-item__content").style.marginBottom = `-${
            el.querySelector(".rule-item__content").offsetHeight + 20
          }px`;
        });

        if (!isOpen) {
          openContent(); // Открываем текущий, если он не был открыт
        }
      });
    }
  });

  const headerButtons = document.querySelectorAll(".btn-header");

  if (isMobile) {
    headerButtons.forEach((btn) => btn.classList.add("iconed"));
  } else {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        headerButtons.forEach((btn) => btn.classList.add("iconed"));
      } else {
        headerButtons.forEach((btn) => btn.classList.remove("iconed"));
      }
    });
  }

  const sections = document.querySelectorAll("section"); // Получаем все секции
  const points = document.querySelectorAll(".scrollbar__point"); // Получаем все поинты
  const scrollbar = document.querySelector(".scrollbar");
  const footer = document.querySelector(".footer");

  function updateScrollbarPosition() {
    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const distanceToFooter = footerRect.top - viewportHeight + 50;

    if (distanceToFooter <= 0) {
      scrollbar.style.top = "30%";
    } else {
      scrollbar.style.top = "50%";
      scrollbar.style.transform = "translateY(-50%)";
    }
  }

  // Запускаем функцию при прокрутке
  window.addEventListener("scroll", updateScrollbarPosition);
  updateScrollbarPosition();

  const observerOptions = {
    root: null, // Отслеживаем относительно окна
    rootMargin: "-50% 0px -50% 0px", // Когда секция на 50% в зоне видимости
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id; // Берём ID секции
        points.forEach((point) => {
          point.classList.toggle(
            "active",
            point.getAttribute("href") === `#${sectionId}`
          );
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  document.addEventListener("click", function (event) {
    const openTrigger = event.target.closest("[data-modal-target]");
    const closeTrigger = event.target.closest("[data-modal-close]");
    const anyModal = event.target.closest(".modal");

    // 1) Открытие по data-modal-target
    if (openTrigger) {
      event.preventDefault();
      const modalId = openTrigger.getAttribute("data-modal-target");
      const modalEl = document.querySelector(`[data-modal="${modalId}"]`);
      if (modalEl) {
        modalEl.classList.add("is_active");
        // При открытии любой модалки добавляем класс к body
        document.body.classList.add("noscroll");
      }
      return;
    }

    // 2) Закрытие по кнопке data-modal-close
    if (closeTrigger) {
      event.preventDefault();
      const parentModal = closeTrigger.closest(".modal");
      if (parentModal) {
        parentModal.classList.remove("is_active");
        resetModalSwipers(anyModal);
        // Если нет ни одной открытой модалки, убираем класс у body
        if (!document.querySelector(".modal.is_active")) {
          document.body.classList.remove("noscroll");
        }
      }
      return;
    }

    if (anyModal && !event.target.closest(".modal-inner")) {
      anyModal.classList.remove("is_active");

      resetModalSwipers(anyModal);

      if (!document.querySelector(".modal.is_active")) {
        document.body.classList.remove("noscroll");
      }
      return;
    }
  });

  function resetModalSwipers(modalEl) {
    const modalId = modalEl.getAttribute("data-modal");

    const match = modalId.match(/rule-modal-(\d+)/);
    if (!match) return;

    const sliderId = match[1];

    const group = modalRuleSwipers[sliderId];
    if (!group) return;

    group.swiperTitle.slideTo(0, 0);
    group.swiperWinners.slideTo(0, 0);
    group.swiperCriteria.slideTo(0, 0);
  }

  function scaleContent() {
    const baseWidth = 1440;
    const baseWidthMobile = 360;
    const wrapper = document.querySelector(".pecowrapper");
    const header = document.querySelector(".header");

    if (window.innerWidth < 768) {
      const scaleXMobile = window.innerWidth / baseWidthMobile;
      wrapper.style.transform = `scale(${scaleXMobile})`;

      wrapper.style.width = `${baseWidthMobile}px`;
      header.style.transform = `scale(${scaleXMobile})`;
      header.style.width = `${baseWidthMobile}px`;
    } else {
      const scaleX = window.innerWidth / baseWidth;

      wrapper.style.transform = `scale(${scaleX})`;
      wrapper.style.width = `${baseWidth}px`;

      header.style.width = `${baseWidth}px`;
      header.style.transform = `scale(${scaleX})`;
    }
  }

  window.addEventListener("resize", scaleContent);
  scaleContent();
});
