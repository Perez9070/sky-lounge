const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
const button = document.getElementById("btn");
const loginForms = document.querySelectorAll(".auth-login-form");
const signupForm = document.querySelector(".auth-signup-form");
const logoutLinks = document.querySelectorAll(".logout-link");
const quoteButton = document.getElementById("quoteBtn");
const heroQuoteButton = document.getElementById("heroQuoteBtn");
const routeFrom = document.getElementById("routeFrom");
const routeTo = document.getElementById("routeTo");
const heroFrom = document.getElementById("heroFrom");
const heroTo = document.getElementById("heroTo");
const routeAircraftClass = document.getElementById("routeAircraftClass");
const heroAircraftClass = document.getElementById("heroAircraftClass");
const routePassengers = document.getElementById("routePassengers");
const priceResult = document.getElementById("priceResult");
const pageName = window.location.pathname.split("/").pop() || "index.html";
const protectedPages = ["home.html", "aircraft.html", "plane.html"];
const publicAuthPages = ["index.html", "login.html", "signup.html"];
const isSignedIn = localStorage.getItem("flightControlSignedIn") === "true";
const accountStorageKey = "flightControlAccount";
const routeCities = [
  { city: "Nairobi", country: "Kenya", lat: -1.286, lon: 36.817 },
  { city: "Cape Town", country: "South Africa", lat: -33.925, lon: 18.424 },
  { city: "Dubai", country: "United Arab Emirates", lat: 25.204, lon: 55.271 },
  { city: "Doha", country: "Qatar", lat: 25.285, lon: 51.531 },
  { city: "London", country: "United Kingdom", lat: 51.507, lon: -0.128 },
  { city: "Paris", country: "France", lat: 48.857, lon: 2.352 },
  { city: "New York", country: "United States", lat: 40.713, lon: -74.006 },
  { city: "Los Angeles", country: "United States", lat: 34.052, lon: -118.244 },
  { city: "Toronto", country: "Canada", lat: 43.653, lon: -79.383 },
  { city: "Sao Paulo", country: "Brazil", lat: -23.555, lon: -46.639 },
  { city: "Istanbul", country: "Turkiye", lat: 41.008, lon: 28.978 },
  { city: "Mumbai", country: "India", lat: 19.076, lon: 72.878 },
  { city: "Singapore", country: "Singapore", lat: 1.352, lon: 103.82 },
  { city: "Tokyo", country: "Japan", lat: 35.676, lon: 139.65 },
  { city: "Sydney", country: "Australia", lat: -33.869, lon: 151.209 },
  { city: "Riyadh", country: "Saudi Arabia", lat: 24.714, lon: 46.675 },
  { city: "Cairo", country: "Egypt", lat: 30.044, lon: 31.236 },
  { city: "Lagos", country: "Nigeria", lat: 6.524, lon: 3.379 }
];
const aircraftPricing = {
  light: { label: "Light Jet", speedMph: 480, hourlyLow: 3500, hourlyHigh: 5500, baseFee: 1800 },
  midsize: { label: "Midsize Jet", speedMph: 500, hourlyLow: 5500, hourlyHigh: 7500, baseFee: 2500 },
  superMidsize: { label: "Super-Midsize Jet", speedMph: 520, hourlyLow: 7500, hourlyHigh: 10500, baseFee: 3500 },
  large: { label: "Large Jet", speedMph: 530, hourlyLow: 9500, hourlyHigh: 14000, baseFee: 5000 },
  ultraLong: { label: "Ultra-Long-Range Jet", speedMph: 560, hourlyLow: 12000, hourlyHigh: 18000, baseFee: 7500 },
  vipAirliner: { label: "VIP Airliner", speedMph: 545, hourlyLow: 16000, hourlyHigh: 26000, baseFee: 12000 }
};

function getSavedAccount() {
  const savedAccount = localStorage.getItem(accountStorageKey);

  if (!savedAccount) {
    return null;
  }

  try {
    return JSON.parse(savedAccount);
  } catch (error) {
    localStorage.removeItem(accountStorageKey);
    return null;
  }
}

function showAuthMessage(form, message, type = "error") {
  const messageElement = form.parentElement.querySelector(".auth-message");

  if (!messageElement) {
    return;
  }

  messageElement.textContent = message;
  messageElement.className = `auth-message ${type}`;
}

function formatCityOption(city) {
  return `${city.country} - ${city.city}`;
}

function populateRouteSelect(select, selectedCity) {
  if (!select) {
    return;
  }

  select.innerHTML = routeCities.map((city, index) => {
    const selected = city.city === selectedCity ? "selected" : "";
    return `<option value="${index}" ${selected}>${formatCityOption(city)}</option>`;
  }).join("");
}

function milesBetween(from, to) {
  const earthRadiusMiles = 3958.8;
  const lat1 = from.lat * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  const deltaLat = (to.lat - from.lat) * Math.PI / 180;
  const deltaLon = (to.lon - from.lon) * Math.PI / 180;
  const a = Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMiles * c;
}

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function calculateQuote() {
  if (!routeFrom || !routeTo || !routeAircraftClass || !routePassengers || !priceResult) {
    return;
  }

  const from = routeCities[Number(routeFrom.value)];
  const to = routeCities[Number(routeTo.value)];
  const pricing = aircraftPricing[routeAircraftClass.value];
  const passengers = Number(routePassengers.value) || 1;

  if (from === to) {
    priceResult.innerHTML = `
      <span class="panel-label">Estimated charter quote</span>
      <strong>Choose two different cities</strong>
      <p>Luxury is lovely, but circling the same airport is not the mission.</p>
    `;
    return;
  }

  const distance = milesBetween(from, to);
  const flightHours = Math.max(1, distance / pricing.speedMph);
  const passengerAdjustment = passengers > 8 ? (passengers - 8) * 250 : 0;
  const lowEstimate = (flightHours * pricing.hourlyLow) + pricing.baseFee + passengerAdjustment;
  const highEstimate = (flightHours * pricing.hourlyHigh) + (pricing.baseFee * 1.35) + passengerAdjustment;
  const nauticalMiles = distance * 0.869;

  priceResult.innerHTML = `
    <span class="panel-label">Estimated charter quote</span>
    <strong>${formatUsd(lowEstimate)} - ${formatUsd(highEstimate)}</strong>
    <p>${formatCityOption(from)} to ${formatCityOption(to)}</p>
    <dl>
      <div><dt>Aircraft</dt><dd>${pricing.label}</dd></div>
      <div><dt>Distance</dt><dd>${Math.round(nauticalMiles).toLocaleString()} nm</dd></div>
      <div><dt>Flight time</dt><dd>${flightHours.toFixed(1)} hrs</dd></div>
      <div><dt>Passengers</dt><dd>${passengers}</dd></div>
    </dl>
    <small>Planning estimate only. Final quotes may include repositioning, landing, handling, crew, taxes, and availability.</small>
  `;
}

function copyHeroRouteToEstimator() {
  if (!heroFrom || !heroTo || !heroAircraftClass || !routeFrom || !routeTo || !routeAircraftClass) {
    return;
  }

  routeFrom.value = heroFrom.value;
  routeTo.value = heroTo.value;
  routeAircraftClass.value = heroAircraftClass.value;
  calculateQuote();
  document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" });
}

if (protectedPages.includes(pageName) && !isSignedIn) {
  window.location.href = "index.html";
}

if (publicAuthPages.includes(pageName) && isSignedIn) {
  window.location.href = "home.html";
}

if (themeToggle) {
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.checked = true;
  }

  themeToggle.addEventListener("change", () => {
    const isDark = themeToggle.checked;

    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

if (button) {
  button.addEventListener("click", () => {
    window.location.href = "aircraft.html";
  });
}

populateRouteSelect(routeFrom, "Nairobi");
populateRouteSelect(routeTo, "Dubai");
populateRouteSelect(heroFrom, "Nairobi");
populateRouteSelect(heroTo, "Dubai");

if (quoteButton) {
  quoteButton.addEventListener("click", calculateQuote);
  calculateQuote();
}

if (heroQuoteButton) {
  heroQuoteButton.addEventListener("click", copyHeroRouteToEstimator);
}

loginForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const savedAccount = getSavedAccount();
    const email = form.querySelector('input[name="email"]').value.trim().toLowerCase();
    const password = form.querySelector('input[name="password"]').value;

    if (!savedAccount) {
      showAuthMessage(form, "Create an account first, then sign in.");
      return;
    }

    if (savedAccount.email !== email || savedAccount.password !== password) {
      showAuthMessage(form, "Email or password is incorrect.");
      return;
    }

    localStorage.setItem("flightControlSignedIn", "true");
    window.location.href = "home.html";
  });
});

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = signupForm.querySelector('input[name="name"]').value.trim();
    const email = signupForm.querySelector('input[name="email"]').value.trim().toLowerCase();
    const password = signupForm.querySelector('input[name="password"]').value;

    if (password.length < 6) {
      showAuthMessage(signupForm, "Use at least 6 characters for your password.");
      return;
    }

    localStorage.setItem(accountStorageKey, JSON.stringify({ name, email, password }));
    localStorage.setItem("flightControlSignedIn", "true");
    window.location.href = "home.html";
  });
}

logoutLinks.forEach((link) => {
  link.addEventListener("click", () => {
    localStorage.removeItem("flightControlSignedIn");
  });
});
