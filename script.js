const openGiftBtn = document.getElementById("openGiftBtn");
const readLetterBtn = document.getElementById("readLetterBtn");
const letterMessage = document.getElementById("letterMessage");
const hugButton = document.getElementById("hugButton");
const floatingHeartsLayer = document.querySelector(".floating-hearts");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxMessage = document.getElementById("lightboxMessage");
const lightboxClose = document.querySelector(".lightbox__close");
const hugPopup = document.getElementById("hugPopup");
const closeHugBtn = document.getElementById("closeHugBtn");

const letterContent = `
Anh muốn nói với em rằng: anh yêu em rất nhiều.

Không chỉ vì em xinh đẹp, mà còn vì em làm cho những ngày của anh trở vui hơn, bình yên hơn, và đáng trân trọng hơn.

Em là người khiến anh muốn cố gắng mỗi ngày. Anh hy vọng em luôn biết rằng mình rất quan trọng với anh, và anh luôn muốn được ở bên em, chăm sóc em và làm em hạnh phúc.

Chúc em luôn khỏe mạnh, luôn vui vẻ, luôn là bé iu của anh và luôn giữ được nụ cười trên môi. Anh muốn em biết rằng, dù có đi đâu, có lớn lên thế nào, trong trái tim anh, em vẫn luôn là một phần đẹp nhất của cuộc sống này.

Happy 20-10, em nhé. 💗
`;

function createFloatingHeart(x, y, size, delay) {
  const heart = document.createElement("span");
  heart.className = "heart-float";
  heart.textContent = "❤";
  heart.style.left = `${x}%`;
  heart.style.top = `${y}%`;
  heart.style.fontSize = `${size}px`;
  heart.style.animationDelay = `${delay}s`;
  heart.style.setProperty(
    "--x-move",
    `${(Math.random() * 120 - 60).toFixed(0)}px`,
  );
  floatingHeartsLayer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 10000);
}

function launchHearts() {
  const total = window.innerWidth < 640 ? 12 : 22;

  for (let index = 0; index < total; index += 1) {
    const x = Math.random() * 100;
    const y = 90 + Math.random() * 10;
    const size = 14 + Math.random() * 18;
    const delay = Math.random() * 4;
    createFloatingHeart(x, y, size, delay);
  }
}

function launchLightboxHearts() {
  const total = 14;

  for (let index = 0; index < total; index += 1) {
    const heart = document.createElement("span");
    heart.className = "lightbox-heart";
    heart.textContent = "❤";
    heart.style.left = `${18 + Math.random() * 64}%`;
    heart.style.top = `${20 + Math.random() * 50}%`;
    heart.style.fontSize = `${12 + Math.random() * 22}px`;
    heart.style.animationDelay = `${Math.random() * 0.6}s`;
    lightbox.appendChild(heart);

    setTimeout(() => {
      if (heart.parentNode) {
        heart.parentNode.removeChild(heart);
      }
    }, 1800);
  }
}

function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  reveals.forEach((section) => observer.observe(section));
}

function scrollToWish() {
  const wishSection = document.getElementById("wishSection");
  if (wishSection) {
    wishSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setFallbackImage() {
  const images = document.querySelectorAll(".photo-card img");

  images.forEach((image) => {
    image.addEventListener("error", () => {
      const frame = image.closest(".photo-frame");
      if (frame) {
        frame.classList.add("is-fallback");
      }
      image.style.display = "none";
    });
  });
}

function openLightbox(imageSource, caption, message) {
  lightboxImage.src = imageSource;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightboxMessage.textContent = message || "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  launchLightboxHearts();
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}

function bindGallery() {
  const cards = document.querySelectorAll(".photo-card");

  cards.forEach((card) => {
    const image = card.querySelector("img");
    const caption = card.dataset.title || "Ảnh kỷ niệm";
    const message = card.dataset.message || "";

    if (image) {
      image.addEventListener("click", () => {
        openLightbox(image.src, caption, message);
      });

      card.addEventListener("click", (event) => {
        if (
          event.target !== image &&
          event.target.closest(".photo-overlay") === null
        ) {
          return;
        }
        openLightbox(image.src, caption, message);
      });
    }
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
      if (hugPopup.classList.contains("is-open")) {
        closeHugPopup();
      }
    }
  });
}

function typeLetter(message) {
  const content = message.trim();
  letterMessage.textContent = "";
  letterMessage.classList.remove("is-visible");

  let index = 0;

  const typing = setInterval(() => {
    letterMessage.textContent += content[index] || "";
    index += 1;

    if (index >= content.length) {
      clearInterval(typing);
      letterMessage.classList.add("is-visible");
    }
  }, 18);
}

function toggleLetter() {
  if (
    !letterMessage.dataset.visible ||
    letterMessage.dataset.visible === "false"
  ) {
    letterMessage.dataset.visible = "true";
    typeLetter(letterContent);
  } else {
    letterMessage.dataset.visible = "false";
    letterMessage.textContent = "";
  }
}

openGiftBtn.addEventListener("click", () => {
  document.body.classList.add("gift-open");
  scrollToWish();
});

readLetterBtn.addEventListener("click", toggleLetter);

function openHugPopup() {
  hugPopup.classList.add("is-open");
  hugPopup.setAttribute("aria-hidden", "false");
  launchHearts();
}

function closeHugPopup() {
  hugPopup.classList.remove("is-open");
  hugPopup.setAttribute("aria-hidden", "true");
}

hugButton.addEventListener("click", () => {
  openHugPopup();
});

closeHugBtn.addEventListener("click", () => {
  closeHugPopup();
});

hugPopup.addEventListener("click", (event) => {
  if (event.target === hugPopup) {
    closeHugPopup();
  }
});

setFallbackImage();
bindGallery();
revealOnScroll();
