const container = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likeCount = document.getElementById("like-count");
const likedCatsContainer = document.getElementById("liked-cats");
const swipePopup = document.getElementById("swipe-popup");

// Spinner for loading images
const spinner = document.createElement("div");
spinner.textContent = "Loading cats...";
spinner.style.color = "white";
spinner.style.fontSize = "24px";
spinner.style.textAlign = "center";
spinner.style.marginTop = "20px";
container.appendChild(spinner);

let cats = [];
let likedCats = [];
let currentIndex = 0;

// Preload image
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
  summary.classList.add("hidden");
  container.innerHTML = "";
  container.appendChild(spinner);

  // Generate URLs
  for (let i = 0; i < 15; i++) {
    cats.push(`https://cataas.com/cat?${Math.random()}`);
  }

  // Show first card immediately
  const firstImgSrc = await preloadImage(cats[0]);
  cats[0] = firstImgSrc;
  spinner.remove();
  createCard();

  // Preload rest in background
  for (let i = 1; i < cats.length; i++) {
    cats[i] = await preloadImage(cats[i]);
  }
}

// Create a card
function createCard() {
  if (currentIndex >= cats.length) {
    showSummaryInSamePlace();
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
  card.addEventListener("touchstart", e => startX = e.touches[0].clientX);
  card.addEventListener("touchmove", e => {
    currentX = e.touches[0].clientX - startX;
    card.style.transform = `translateX(${currentX}px) rotate(${currentX/10}deg)`;
  });
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

// Full-screen popup
function showSwipePopup(text) {
  swipePopup.textContent = text;
  swipePopup.classList.add("show");
  setTimeout(() => swipePopup.classList.remove("show"), 500);
}

// Show summary **in the same place**
function showSummaryInSamePlace() {
  container.innerHTML = ""; // clear all cards
  const summaryCard = document.createElement("div");
  summaryCard.classList.add("card");
  summaryCard.style.background = "#1e1e1e";
  summaryCard.style.flexDirection = "column";
  summaryCard.style.justifyContent = "flex-start";
  summaryCard.style.padding = "20px";

  const heading = document.createElement("h3");
  heading.textContent = `You liked ${likedCats.length} cats!`;
  summaryCard.appendChild(heading);

  const likedDiv = document.createElement("div");
  likedDiv.id = "liked-cats-summary";
  likedDiv.style.display = "flex";
  likedDiv.style.flexWrap = "wrap";
  likedDiv.style.justifyContent = "center";
  likedDiv.style.marginTop = "10px";

  likedCats.forEach(cat => {
    const img = document.createElement("img");
    img.src = cat;
    img.style.width = "80px";
    img.style.height = "80px";
    img.style.objectFit = "cover";
    img.style.margin = "5px";
    img.style.borderRadius = "10px";
    likedDiv.appendChild(img);
  });

  summaryCard.appendChild(likedDiv);

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart";
  restartBtn.onclick = restart;
  restartBtn.style.marginTop = "15px";
  summaryCard.appendChild(restartBtn);

  container.appendChild(summaryCard);
}

// Restart
function restart() {
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

// Start
fetchCats();
