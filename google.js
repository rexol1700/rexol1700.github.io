
function leaveGoogleReview() {
// Replace YOUR-GOOGLE-BUSINESS-ID with your actual Google Business profile ID
// You can find this in your Google My Business URL
const googleReviewUrl = 'https://g.page/r/YOUR-GOOGLE-BUSINESS-ID/review';

window.open(googleReviewUrl, '_blank');

const btn = event.target;
const originalText = btn.innerHTML;
btn.innerHTML = '💙 TAKK FOR HJELPEN!';
btn.style.background = '#4285F4';
btn.style.color = 'white';

setTimeout(() => {
btn.innerHTML = originalText;
btn.style.background = '#ffffff';
btn.style.color = '#4285F4';
}, 3000);

// Analytics tracking (if you have Google Analytics)
if (typeof gtag !== 'undefined') {
gtag('event', 'google_review_click', {
'event_category': 'review_engagement',
'event_label': 'google_review'
});
}
}
