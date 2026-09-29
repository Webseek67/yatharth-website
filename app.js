// ---- Site-wide config: edit these three values ----
window.SITE = {
  SHEET_URL: 'https://script.google.com/macros/s/AKfycbweyQ5oNMB894yJBfLbAxsgJSbxzLIUqJts8IxUZZn7tG-psB9YYGvyWpyXN-BYI-W8/exec',
  WHATSAPP: '918849125463',
  PHONE: '+918849125463'
};

document.addEventListener('DOMContentLoaded', function () {
  // mobile nav toggle
  var burger = document.querySelector('.burger'), links = document.querySelector('.navlinks');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }

  // scroll reveal
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    els.forEach(function (e) { io.observe(e); });
  } else {
    els.forEach(function (e) { e.classList.add('in'); });
  }

  // whatsapp / call links
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = 'https://wa.me/' + window.SITE.WHATSAPP + '?text=' + encodeURIComponent('Hello Yatharth Solutions, I would like to discuss my investment requirements.');
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-call]').forEach(function (a) { a.href = 'tel:' + window.SITE.PHONE; });

  // contact form
  var f = document.getElementById('f');
  if (f) {
    var m = document.getElementById('msg'), sb = f.querySelector('button[type=submit]');
    function say(t, ok) { m.style.color = ok ? '#146356' : '#B42318'; m.textContent = t; }
    // prefill goal from a "?goal=" query param (used by product pages' CTAs)
    var qp = new URLSearchParams(location.search);
    if (qp.get('goal') && f.goal) f.goal.value = qp.get('goal');

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      if (f.company.value) return; // honeypot
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var name = f.n.value.trim();
      var ph = f.p.value.replace(/[\s\-()]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, '');
      var email = f.e.value.trim();
      if (name.length < 2) { say('Please enter your full name.'); return; }
      if (!/^[6-9]\d{9}$/.test(ph)) { say('Please enter a valid 10-digit mobile number.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say('Please enter a valid email address.'); return; }
      if (!f.consent.checked) { say('Please tick the consent box so we can contact you.'); return; }
      if (window.SITE.SHEET_URL.indexOf('PASTE') === 0) { say('The form is not connected yet. Please add the Google Sheets URL.'); return; }
      sb.disabled = true; sb.textContent = 'Sending...'; say('');
      var d = new URLSearchParams({ name: name, mobile: '+91' + ph, email: email, iam: f.iam.value, amount: f.amount.value, goal: f.goal.value, page: location.href });
      fetch(window.SITE.SHEET_URL, { method: 'POST', mode: 'no-cors', body: d }).then(function () {
        f.reset(); say('Thank you. We have received your request and will call you shortly.', true);
      }).catch(function () {
        say('Sorry, something went wrong. Please try again or reach us on WhatsApp.');
      }).finally(function () { sb.disabled = false; sb.textContent = 'Request a call'; });
    });
  }
});
