/* ============================================================
   AMIT LEGACY ESTATES — Form Email Handler
   Sends all form data to info@amitlegacyestates.com
   Uses Web3Forms API (free, no backend needed)
   ============================================================
   
   SETUP REQUIRED (one-time):
   1. Go to https://web3forms.com
   2. Enter: info@amitlegacyestates.com
   3. Check your email and click the activation link
   4. Copy the Access Key and replace WEB3FORMS_ACCESS_KEY below
   ============================================================ */

const WEB3FORMS_ACCESS_KEY = '88f50a89-6bf3-41a6-a9b8-cf6b8137aef5'; // <-- Replace this after activation

(function initEmailForms() {
  document.querySelectorAll('form[data-form]').forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      const origText = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Collect form data
      const formData = new FormData(form);
      const formName = form.getAttribute('data-form') || 'Website Form';
      
      // Build email body from all fields
      const fields = {};
      form.querySelectorAll('input, select, textarea').forEach(function(field) {
        if (field.name || field.placeholder) {
          const key = field.name || field.getAttribute('aria-label') || field.placeholder || field.type;
          const label = form.querySelector('label[for="' + field.id + '"]');
          const labelText = label ? label.textContent.replace('*','').trim() : key;
          if (field.value && field.value.trim()) {
            fields[labelText] = field.value;
          }
        }
      });

      // Also collect by label proximity
      const allFields = {};
      form.querySelectorAll('.form-group, .form-row-2 .form-group').forEach(function(group) {
        const lbl = group.querySelector('.form-label, label');
        const inp = group.querySelector('input, select, textarea');
        if (lbl && inp && inp.value && inp.value.trim()) {
          allFields[lbl.textContent.replace('*','').trim()] = inp.value;
        }
      });

      // Format message
      const fieldLines = Object.keys(allFields).length > 0
        ? Object.entries(allFields).map(([k,v]) => k + ': ' + v).join('\n')
        : Object.entries(fields).map(([k,v]) => k + ': ' + v).join('\n');

      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'New Enquiry — ' + formName.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase()) + ' | Amit Legacy Estates',
        from_name: 'Amit Legacy Estates Website',
        to_email: 'info@amitlegacyestates.com',
        message: 'Form: ' + formName + '\n\n' + fieldLines + '\n\n---\nSent from amitlegacyestates.com',
        botcheck: ''
      };

      // Also include all named inputs
      form.querySelectorAll('input[name], select[name], textarea[name]').forEach(function(el) {
        if (el.value) payload[el.name] = el.value;
      });

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          btn.textContent = '✓ Sent! We\'ll contact you shortly.';
          btn.style.background = '#25D366';
          btn.style.color = '#fff';

          // Show success state if project page
          const successEl = form.parentNode && form.parentNode.querySelector('[id$="-form-success"]');
          if (successEl) {
            setTimeout(function() {
              form.style.display = 'none';
              successEl.style.display = 'block';
            }, 1200);
          }

          // Close popup if inside one
          const popup = form.closest('.lead-popup');
          if (popup) {
            setTimeout(function() { popup.classList.remove('active'); }, 2200);
          }

          setTimeout(function() {
            btn.textContent = origText;
            btn.disabled = false;
            btn.style.background = '';
            btn.style.color = '';
            form.reset();
          }, 3500);
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      })
      .catch(function(err) {
        console.error('Form error:', err);
        btn.textContent = '⚠ Try again or call +91-7388808813';
        btn.style.background = '#c0392b';
        btn.style.color = '#fff';
        setTimeout(function() {
          btn.textContent = origText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.color = '';
        }, 4000);
      });
    });
  });
})();
