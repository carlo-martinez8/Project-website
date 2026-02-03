// Simple shared behavior for all pages

// Mobile navigation toggle
function setupNavToggle() {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("header nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

// Lightweight contact form handling
function setupContactForm() {
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = form.querySelector("[data-form-status]");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = form.elements["name"].value.trim();
    var email = form.elements["email"].value.trim();
    var message = form.elements["message"].value.trim();

    if (!name || !email || !message) {
      if (status) {
        status.textContent = "Please fill in all required fields.";
        status.className = "form-status error";
      }
      return;
    }

    if (status) {
      status.textContent = "Thanks, your message has been captured locally (no network request made).";
      status.className = "form-status success";
    }

    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupNavToggle();
  setupContactForm();
});

