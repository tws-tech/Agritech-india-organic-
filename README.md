# Agritech India Organic 🌱

**मिट्टी की सेहत, फसल की ताकत।** – Organic khad (जैविक खाद) ki online order website + brand kit.

## Features
- 8 organic products (Vermicompost, Gobar Khad, Neem Khali, Bio NPK, Seaweed, Sarson Khali, Organic Potash, Kitchen Garden Kit) with pack sizes and prices
- Cart, checkout form (naam, mobile, pata, pincode, COD/UPI)
- **Har online order ka email notification** → `mukeshmehra2811@gmail.com` (Order ID, items, total, customer details ke saath)
- Contact / bulk-order enquiry form → same email
- Hindi-first, mobile-friendly, no server/database needed
- Brand kit: `/brand-kit/` (logo files, colours, fonts, voice, templates)

## Files
```
index.html              Website
assets/css/style.css    Design
assets/js/app.js        Products, cart, order email  ← prices/products yahan badlein
assets/img/             Logo + icon
brand-kit/index.html    Brand guidelines page
brand-kit/logos/        logo-primary, logo-reversed, logo-stacked, logo-icon (SVG)
```

## ⚠️ Email notification chalu karna (ek baar)
Orders [FormSubmit](https://formsubmit.co) se email hote hain (free, koi password/API key nahi).
1. Website live karke ek **test order** karein.
2. `mukeshmehra2811@gmail.com` par FormSubmit ka **"Activate Form"** email aayega (Spam folder bhi dekhein) – usme **Activate** dabayein.
3. Bas! Ab har order seedha inbox mein aayega. Subject: `🛒 New Order AIO-YYYYMMDD-XXXX – ₹amount – Name`.

Email badalna ho to `assets/js/app.js` mein `ORDER_EMAIL` change karein.

## Website live karna (GitHub Pages – free)
1. Repo → **Settings → Pages**
2. Source: *Deploy from a branch* → branch `main`, folder `/ (root)` → Save
3. 1–2 min mein site live: `https://<username>.github.io/<repo-name>/`

Custom domain (jaise `agritechindiaorganic.com`) bhi Pages settings mein jod sakte hain.

## Products / price badalna
`assets/js/app.js` → `PRODUCTS` list mein naam, Hindi naam, description aur `packs` (label + price) edit karein.
