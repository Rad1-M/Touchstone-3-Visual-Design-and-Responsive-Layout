// ==========================================
// Touchstone 4: Interactivity & Data Storage
// Client: North Star Bakery
// ==========================================

// --- Data Structures (Arrays & Objects) ---
// Object 1: Bakery configuration and storage keys
const bakeryConfig = {
    name: "North Star Bakery",
    storageKeyFavorites: "northStar_favorites",
    storageKeyPreorderName: "northStar_preorder_name"
};

// Object 2: Product catalog map
const productCatalog = {
    breads: "Artisan Breads",
    pastries: "Pastries & Sweets",
    cakes: "Custom Cakes"
};

// Array 1: Dynamic array for storing selected favorites
let userFavorites = [];

// Array 2: List of valid product categories for validation
const validCategories = ["breads", "pastries", "cakes"];


// ==========================================
// Feature 1: Interactive Favorites Tracker
// ==========================================

// Function 1: Load stored favorites from localStorage
function loadFavorites() {
    const stored = localStorage.getItem(bakeryConfig.storageKeyFavorites);
    if (stored) {
        userFavorites = JSON.parse(stored);
        updateFavoritesUI();
    }
}

// Function 2: Toggle favorite status and persist to localStorage
function toggleFavorite(productName) {
    const index = userFavorites.indexOf(productName);
    if (index === -1) {
        userFavorites.push(productName);
    } else {
        userFavorites.splice(index, 1);
    }
    
    localStorage.setItem(bakeryConfig.storageKeyFavorites, JSON.stringify(userFavorites));
    updateFavoritesUI();
}

// Function 3: Update DOM elements for favorites list, count badge, and button styles
function updateFavoritesUI() {
    const favoritesContainer = document.getElementById("favorites-list");
    const countBadge = document.getElementById("favorites-count");
    
    if (!favoritesContainer) return; // Exit if not on products page
    
    favoritesContainer.innerHTML = "";
    
    if (userFavorites.length === 0) {
        favoritesContainer.innerHTML = "<li>No favorites added yet. Click 'Add to Favorites' on any item!</li>";
    } else {
        userFavorites.forEach(item => {
            const li = document.createElement("li");
            li.textContent = `⭐ ${item}`;
            favoritesContainer.appendChild(li);
        });
    }
    
    if (countBadge) {
        countBadge.textContent = userFavorites.length;
    }
    
    // Update button states on product cards
    const buttons = document.querySelectorAll(".fav-btn");
    buttons.forEach(btn => {
        const item = btn.getAttribute("data-product");
        if (userFavorites.includes(item)) {
            btn.textContent = "❤️ Saved in Favorites";
            btn.classList.add("saved");
        } else {
            btn.textContent = "🤍 Add to Favorites";
            btn.classList.remove("saved");
        }
    });
}


// ==========================================
// Feature 2: Form Validation & Saved Pre-fill
// ==========================================

// Function 4: Save & restore pre-order name in localStorage
function setupFormStorage() {
    const nameInput = document.getElementById("name");
    if (!nameInput) return;

    // Load saved name on page load
    const savedName = localStorage.getItem(bakeryConfig.storageKeyPreorderName);
    if (savedName) {
        nameInput.value = savedName;
    }

    // Save name on input change
    nameInput.addEventListener("input", function() {
        localStorage.setItem(bakeryConfig.storageKeyPreorderName, nameInput.value.trim());
    });
}

// Function 5: Form validation handler
function validatePreorderForm(event) {
    let isValid = true;

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const successMsg = document.getElementById("form-success");

    // Reset messages
    if (nameError) nameError.textContent = "";
    if (emailError) emailError.textContent = "";
    if (successMsg) successMsg.textContent = "";

    // Validation Check 1: Full Name (min 2 characters)
    if (nameInput) {
        if (nameInput.value.trim().length < 2) {
            if (nameError) nameError.textContent = "Please enter your full name (at least 2 characters).";
            isValid = false;
        }
    }

    // Validation Check 2: Valid Email Format
    if (emailInput) {
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailValue === "") {
            if (emailError) emailError.textContent = "Email address is required for pre-order confirmation.";
            isValid = false;
        } else if (!emailRegex.test(emailValue)) {
            if (emailError) emailError.textContent = "Please enter a valid email address (e.g., name@domain.com).";
            isValid = false;
        }
    }

    // Prevent submit on error
    if (!isValid) {
        event.preventDefault();
    } else {
        event.preventDefault(); // Prevent page refresh for demonstration
        if (successMsg) {
            successMsg.textContent = "Thank you! Your pre-order request has been received. We will contact you soon.";
        }
    }
}


// ==========================================
// Event Listeners & Initialization
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
    // Initialize Favorites
    loadFavorites();

    const favButtons = document.querySelectorAll(".fav-btn");
    favButtons.forEach(button => {
        button.addEventListener("click", function() {
            const productName = this.getAttribute("data-product");
            toggleFavorite(productName);
        });
    });

    // Initialize Form Validation & Storage
    setupFormStorage();
    
    const orderForm = document.getElementById("preorder-form");
    if (orderForm) {
        orderForm.addEventListener("submit", validatePreorderForm);
    }
});