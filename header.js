// Add this script to enable the scroll behavior
document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  
  function updateHeader() {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScrollY;
  }
  
  // Throttle the scroll event for performance
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  });
  
  // Initial check
  updateHeader();
});
