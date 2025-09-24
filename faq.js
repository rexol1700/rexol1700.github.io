// Get the answer element that follows the question
    const answer = element.nextElementSibling;
    
    // Toggle the active class on the question
    element.classList.toggle('active');
    
    // Toggle the visibility of the answer
    if (answer.style.maxHeight) {
        answer.style.maxHeight = null;
    } else {
        answer.style.maxHeight = answer.scrollHeight + "px";
    }
    
    // Rotate the arrow icon
    const icon = element.querySelector('.faq-icon');
    icon.style.transform = answer.style.maxHeight ? 'rotate(180deg)' : 'rotate(0)';
}
