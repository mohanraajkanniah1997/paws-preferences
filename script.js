const container = document.getElementById("card-container");
const summary = document.getElementById("summary");
const likeCount = document.getElementById("like-count");
const likedCatsContainer = document.getElementById("liked-cats");

let cats = [];
let likedCats = [];
let currentIndex = 0;

async function fetchCats() {
    for (let i = 0; i < 15; i++) {
        cats.push(`https://cataas.com/cat?${i}`);
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

    const img = document.createElement("img");
    img.src = cats[currentIndex];

    card.appendChild(img);
    container.appendChild(card);

    let startX = 0;

    card.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
    });

    card.addEventListener("touchmove", e => {
        let moveX = e.touches[0].clientX - startX;
        card.style.transform = `translateX(${moveX}px) rotate(${moveX/10}deg)`;
    });

    card.addEventListener("touchend", e => {
        let endX = e.changedTouches[0].clientX;
        let diff = endX - startX;

        if (diff > 100) {
            likedCats.push(cats[currentIndex]);
            card.style.transform = "translateX(500px)";
        } else if (diff < -100) {
            card.style.transform = "translateX(-500px)";
        } else {
            card.style.transform = "translateX(0)";
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
    cats = [];
    likedCats = [];
    currentIndex = 0;
    likedCatsContainer.innerHTML = "";
    summary.classList.add("hidden");
    fetchCats();
}

fetchCats();