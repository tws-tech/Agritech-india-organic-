/* Agritech India Organic – shop + order notification
 * Orders and enquiries are emailed to ORDER_EMAIL using FormSubmit (https://formsubmit.co).
 * First order par FormSubmit ek "Activate" email bhejega – use ek baar confirm karna zaroori hai.
 */
const ORDER_EMAIL = "mukeshmehra2811@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${ORDER_EMAIL}`;

/* ---- Products: naam, price aur pack sizes yahan se badlein ---- */
const PRODUCTS = [
  { id: "vermicompost", name: "Vermicompost", hi: "वर्मीकम्पोस्ट (केंचुआ खाद)", icon: "🪱", bg: "#E9DCC8", tag: "Best Seller",
    desc: "मिट्टी की उर्वरता बढ़ाए, सभी फसलों, सब्ज़ी और गमलों के लिए। 4–5 क्विंटल/एकड़।",
    packs: [{ label: "5 kg", price: 149 }, { label: "25 kg", price: 549 }, { label: "50 kg", price: 999 }] },
  { id: "cowdung", name: "Organic Cow Dung Manure", hi: "देसी गोबर खाद", icon: "🐄", bg: "#E4D6BF",
    desc: "पूरी तरह सड़ी हुई गोबर खाद, जैविक कार्बन से भरपूर। 2–3 टन/एकड़।",
    packs: [{ label: "10 kg", price: 199 }, { label: "40 kg", price: 649 }] },
  { id: "neemcake", name: "Neem Cake", hi: "नीम खली", icon: "🌳", bg: "#DCE8CF", tag: "कीट नियंत्रण",
    desc: "दीमक और मिट्टी के कीटों से सुरक्षा, साथ में नाइट्रोजन। 1–2 क्विंटल/एकड़।",
    packs: [{ label: "5 kg", price: 299 }, { label: "25 kg", price: 1199 }, { label: "50 kg", price: 2199 }] },
  { id: "bionpk", name: "Bio NPK Consortia", hi: "जैविक NPK (तरल)", icon: "🧪", bg: "#D6EBD9",
    desc: "नाइट्रोजन, फॉस्फोरस व पोटाश घोलक जीवाणु। 1 लीटर/एकड़ बीज या ड्रिप से।",
    packs: [{ label: "500 ml", price: 349 }, { label: "1 L", price: 599 }, { label: "5 L", price: 2499 }] },
  { id: "seaweed", name: "Seaweed Extract", hi: "समुद्री शैवाल टॉनिक", icon: "🌊", bg: "#D2E6E6", tag: "नया",
    desc: "फूल-फल बढ़ाने वाला प्राकृतिक ग्रोथ प्रमोटर। 2–3 ml/लीटर पानी में स्प्रे।",
    packs: [{ label: "250 ml", price: 249 }, { label: "1 L", price: 799 }] },
  { id: "mustardcake", name: "Mustard Cake", hi: "सरसों खली", icon: "🌼", bg: "#F3E4B5",
    desc: "धीरे-धीरे पोषण देने वाली प्राकृतिक खाद, बागवानी और सब्ज़ियों के लिए श्रेष्ठ।",
    packs: [{ label: "5 kg", price: 249 }, { label: "25 kg", price: 999 }] },
  { id: "potash", name: "Organic Potash (PDM)", hi: "जैविक पोटाश", icon: "🌾", bg: "#EADFC9",
    desc: "गन्ने के शीरे से बना पोटाश, दानों की चमक व वज़न बढ़ाए। 25–50 kg/एकड़।",
    packs: [{ label: "25 kg", price: 899 }, { label: "50 kg", price: 1699 }] },
  { id: "kitchen", name: "Kitchen Garden Kit", hi: "होम गार्डन किट", icon: "🪴", bg: "#DDEBCB",
    desc: "वर्मीकम्पोस्ट 5kg + नीम खली 1kg + सीवीड 250ml — गमलों के लिए कम्प्लीट किट।",
    packs: [{ label: "Kit", price: 549 }] },
];

const inr = (n) => "₹" + n.toLocaleString("en-IN");
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---- Storage (safe) ---- */
const store = {
  get() { try { return JSON.parse(localStorage.getItem("aio-cart")) || []; } catch { return []; } },
  set(v) { try { localStorage.setItem("aio-cart", JSON.stringify(v)); } catch {} },
};
let cart = store.get();

/* ---- Render products ---- */
function renderProducts() {
  $("#productGrid").innerHTML = PRODUCTS.map((p) => `
    <article class="product">
      <div class="p-visual" style="background:${p.bg}">
        ${p.tag ? `<span class="p-tag">${p.tag}</span>` : ""}<span aria-hidden="true">${p.icon}</span>
      </div>
      <div class="p-body">
        <h3>${p.name}</h3>
        <div class="p-hi">${p.hi}</div>
        <p>${p.desc}</p>
        <div class="p-price" data-price="${p.id}">${inr(p.packs[0].price)} <small>/ ${p.packs[0].label}</small></div>
        <div class="p-controls">
          <select data-pack="${p.id}" aria-label="Pack size">
            ${p.packs.map((k, i) => `<option value="${i}">${k.label} – ${inr(k.price)}</option>`).join("")}
          </select>
          <button class="btn btn-primary" data-add="${p.id}">+ कार्ट</button>
        </div>
      </div>
    </article>`).join("");

  $$("[data-pack]").forEach((sel) => sel.addEventListener("change", () => {
    const p = PRODUCTS.find((x) => x.id === sel.dataset.pack);
    const k = p.packs[sel.value];
    $(`[data-price="${p.id}"]`).innerHTML = `${inr(k.price)} <small>/ ${k.label}</small>`;
  }));
  $$("[data-add]").forEach((btn) => btn.addEventListener("click", () => {
    const p = PRODUCTS.find((x) => x.id === btn.dataset.add);
    const idx = +$(`[data-pack="${p.id}"]`).value;
    addToCart(p, idx);
  }));
}

/* ---- Cart ---- */
function addToCart(p, packIdx) {
  const key = `${p.id}:${packIdx}`;
  const found = cart.find((c) => c.key === key);
  if (found) found.qty++;
  else cart.push({ key, name: p.name, pack: p.packs[packIdx].label, price: p.packs[packIdx].price, qty: 1 });
  saveCart();
  toast(`${p.name} (${p.packs[packIdx].label}) कार्ट में जोड़ा गया ✅`);
}
function saveCart() { store.set(cart); renderCart(); }
const cartTotal = () => cart.reduce((s, c) => s + c.price * c.qty, 0);

function renderCart() {
  $$(".cart-count").forEach((el) => (el.textContent = cart.reduce((s, c) => s + c.qty, 0)));
  $("#cartTotal").textContent = inr(cartTotal());
  const box = $("#cartItems");
  if (!cart.length) {
    box.innerHTML = `<div class="cart-empty">कार्ट खाली है 🌱<br><a href="#products" data-close-cart>उत्पाद देखें</a></div>`;
    $$("[data-close-cart]", box).forEach((el) => el.addEventListener("click", closeCart));
    return;
  }
  box.innerHTML = cart.map((c, i) => `
    <div class="cart-item">
      <div><strong>${c.name}</strong><br><span class="muted small">${c.pack} × ${inr(c.price)}</span></div>
      <strong>${inr(c.price * c.qty)}</strong>
      <div class="qty"><button data-dec="${i}" aria-label="Decrease">−</button><span>${c.qty}</span><button data-inc="${i}" aria-label="Increase">+</button></div>
      <button class="remove" data-rm="${i}">हटाएँ</button>
    </div>`).join("");
  $$("[data-inc]", box).forEach((b) => b.onclick = () => { cart[b.dataset.inc].qty++; saveCart(); });
  $$("[data-dec]", box).forEach((b) => b.onclick = () => { const c = cart[b.dataset.dec]; c.qty > 1 ? c.qty-- : cart.splice(b.dataset.dec, 1); saveCart(); });
  $$("[data-rm]", box).forEach((b) => b.onclick = () => { cart.splice(b.dataset.rm, 1); saveCart(); });
}

function openCart() { $("#cartDrawer").classList.add("open"); $("#cartDrawer").setAttribute("aria-hidden", "false"); $(".overlay").hidden = false; }
function closeCart() { $("#cartDrawer").classList.remove("open"); $("#cartDrawer").setAttribute("aria-hidden", "true"); $(".overlay").hidden = true; }

/* ---- Email submit via FormSubmit ---- */
async function sendEmail(payload) {
  const res = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === "false" || data.success === false) throw new Error(data.message || "Send failed");
  return data;
}

function makeOrderId() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `AIO-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function setStatus(form, msg, ok) {
  const s = $(".form-status", form);
  s.textContent = msg; s.className = "form-status " + (ok ? "ok" : "err");
}

$("#orderForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  if (!cart.length) return setStatus(form, "कार्ट खाली है — पहले उत्पाद जोड़ें।", false);
  const f = Object.fromEntries(new FormData(form));
  if (f._honey) return; // bot
  const orderId = makeOrderId();
  const items = cart.map((c, i) => `${i + 1}. ${c.name} (${c.pack}) × ${c.qty} = ${inr(c.price * c.qty)}`).join("\n");
  const payload = {
    _subject: `🛒 New Order ${orderId} – ${inr(cartTotal())} – ${f.name}`,
    _template: "table",
    _captcha: "false",
    ...(f.email ? { _replyto: f.email } : {}),
    "Order ID": orderId,
    "Customer Name": f.name,
    Mobile: f.phone,
    Email: f.email || "-",
    Address: f.address,
    "City / District": f.city,
    State: f.state,
    Pincode: f.pincode,
    Payment: f.payment,
    Items: items,
    "Order Total": inr(cartTotal()),
    Note: f.note || "-",
    "Order Time": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
  };
  const btn = $("button[type=submit]", form);
  btn.disabled = true; btn.textContent = "भेजा जा रहा है…";
  try {
    await sendEmail(payload);
    cart = []; saveCart(); form.reset();
    setStatus(form, `🎉 धन्यवाद! आपका ऑर्डर ${orderId} मिल गया है। हमारी टीम जल्द ही कॉल करेगी।`, true);
  } catch (err) {
    // Fallback: open mail app with order details
    const body = Object.entries(payload).filter(([k]) => !k.startsWith("_")).map(([k, v]) => `${k}: ${v}`).join("\n");
    setStatus(form, "नेटवर्क समस्या — ईमेल ऐप से ऑर्डर भेजें।", false);
    location.href = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(payload._subject)}&body=${encodeURIComponent(body)}`;
  } finally {
    btn.disabled = false; btn.textContent = "✅ ऑर्डर प्लेस करें";
  }
});

$("#enquiryForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const f = Object.fromEntries(new FormData(form));
  if (f._honey) return;
  const btn = $("button[type=submit]", form);
  btn.disabled = true;
  try {
    await sendEmail({ _subject: `📩 New Enquiry – ${f.name}`, _template: "table", _captcha: "false", Name: f.name, Mobile: f.phone, Message: f.message });
    form.reset();
    setStatus(form, "✅ संदेश भेज दिया गया। हम जल्द संपर्क करेंगे।", true);
  } catch {
    setStatus(form, "❌ भेजने में समस्या हुई, कृपया दोबारा कोशिश करें।", false);
  } finally { btn.disabled = false; }
});

/* ---- UI helpers ---- */
let toastTimer;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

$$("[data-open-cart]").forEach((b) => b.addEventListener("click", openCart));
$$("[data-close-cart]").forEach((b) => b.addEventListener("click", closeCart));
document.addEventListener("keydown", (e) => e.key === "Escape" && closeCart());
$(".nav-toggle").addEventListener("click", (e) => {
  const open = $(".nav-links").classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded", open);
});
$$(".nav-links a").forEach((a) => a.addEventListener("click", () => $(".nav-links").classList.remove("open")));
$("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
