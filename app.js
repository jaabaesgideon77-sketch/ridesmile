let selectedRating = 0;
let selectedChoice = "";

function show(id) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(id);

  if (target) {
    target.classList.add("active");
  }

  if (id === "dashboard") {
    renderDashboard();
  }
}

function rate(number) {
  selectedRating = number;

  document.querySelectorAll("#stars button").forEach((button, index) => {
    button.classList.toggle("selected", index < number);
  });
}

function pick(button) {
  document.querySelectorAll(".choices button").forEach(item => {
    item.classList.remove("selected");
  });

  button.classList.add("selected");
  selectedChoice = button.textContent.trim();
}

function submitFeedback() {
  const name = document.getElementById("name").value.trim();
  const issue = document.getElementById("issue").value.trim();
  const liked = document.getElementById("liked").value.trim();

  const count = Number(localStorage.getItem("rideSmileCount") || 0);
  const id = "#" + (1001 + count);

  const item = {
    id: id,
    name: name || "Guest",
    rating: selectedRating || 5,
    choice: selectedChoice,
    issue: issue,
    liked: liked
  };

  const list = JSON.parse(
    localStorage.getItem("rideSmileFeedback") || "[]"
  );

  list.unshift(item);

  localStorage.setItem(
    "rideSmileFeedback",
    JSON.stringify(list)
  );

  localStorage.setItem(
    "rideSmileCount",
    String(list.length)
  );

  document.getElementById("feedbackId").textContent = id;
  document.getElementById("viewId").textContent = "ID: " + id;

  document.getElementById("viewName").textContent =
    "Name: " + item.name;

  document.getElementById("viewStars").textContent =
    "★".repeat(item.rating) + "☆".repeat(5 - item.rating);

  document.getElementById("viewComment").textContent =
    item.liked || item.issue || "Thank you for sharing your experience.";

  document.getElementById("name").value = "";
  document.getElementById("issue").value = "";
  document.getElementById("liked").value = "";

  selectedRating = 0;
  selectedChoice = "";

  document.querySelectorAll("#stars button").forEach(button => {
    button.classList.remove("selected");
  });

  document.querySelectorAll(".choices button").forEach(button => {
    button.classList.remove("selected");
  });

  show("success");
}

function renderDashboard() {
  const list = JSON.parse(
    localStorage.getItem("rideSmileFeedback") || "[]"
  );

  const total = list.length;

  const average = total
    ? list.reduce((sum, item) => sum + item.rating, 0) / total
    : 0;

  document.getElementById("total").textContent = total;
  document.getElementById("avg").textContent =
    average.toFixed(1) + " ★";

  document.getElementById("feedbackList").innerHTML =
    total
      ? list.map(item => `
        <div class="card">
          <div class="row">
            <b>${escapeHtml(item.name)}</b>
            <span>${"★".repeat(item.rating)}</span>
          </div>

          <p>${escapeHtml(
            item.liked ||
            item.issue ||
            "No written comment."
          )}</p>
        </div>
      `).join("")
      : `
        <div class="card">
          <p>No feedback yet.</p>
        </div>
      `;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
                                         }
