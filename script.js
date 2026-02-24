const container = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likeCount = document.getElementById("like-count");
const likedCatsContainer = document.getElementById("liked-cats");

let cats = [];
let likedCats = [];
let currentIndex = 0;

async function fetchCats() {
    cats = [];
    likedCats = [];
    currentIndex = 0;
    likedCatsContainer.innerHTML = "";
    summary.classList.add("hidden");

    // generate 15 random cat URLs
    for (let i = 0; i < 15; i++) {
        cats.push(`https://cataas.com/cat?${Math.random()}`);
    }
    createCard();
}

function createCard() {
    if (currentIndex >= cats.length) {
        showSummary();
        return;
    }

    const card = document.createElement("div");
    card.classList.add("card");
    card.style.zIndex = cats.length - currentIndex; // stacking effect

    const img = new Image();
    img.src = cats[currentIndex];
    img.onload = () => card.appendChild(img);

    container.appendChild(card);

    let startX = 0;
    let currentX = 0;

    const threshold = window.innerWidth * 0.25; // responsive swipe threshold

    card.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    card.addEventListener("touchmove", e => {
        currentX = e.touches[0].clientX - startX;
        const rotate = currentX / 10;
        card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
        // optional opacity feedback
        card.style.opacity = `${1 - Math.min(Math.abs(currentX)/300, 0.5)}`;
    });

    card.addEventListener("touchend", e => {
        const diff = currentX;

        if (diff > threshold) {
            likedCats.push(cats[currentIndex]);
            card.style.transform = `translateX(${window.innerWidth}px) rotate(20deg)`;
        } else if (diff < -threshold) {
            card.style.transform = `translateX(-${window.innerWidth}px) rotate(-20deg)`;
        } else {
            card.style.transform = "translateX(0) rotate(0)";
            card.style.opacity = 1;
            return;
        }

        setTimeout(() => {
            container.removeChild(card);
            currentIndex++;
            createCard();
        }, 300);
    });
}

function showSummary() {
    summary.classList.remove("hidden");
    likeCount.textContent = likedCats.length;

    likedCats.forEach(cat => {
        const img = document.createElement("img");
        img.src = cat;
        likedCatsContainer.appendChild(img);
    });
}

function restart() {
    fetchCats();
}

// initialize
fetchCats();
