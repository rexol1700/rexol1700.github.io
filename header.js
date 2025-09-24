// Mobile sticky navigation
function initMobileStickyNav() {
  const header = document.querySelector('.site-header');
  let lastScrollTop = 0;
  let isScrolled = false;

  // Only apply on mobile
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function handleScroll() {
    if (!isMobile()) {
      // Remove scrolled class on desktop
      if (header.classList.contains('scrolled')) {
        header.classList.remove('scrolled');
      }
      return;
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50 && !isScrolled) {
      header.classList.add('scrolled');
      isScrolled = true;
    } else if (scrollTop <= 50 && isScrolled) {
      header.classList.remove('scrolled');
      isScrolled = false;
    }
  }

  // Throttle scroll events for better performance
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll);
  window.addEventListener('resize', handleScroll); // Handle orientation changes
}

// Smooth scroll function for nav links
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Get header height for offset
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update active state
        navLinks.forEach(nl => nl.classList.remove('active'));
        link.classList.add('active');
      }
    });
  });
}

// Update active nav link based on scroll position
function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    const headerHeight = document.querySelector('.site-header').offsetHeight;
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 100; // Adding offset for better UX
      const sectionHeight = section.offsetHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initMobileStickyNav();
  initSmoothScroll();
  updateActiveNavOnScroll();
});
