const movies = [
    {title: "Pushpa2", image: "https://res.cloudinary.com/dnuzyfts7/image/upload/v1739811502/Pushpa_2_ixzwmi.jpg"},
    {title: "Thandel", image: "https://res.cloudinary.com/dnuzyfts7/image/upload/v1739811570/download_1_x818my.jpg"},
    {title: "Kalki 2898ad", image: "https://res.cloudinary.com/dnuzyfts7/image/upload/v1739811525/IMAX_Poster_Design___Kalki_2898_AD_Fan_Made_Design_edit_liizxk.jpg"},
    {title: "Laila", image: "https://res.cloudinary.com/dnuzyfts7/image/upload/v1739811623/Vishwak-Sen-Laila-Movie-Stylish-First-Look-Poster-HD_w55b4o.webp"},
    {title: "Ee nagaraniki Yemaindhi", image: "https://res.cloudinary.com/dnuzyfts7/image/upload/v1739811478/Ee_nagaraniki_em_ayindi___mjvzwu.jpg"},
    {title: "Devara", image: "https://res.cloudinary.com/dnuzyfts7/image/upload/v1739811485/Devara_Jr_NTR_dnrfcp.jpg"},
    {title: "Arjun Reddy", image: "https://res.cloudinary.com/dnuzyfts7/image/upload/v1739811775/images_2_cgewwo.jpg"},
    {title: "Lucky Baskhar", image: "https://res.cloudinary.com/dnuzyfts7/image/upload/v1739811258/lucky-baskhar-review-30565423-3x4_x7h2qu.webp"},
    {title: "Game Changer", image: "https://res.cloudinary.com/dnuzyfts7/image/upload/v1739811516/game_changer_wiscbd.jpg"},
    {title: "Daaku Maharaj", image: "https://res.cloudinary.com/dnuzyfts7/image/upload/v1739811472/1_ew1m3h.jpg"}
];

const moviesContainer = document.getElementById("movies-container");

movies.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
        <img src="${movie.image}" alt="${movie.title} Poster">
        <h2>${movie.title}</h2>
        <div class="rating">
            ${[5, 4, 3, 2, 1].map(num => `
                <input type="radio" name="rating${index}" id="star${num}-${index}" value="${num}">
                <label for="star${num}-${index}">★</label>
            `).join('')}
        </div>
        <textarea id="review${index}" class="review-textbox" placeholder="Write your review..." rows="3"></textarea>
        <button class="rate-btn" onclick="submitReview('${movie.title}', ${index})">Submit Review</button>
        <div class="reviews" id="reviews${index}"></div>
    `;

    moviesContainer.appendChild(movieCard);
    loadReviews(movie.title, index);
});

function submitReview(title, index) {
    const reviewText = document.getElementById(`review${index}`).value;
    const rating = document.querySelector(`input[name="rating${index}"]:checked`);

    if (!rating || !reviewText) {
        alert("Please select a rating and write a review.");
        return;
    }

    fetch("/submit_review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, review: reviewText, rating: rating.value })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        loadReviews(title, index);
    });
}

function loadReviews(title, index) {
    fetch(`/get_reviews/${title}`)
    .then(response => response.json())
    .then(reviews => {
        const reviewsContainer = document.getElementById(`reviews${index}`);
        reviewsContainer.innerHTML = reviews.map(r => `
            <div class="review-item"><strong>${r[1]}★</strong>: ${r[0]}</div>
        `).join('');
    });
}
