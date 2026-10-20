/* DE-GREENS INNOVATION — site behaviour (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* WhatsApp / contact constants (confirmed company details) */
  var WA_NUMBER = '233504618929';
  var WA_DEFAULT_MSG = "Hello De-Greens Innovation, I'd like to request a quote for my project.";
  var EMAIL = 'degreensinnovationltd@gmail.com';
  function waLink(msg) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg || WA_DEFAULT_MSG);
  }
  $$('a[data-wa]').forEach(function (a) {
    a.href = waLink(a.getAttribute('data-wa') || null);
  });

  /* Footer year */
  $$('.js-year').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* Mobile navigation */
  var toggle = $('.nav-toggle');
  var panel = $('.nav-mobile');
  if (toggle && panel) {
    var closeNav = function () {
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeNav(); }
    });
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && !toggle.contains(e.target)) closeNav();
    });
  }

  /* Scroll reveal */
  var revealEls = $$('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------------- Our Work: filtering + lightbox ---------------- */
  var workGrid = $('.work-grid');
  var filterBtns = $$('.filter-btn');
  if (workGrid && filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        var cat = btn.getAttribute('data-filter');
        $$('.work-item', workGrid).forEach(function (item) {
          var cats = item.getAttribute('data-category') || '';
          item.classList.toggle('hide', cat !== 'all' && cats.indexOf(cat) === -1);
        });
      });
    });
  }

  var items = $$('.work-item');
  if (items.length) {
    var lb = $('.lightbox');
    if (lb) {
      var lbImg = $('.lightbox__stage img', lb);
      var lbCap = $('.lightbox__cap', lb);
      var lbTitle = $('.lightbox__cap strong', lb);
      var lbCat = $('.lightbox__cap small', lb);
      var current = 0;
      var visible = function () {
        return items.filter(function (i) { return !i.classList.contains('hide'); });
      };
      var show = function (idx) {
        var list = visible();
        current = (idx + list.length) % list.length;
        var item = list[current];
        var img = $('img', item);
        var btn = $('.thumb', item);
        lbImg.src = btn.getAttribute('data-full') || (img ? img.src : '');
        lbTitle.textContent = btn.getAttribute('data-title') || '';
        lbCat.textContent = btn.getAttribute('data-cats') || '';
        lbImg.alt = img ? (img.alt || '') : '';
      };
      var openLb = function (idx) {
        show(idx);
        lb.hidden = false;
        document.body.style.overflow = 'hidden';
        $('.lightbox__close', lb).focus();
      };
      var closeLb = function () {
        lb.hidden = true;
        document.body.style.overflow = '';
        if (lastFocus) lastFocus.focus();
      };
      var lastFocus = null;
      items.forEach(function (item) {
        var btn = $('.thumb', item);
        btn.addEventListener('click', function () {
          lastFocus = btn;
          openLb(visible().indexOf(item));
        });
      });
      $('.lightbox__close', lb).addEventListener('click', closeLb);
      $('.lightbox__nav--prev', lb).addEventListener('click', function () { show(current - 1); $('.lightbox__nav--prev', lb).focus(); });
      $('.lightbox__nav--next', lb).addEventListener('click', function () { show(current + 1); $('.lightbox__nav--next', lb).focus(); });
      lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
      document.addEventListener('keydown', function (e) {
        if (lb.hidden) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
        if (e.key === 'Tab') {
          var f = $$('button, [href]', lb).filter(function (el) { return el.offsetParent !== null; });
          if (!f.length) return;
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
    }
  }

  /* ---------------- Quote form (contact page) ---------------- */
  var form = $('#quote-form');
  if (form) {
    var successPanel = $('#form-success');
    var previewEl = $('#msg-preview');
    var waSendBtn = $('#send-wa');
    var mailSendBtn = $('#send-mail');

    /* prefill service from ?service= (e.g. contact.html?service=branding-identity) */
    try {
      var svc = new URLSearchParams(location.search).get('service');
      if (svc) {
        var sel = $('#f-service');
        var norm = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); };
        $$('option', sel).forEach(function (o) {
          if (o.value && norm(o.value) === norm(svc)) sel.value = o.value;
        });
      }
    } catch (e) { /* older browsers: ignore */ }

    var fileNames = [];
    var fileInput = $('#f-files');
    if (fileInput) {
      fileInput.addEventListener('change', function () {
        fileNames = Array.prototype.map.call(fileInput.files || [], function (f) { return f.name; });
        $('#file-list').textContent = fileNames.length
          ? 'Will be shared in the chat: ' + fileNames.join(', ')
          : '';
      });
    }

    var setError = function (id, msg) {
      var field = $('#' + id).closest('.f-field');
      var errEl = $('.f-error', field);
      if (msg) {
        field.classList.add('has-error');
        errEl.textContent = msg;
        $('#' + id).setAttribute('aria-invalid', 'true');
      } else {
        field.classList.remove('has-error');
        errEl.textContent = '';
        $('#' + id).removeAttribute('aria-invalid');
      }
      return !msg;
    };

    var buildMessage = function () {
      var v = function (id) { var el = $('#' + id); return el ? el.value.trim() : ''; };
      var lines = [
        '*Quote request — De-Greens Innovation*',
        '',
        'Name: ' + v('f-name'),
        'Company / Organization: ' + (v('f-company') || '—'),
        'Phone / WhatsApp: ' + v('f-phone'),
        'Email: ' + (v('f-email') || '—'),
        'Service needed: ' + v('f-service'),
        'Quantity: ' + (v('f-qty') || '—'),
        'Deadline: ' + (v('f-deadline') || '—'),
        'Budget: ' + (v('f-budget') || 'Not specified'),
        '',
        'Project description:',
        v('f-desc')
      ];
      if (v('f-notes')) { lines.push('', 'Additional notes: ' + v('f-notes')); }
      if (fileNames.length) { lines.push('', 'Reference files to be shared in chat: ' + fileNames.join(', ')); }
      lines.push('', '(Sent from the De-Greens Innovation website)');
      return lines.join('\n');
    };

    var validate = function () {
      var ok = true;
      var v = function (id) { return $('#' + id).value.trim(); };
      ok = setError('f-name', v('f-name').length >= 2 ? '' : 'Please enter your name.') && ok;
      var digits = v('f-phone').replace(/\D/g, '');
      ok = setError('f-phone', digits.length >= 9 ? '' : 'Please enter a valid phone / WhatsApp number.') && ok;
      var email = v('f-email');
      ok = setError('f-email', (!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ? '' : 'Please enter a valid email address.') && ok;
      ok = setError('f-service', v('f-service') ? '' : 'Please choose a service.') && ok;
      ok = setError('f-desc', v('f-desc').length >= 10 ? '' : 'Please describe your project (at least a sentence).') && ok;
      return ok;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        var firstErr = $('.has-error input, .has-error select, .has-error textarea', form);
        if (firstErr) firstErr.focus();
        return;
      }
      var msg = buildMessage();
      previewEl.textContent = msg.replace(/\*/g, '');
      waSendBtn.href = waLink(msg);
      mailSendBtn.href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent('Quote request — ' + $('#f-service').value) +
        '&body=' + encodeURIComponent(msg.replace(/\*/g, ''));
      form.hidden = true;
      successPanel.hidden = false;
      successPanel.setAttribute('tabindex', '-1');
      successPanel.focus();
      window.open(waLink(msg), '_blank', 'noopener');
    });

    var editAgain = $('#edit-again');
    if (editAgain) {
      editAgain.addEventListener('click', function () {
        successPanel.hidden = true;
        form.hidden = false;
        $('#f-name').focus();
      });
    }
  }
})();
