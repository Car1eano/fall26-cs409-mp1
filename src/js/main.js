document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. DOM Elements
  // ==========================================
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section.stripe, footer.stripe");

  // ==========================================
  // 2. Navbar Resizing & Position Indicator
  // ==========================================
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const navHeight = navbar.offsetHeight;

    // --- Navbar 縮放判斷 ---
    if (scrollY > 50) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }

    // --- 檢查是否滾動到底部 (滿足底端高亮最後一項規範) ---
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;

    if (isAtBottom) {
      navLinks.forEach((link) => link.classList.remove("active"));
      const lastLink = navLinks[navLinks.length - 1];
      if (lastLink) lastLink.classList.add("active");
      return;
    }

    // --- 當前閱讀位置指示器 (Position Indicator) ---
    let currentSectionId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight - 10;
      const sectionHeight = section.offsetHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active");
        }
      });
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // 初始化執行一次

// ==========================================
  // 3. Smooth Scrolling with Offset (加入 .hero-btn)
  // ==========================================
  const scrollTriggers = document.querySelectorAll(".nav-link, .hero-btn");

  scrollTriggers.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        if (targetId === "hero") {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          return;
        }

        // 滾動後 Navbar 一律縮小為 48px，統一使用 48px offset
        const SCROLLED_NAV_HEIGHT = 48;
        const targetTop = targetSection.offsetTop - SCROLLED_NAV_HEIGHT;

        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // ==========================================
  // 4. Carousel Implementation
  // ==========================================
  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".carousel-slide");
  const prevBtn = document.querySelector(".carousel-control.prev");
  const nextBtn = document.querySelector(".carousel-control.next");
  let currentIndex = 0;

  const updateCarousel = () => {
    if (!track) return;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  if (prevBtn && nextBtn && slides.length > 0) {
    prevBtn.addEventListener("click", () => {
      currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
      updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
      currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
      updateCarousel();
    });
  }

  // ==========================================
  // 5. Modal Implementation
  // ==========================================
  const modalTriggers = document.querySelectorAll(".modal-trigger-btn");
  const overlay = document.getElementById("modal-overlay");
  const closeButtons = document.querySelectorAll(".modal-close-btn");

  const openModal = (modalId) => {
    const targetModal = document.getElementById(modalId);
    if (targetModal && overlay) {
      targetModal.classList.add("active");
      overlay.classList.add("active");
    }
  };

  const closeModal = () => {
    document.querySelectorAll(".modal.active").forEach((m) => m.classList.remove("active"));
    if (overlay) overlay.classList.remove("active");
  };

  modalTriggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-modal");
      openModal(modalId);
    });
  });

  closeButtons.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  if (overlay) {
    overlay.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // ==========================================
  // 6. Copy Email to Clipboard & Toast
  // ==========================================
  const emailBtn = document.getElementById("email-copy-btn");
  const toast = document.getElementById("toast");

  if (emailBtn && toast) {
    emailBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const email = "poching2@illinois.edu";

      navigator.clipboard.writeText(email).then(() => {
        toast.textContent = `Email copied to clipboard: ${email}!`;
        toast.classList.add("show");

        setTimeout(() => {
          toast.classList.remove("show");
        }, 2200);
      }).catch((err) => {
        console.error("Failed to copy email: ", err);
      });
    });
  }
});