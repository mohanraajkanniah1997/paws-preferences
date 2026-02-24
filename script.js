// References
const container = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likeCount = document.getElementById("like-count");
const likedCatsContainer = document.getElementById("liked-cats");

// State variables
let cats = [];
let likedCats = [];
let currentIndex = 0;

// Fetch cat images from Cataas (fixed 15 cats)
function fetchCats() {
    cats = [];
    likedCats = [];
    currentIndex = 0;
    likedCatsContainer.innerHTML = "";
    summary.classList.add("hidden");

    for (let i = 0; i < 15; i++) {
        cats.push(`https://cataas.com/cat?${Math.random()}`);
    }

    createCard();
}

// Create each card
function createCard() {
    if (currentIndex >= cats.length) {
        showSummary();
        return;
    }

    const card = document.createElement("div");
    card.classList.add("card");
    card.style.zIndex = cats.length - currentIndex;

    // Add swipe indicators
    const likeIndicator = document.createElement("div");
    likeIndicator.classList.add("indicator", "like");
    likeIndicator.textContent = "❤️ Like";
    card.appendChild(likeIndicator);

    const dislikeIndicator = document.createElement("div");
    dislikeIndicator.classList.add("indicator", "dislike");
    dislikeIndicator.textContent = "❌ Dislike";
    card.appendChild(dislikeIndicator);

    // Preload image
    const img = new Image();
    img.src = cats[currentIndex];
    img.onload = () => card.appendChild(img);

    container.appendChild(card);

    let startX = 0;
    let currentX = 0;
    const threshold = window.innerWidth * 0.25; // 25% of screen width

    card.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    card.addEventListener("touchmove", e => {
        currentX = e.touches[0].clientX - startX;
        const rotate = currentX / 10;
        card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
        card.style.opacity = `${1 - Math.min(Math.abs(currentX)/300, 0.5)}`;

        // Show swipe indicator
        if (currentX > 0) {
            likeIndicator.style.opacity = Math.min(currentX/150, 1);
            dislikeIndicator.style.opacity = 0;
        } else if (currentX < 0) {
            dislikeIndicator.style.opacity = Math.min(Math.abs(currentX)/150, 1);
            likeIndicator.style.opacity = 0;
        } else {
            likeIndicator.style.opacity = 0;
            dislikeIndicator.style.opacity = 0;
        }
    });

    card.addEventListener("touchend", e => {
        if (currentX > threshold) {
            likedCats.push(cats[currentIndex]);
            card.style.transform = `translateX(${window.innerWidth}px) rotate(20deg)`;
        } else if (currentX < -threshold) {
            card.style.transform = `translateX(-${window.innerWidth}px) rotate(-20deg)`;
        } else {
            card.style.transform = "translateX(0) rotate(0)";
            card.style.opacity = 1;
            likeIndicator.style.opacity = 0;
            dislikeIndicator.style.opacity = 0;
            return;
        }

        setTimeout(() => {
            container.removeChild(card);
            currentIndex++;
            createCard();
        }, 300);
    });
}

// Show summary of liked cats
function showSummary() {
    summary.classList.remove("hidden");
    likeCount.textContent = likedCats.length;

    likedCats.forEach(cat => {
        const img = document.createElement("img");
        img.src = cat;
        likedCatsContainer.appendChild(img);
    });
}

// Restart the app
function restart() {
    fetchCats();
}

// Initialize app
fetchCats();
