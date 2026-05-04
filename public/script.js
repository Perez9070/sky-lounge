const button = document.getElementById("btn");


const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");

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
