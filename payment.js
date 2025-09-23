
function initiateVippsPayment() {
const button = document.getElementById('customVippsPayButton');
const content = button.querySelector('.custom-vipps-content');
const spinner = button.querySelector('.custom-loading-spinner');

// Show loading state
content.style.display = 'none';
spinner.style.display = 'block';
button.disabled = true;

// Simulate Vipps integration
setTimeout(() => {
// Reset button state (remove in production)
content.style.display = 'flex';
spinner.style.display = 'none';
button.disabled = false;

alert('I produksjon vil du nå bli videresendt til Vipps for sikker betaling.');
}, 2000);
}
