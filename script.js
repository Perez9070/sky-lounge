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
    localStorage.setItem("flightControlSignedIn", "true");
    window.location.href = "home.html";
  });
});

if (signupForm) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    localStorage.setItem("flightControlSignedIn", "true");
    window.location.href = "home.html";
  });
}

logoutLinks.forEach((link) => {
  link.addEventListener("click", () => {
    localStorage.removeItem("flightControlSignedIn");
  });
});
