const container = document.getElementById("card-container");
const swipePopup = document.getElementById("swipe-popup");
const summaryDiv = document.getElementById("summary");
const likeCount = document.getElementById("like-count");
const likedCatsContainer = document.getElementById("liked-cats");

let cats = [];
let likedCats = [];
let currentIndex = 0;

// Spinner for initial load
const spinner = document.createElement("div");
spinner.textContent = "Loading cats...";
spinner.style.color = "white";
spinner.style.fontSize = "24px";
spinner.style.textAlign = "center";
spinner.style.marginTop = "20px";
container.appendChild(spinner);

// Preload an image
function preloadImage(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img.src);
    img.onerror = () => resolve(url);
  });
}

// Fetch cats: show first immediately, preload rest in background
async function fetchCats() {
  cats = [];
  likedCats = [];
  currentIndex = 0;
  likedCatsContainer.innerHTML = "";
  summaryDiv.classList.add("hidden");
  container.innerHTML = "";
  container.appendChild(spinner);

  for (let i = 0; i < 15; i++) {
    cats.push(`https://cataas.com/cat?${Math.random()}`);
  }

  // Show first card immediately
  const firstImgSrc = await preloadImage(cats[0]);
  cats[0] = firstImgSrc;
  spinner.remove();
  createCard();

  // Preload remaining images in background
  for (let i = 1; i < cats.length; i++) {
    cats[i] = await preloadImage(cats[i]);
  }
}

// Create card
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

  // Touch events for mobile swipe
  card.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  card.addEventListener("touchmove", e => {
    currentX = e.touches[0].clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX/10}deg)`;

    if (Math.abs(currentX) > 5) e.preventDefault(); // lock vertical scroll
  }, { passive: false });
  card.addEventListener("touchend", e => handleSwipe(card, currentX, threshold));
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

// Full-page swipe popup
function showSwipePopup(text) {
  swipePopup.textContent = text;
  swipePopup.classList.add("show");
  setTimeout(() => swipePopup.classList.remove("show"), 500);
}

// Show summary **on the same page**
function showSummary() {
  summaryDiv.classList.remove("hidden");
  likeCount.textContent = likedCats.length;
  likedCatsContainer.innerHTML = "";
  likedCats.forEach(cat => {
    const img = document.createElement("img");
    img.src = cat;
    likedCatsContainer.appendChild(img);
  });
}

// Restart
function restart() {
  likedCats = [];
  currentIndex = 0;
  container.innerHTML = "";
  likedCatsContainer.innerHTML = "";
  summaryDiv.classList.add("hidden");
  fetchCats();
}

// Desktop arrow key support
document.addEventListener("keydown", e => {
  if (currentIndex >= cats.length) return;
  const card = container.querySelector(".card:last-child");
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

// Start the app
fetchCats();
