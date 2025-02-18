// DOM Elements
const addReviewBtn = document.getElementById('addReviewBtn');
const modal = document.getElementById('addReviewModal');
const reviewForm = document.getElementById('reviewForm');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const filterRating = document.getElementById('filterRating');
const reviewsContainer = document.getElementById('reviewsContainer');
const darkModeToggle = document.getElementById('darkModeToggle');

// State
let reviews = [];

// Dark Mode
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
    document.body.setAttribute('data-theme', 'dark');
    darkModeToggle.textContent = '☀️';
}

darkModeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    darkModeToggle.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('darkMode', !isDark);
});

// Fetch reviews from backend
async function fetchReviews() {
    try {
        const response = await fetch('/api/reviews');
        reviews = await response.json();
        renderReviews();
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

// Event Listeners
addReviewBtn.addEventListener('click', () => modal.style.display = 'block');
cancelBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

searchInput.addEventListener('input', renderReviews);
filterRating.addEventListener('change', renderReviews);

reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newReview = {
        title: document.getElementById('movieTitle').value,
        year: parseInt(document.getElementById('movieYear').value),
        rating: parseInt(document.querySelector('input[name="rating"]:checked').value),
        review: document.getElementById('review').value,
        poster: document.getElementById('moviePoster').value || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=800'
    };
    
    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newReview),
        });
        
        if (response.ok) {
            const savedReview = await response.json();
            reviews.unshift(savedReview);
            reviewForm.reset();
            modal.style.display = 'none';
            renderReviews();
        }
    } catch (error) {
        console.error('Error adding review:', error);
    }
});

// Render Functions
function getStarRating(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function renderReviews() {
    const searchTerm = searchInput.value.toLowerCase();
    const ratingFilter = filterRating.value;
    
    let filteredReviews = reviews.filter(review => {
        const matchesSearch = review.title.toLowerCase().includes(searchTerm) ||
                            review.review.toLowerCase().includes(searchTerm);
        const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
        return matchesSearch && matchesRating;
    });
    
    reviewsContainer.innerHTML = filteredReviews.map(review => `
        <article class="review-card">
            <img src="${review.poster}" alt="${review.title}" class="review-poster">
            <h3>${review.title} (${review.year})</h3>
            <div class="review-meta">
                Reviewed on ${formatDate(review.date)}
            </div>
            <div class="review-rating">
                ${getStarRating(parseInt(review.rating))}
            </div>
            <p class="review-text">${review.review}</p>
        </article>
    `).join('');
}

// Initial fetch
fetchReviews();