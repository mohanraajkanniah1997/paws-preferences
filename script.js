const container = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likeCount = document.getElementById("like-count");
const likedCatsContainer = document.getElementById("liked-cats");
const swipePopup = document.getElementById("swipe-popup");

let cats = [];
let likedCats = [];
let currentIndex = 0;

// Preload image
function preloadImage(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
  });
}

// Fetch 15 random cats and preload
async function fetchCats() {
  cats = [];
  likedCats = [];
  currentIndex = 0;
  likedCatsContainer.innerHTML = "";
  summary.classList.add("hidden");

  for (let i = 0; i < 15; i++) {
    cats.push(`https://cataas.com/cat?${Math.random()}`);
  }

  // Preload all images
  const preloadedImages = await Promise.all(cats.map(url => preloadImage(url)));

  // Store preloaded images in cats array
  cats = preloadedImages.map(img => img.src);

  createCard();
}

// Create a card
function createCard() {
  if (currentIndex >= cats.length) {
    showSummary();
    return;
  }

  const card = document.createElement("div");
  card.classList.add("card");
  card.style.zIndex = cats.length - currentIndex;

  const img = new Image();
  img.src = cats[currentIndex];
  card.appendChild(img);

  container.appendChild(card);

  let startX = 0;
  let currentX = 0;
  const threshold = window.innerWidth * 0.25;

  // Touch events
  card.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  card.addEventListener("touchmove", e => {
    currentX = e.touches[0].clientX - startX;
    const rotate = currentX / 10;
    card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
  });

  card.addEventListener("touchend", e => {
    handleSwipe(card, currentX, threshold);
  });
}

// Handle swipe logic
function handleSwipe(card, currentX, threshold) {
  if (currentX > threshold) {
    likedCats.push(cats[currentIndex]);
    showSwipePopup("❤️ LIKE");
    card.style.transform = `translateX(${window.innerWidth}px) rotate(20deg)`;
  } else if (currentX < -threshold) {
    showSwipePopup("❌ DISLIKE");
    card.style.transform = `translateX(-${window.innerWidth}px) rotate(-20deg)`;
  } else {
    card.style.transform = "translateX(0) rotate(0)";
    return;
  }

  setTimeout(() => {
    container.removeChild(card);
    currentIndex++;
    createCard();
  }, 500);
}

// Full-page popup
function showSwipePopup(text) {
  swipePopup.textContent = text;
  swipePopup.classList.add("show");
  setTimeout(() => {
    swipePopup.classList.remove("show");
  }, 500);
}

// Show summary
function showSummary() {
  summary.classList.remove("hidden");
  likeCount.textContent = likedCats.length;

  likedCats.forEach(cat => {
    const img = document.createElement("img");
    img.src = cat;
    likedCatsContainer.appendChild(img);
  });
}

// Restart
function restart() {
  fetchCats();
}

// Keyboard support for desktop
document.addEventListener("keydown", e => {
  if (currentIndex >= cats.length) return;
  const card = container.querySelector(".card");
  const threshold = 1; // just to trigger swipe
  if (!card) return;

  if (e.key === "ArrowRight") {
    likedCats.push(cats[currentIndex]);
    showSwipePopup("❤️ LIKE");
    card.style.transform = `translateX(${window.innerWidth}px) rotate(20deg)`;
    setTimeout(() => {
      container.removeChild(card);
      currentIndex++;
      createCard();
    }, 500);
  } else if (e.key === "ArrowLeft") {
    showSwipePopup("❌ DISLIKE");
    card.style.transform = `translateX(-${window.innerWidth}px) rotate(-20deg)`;
    setTimeout(() => {
      container.removeChild(card);
      currentIndex++;
      createCard();
    }, 500);
  }
});

// Start
fetchCats();
