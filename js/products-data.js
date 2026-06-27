/* ============================================================
   Manak Petroleum — product catalogue data + detail-page hydrator
   - window.MANAK_PRODUCTS keyed by slug
   - wires every .product-card link to product.html?p=<slug>
   - on product.html, fills the template from the ?p= slug
   ============================================================ */
(function () {
  var CL = 'https://res.cloudinary.com/dij7gyend/image/upload/';
  function imgURL(id, photo) {
    return CL + (photo
      ? 'c_fill,g_center,w_800,h_800,q_auto,f_auto/'
      : 'e_background_removal/c_limit,w_700,q_auto,f_auto/') + id;
  }

  var APP = {
    'hd-diesel': [['Trucks & tippers', 'High-km commercial diesel'], ['Buses & CV', 'Intercity & staff transport'], ['Construction', 'Loaders, tippers & gensets'], ['Tractors', 'High-load farm diesel']],
    'moto': [['Motorcycles', '4-stroke commuter & sport'], ['Scooters', 'Geared & automatic'], ['Three-wheelers', 'Auto-rickshaws'], ['Small 4-stroke', 'General utility engines']],
    'gear': [['Truck & bus axles', 'Hypoid & spiral bevel'], ['Manual gearboxes', 'Synchromesh & constant-mesh'], ['Differentials', 'Final drives'], ['Industrial gears', 'Enclosed gear drives']],
    'atf': [['Automatic transmissions', 'Torque-converter ATs'], ['Power steering', 'Hydraulic PS systems'], ['Hydraulics', 'Light hydraulic systems'], ['Torque converters', 'Fluid couplings']],
    'tractor': [['Tractor transmission', 'Combined trans-hydraulic'], ['Wet brakes', 'Oil-immersed brakes'], ['Hydraulics', 'Lift & implement systems'], ['PTO & final drive', 'Power take-off']],
    'hydraulic': [['Excavators', 'Earth-moving hydraulics'], ['Presses', 'Industrial hydraulic presses'], ['Injection moulding', 'Plastics machinery'], ['Hydraulic systems', 'Pumps & actuators']],
    'grease': [['Wheel bearings', 'Hubs & rolling bearings'], ['Chassis', 'Pins, bushes & linkages'], ['Industrial plant', 'Machinery & equipment'], ['General points', 'Multipurpose lubrication']],
    'coolant': [['Radiators', 'Engine cooling systems'], ['Corrosion control', 'Cooling-circuit protection'], ['All-season', 'Antifreeze & anti-boil'], ['Fleets', 'Trucks, buses & gensets']]
  };

  var LIST = [
    // ===== ZIGMA =====
    { slug: 'ch-4', brand: 'ZIGMA', name: 'CH-4 15W-40', cat: 'Engine Oil', anchor: 'engine', id: 'Screenshot_2026-06-27_171836_ecl0yj.png', photo: 1, grade: 'API CH-4 · 15W-40 · Multigrade heavy-duty diesel', chips: ['15W-40', 'LONG HAUL', 'HIGH LOAD', 'EXTENDED DRAIN'], pk: '10 L', type: 'Heavy-duty diesel engine oil', standard: 'API CH-4 · IS 13656:2002', appset: 'hd-diesel', summary: 'A high-performance heavy-duty diesel engine oil with quality base stocks and a modern additive package, meeting API CH-4 and IS 13656:2002 for long-haul commercial vehicles, high-load operation and extended drain intervals.' },
    { slug: 'sf-cd-20w50', brand: 'ZIGMA', name: 'SF/CD 20W-50', cat: 'Engine Oil', anchor: 'engine', id: 'Screenshot_2026-06-27_183219_mjwsnh.png', photo: 1, grade: 'API SF/CD · 3-wheeler & auto · Petrol/diesel', chips: ['20W-50', '3-WHEELER', 'AUTO'], pk: '1 L', type: 'Multigrade automotive engine oil', standard: 'API SF/CD', appset: 'moto', summary: 'A 20W-50 multigrade engine oil for three-wheelers and older automobiles, balancing wear protection and oil-film strength for stop-start petrol and diesel duty.' },
    { slug: '4t-sl-20w40', brand: 'ZIGMA', name: '4T SL 20W-40', cat: '4T Motorcycle', anchor: 'engine', id: 'Screenshot_2026-06-27_183125_igedpy.png', photo: 1, grade: 'API SL · High-performance 4-stroke', chips: ['20W-40', 'MOTORCYCLE', 'SCOOTER'], pk: '1 L', type: '4-stroke motorcycle engine oil', standard: 'API SL', appset: 'moto', summary: 'An API SL 4-stroke motorcycle oil engineered for smooth gear shifts, wet-clutch compatibility and dependable protection for bikes and scooters.' },
    { slug: 'gear-ep-90', brand: 'ZIGMA', name: 'Gear Oil EP-90', cat: 'Gear Oil', anchor: 'gear', id: 'Screenshot_2026-06-27_182847_j3ungl.png', photo: 1, grade: 'EP-90 · Extreme pressure · Manual gearboxes', chips: ['EP-90', 'AXLES', 'GEARBOX'], pk: '1 L', type: 'Automotive gear oil', standard: 'EP · API GL-4', appset: 'gear', summary: 'An EP-90 extreme-pressure gear oil for manual gearboxes and axles, protecting against shock loading, scuffing and wear.' },
    { slug: 'gear-80w90', brand: 'ZIGMA', name: 'Gear Oil 80W-90', cat: 'Gear Oil', anchor: 'gear', id: 'Screenshot_2026-06-27_182829_tlcwhm.png', photo: 1, grade: 'API GL-5 · Multipurpose EP · Hypoid axles', chips: ['80W-90', 'GL-5', 'AXLES'], pk: 'Pail', type: 'Multipurpose gear oil', standard: 'API GL-5', appset: 'gear', summary: 'A multipurpose API GL-5 80W-90 gear oil for hypoid axles and heavily loaded transmissions, with extreme-pressure protection.' },
    { slug: 'tq-atf', brand: 'ZIGMA', name: 'TQ ATF', cat: 'Transmission', anchor: 'gear', id: 'Screenshot_2026-06-27_182933_jqspyw.png', photo: 1, grade: 'Automatic transmission & power-steering fluid', chips: ['ATF', 'POWER STEERING', 'AUTO TRANS'], pk: '10 L', type: 'Automatic transmission fluid', standard: 'ATF · power-steering', appset: 'atf', summary: 'An automatic transmission and power-steering fluid for smooth shifting, frictional stability and reliable hydraulic response.' },
    { slug: 'utto', brand: 'ZIGMA', name: 'UTTO', cat: 'Tractor', anchor: 'gear', id: 'Screenshot_2026-06-27_182906_vmriz9.png', photo: 1, grade: 'Universal Tractor Transmission Oil', chips: ['TRANSMISSION', 'HYDRAULICS', 'FARM'], pk: '5 L', type: 'Universal tractor transmission oil', standard: 'UTTO multifunctional', appset: 'tractor', summary: 'A universal tractor transmission oil combining transmission, wet-brake, hydraulic and final-drive performance in a single fluid.' },
    { slug: 'hydraulic-aw68', brand: 'ZIGMA', name: 'Hydraulic AW-68 · Bulk', cat: 'Hydraulic', anchor: 'industrial', id: 'Screenshot_2026-06-27_171814_mryjy3.png', photo: 1, grade: 'ISO VG 68 · Anti-wear · Excavators & presses', chips: ['VG 68', 'ANTI-WEAR', 'BULK'], pk: '25 L', type: 'Anti-wear hydraulic oil', standard: 'ISO VG 68 · anti-wear', appset: 'hydraulic', summary: 'An ISO VG 68 anti-wear hydraulic oil for excavators, presses and industrial hydraulic systems operating under high pressure.' },
    { slug: 'multipurpose-grease', brand: 'ZIGMA', name: 'Multipurpose Grease', cat: 'Grease', anchor: 'grease', id: 'Screenshot_2026-06-27_182817_yrnm0n.png', photo: 1, grade: 'Lithium-based · Bearings & chassis · Bulk pail', chips: ['NLGI', 'BEARINGS', 'BULK'], pk: 'Pail', type: 'Lithium multipurpose grease', standard: 'NLGI 2/3', appset: 'grease', summary: 'A lithium-based multipurpose grease for bearings, chassis and general lubrication, with good mechanical stability and water resistance.' },
    { slug: 'gp-grease', brand: 'ZIGMA', name: 'General Purpose Grease', cat: 'Grease', anchor: 'grease', id: 'Screenshot_2026-06-18_144109_sfc4fi.png', photo: 0, grade: 'Calcium hydroxide base · Joints, pumps & bearings', chips: ['90–100°C', 'UNIVERSAL', 'SACHET'], pk: '100 g', type: 'Calcium-base general grease', standard: 'IS general purpose', appset: 'grease', summary: 'A calcium-base general-purpose grease for joints, pumps and bearings in moderate-temperature service.' },
    { slug: 'rotavator-oil', brand: 'ZIGMA', name: 'Rotavator Oil', cat: 'Agriculture', anchor: 'specialty', id: 'Screenshot_2026-06-18_144041_bfjqrp.png', photo: 0, grade: 'Strong oil film · High-temp · Rotavator gearbox', chips: ['EP', 'HIGH-TEMP', 'FARM'], pk: '1 L', type: 'Rotavator gearbox oil', standard: 'EP gear-type', appset: 'gear', summary: 'A high-temperature, strong-film oil for rotavator gearboxes and farm implement drives subject to shock and dust.' },

    // ===== EMTEX =====
    { slug: 'emtex-xpresso-20w40', brand: 'EMTEX', name: 'Xpresso 20W-40 CF-4', cat: 'Engine Oil', anchor: 'engine', id: 'Screenshot_2026-06-18_172518_s8jmur.png', photo: 0, grade: 'API CF-4 · Multigrade diesel', chips: ['20W-40', 'CF-4'], pk: '20 L', type: 'Multigrade diesel engine oil', standard: 'API CF-4', appset: 'hd-diesel', summary: 'An API CF-4 20W-40 multigrade diesel engine oil for mixed commercial fleets needing dependable wear and deposit control.' },
    { slug: 'emtex-chota-hathi-15w40', brand: 'EMTEX', name: 'Chota Hathi 15W-40', cat: 'Engine Oil', anchor: 'engine', id: 'Screenshot_2026-06-18_172549_wnmd4t.png', photo: 0, grade: 'Heavy-duty diesel · Commercial', chips: ['15W-40', 'CV'], pk: '5 L', type: 'Heavy-duty diesel engine oil', standard: 'Heavy-duty diesel', appset: 'hd-diesel', summary: 'A heavy-duty 15W-40 diesel engine oil for commercial vehicles, balancing protection and value for high-utilisation fleets.' },
    { slug: 'emtex-drivtech-4t-10w30', brand: 'EMTEX', name: 'Drivtech 4T 10W-30', cat: '4T Motorcycle', anchor: 'engine', id: 'Screenshot_2026-06-18_172620_zf2vwv.png', photo: 0, grade: 'API SL · JASO MA2 · 4-stroke', chips: ['10W-30', 'JASO MA2'], pk: '800 ml', type: '4-stroke motorcycle oil', standard: 'API SL · JASO MA2', appset: 'moto', summary: 'A JASO MA2 10W-30 4-stroke motorcycle oil for smooth shifts and clutch performance in modern bikes.' },
    { slug: 'emtex-drivtech-4t-20w40', brand: 'EMTEX', name: 'Drivtech 4T 20W-40', cat: '4T Motorcycle', anchor: 'engine', id: 'Screenshot_2026-06-18_172630_sjstyx.png', photo: 0, grade: 'API SL · JASO MA2 · 4-stroke', chips: ['20W-40', 'JASO MA2'], pk: '1 L', type: '4-stroke motorcycle oil', standard: 'API SL · JASO MA2', appset: 'moto', summary: 'A JASO MA2 20W-40 4-stroke motorcycle oil for dependable protection in commuter and utility motorcycles.' },
    { slug: 'emtex-gear-protact-ep90', brand: 'EMTEX', name: 'Gear Protact EP-90', cat: 'Gear Oil', anchor: 'gear', id: 'Screenshot_2026-06-18_173558_cdtkts.png', photo: 0, grade: 'API GL-4 · Extreme pressure', chips: ['EP-90', 'GL-4'], pk: '26 L', type: 'Automotive gear oil', standard: 'API GL-4', appset: 'gear', summary: 'An API GL-4 EP-90 gear oil for manual gearboxes and transaxles requiring extreme-pressure protection.' },
    { slug: 'emtex-gear-protact-ep140', brand: 'EMTEX', name: 'Gear Protact EP-140', cat: 'Gear Oil', anchor: 'gear', id: 'Screenshot_2026-06-18_173608_imat1b.png', photo: 0, grade: 'API GL-4 · Heavy-duty gears', chips: ['EP-140', 'GL-4'], pk: '26 L', type: 'Heavy-duty gear oil', standard: 'API GL-4', appset: 'gear', summary: 'An API GL-4 EP-140 heavy-duty gear oil for highly loaded commercial and industrial gears.' },
    { slug: 'emtex-gear-protact-80w90', brand: 'EMTEX', name: 'Gear Protact 80W-90', cat: 'Gear Oil', anchor: 'gear', id: 'Screenshot_2026-06-18_173626_c4ugyl.png', photo: 0, grade: 'API GL-5 · Multipurpose EP', chips: ['80W-90', 'GL-5'], pk: '26 L', type: 'Multipurpose gear oil', standard: 'API GL-5', appset: 'gear', summary: 'A multipurpose API GL-5 80W-90 gear oil for hypoid axles and mixed driveline applications.' },
    { slug: 'emtex-gear-protact-85w140', brand: 'EMTEX', name: 'Gear Protact 85W-140', cat: 'Gear Oil', anchor: 'gear', id: 'Screenshot_2026-06-18_173616_qr0smw.png', photo: 0, grade: 'API GL-5 · Rear axle · Hypoid', chips: ['85W-140', 'GL-5'], pk: '26 L', type: 'Rear-axle hypoid gear oil', standard: 'API GL-5', appset: 'gear', summary: 'An API GL-5 85W-140 rear-axle oil for hypoid final drives under high load and temperature.' },
    { slug: 'emtex-gear-protact-st90', brand: 'EMTEX', name: 'Gear Protact ST-90', cat: 'Gear Oil', anchor: 'gear', id: 'Screenshot_2026-06-18_173633_bsbhnh.png', photo: 0, grade: 'API GL-4 · Oxidation stable', chips: ['ST-90', 'GL-4'], pk: '26 L', type: 'Automotive gear oil', standard: 'API GL-4', appset: 'gear', summary: 'An oxidation-stable API GL-4 ST-90 gear oil for prolonged service in manual transmissions.' },
    { slug: 'emtex-ap-long-run-35000', brand: 'EMTEX', name: 'AP Long Run 35000', cat: 'Grease', anchor: 'grease', id: 'Screenshot_2026-06-18_173434_dql2sm.png', photo: 0, grade: 'Lithium complex · IS 14847 · High drop-point', chips: ['LITHIUM CX', 'EP'], pk: 'Pail', type: 'Lithium-complex grease', standard: 'IS 14847', appset: 'grease', summary: 'A lithium-complex grease to IS 14847 with a high drop-point for long-life, high-temperature bearing lubrication.' },
    { slug: 'emtex-red-gel', brand: 'EMTEX', name: 'Red Gel Semicomplex', cat: 'Grease', anchor: 'grease', id: 'Screenshot_2026-06-27_182749_u1lfmz.png', photo: 1, grade: 'Semicomplex · High-performance · High drop-point', chips: ['SEMICOMPLEX', 'EP', 'PREMIUM'], pk: 'Pail', type: 'Semicomplex performance grease', standard: 'High drop-point EP', appset: 'grease', summary: 'A premium semicomplex high-performance grease with a high drop-point for demanding, high-temperature service.' },
    { slug: 'emtex-chassis-grease', brand: 'EMTEX', name: 'Chassis Grease', cat: 'Grease', anchor: 'grease', id: 'Screenshot_2026-06-18_173453_abyrlh.png', photo: 0, grade: 'NLGI 1 · Chassis & fittings', chips: ['NLGI 1', 'CHASSIS'], pk: 'Pail', type: 'Chassis grease', standard: 'NLGI 1', appset: 'grease', summary: 'An NLGI 1 chassis grease for pins, bushes and fittings, providing easy pumpability and reliable film strength.' },
    { slug: 'emtex-gpep-2', brand: 'EMTEX', name: 'GPEP-2 Grease', cat: 'Grease', anchor: 'grease', id: 'Screenshot_2026-06-18_173503_bncpgm.png', photo: 0, grade: 'General-purpose EP · Earth-moving', chips: ['EP', 'NLGI 2'], pk: 'Pail', type: 'General-purpose EP grease', standard: 'NLGI 2', appset: 'grease', summary: 'A general-purpose NLGI 2 EP grease for earth-moving and plant equipment operating under shock loads.' },
    { slug: 'emtex-cooltech', brand: 'EMTEX', name: 'Cooltech Coolant', cat: 'Coolant', anchor: 'specialty', id: 'Screenshot_2026-06-18_173654_kfushc.png', photo: 0, grade: 'Ethylene glycol · Antifreeze / anticorrosion', chips: ['COOLANT', 'ANTIFREEZE'], pk: '5 L', type: 'Engine coolant / antifreeze', standard: 'Ethylene-glycol coolant', appset: 'coolant', summary: 'An ethylene-glycol coolant providing antifreeze, anti-boil and corrosion protection for engine cooling systems.' }
  ];

  var P = {}, BYKEY = {};
  function keyOf(brand, name) { return (String(brand) + '|' + String(name)).toLowerCase().replace(/\s+/g, ' ').trim(); }
  LIST.forEach(function (d) {
    d.image = imgURL(d.id, d.photo);
    d.apps = APP[d.appset] || APP.grease;
    d.packs = d.pk + ' · other packs on request';
    P[d.slug] = d;
    BYKEY[keyOf(d.brand, d.name)] = d.slug;
  });
  window.MANAK_PRODUCTS = P;

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  // Point every product card at its detail page
  function wireCards() {
    var cards = document.querySelectorAll('a.product-card');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var href = card.getAttribute('href') || '';
      if (href.indexOf('?p=') > -1) continue;
      var brand = card.getAttribute('data-brand');
      if (!brand) {
        var catEl = card.querySelector('.cat');
        brand = catEl ? catEl.textContent.split('·')[0] : '';
      }
      var h3 = card.querySelector('h3');
      var name = h3 ? h3.textContent : '';
      var slug = BYKEY[keyOf(brand, name)];
      if (slug) card.setAttribute('href', 'product.html?p=' + slug);
    }
  }

  function relCard(d) {
    var fill = 'prod-fill' + (d.photo ? ' is-photo' : '');
    return '<a href="product.html?p=' + d.slug + '" class="product-card">'
      + '<div class="product-img" style="aspect-ratio:1;position:relative;border-bottom:1px solid var(--line)"><div class="' + fill + '"><img loading="lazy" src="' + d.image + '" alt="' + esc(d.brand + ' ' + d.name) + '"/></div></div>'
      + '<div class="product-info"><div class="cat">' + esc(d.brand + ' · ' + d.cat) + '</div><h3>' + esc(d.name) + '</h3><div class="grade">' + esc(d.grade) + '</div></div></a>';
  }

  function populateDetail() {
    var host = document.querySelector('.spec-detail');
    if (!host) return;
    var slug = new URLSearchParams(location.search).get('p');
    var d = P[slug] || P['ch-4'];
    if (!d) return;
    var q = function (s) { return document.querySelector(s); };

    document.title = d.brand + ' ' + d.name + ' · ' + d.cat + ' · Manak Petroleum';
    var md = q('meta[name="description"]'); if (md) md.setAttribute('content', d.summary);

    var crumbs = q('.crumbs');
    if (crumbs) crumbs.innerHTML = '<a href="index.html">Home</a> / <a href="products.html">Products</a> / <a href="products.html#' + d.anchor + '">' + esc(d.cat) + '</a> / <span style="color:var(--ink)">' + esc(d.brand + ' ' + d.name) + '</span>';

    var vis = q('.spec-visual img'); if (vis) { vis.src = d.image; vis.alt = d.brand + ' ' + d.name; }
    var lab = q('.spec-visual .ph-label'); if (lab) lab.textContent = d.brand + ' · ' + d.cat;

    var cat = q('.spec-detail .cat'); if (cat) cat.innerHTML = '<span style="display:inline-block;width:6px;height:6px;background:var(--red)"></span> ' + esc(d.brand + ' / ' + d.cat.toUpperCase());
    var h1 = q('.spec-detail h1'); if (h1) h1.textContent = d.brand + ' ' + d.name + '.';
    var gr = q('.spec-detail .grade'); if (gr) gr.textContent = d.grade;
    var sm = q('.spec-detail .summary'); if (sm) sm.textContent = d.summary;

    var rows = [['Brand', d.brand], ['Product type', d.type], ['Grade', d.grade], ['Standard', d.standard], ['Pack sizes', d.packs]];
    var tbl = q('.spec-table'); if (tbl) tbl.innerHTML = rows.map(function (r) { return '<div class="row"><div class="k">' + esc(r[0]) + '</div><div>' + esc(r[1]) + '</div></div>'; }).join('');

    var chips = q('.spec-detail .specs'); if (chips) chips.innerHTML = d.chips.map(function (c) { return '<span class="spec-chip">' + esc(c) + '</span>'; }).join('');
    var pk = document.getElementById('packSizes'); if (pk) pk.textContent = d.packs;

    var ig = document.getElementById('appGrid');
    if (ig) ig.innerHTML = d.apps.map(function (a, i) { return '<div class="ind"><span class="num">0' + (i + 1) + '</span><div><h4>' + esc(a[0]) + '</h4><div class="meta">' + esc(a[1]) + '</div></div></div>'; }).join('');

    var rel = LIST.filter(function (x) { return x.slug !== d.slug && x.anchor === d.anchor; });
    if (rel.length < 3) LIST.forEach(function (x) { if (rel.length < 3 && x.slug !== d.slug && x.brand === d.brand && rel.indexOf(x) < 0) rel.push(x); });
    var rg = document.getElementById('relGrid'); if (rg) rg.innerHTML = rel.slice(0, 3).map(relCard).join('');

    var ld = document.querySelector('script[type="application/ld+json"]');
    if (ld) { try { var j = JSON.parse(ld.textContent); j.name = d.brand + ' ' + d.name; j.description = d.summary; j.image = d.image; j.category = d.cat; if (j.brand) j.brand.name = d.brand; ld.textContent = JSON.stringify(j); } catch (e) {} }
  }

  function init() { populateDetail(); wireCards(); }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
