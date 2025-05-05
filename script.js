// Sample Products with enhanced data
const products = [
  { id: 1, name: "Designer T-Shirt", category: "T-Shirts", price: 120, image: "t_shirt.jpg", description: "Premium cotton blend with futuristic design" },
  { id: 2, name: "Designer Hoodie", category: "Jackets", price: 450, image: "Hoodie.jpeg", description: "Sleek design with smart temperature control" },
  { id: 3, name: "Accessories", category: "Accessories", price: 300, image: "accessories.jpg", description: "Next-gen wearable with holographic display" },
  { id: 4, name: "iPhone 14 Pro", category: "iPhones", price: 999, image: "iPhone.jpg", description: "Latest iPhone with premium finishing" },
  { id: 5, name: "Designer Sneakers", category: "Sneakers", price: 250, image: "sneakers.webp", description: "Ultra-comfortable with LED accents" }
];

// Cart with enhanced functionality
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Parallax effect for hero section
function parallaxEffect() {
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    });
  }
}

// Smooth reveal animation for products
function revealProducts() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
  });
}

// Enhanced product display with loading animation
function displayProducts(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<div class="loading"></div>';

  setTimeout(() => {
    container.innerHTML = products
      .map(
        (product) => `
          <div class="product-card">
            <div class="product-image">
              <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="price">$${product.price}</p>
            <button onclick="addToCart(${product.id})" class="btn add-to-cart">
              Add to Cart
            </button>
          </div>
        `
      )
      .join("");
    
    revealProducts();
  }, 800);
}

// Enhanced cart functionality with animations
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const cartItem = cart.find((item) => item.id === id);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Add feedback animation
  const button = event.target;
  button.classList.add('animate__animated', 'animate__pulse');
  setTimeout(() => button.classList.remove('animate__animated', 'animate__pulse'), 1000);
}

// Enhanced dark mode with smooth transition
function initDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.setAttribute('data-theme', 'dark');
  }

  darkModeToggle.addEventListener("click", () => {
    if (document.body.getAttribute('data-theme') === 'dark') {
      document.body.removeAttribute('data-theme');
      localStorage.setItem("darkMode", "disabled");
    } else {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem("darkMode", "enabled");
    }
  });
}

// Contact form with enhanced validation and feedback
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      if (validateForm(data)) {
        form.classList.add('animate__animated', 'animate__fadeOutUp');
        await simulateSubmission();
        showSuccess();
      }
    });
  }
}

function validateForm(data) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return data.name.length > 2 && emailRegex.test(data.email) && data.message.length > 10;
}

async function simulateSubmission() {
  return new Promise(resolve => setTimeout(resolve, 1000));
}

function showSuccess() {
  const form = document.getElementById("contact-form");
  form.innerHTML = `
    <div class="success-message animate__animated animate__fadeInDown">
      <h2>Thank you for your message!</h2>
      <p>We'll get back to you shortly.</p>
    </div>
  `;
}

// Enhanced cart display
function displayCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout");

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart animate__animated animate__fadeIn">
        <p>Your cart is empty</p>
        <a href="products.html" class="btn">Start Shopping</a>
      </div>
    `;
    cartTotal.textContent = "0";
    checkoutBtn.style.display = "none";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item animate__animated animate__fadeIn">
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="cart-item-details">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="cart-item-quantity">
              <button onclick="updateQuantity(${item.id}, -1)">-</button>
              <span>${item.quantity}</span>
              <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
          </div>
          <div class="cart-item-price">
            <p>$${item.price * item.quantity}</p>
            <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
          </div>
        </div>
      `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = total;
  checkoutBtn.style.display = "block";
}

// Update cart quantity
function updateQuantity(id, change) {
  const cartItem = cart.find((item) => item.id === id);
  if (cartItem) {
    cartItem.quantity += change;
    if (cartItem.quantity <= 0) {
      removeFromCart(id);
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
      updateCartCount();
    }
  }
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// Update cart count
function updateCartCount() {
  const cartCountElements = document.querySelectorAll("#cart-count");
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElements.forEach((el) => (el.textContent = totalItems));
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  parallaxEffect();
  initDarkMode();
  initContactForm();

  // Navigation enhancement
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("nav");
  
  navToggle?.addEventListener("click", () => {
    nav.classList.toggle("open");
    nav.classList.add('animate__animated', 'animate__fadeIn');
  });

  // Featured Products
  if (document.getElementById("featured-products")) {
    displayProducts(products.slice(0, 3), "featured-products");
  }

  // Products Page
  if (document.getElementById("product-grid")) {
    displayProducts(products, "product-grid");

    const categoryFilter = document.getElementById("category-filter");
    const sortPrice = document.getElementById("sort-price");

    const filterProducts = () => {
      let filtered = [...products];
      const category = categoryFilter.value;
      const sort = sortPrice.value;

      if (category !== "all") {
        filtered = filtered.filter((p) => p.category === category);
      }

      if (sort === "low-high") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === "high-low") {
        filtered.sort((a, b) => b.price - a.price);
      }

      displayProducts(filtered, "product-grid");
    };

    categoryFilter?.addEventListener("change", filterProducts);
    sortPrice?.addEventListener("change", filterProducts);
  }

  // Initialize cart
  updateCartCount();

  // Cart Page
  if (document.getElementById("cart-items")) {
    displayCart();
    
    // Clear cart button
    document.getElementById("clear-cart")?.addEventListener("click", () => {
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
      updateCartCount();
    });

    // Checkout button
    document.getElementById("checkout")?.addEventListener("click", () => {
      alert("Thank you for your purchase! This is a demo site.");
      cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      displayCart();
      updateCartCount();
    });
  }
});