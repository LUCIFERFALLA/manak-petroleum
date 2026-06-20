/* ============================================================
   MANAK PETROLEUM — Supabase form submissions (no auth)
   Static-site integration: loads supabase-js from CDN and inserts
   each enquiry into the public.enquiries table. The publishable
   key is designed to be exposed in the browser; writes are guarded
   by a Row-Level-Security "insert only" policy (see supabase/schema.sql).
   ============================================================ */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://fjjybrstcqtrnvltemtc.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_8qqZhZpEGW5Ci5PxLvDpSQ_qzGuC7r_';

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/* hidden / control fields we never want to store as columns */
const SKIP = new Set(['access_key', 'subject', 'from_name', 'redirect', 'botcheck']);

/* map whatever named fields a form has onto our table columns */
function buildPayload(form) {
  const data = {};
  new FormData(form).forEach((value, key) => {
    if (SKIP.has(key)) return;
    const v = String(value).trim();
    if (v) data[key] = v;
  });
  return {
    form_type: form.dataset.formType || 'contact',
    name: data.name || null,
    company: data.company || null,
    business_name: data.business_name || null,
    email: data.email || null,
    phone: data.phone || null,
    location: data.location || null,
    enquiry_type: data.enquiry_type || null,
    product_category: data.product_category || null,
    annual_volume: data.annual_volume || null,
    territory: data.territory || null,
    brand_interest: data.brand_interest || null,
    years_in_trade: data.years_in_trade || null,
    existing_categories: data.existing_categories || null,
    message: data.message || null,
    page: location.pathname.split('/').pop() || 'index.html',
    raw: data
  };
}

document.querySelectorAll('form.form').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    const { error } = await supabase.from('enquiries').insert(buildPayload(form));

    if (error) {
      console.error('Supabase insert failed:', error);
      if (btn) { btn.disabled = false; btn.innerHTML = original; }
      alert('Sorry — we could not send your enquiry just now. Please WhatsApp or call us on +91 97390 95494 and we will help right away.');
      return;
    }
    window.location.href = 'thank-you.html';
  });
});
