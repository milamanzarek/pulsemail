# PulseMail | Gmail Responsive Newsletter Studio 🚀

A lightweight, high-performance responsive email & newsletter builder tailored specifically for **Gmail**, modern mobile email clients, tablets, and desktop devices. Build branded, multi-column newsletters with embedded video cards, photo galleries, and bulletproof responsive layouts on the go.

---

## ✨ Key Features

### 1. 📧 1-Click Copy for Gmail (Direct Rich-Text Paste)
* No complicated ESP or Mailchimp account required!
* Click **"Copy for Gmail"** to copy pre-formatted, inline-styled rich text directly to your clipboard.
* Simply open [Gmail](https://mail.google.com), click **+ Compose**, and press **Ctrl+V** (or **Cmd+V**).
* All buttons, multi-columns, video cards, badges, and fonts appear immediately inside Gmail's compose box.

### 2. 📱 Screen Responsive Preview Suite
Switch effortlessly between real-time viewport modes to test how your layout renders:
* **Mobile Portrait (375px)**: iPhone / Android portrait frame with notch and responsive single-column auto-stacking.
* **Tablet (768px)**: iPad / Surface preview showing side-by-side fluid columns.
* **Desktop (100% / 1000px)**: Full widescreen view.
* **Gmail Web Simulation Mode**: Complete Gmail inbox chrome with search bar, sender avatar, subject header, and inbox preheader snippet.
* **Dark Mode Simulator**: Test inverted client styles and contrast before hitting send.

### 3. 🎥 Bulletproof Embedded Video Cards
Because Gmail and standard email clients block `<video>` and `<iframe>` embeds for security, PulseMail provides the industry-standard **Interactive Video Card**:
* Auto-detects YouTube video IDs and generates high-resolution thumbnails.
* Overlays a high-contrast SVG Play Button with selectable styles (YouTube Red, Brand Color, Minimal Dark).
* Hyperlinks the entire card directly to your video URL.
* Displays duration badges (e.g. `▶ WATCH (12:45)`) and optional captions.

### 4. 📐 Multi-Column & Media Layout Configurations
* **Headers & Nav**: Classic logo + navigation links, or Substack-style minimalist editorial header.
* **Responsive 2-Columns (50/50)**: Side-by-side cards with images, tags, headings, and CTAs that automatically stack gracefully on mobile.
* **Responsive 3-Columns (33/33/33)**: Feature cards, product highlights, or team profiles.
* **Responsive 4-Columns (Stats/KPIs)**: Metrics and milestone counters that wrap into a 2x2 grid on small screens.
* **Magazine Split**: Image on one side, editorial narrative and link on the other.
* **Photo Galleries**: Full-bleed hero banner, 2-photo side-by-side gallery, and 3-photo grid.
* **Voucher & Coupon Cards**: Dashed promo boxes with discount codes and terms.
* **CAN-SPAM & GDPR Compliant Footers**: Physical address, copyright, and 1-click unsubscribe links.

### 5. 🎨 Brand Kit on the Go
* **Brand Colors**: Set primary, secondary/accent, card background, canvas background, and body text colors.
* **Web-Safe Typography**: Select from fonts supported natively across all Gmail clients:
  * Modern System Sans (`Inter`, `-apple-system`, `Roboto`)
  * Universal Clean (`Arial`, `Helvetica`)
  * Literary & Editorial (`Georgia`, `Times New Roman`)
  * Friendly & Open (`Trebuchet MS`, `Lucida Sans`)
  * High Readability (`Verdana`, `Geneva`)
  * Developer Monospace (`Courier New`)
* **1-Click Brand Presets**: Quick themes including *Modern Tech*, *Creator Red*, *Organic Green*, *Warm Amber*, *Minimalist Noir*, and *Corporate Navy*.
* **Custom Logo Upload**: Upload or link your brand logo with automatic inline encoding.

### 6. 🔍 Gmail Linter & 102 KB Clipping Guard
* Gmail strictly clips any email whose HTML source exceeds **102 KB (104,448 bytes)** with `[Message clipped] View entire message`.
* PulseMail features a live size counter and health auditor that alerts you whenever your newsletter approaches the limit.
* Preheader text length validator (recommends 40–100 characters for high inbox open rates).

---

## 🚀 Quick Start Guide

### Option A: Open Directly in Any Browser
Simply open `index.html` in your browser:
```bash
# On macOS:
open /gmail-newsletter-builder/index.html

# On Linux:
xdg-open /gmail-newsletter-builder/index.html

# On Windows:
start \gmail-newsletter-builder\index.html
```
No build steps or dependencies required! The app is 100% self-contained.

### Option B: Run Local Web Server (Python Flask)
```bash
cd /gmail-newsletter-builder
python3 server.py
```
Then visit `http://127.0.0.1:8080` in your web browser.

### Option C: Command-Line Exporter (CLI)
You can compile any newsletter template JSON into production HTML directly from the terminal:
```bash
cd /gmail-newsletter-builder
python3 export_cli.py sample-template.json -o my-newsletter.html
```

---

## 📂 Project Structure

```
/gmail-newsletter-builder/
├── index.html            # Main web application interface
├── styles.css            # Responsive styles, device frames & themes
├── app.js                # Core engine, HTML generator & Gmail clipboard API
├── templates_data.js     # 6 pre-built curated starter templates
├── sample-template.json  # Reusable JSON template definition
├── server.py             # Lightweight Python server with validation endpoints
├── export_cli.py         # Terminal CLI compiler from JSON to HTML
└── README.md             # Documentation and usage guide
```

---

## 📧 How to Send via Gmail

1. In the builder, customize your text, photos, video links, and branding.
2. Click the red **"Copy for Gmail"** button in the top navigation bar.
3. Open [Gmail](https://mail.google.com) and click **+ Compose**.
4. Paste (`Ctrl+V` on Windows/Linux or `Cmd+V` on Mac) directly into the email body.
5. Enter your recipients and Subject Line, then hit **Send**!
