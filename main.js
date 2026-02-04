// Modern JavaScript (ES6+) for interactive functionality

// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mark active link based on current page
const setActiveNavFromPath = () => {
    if (!navLinks.length) return;
  
    // current route: "/about" -> "about", "/" -> "index"
    let current = window.location.pathname.replace(/\/+$/, "").split("/").pop() || "index";
    current = current.replace(".html", "");
  
    navLinks.forEach((link) => {
      // prefer data-page if you use it, else href
      const raw = (link.dataset.page || link.getAttribute("href") || "").trim();
  
      // normalize target: "/about/" -> "about", "about.html" -> "about"
      let target = raw.replace(/\/+$/, "").split("/").pop() || "index";
      target = target.replace(".html", "");
  
      // special-case home links: "", "#", "index", "index.html", "/"
      const isHomeTarget = raw === "" || raw === "#" || raw === "/" || target === "index";
  
      const isActive = current === target || (current === "index" && isHomeTarget);
      link.classList.toggle("active", isActive);
    });
  };
  
// Toggle mobile navigation menu
const toggleNav = () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
};

// Close mobile menu when clicking outside
const closeNavOnClickOutside = (event) => {
    if (
        navMenu.classList.contains('active') &&
        !navToggle.contains(event.target) &&
        !navMenu.contains(event.target)
    ) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    }
};

// Handle navigation link clicks
const handleNavClick = (event) => {
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    event.currentTarget.classList.add('active');
    
    // Close mobile menu if open
    if (navMenu.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    }
};

// Initialize event listeners
const init = () => {
    setActiveNavFromPath();

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleNav);
    }

    // Close menu on outside click
    document.addEventListener('click', closeNavOnClickOutside);

    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            handleNavClick(event);
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        }, 250);
    });

    // Keyboard navigation support
    navLinks.forEach(link => {
        link.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                link.click();
            }
        });
    });
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
