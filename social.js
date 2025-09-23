(function(){
function safeGtag(){ if(typeof window.gtag === 'function'){ gtag.apply(null, arguments); } }

// Vipps
window.initiateVippsPayment = function(){
var button = document.getElementById('vippsPayButton') || document.getElementById('customVippsPayButton');
if (!button) return;
var content = button.querySelector('.vipps-content, .custom-vipps-content');
var spinner = button.querySelector('.loading-spinner, .custom-loading-spinner');

safeGtag('event','payment_initiated',{event_category:'Payment',event_label:'Vipps',value:850});

if (content && spinner){
content.style.display = 'none';
spinner.style.display = 'block';
button.disabled = true;
}

setTimeout(function(){
safeGtag('event','payment_redirect',{event_category:'Payment',event_label:'Vipps_Redirect'});
if (content && spinner){
content.style.display = 'flex';
spinner.style.display = 'none';
button.disabled = false;
}
alert('I produksjon vil du nå bli videresendt til Vipps for sikker betaling.');
}, 2000);
};

// Instagram
window.shareInstagram = function(ev){
var btn = ev && ev.currentTarget ? ev.currentTarget : null;
var text = `Ren lykksalighet på Oceanside Bastu 🔥🌊 Ingenting slår norsk bastukultur! Perfekt varme, fantastisk utsikt, og den magiske følelsen av å være ett med naturen. #OceansideBastu #NorgeBastu #BastuLiv #Hygge #NorskNatur #SaunaLife #Wellness #NatureTherapy`;

if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(text).then(function(){
if (!btn) return;
var original = btn.innerHTML;
btn.innerHTML = '📋 TEKST KOPIERT!';
btn.style.background = '#28a745';
btn.style.color = '#fff';
setTimeout(function(){
btn.innerHTML = original;
btn.style.background = 'linear-gradient(45deg, #833AB4, #E4405F)';
btn.style.color = '#fff';
}, 2000);
}).catch(function(){});
}

var isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
window.open(isMobile ? 'instagram://camera' : 'https://www.instagram.com/', '_blank');

safeGtag('event','instagram_share_click',{event_category:'social_engagement',event_label:'instagram_share'});
};

// Facebook
window.followFacebook = function(ev){
var btn = ev && ev.currentTarget ? ev.currentTarget : null;
window.open('https://www.facebook.com/nytsauna', '_blank'); // replace with your page
if (btn){
var original = btn.innerHTML;
btn.innerHTML = '✅ TAKK!';
btn.style.background = '#28a745';
btn.style.color = '#fff';
setTimeout(function(){
btn.innerHTML = original;
btn.style.background = '#ffffff';
btn.style.color = '#1877F2';
}, 2000);
}
safeGtag('event','facebook_follow_click',{event_category:'social_engagement',event_label:'facebook_follow'});
};

// Track payment section view (works with either class set)
function onReady(fn){ if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fn);} else { fn(); } }
onReady(function(){
var el = document.querySelector('.payment-section, .custom-payment-wrapper');
if (el && 'IntersectionObserver' in window) {
var obs = new IntersectionObserver(function(entries){
entries.forEach(function(entry){
if (entry.isIntersecting) {
safeGtag('event','section_view',{event_category:'Engagement',event_label:'Payment_Section'});
obs.disconnect();
}
});
}, { threshold: 0.2 });
obs.observe(el);
}
});
})();
