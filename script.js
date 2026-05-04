const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
const button = document.getElementById("btn");
const loginForms = document.querySelectorAll(".auth-login-form");
const signupForm = document.querySelector(".auth-signup-form");
const logoutLinks = document.querySelectorAll(".logout-link");
const pageName = window.location.pathname.split("/").pop() || "index.html";
const protectedPages = ["home.html", "aircraft.html", "plane.html"];
const publicAuthPages = ["index.html", "login.html", "signup.html"];
const isSignedIn = localStorage.getItem("flightControlSignedIn") === "true";
const accountStorageKey = "flightControlAccount";

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
