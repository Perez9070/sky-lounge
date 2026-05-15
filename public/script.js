const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
const button = document.getElementById("btn");
const loginForms = document.querySelectorAll(".auth-login-form");
const signupForm = document.querySelector(".auth-signup-form");
const contactForm = document.querySelector(".contact-form");
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
const routeCurrency = document.getElementById("routeCurrency");
const heroCurrency = document.getElementById("heroCurrency");
const priceResult = document.getElementById("priceResult");
const pageName = window.location.pathname.split("/").pop() || "index.html";
const protectedPages = ["home.html", "aircraft.html", "plane.html", "about.html", "contact.html"];
const publicAuthPages = ["index.html", "login.html", "signup.html"];
const isSignedIn = localStorage.getItem("flightControlSignedIn") === "true";
const accountStorageKey = "flightControlAccount";
const currencyStorageKey = "flightControlCurrency";
const supportEmailAddress = "perezmainaabel@gmail.com";
const web3FormsEndpoint = "https://api.web3forms.com/submit";
let web3FormsAccessKeyPromise;
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
  turboprop: { label: "Turboprop", speedMph: 330, hourlyLow: 1800, hourlyHigh: 3000, baseFee: 1400, seats: 8 },
  piston: { label: "Piston Aircraft", speedMph: 125, hourlyLow: 140, hourlyHigh: 260, baseFee: 120, seats: 4 },
  light: { label: "Light Jet", speedMph: 480, hourlyLow: 3500, hourlyHigh: 6000, baseFee: 2400, seats: 7 },
  midsize: { label: "Midsize Jet", speedMph: 500, hourlyLow: 5000, hourlyHigh: 8500, baseFee: 3400, seats: 8 },
  superMidsize: { label: "Super-Midsize Jet", speedMph: 520, hourlyLow: 6500, hourlyHigh: 11000, baseFee: 4800, seats: 10 },
  large: { label: "Heavy Jet", speedMph: 530, hourlyLow: 9000, hourlyHigh: 14000, baseFee: 6800, seats: 14 },
  ultraLong: { label: "Ultra-Long-Range Jet", speedMph: 560, hourlyLow: 12000, hourlyHigh: 20000, baseFee: 9800, seats: 16 },
  vipAirliner: { label: "VIP Airliner", speedMph: 545, hourlyLow: 18000, hourlyHigh: 30000, baseFee: 15000, seats: 50 }
};
const quoteCurrencies = {
  USD: { label: "USD - US Dollar", locale: "en-US", rate: 1 },
  KES: { label: "KES - Kenyan Shilling", locale: "en-KE", rate: 129 },
  EUR: { label: "EUR - Euro", locale: "en-IE", rate: 0.92 },
  GBP: { label: "GBP - Pound Sterling", locale: "en-GB", rate: 0.79 },
  AED: { label: "AED - UAE Dirham", locale: "en-AE", rate: 3.67 },
  QAR: { label: "QAR - Qatari Riyal", locale: "en-QA", rate: 3.64 }
};
const supportPrompts = [
  "How much does a flight cost?",
  "Which aircraft should I choose?",
  "How do I request a quote?",
  "How can I contact support?"
];
const supportQuickLinks = isSignedIn ? [
  { label: "Open route planner", href: "home.html#planner" },
  { label: "View aircraft", href: "aircraft.html" },
  { label: "Contact desk", href: "contact.html" }
] : [
  { label: "Request access", href: "signup.html" },
  { label: "Sign in", href: "login.html" },
  { label: "Email desk", href: `mailto:${supportEmailAddress}` }
];

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

function populateCurrencySelect(select, selectedCurrency) {
  if (!select) {
    return;
  }

  select.innerHTML = Object.entries(quoteCurrencies).map(([code, currency]) => {
    const selected = code === selectedCurrency ? "selected" : "";
    return `<option value="${code}" ${selected}>${currency.label}</option>`;
  }).join("");
}

function saveCurrencyPreference(currencyCode) {
  if (!quoteCurrencies[currencyCode]) {
    return;
  }

  localStorage.setItem(currencyStorageKey, currencyCode);

  if (routeCurrency && routeCurrency.value !== currencyCode) {
    routeCurrency.value = currencyCode;
  }

  if (heroCurrency && heroCurrency.value !== currencyCode) {
    heroCurrency.value = currencyCode;
  }
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

function formatMoney(value, currencyCode) {
  const currency = quoteCurrencies[currencyCode] || quoteCurrencies.USD;

  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0
  }).format(value * currency.rate);
}

function showEmptyQuote() {
  if (!priceResult) {
    return;
  }

  priceResult.innerHTML = `
    <span class="panel-label">Estimated charter quote</span>
    <strong>0.000</strong>
    <p>Edit passengers to calculate your price range.</p>
  `;
}

function calculateQuote() {
  if (!routeFrom || !routeTo || !routeAircraftClass || !routePassengers || !priceResult) {
    return;
  }

  const from = routeCities[Number(routeFrom.value)];
  const to = routeCities[Number(routeTo.value)];
  const pricing = aircraftPricing[routeAircraftClass.value];
  const passengers = Number(routePassengers.value);
  const currencyCode = routeCurrency?.value || localStorage.getItem(currencyStorageKey) || "USD";

  saveCurrencyPreference(currencyCode);

  if (!Number.isFinite(passengers) || passengers <= 0) {
    showEmptyQuote();
    return;
  }

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
  const passengerAdjustment = passengers > pricing.seats ? (passengers - pricing.seats) * 450 : 0;
  const lowEstimate = (flightHours * pricing.hourlyLow) + pricing.baseFee + passengerAdjustment;
  const highEstimate = (flightHours * pricing.hourlyHigh) + (pricing.baseFee * 1.35) + passengerAdjustment;
  const nauticalMiles = distance * 0.869;

  priceResult.innerHTML = `
    <span class="panel-label">Estimated charter quote</span>
    <strong>${formatMoney(lowEstimate, currencyCode)} - ${formatMoney(highEstimate, currencyCode)}</strong>
    <p>${formatCityOption(from)} to ${formatCityOption(to)}</p>
    <dl>
      <div><dt>Aircraft</dt><dd>${pricing.label}</dd></div>
      <div><dt>Distance</dt><dd>${Math.round(nauticalMiles).toLocaleString()} nm</dd></div>
      <div><dt>Flight time</dt><dd>${flightHours.toFixed(1)} hrs</dd></div>
      <div><dt>Passengers</dt><dd>${passengers}</dd></div>
      <div><dt>Hourly range</dt><dd>${formatMoney(pricing.hourlyLow, currencyCode)} - ${formatMoney(pricing.hourlyHigh, currencyCode)}</dd></div>
      <div><dt>Currency</dt><dd>${currencyCode}</dd></div>
    </dl>
    <small>Planning estimate only, benchmarked against 2026 aircraft charter ranges. Final quotes may include repositioning, landing, handling, crew, taxes, overnight costs, and real-time availability.</small>
  `;
}

function copyHeroRouteToEstimator() {
  if (!heroFrom || !heroTo || !heroAircraftClass || !routeFrom || !routeTo || !routeAircraftClass) {
    return;
  }

  routeFrom.value = heroFrom.value;
  routeTo.value = heroTo.value;
  routeAircraftClass.value = heroAircraftClass.value;
  saveCurrencyPreference(heroCurrency?.value || "USD");
  calculateQuote();
  document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" });
}

function initHomeNavHighlight() {
  const navLinks = Array.from(document.querySelectorAll(".home-page .site-header nav a[href^='#']"));

  if (!navLinks.length) {
    return;
  }

  const sectionLinks = navLinks
    .map((link) => ({
      link,
      section: document.querySelector(link.getAttribute("href"))
    }))
    .filter((item) => item.section);

  function setActiveLink(id) {
    sectionLinks.forEach(({ link, section }) => {
      const isActive = section.id === id;

      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActiveLink() {
    const headerOffset = document.querySelector(".site-header")?.offsetHeight || 0;
    const scrollPosition = window.scrollY + headerOffset + 80;
    let currentId = sectionLinks[0].section.id;

    sectionLinks.forEach(({ section }) => {
      if (section.offsetTop <= scrollPosition) {
        currentId = section.id;
      }
    });

    setActiveLink(currentId);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveLink(visibleEntry.target.id);
      }
    }, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0.1, 0.3, 0.6]
    });

    sectionLinks.forEach(({ section }) => observer.observe(section));
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", updateActiveLink);
  updateActiveLink();
}

function getSupportReply(message) {
  const question = message.trim().toLowerCase();

  if (!question) {
    return "Ask me about pricing, aircraft options, route estimates, account access, or how to reach the concierge desk.";
  }

  if (/(price|pricing|cost|rate|quote|expensive|cheap|budget|estimate|money)/.test(question)) {
    return "Pricing depends on route distance, aircraft class, passenger count, airport fees, crew costs, and availability. The route planner gives a market-aware estimate using 2026 hourly ranges: piston aircraft from about $140-$260/hr, turboprops from $1,800-$3,000/hr, light jets from $3,500-$6,000/hr, and ultra-long-range jets from $12,000-$20,000/hr.";
  }

  if (/(aircraft|plane|fleet|cessna|citation|phenom|challenger|gulfstream|boeing|jet|turboprop)/.test(question)) {
    return "For short training or scenic flights, start with the Cessna 172. For regional business trips, compare the Citation CJ4 or Phenom 300. For longer premium missions, the Challenger 350 and Gulfstream G650 are stronger fits. Larger group movement should use the Boeing 737 or a custom VIP airliner quote.";
  }

  if (/(route|city|from|to|distance|nairobi|dubai|london|flight time|planner)/.test(question)) {
    return "Use the route planner on the home page to pick departure city, destination, aircraft class, passengers, and currency. It calculates distance, flight time, hourly range, and a planning quote.";
  }

  if (/(book|booking|reserve|consult|consultation|hire|charter|request)/.test(question)) {
    return "To start a booking conversation, open the contact desk and send your route, date, passenger count, aircraft preference, and currency. The estimate is a planning guide; the final quote depends on live aircraft availability and operating fees.";
  }

  if (/(contact|email|phone|call|whatsapp|support|help|agent|human)/.test(question)) {
    return "You can reach the Flight Control desk by email at perezmainaabel@gmail.com or phone at +254 740 218 358. The team is based in Nairobi, Kenya.";
  }

  if (/(login|sign in|signup|sign up|account|password|access)/.test(question)) {
    return "Create an account from Request Access, then sign in with the same email and password. Passwords need at least 6 characters. This demo stores access locally in the browser.";
  }

  if (/(currency|kes|usd|eur|gbp|aed|qar|shilling|dollar|pound)/.test(question)) {
    return "The estimator supports USD, KES, EUR, GBP, AED, and QAR. Pick your preferred currency in the route planner or hero quote form and the site will remember it.";
  }

  if (/(safe|safety|maintenance|condition|crew|pilot|insurance)/.test(question)) {
    return "Aircraft shown here are planning profiles, not live dispatch records. A final charter process should confirm aircraft availability, operator approvals, maintenance status, crew, insurance, permits, and airport handling before departure.";
  }

  return "I do not have the exact answer for that yet. You can send this question to the Flight Control desk and a person can follow up by email.";
}

function addSupportMessage(messages, message, sender) {
  const bubble = document.createElement("div");
  bubble.className = `support-message ${sender}`;
  bubble.textContent = message;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function shouldSendToEmail(message) {
  const question = message.trim().toLowerCase();

  if (!question) {
    return false;
  }

  return !/(price|pricing|cost|rate|quote|expensive|cheap|budget|estimate|money|aircraft|plane|fleet|cessna|citation|phenom|challenger|gulfstream|boeing|jet|turboprop|route|city|from|to|distance|nairobi|dubai|london|flight time|planner|book|booking|reserve|consult|consultation|hire|charter|request|contact|email|phone|call|whatsapp|support|help|agent|human|login|sign in|signup|sign up|account|password|access|currency|kes|usd|eur|gbp|aed|qar|shilling|dollar|pound|safe|safety|maintenance|condition|crew|pilot|insurance)/.test(question);
}

function getSupportEmailHref(question) {
  const pageUrl = window.location.href;
  const subject = encodeURIComponent("Flight Control customer question");
  const body = encodeURIComponent(`Hello Flight Control,\n\nA customer asked this question in the website chat:\n\n"${question}"\n\nPage: ${pageUrl}\n\nPlease follow up with them.\n`);

  return `mailto:${supportEmailAddress}?subject=${subject}&body=${body}`;
}

async function getWeb3FormsAccessKey() {
  if (!web3FormsAccessKeyPromise) {
    web3FormsAccessKeyPromise = fetch("/api/web3forms-config", {
      headers: {
        Accept: "application/json"
      }
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.accessKey) {
          throw new Error(data.message || "Web3Forms key is missing.");
        }

        return data.accessKey;
      })
      .catch((error) => {
        web3FormsAccessKeyPromise = null;
        throw error;
      });
  }

  return web3FormsAccessKeyPromise;
}

function getWeb3FormsMessage(data, fallback) {
  return data?.message || data?.body?.message || fallback;
}

async function submitToWeb3Forms(payload) {
  const accessKey = await getWeb3FormsAccessKey();
  const response = await fetch(web3FormsEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      access_key: accessKey,
      ...payload,
      submitted_at: new Date().toISOString()
    })
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(getWeb3FormsMessage(data, "Message could not be sent."));
  }

  return data;
}

function addSupportEmailAction(messages, question) {
  const savedAccount = getSavedAccount();
  const form = document.createElement("form");
  form.className = "support-escalation";

  const label = document.createElement("label");
  label.textContent = "Your email for follow-up";

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.required = true;
  emailInput.placeholder = "name@example.com";
  emailInput.value = savedAccount?.email || "";
  emailInput.setAttribute("aria-label", "Your email for support follow-up");

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Send to support";

  const status = document.createElement("p");
  status.className = "support-escalation-status";
  status.setAttribute("aria-live", "polite");

  const fallback = document.createElement("a");
  fallback.className = "support-email-fallback";
  fallback.href = getSupportEmailHref(question);
  fallback.textContent = "Open email app instead";

  label.appendChild(emailInput);
  form.append(label, submitButton, status, fallback);

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitButton.disabled = true;
    status.className = "support-escalation-status";
    status.textContent = "Sending to Flight Control support...";

    try {
      const data = await submitToWeb3Forms({
        subject: "New Support Message from Flight Control",
        from_name: "Flight Control Support",
        email: emailInput.value,
        message: question,
        page_url: window.location.href
      });

      status.className = "support-escalation-status success";
      status.textContent = getWeb3FormsMessage(data, "Sent. Flight Control support will follow up by email.");
      emailInput.disabled = true;
      fallback.style.display = "none";
    } catch (error) {
      status.className = "support-escalation-status error";
      status.textContent = error.message || "Message could not be sent. Please use the email app link.";
      submitButton.disabled = false;
    }
  });

  messages.appendChild(form);
  messages.scrollTop = messages.scrollHeight;
}

function initContactForm() {
  if (!contactForm) {
    return;
  }

  const status = contactForm.querySelector(".contact-form-status");
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const accessKeyInput = contactForm.querySelector('input[name="access_key"]');

  contactForm.action = web3FormsEndpoint;
  contactForm.method = "POST";
  getWeb3FormsAccessKey()
    .then((accessKey) => {
      if (accessKeyInput) {
        accessKeyInput.value = accessKey;
        accessKeyInput.defaultValue = accessKey;
      }
    })
    .catch(() => {});

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const issue = String(formData.get("message") || formData.get("issue") || "").trim();
    const botcheck = String(formData.get("botcheck") || "").trim();

    if (botcheck) {
      return;
    }

    if (!name || !email || !phone || !issue) {
      status.textContent = "Please fill in your contact details and issue.";
      status.className = "contact-form-status error";
      return;
    }

    submitButton.disabled = true;
    status.textContent = "Sending your issue to Flight Control...";
    status.className = "contact-form-status";

    try {
      const data = await submitToWeb3Forms({
        subject: String(formData.get("subject") || "New Contact Issue from Flight Control"),
        from_name: String(formData.get("from_name") || "Flight Control Contact Form"),
        name,
        email,
        phone,
        message: issue,
        page_url: window.location.href
      });

      status.textContent = getWeb3FormsMessage(data, "Sent. Flight Control will follow up.");
      status.className = "contact-form-status success";
      contactForm.reset();
    } catch (error) {
      status.textContent = error.message || "Your issue could not be sent. Please try email or phone.";
      status.className = "contact-form-status error";
    } finally {
      submitButton.disabled = false;
    }
  });
}

function askSupportQuestion(messages, input, question) {
  const trimmedQuestion = question.trim();

  if (!trimmedQuestion) {
    return;
  }

  addSupportMessage(messages, trimmedQuestion, "customer");
  input.value = "";

  window.setTimeout(() => {
    addSupportMessage(messages, getSupportReply(trimmedQuestion), "assistant");

    if (shouldSendToEmail(trimmedQuestion)) {
      addSupportEmailAction(messages, trimmedQuestion);
    }
  }, 180);
}

function initSupportAssistant() {
  if (document.querySelector(".support-assistant")) {
    return;
  }

  const assistant = document.createElement("aside");
  assistant.className = "support-assistant";
  assistant.setAttribute("aria-label", "Flight Control customer support assistant");

  const toggle = document.createElement("button");
  toggle.className = "support-toggle";
  toggle.type = "button";
  toggle.textContent = "?";
  toggle.title = "Open support assistant";
  toggle.setAttribute("aria-label", "Open support assistant");
  toggle.setAttribute("aria-expanded", "false");

  const panel = document.createElement("section");
  panel.className = "support-panel";
  panel.setAttribute("aria-hidden", "true");

  const header = document.createElement("div");
  header.className = "support-header";

  const titleBlock = document.createElement("div");
  const eyebrow = document.createElement("span");
  eyebrow.textContent = "Flight Control AI";
  const title = document.createElement("strong");
  title.textContent = "Customer Support";
  titleBlock.append(eyebrow, title);

  const closeButton = document.createElement("button");
  closeButton.className = "support-close";
  closeButton.type = "button";
  closeButton.textContent = "x";
  closeButton.title = "Close support assistant";
  closeButton.setAttribute("aria-label", "Close support assistant");
  header.append(titleBlock, closeButton);

  const messages = document.createElement("div");
  messages.className = "support-messages";
  messages.setAttribute("aria-live", "polite");
  addSupportMessage(messages, "Hi, I am Flight Control AI. Ask me about pricing, aircraft options, route estimates, or customer support.", "assistant");

  const promptList = document.createElement("div");
  promptList.className = "support-prompts";
  supportPrompts.forEach((prompt) => {
    const promptButton = document.createElement("button");
    promptButton.type = "button";
    promptButton.textContent = prompt;
    promptButton.addEventListener("click", () => askSupportQuestion(messages, input, prompt));
    promptList.appendChild(promptButton);
  });

  const linkList = document.createElement("div");
  linkList.className = "support-links";
  supportQuickLinks.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.textContent = link.label;
    linkList.appendChild(anchor);
  });

  const form = document.createElement("form");
  form.className = "support-form";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Ask a question";
  input.setAttribute("aria-label", "Ask the support assistant a question");

  const submit = document.createElement("button");
  submit.type = "submit";
  submit.textContent = "Send";
  form.append(input, submit);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    askSupportQuestion(messages, input, input.value);
  });

  function setOpen(isOpen) {
    assistant.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close support assistant" : "Open support assistant");
    toggle.title = isOpen ? "Close support assistant" : "Open support assistant";
    panel.setAttribute("aria-hidden", String(!isOpen));

    if (isOpen) {
      input.focus();
    }
  }

  toggle.addEventListener("click", () => {
    setOpen(!assistant.classList.contains("is-open"));
  });

  closeButton.addEventListener("click", () => setOpen(false));
  panel.append(header, messages, promptList, linkList, form);
  assistant.append(toggle, panel);
  document.body.appendChild(assistant);
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

const savedCurrency = localStorage.getItem(currencyStorageKey) || "USD";
populateCurrencySelect(routeCurrency, savedCurrency);
populateCurrencySelect(heroCurrency, savedCurrency);

if (quoteButton) {
  quoteButton.addEventListener("click", calculateQuote);
  showEmptyQuote();
}

if (heroQuoteButton) {
  heroQuoteButton.addEventListener("click", copyHeroRouteToEstimator);
}

[heroFrom, heroTo, heroAircraftClass, heroCurrency].forEach((field) => {
  field?.addEventListener("change", () => {
    if (field === heroCurrency) {
      saveCurrencyPreference(heroCurrency.value);
    }
  });
});

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

if (isSignedIn) {
  initSupportAssistant();
}
initHomeNavHighlight();
initContactForm();
