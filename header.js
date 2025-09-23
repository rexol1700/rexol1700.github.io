// Header scroll behavior
const header = document.querySelector('.site-header');
let lastScrollY = window.scrollY;

function handleScroll() {
  if (window.scrollY > 100) {
    header.classList.add('compact');
  } else {
    header.classList.remove('compact');
  }
  
  lastScrollY = window.scrollY;
}

// Throttle scroll events for better performance
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});

// Initialize header state
handleScroll();

