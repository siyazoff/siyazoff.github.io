document.addEventListener("DOMContentLoaded", () => {
  // ScrollReveal().reveal("[scroll-anime]");

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

    // Устанавливаем отрицательный margin-bottom
    content.style.marginBottom = `-${contentHeight + 20}px`;

    // Функция для открытия контента
    function openContent() {
      item.classList.add("hovered");
      content.style.marginBottom = "0px"; // Раскрытие содержимого
    }

    // Функция для закрытия контента
    function closeContent() {
      item.classList.remove("hovered");
      content.style.marginBottom = `-${contentHeight + 20}px`; // Скрытие содержимого
    }

    // События для десктопа
    item.addEventListener("mouseenter", openContent);
    item.addEventListener("mouseleave", closeContent);

    // События для мобильных устройств
    item.addEventListener("touchstart", function (event) {
      openContent();
      event.preventDefault(); // Предотвращаем стандартное поведение (например, прокрутку)
    });

    item.addEventListener("touchend", function (event) {
      closeContent();
      event.preventDefault();
    });
  });

  const headerButtons = document.querySelectorAll(".btn-header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      headerButtons.forEach((btn) => btn.classList.add("iconed"));
    } else {
      headerButtons.forEach((btn) => btn.classList.remove("iconed"));
    }
  });

  const sections = document.querySelectorAll("section"); // Получаем все секции
  const points = document.querySelectorAll(".scrollbar__point"); // Получаем все поинты

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
        // Если нет ни одной открытой модалки, убираем класс у body
        if (!document.querySelector(".modal.is_active")) {
          document.body.classList.remove("noscroll");
        }
      }
      return;
    }

    // 3) Закрытие по клику на подложку (т.е. фон .modal, но НЕ по .modal-form)
    if (anyModal && !event.target.closest(".modal-inner")) {
      anyModal.classList.remove("is_active");
      // Если больше нет открытых модалок, убираем класс у body
      if (!document.querySelector(".modal.is_active")) {
        document.body.classList.remove("noscroll");
      }
      return;
    }
  });
});
