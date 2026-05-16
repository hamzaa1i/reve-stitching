document.addEventListener("astro:page-load",()=>{const b=document.getElementById("chat-toggle"),g=document.getElementById("chat-window"),J=document.getElementById("chat-minimize"),l=document.getElementById("chat-messages"),L=document.getElementById("chat-form"),c=document.getElementById("chat-input"),u=document.getElementById("quick-replies-container"),I=document.getElementById("chat-notification"),E=document.getElementById("chat-icon-open"),C=document.getElementById("chat-icon-close"),j=document.getElementById("request-human-btn");let q=!1;window.__chatPollInterval&&(clearInterval(window.__chatPollInterval),window.__chatPollInterval=null),window.__chatHeartbeatInterval&&(clearInterval(window.__chatHeartbeatInterval),window.__chatHeartbeatInterval=null);let v=null,F=new Date().toISOString();const R=new Set,o={messages:"reve-chat-messages",hasOpened:"reve-chat-opened",wasOpen:"reve-chat-was-open",mode:"reve-chat-mode",sessionId:"reve-chat-session-id",visitorToken:"reve-chat-visitor-token"},H='<svg class="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/></svg>',K='<svg class="w-3.5 h-3.5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>',$={"hello|hi|hey|good morning|good afternoon|good evening|howdy|assalam|salam|hola":{answer:`Hello! 👋 Welcome to **Reve Stitching**!

I'm here to help you with any questions about our garment manufacturing services. What would you like to know?`,followUp:["Product range","MOQ details","Get a quote","Quality standards"]},"how are you|how r u|whats up|what's up":{answer:`I'm doing great, thank you for asking! 😊

I'm ready to help you with anything related to garment manufacturing. What can I assist you with today?`,followUp:["Product range","MOQ details","Get a quote"]},"product range|product line|what do you make|what do you manufacture|catalog|catalogue|offering|garment type":{answer:`We manufacture a wide range of premium knitted garments:

👕 **Premium Cotton T-Shirts** — MOQ: 500 pcs
👔 **Corporate Polo Shirts** — MOQ: 300 pcs
🧥 **Premium Hoodies** — MOQ: 250 pcs
👖 **Athletic Joggers** — MOQ: 400 pcs
🧶 **Sweatshirts Collection** — MOQ: 350 pcs
👗 **Ladies' Wear** — MOQ: 300 pcs
👶 **Kids' Wear Range** — MOQ: 500 pcs
✨ **Specialized Fabric Garments** — MOQ: 200 pcs

All products are fully customizable to your brand specifications!`,followUp:["T-shirt details","Hoodie details","Fabric types","Get a quote"]},"tshirt|t-shirt|t shirt|tee shirt":{answer:`Our **Premium Cotton T-Shirts** are our bestseller! Here's what we offer:

📋 **Specifications:**
• 100% Combed Cotton
• GSM Range: 120-220
• SGS Quality Certified
• Pre-shrunk fabric
• MOQ: 500 pieces

🎨 **Customization:**
• Screen printing
• DTG printing
• Embroidery
• Custom labels & tags
• Pantone color matching
• All sizes (XS to 5XL)

⭐ **Rating:** 4.9/5 from our clients`,followUp:["Get a quote","Polo details","Fabric types","Sample request"]},"polo shirt|polo":{answer:`Our **Corporate Polo Shirts** are perfect for brands and uniforms:

📋 **Specifications:**
• Pique Cotton Construction
• Moisture Management options
• Reinforced collars & cuffs
• MOQ: 300 pieces

🎨 **Customization:**
• Custom embroidery
• Woven/printed labels
• Tipping on collar & cuffs
• Button customization
• Pantone color matching

⭐ **Rating:** 4.8/5 from our clients`,followUp:["Get a quote","T-shirt details","MOQ details"]},"hoodie|hoody|hooded":{answer:`Our **Premium Hoodies** are crafted for comfort and style:

📋 **Specifications:**
• Terry Fleece / Heavy Jersey
• GSM Range: 280-400
• YKK Zippers available
• Brushed interior finish
• MOQ: 250 pieces

🎨 **Customization:**
• Screen print & embroidery
• Pullover & zip-up styles
• Kangaroo & side pockets
• Drawstring options
• Custom hood lining

⭐ **Rating:** 4.9/5 from our clients`,followUp:["Get a quote","Jogger details","Sweatshirt details"]},"jogger|joggers|track pant|sweatpant":{answer:`Our **Athletic Joggers** combine performance and comfort:

📋 **Specifications:**
• Moisture Management Fabric
• Cotton-Polyester blend options
• Elastic cuffs & waistband
• MOQ: 400 pieces

🎨 **Customization:**
• Zippered pockets
• Drawstring waistband
• Side panels
• Printed/embroidered logos
• Tapered or straight fit

⭐ **Rating:** 4.7/5 from our clients`,followUp:["Get a quote","Hoodie details","Fabric types"]},"sweatshirt|crew neck|crewneck":{answer:`Our **Sweatshirts Collection** offers versatile options:

📋 **Specifications:**
• Double Jersey & Fleece options
• French Terry available
• GSM Range: 240-380
• MOQ: 350 pieces

🎨 **Styles:**
• Crew neck
• Half-zip
• Quarter-zip
• Oversized fits
• Custom dye options

⭐ **Rating:** 4.8/5 from our clients`,followUp:["Get a quote","Hoodie details","Fabric types"]},"ladies|women|woman|female":{answer:`Our **Ladies' Wear Collection** features delicate designs:

📋 **Specifications:**
• Modal Blends available
• Lycra Rib options
• Delicate finishing techniques
• MOQ: 300 pieces

👗 **Range:**
• Fitted & relaxed tees
• Crop tops
• Bodysuits
• Lounge sets
• Trend-forward designs

⭐ **Rating:** 4.9/5 from our clients`,followUp:["Get a quote","Kids wear","Fabric types"]},"kids wear|children|child wear|baby|infant|junior":{answer:`Our **Kids' Wear Range** prioritizes safety and comfort:

📋 **Specifications:**
• 100% Skin-Friendly Cotton
• Certified safe dyes (Oeko-Tex standards)
• Reinforced stitching
• MOQ: 500 pieces

👶 **Range:**
• T-shirts & polos
• Hoodies & sweatshirts
• Joggers & shorts
• Sleepwear
• Fun prints & patterns

⭐ **Rating:** 4.8/5 from our clients`,followUp:["Get a quote","Ladies wear","Quality standards"]},"specialized|lurex|burnout|performance wear|technical fabric":{answer:`Our **Specialized Fabric Garments** for unique requirements:

📋 **Specifications:**
• Lurex Mixed Fabrics
• Burnout Printed options
• Performance blends
• Custom development available
• MOQ: 200 pieces (lowest MOQ!)

✨ **Capabilities:**
• Custom fabric development
• Technical performance wear
• Fashion-forward textures
• Mixed-material construction

⭐ **Rating:** 4.7/5 from our clients`,followUp:["Get a quote","Fabric types","Sample request"]},"moq|minimum order|minimum quantity|order size|small order":{answer:`Our standard MOQ varies by product:

• 👕 T-Shirts → 500 pcs
• 👔 Polo Shirts → 300 pcs
• 🧥 Hoodies → 250 pcs
• 👖 Joggers → 400 pcs
• 🧶 Sweatshirts → 350 pcs
• 👗 Ladies' Wear → 300 pcs
• 👶 Kids' Wear → 500 pcs
• ✨ Specialized → 200 pcs

💡 **Note:** For first-time trial orders, we can be flexible on MOQ. Just ask!

All MOQs are per style/color combination.`,followUp:["Get a quote","Sample request","Lead time","Payment terms"]},"order process|how to order|place order|start order|ordering process":{answer:`Here's our simple **ordering process:**

**1️⃣ Inquiry** — Send us your requirements
**2️⃣ Quote** — We provide pricing within 24hrs
**3️⃣ Sample** — We develop a sample (7-10 days)
**4️⃣ Approval** — You approve the sample
**5️⃣ Production** — Bulk manufacturing (30-45 days)
**6️⃣ QC** — Multi-point quality inspection
**7️⃣ Shipping** — Delivery to your destination

Want to start the process? I can connect you with our team!`,followUp:["Get a quote","Request human","Payment terms","Lead time"]},"payment|pay term|deposit|advance payment":{answer:`Our standard **payment terms:**

💳 **For new clients:**
• 50% advance with order confirmation
• 50% before shipment (after QC approval)

💳 **For established clients:**
• 30% advance
• 70% against B/L (negotiable)

🏦 **Payment methods:**
• Bank transfer (TT)
• Letter of Credit (L/C)

Specific terms can be discussed based on order volume and relationship.`,followUp:["Order process","Get a quote","Request human"]},"fabric|material|textile|cloth type":{answer:`We work with a diverse range of **knitted fabrics:**

🧵 **Single Jersey** (120-200 GSM)
→ Lightweight, breathable — perfect for tees

🧵 **Double Jersey** (180-300 GSM)
→ Structured, premium feel — ideal for polos

🧵 **Terry Fleece** (240-400 GSM)
→ Soft & warm — hoodies and sweatshirts

🧵 **Lycra Rib** (170-280 GSM)
→ Stretchy & form-fitting — activewear

🧵 **Interlock** (160-280 GSM)
→ Smooth & stable — premium basics

🧵 **Moisture Management** (140-220 GSM)
→ Quick-dry performance wear

We also develop **custom blends** including Lurex, Burnout, Modal, and CVC compositions!`,followUp:["Product range","Custom fabric","Get a quote"]},cotton:{answer:`We specialize in **premium cotton fabrics:**

🧵 **Cotton Types We Use:**
• 100% Combed Cotton — Soft, durable, premium
• Ring-Spun Cotton — Smooth texture
• Organic Cotton (GOTS certified) — Sustainable
• BCI Cotton — Better Cotton Initiative
• CVC Blends — Cotton-dominant with polyester
• Poly-Cotton — Durable, cost-effective

📊 **GSM Range:** 120-400 depending on fabric type

All our cotton is sourced responsibly and tested for quality!`,followUp:["Fabric types","Sustainability","Get a quote"]},"jersey fabric|single jersey|double jersey":{answer:`We offer both **Single Jersey** and **Double Jersey:**

**Single Jersey:**
• Weight: 120-200 GSM
• Smooth face, soft hand
• Best for: T-shirts, underwear, casual tops
• Cotton, CVC, and poly-cotton options

**Double Jersey:**
• Weight: 180-300 GSM
• Thicker, more structured
• Best for: Polo shirts, dresses, upscale casual
• Excellent dimensional stability

Both available in any Pantone color!`,followUp:["Fleece details","Fabric types","Get a quote"]},"fleece|terry fleece|french terry":{answer:`Our **Terry Fleece** is perfect for cold-weather garments:

📋 **Details:**
• Weight: 240-400 GSM
• Brushed or unbrushed interior
• French Terry also available
• Loop-back or peach-finish options

🧥 **Best for:**
• Hoodies & zip-ups
• Sweatshirts & crew necks
• Joggers & sweatpants
• Loungewear

Available in 100% Cotton, CVC, and Poly-Cotton blends.`,followUp:["Hoodie details","Fabric types","Get a quote"]},"gsm|fabric weight|thickness":{answer:`Here's our **GSM range** by fabric type:

• Single Jersey → 120-200 GSM (Light)
• Double Jersey → 180-300 GSM (Medium)
• Terry Fleece → 240-400 GSM (Heavy)
• Lycra Rib → 170-280 GSM (Stretchy)
• Interlock → 160-280 GSM (Smooth)
• Moisture Mgmt → 140-220 GSM (Technical)

💡 **Tip:** Most t-shirts are 150-180 GSM. Hoodies are typically 300-380 GSM.

Not sure which GSM to choose? Tell me your product and I'll recommend!`,followUp:["Fabric types","Product range","Get a quote"]},"custom fabric|develop fabric|special fabric|custom blend":{answer:`Yes! We can **develop custom fabrics** for your brand:

✅ Custom yarn blends (Cotton, Polyester, Modal, Viscose, Spandex)
✅ Custom GSM (any weight you need)
✅ Special finishes (peach, enzyme wash, garment dye)
✅ Performance treatments (moisture-wicking, anti-microbial)
✅ Sustainable options (organic cotton, recycled polyester, BCI cotton)

⏱️ Custom fabric development takes **2-3 weeks** for sampling.

Want to discuss a custom fabric? I can connect you with our R&D team!`,followUp:["Request human","Fabric types","Get a quote"]},"quality|aql|inspection|quality control|quality standard|testing":{answer:`Quality is the cornerstone of our business:

✅ **AQL 1.5-4.0** standards on every order
✅ **SGS-trained** quality control team
✅ **14-checkpoint** inspection process
✅ Dedicated quality lab
✅ Full traceability

🔍 **Our 14-Point QC Process:**
1. Fabric inspection
2. Shrinkage testing
3. Color fastness check
4. Pattern verification
5. Cutting accuracy
6. In-line sewing checks
7. Measurement verification
8. Stitch quality audit
9. Print/embroidery check
10. Pressing quality
11. Finishing inspection
12. Packaging check
13. Final AQL audit
14. Pre-shipment inspection

Every garment must pass before export!`,followUp:["Certifications","Sample request","Get a quote"]},"defect|reject|return|complaint":{answer:`We take quality issues very seriously:

🛡️ **Our Guarantee:**
• All shipments pass AQL 1.5-4.0 inspection
• Pre-shipment inspection photos shared with you
• Third-party inspection welcome (SGS, Bureau Veritas, etc.)

📋 **If issues arise:**
• Documented claims process
• Quick resolution within 48 hours
• Replacement or credit for genuine defects
• Dedicated quality liaison for your account

Our defect rate is consistently below **2%** — among the best in the industry.`,followUp:["Quality standards","Certifications","Request human"]},"certification|sedex|iso|gots|bci|compliance|ethical":{answer:`We hold multiple international certifications:

🏅 **SEDEX** — Ethical compliance & worker welfare
🏅 **ISO 9001:2015** — Quality management systems
🏅 **BCI** — Better Cotton Initiative
🏅 **GOTS** — Global Organic Textile Standard
🏅 **OCS** — Organic Content Standard
🏅 **Higg Index** — Sustainable Apparel Coalition
🏅 **RCS** — Recycled Claim Standard
🏅 **GRS** — Global Recycled Standard

🌱 We're committed to **sustainable manufacturing** with:
• Energy-efficient processes
• Water recycling systems
• Responsible waste management
• Ethical labor practices`,followUp:["Quality standards","Sustainability","Get a quote"]},"sustainability|sustainable|environment|eco-friendly|recycle|green initiative":{answer:`Sustainability is a core value at Reve Stitching:

🌍 **Our Green Initiatives:**

♻️ **Materials:**
• Organic cotton (GOTS certified)
• Recycled polyester (GRS certified)
• BCI cotton sourcing
• Sustainable packaging options

🏭 **Factory:**
• Energy-efficient machinery
• Water recycling systems
• Solar energy integration (2025)
• Zero-waste cutting technology

👥 **Social:**
• Fair wages & safe working conditions
• SEDEX compliant
• No child labor policy
• Community development programs

Ask about our eco-friendly product lines!`,followUp:["Certifications","Get a quote","About us"]},"price|cost|pricing|quote|how much|rate|budget":{answer:`Pricing depends on several factors:

💰 **What affects price:**
• Fabric type & GSM
• Order quantity (higher = better price)
• Print/embroidery complexity
• Packaging requirements
• Delivery timeline

📊 **General ranges:**
• Basic T-shirts: $3-8 per unit
• Polo Shirts: $5-12 per unit
• Hoodies: $8-18 per unit
• Joggers: $6-14 per unit

⚠️ *These are approximate. Exact pricing requires your specific requirements.*

For an accurate quote, share your **tech pack** or describe your needs. We respond within **24 hours**!`,followUp:["Request human","Send requirements","MOQ details"]},"sample|prototype|before bulk|trial order":{answer:`Absolutely! We provide **pre-production samples:**

📋 **Sample Process:**

**Step 1:** Share your requirements/tech pack
**Step 2:** We provide a sample quote
**Step 3:** Sample development: **7-10 business days**
**Step 4:** Sample shipped to you
**Step 5:** Your feedback & revisions
**Step 6:** Bulk production after approval

🔄 **Revisions:** Up to 2 rounds at no extra cost
💰 **Cost:** Sample charges apply (adjusted against bulk order)
📦 **Shipping:** Via DHL/FedEx (at your cost)

Ready to start a sample? Share your requirements!`,followUp:["Get a quote","Send requirements","Lead time","Request human"]},"lead time|delivery time|how long|turnaround|production time|timeline|deadline":{answer:`Our production timelines:

⏱️ **Standard Lead Times:**

• Sample Development → 7-10 days
• Fabric Sourcing → 7-15 days
• Bulk Production → 20-30 days
• QC & Packing → 3-5 days
• **Total → 30-45 days**

🚀 **Rush Orders:**
• Available on case-by-case basis
• 15-25 day turnaround possible
• Priority surcharge may apply

📦 **Shipping:**
• Sea freight: 15-30 days
• Air freight: 3-7 days
• FOB Karachi / CIF destination

Need a specific delivery date? Let's discuss!`,followUp:["Shipping details","Get a quote","Request human"]},"shipping|freight|fob|cif|delivery method|transport|logistics":{answer:`Our **shipping & logistics** options:

🚢 **Sea Freight:**
• Port: Karachi, Pakistan
• Transit to UK: ~18-22 days
• Transit to EU: ~20-28 days
• Most economical option

✈️ **Air Freight:**
• Airport: Faisalabad / Lahore
• Transit: 3-7 days worldwide
• For urgent or sample shipments

📋 **Terms Available:**
• **FOB** (Free On Board)
• **CIF** (Cost, Insurance, Freight)
• **DDP** (Delivered Duty Paid — upon request)

📄 All export documentation handled by us.`,followUp:["Lead time","Get a quote","Request human"]},"customization|customize|personalize|private label|own brand|own label":{answer:`We offer **full customization** for your brand:

🎨 **Decoration Options:**
• Screen printing (up to 12 colors)
• DTG (Direct-to-Garment) printing
• Embroidery (flat, 3D puff, chain stitch)
• Heat transfer printing
• Sublimation printing
• Discharge printing

🏷️ **Branding:**
• Custom woven labels
• Printed care labels
• Custom hang tags
• Branded packaging
• Custom polybags

✂️ **Design Services:**
• Pattern development from your sketch
• Tech pack development assistance
• Size grading
• Color matching (Pantone)

Send us your design and we'll bring it to life!`,followUp:["Sample request","Get a quote","Send requirements"]},logo:{answer:`We can add your **logo** using several methods:

🎨 **Logo Application Options:**
• **Embroidery** — Premium, textured, durable
• **Screen Print** — Cost-effective for bulk
• **DTG Print** — Full-color, photographic quality
• **Heat Transfer** — Detailed, multi-color
• **Woven Label** — Inside garment branding
• **Rubber/Silicone** — 3D raised effect

📋 **What we need from you:**
• Logo file (AI, EPS, PNG, or PDF)
• Preferred placement (chest, back, sleeve)
• Preferred method (or we can recommend)

Send us your logo and we'll provide a free mockup!`,followUp:["Get a quote","Sample request","Send requirements"]},"printing|screen print|dtg|sublimation":{answer:`Our **printing capabilities:**

🖨️ **Screen Printing:**
• Up to 12 colors
• Plastisol & water-based inks
• Discharge printing
• High-density printing
• Best for bulk orders

🖨️ **DTG Printing:**
• Full-color photographic prints
• No color limitations
• Best for complex designs
• Small batch friendly

🖨️ **Other Options:**
• Sublimation (polyester fabrics)
• Heat transfer / vinyl
• Foil printing
• Flock printing
• Puff printing

All printing undergoes wash testing to ensure durability!`,followUp:["Embroidery details","Get a quote","Sample request"]},"embroidery|embroider":{answer:`Our **embroidery services:**

🪡 **Types:**
• Flat embroidery
• 3D puff embroidery
• Chain stitch
• Appliqué
• Sequin embroidery

📋 **Details:**
• Up to 15 colors per design
• Max stitch count: 100,000+
• Placement: chest, back, sleeve, cap
• Digitization included
• Free stitch-out sample

💰 Pricing based on stitch count and quantity.

Send us your logo and we'll provide a digitized mockup!`,followUp:["Printing details","Get a quote","Sample request"]},"about|tell me about|company info|who are you|history|background":{answer:`**Reve Stitching** — Where Quality Meets Innovation

📅 **Founded:** 2019 in Faisalabad, Pakistan
🏭 **Facility:** Full composite knitwear unit
⚙️ **Capacity:** 300,000+ garments/month
🔧 **Machines:** 150+ modern units
🌍 **Markets:** UK, Europe, and growing
🏅 **Certified:** SEDEX, ISO, BCI, GOTS & more

📈 **Our Journey:**
• 2019 — Company established
• 2020 — SEDEX certification
• 2021 — SGS training program
• 2022 — Production expansion
• 2023 — Full composite facility
• 2024 — Global brand partnerships
• 2025 — Sustainability initiative

We're not just a manufacturer — we're your **strategic partner** in growth!`,followUp:["Our clients","Certifications","Factory tour","Get a quote"]},"team|management|leadership|owner|ceo|director":{answer:`Meet our **leadership team:**

👤 **Vasim Ahmad** — CEO
Visionary leader driving growth with focus on sustainable manufacturing.

👤 **Haroon Iqbal** — Director
Oversees client relations and international business development.
📧 haroon@revestitching.com

👤 **Abdul Basit** — Director
Leads operations and production strategy.
📧 abdul.basit@revestitching.com

👤 **Ghulam Jilani** — General Manager
Manages day-to-day operations across all departments.

Want to speak with someone directly?`,followUp:["Request human","Contact team","About us"]},"factory tour|visit factory|see factory|facility":{answer:`We welcome **factory visits!** Here's what you'll see:

🏭 **Our Facility Features:**
• 150+ modern knitting & sewing machines
• Dedicated cutting department
• In-house embroidery unit
• Quality control laboratory
• Pressing & finishing department
• Packaging & dispatch area
• Clean, well-lit workspace
• SEDEX-compliant environment

📍 **Location:** Chak No. 196/R.B, Ghona Road, Faisalabad
🕐 **Visit Hours:** Mon-Sat, 8 AM - 6 PM

Contact us to schedule your visit — we'll arrange everything!`,followUp:["Contact team","Request human","Location details"]},"client|brand|who do you work|partner|boohoo|customer":{answer:`We're proud to partner with **international brands:**

🏷️ **Our Clients:**
• Boohoo
• Pull&Bear
• Yours Clothing
• Closure London
• Daisy Street
• Marshall Artist
• Threadbare
• Forever Club
• Helme

🌍 **Industries Served:**
• Fast Fashion & High Street
• Sportswear & Activewear
• Children's Apparel
• Corporate & Uniforms

Join our growing list of satisfied partners!`,followUp:["Product range","Quality standards","Get a quote"]},"location|address|where are you|faisalabad|find you|map":{answer:`📍 **Our Location:**

**Reve Stitching**
Chak No. 196/R.B, Ghona Road
Faisalabad (38000), Pakistan

🌐 **Why Faisalabad?**
Known as the "Manchester of Pakistan" — it's the heart of Pakistan's textile industry with:
• Access to raw materials
• Skilled labor force
• Textile infrastructure
• Proximity to Karachi port

🕐 **Working Hours:**
Monday – Saturday: 8 AM – 6 PM
Sunday: Closed

Factory visits are always welcome!`,followUp:["Contact team","Factory tour","Request human"]},"contact|email|phone|call|reach|get in touch":{answer:`Here's how to **reach us:**

📧 **Email:**
• Haroon Iqbal (Client Relations)
  haroon@revestitching.com

• Abdul Basit (Operations)
  abdul.basit@revestitching.com

📝 **Contact Form:**
Visit our [contact page](/contact/) for detailed inquiries.

🕐 **Response Time:**
• Email: Within 24 hours
• Urgent: Same day during business hours

📍 **Office Hours:**
Mon-Sat: 8 AM - 6 PM (PKT)`,followUp:["Get a quote","Request human","Visit contact page"]},"manufacturing process|production process|how do you make|workflow":{answer:`Our **14-step manufacturing process:**

1️⃣ Product Design
2️⃣ Fabric Selection & Inspection
3️⃣ Pattern Making
4️⃣ Grading
5️⃣ Marking
6️⃣ Spreading
7️⃣ Cutting
8️⃣ Bundling
9️⃣ Sewing
🔟 Embroidery/Printing
1️⃣1️⃣ Pressing & Folding
1️⃣2️⃣ Finishing & Detailing
1️⃣3️⃣ Quality Control (AQL 1.5-4.0)
1️⃣4️⃣ Finished & Packed

Every step has dedicated quality checkpoints!`,followUp:["Quality standards","Lead time","Get a quote"]},"capacity|production volume|per month|output":{answer:`Our **production capabilities:**

🏭 **Monthly Capacity:** 300,000+ garments
⚙️ **Machines:** 150+ modern units
👥 **Workforce:** Skilled, SGS-trained team

📊 **Breakdown by product:**
• T-Shirts: ~100,000/month
• Polos: ~50,000/month
• Hoodies: ~40,000/month
• Joggers: ~40,000/month
• Other: ~70,000/month

📈 We can scale up for large orders with our partner facilities!

🔄 **We're a full composite unit:**
Fabric Knitting → Dyeing → Cutting → Stitching → Finishing → Packing

All under one roof!`,followUp:["Product range","Lead time","Get a quote"]},"send requirement|share requirement|tech pack|send design|share design":{answer:`Great! Here's how to **share your requirements:**

📧 **Email your tech pack to:**
haroon@revestitching.com

📋 **What to include:**
• Product type (tee, hoodie, etc.)
• Fabric preference & GSM
• Colors (Pantone codes if possible)
• Size range needed
• Quantity per size
• Print/embroidery details
• Any special requirements

💡 **Don't have a tech pack?**
No worries! Even a sketch or reference image works. We can help develop the full specification.

We'll respond with a detailed quote within **24 hours**!`,followUp:["Get a quote","Request human","Sample request"]},"why you|why not china|advantage|why choose|compare|competitor|better than":{answer:`Here's why brands choose **Reve Stitching:**

🏆 **Our Advantages:**

✅ **Lower MOQs** — Start from 200 pcs (vs 1000+ in China)
✅ **Faster Communication** — Same timezone as EU/UK
✅ **Competitive Pricing** — 15-30% lower than comparable quality
✅ **GSP+ Status** — Duty-free exports to EU
✅ **Quality** — AQL 1.5-4.0 with SGS-trained staff
✅ **Flexibility** — Quick design changes & re-orders
✅ **Ethical** — SEDEX compliant, fair wages
✅ **Full Composite** — Everything under one roof

🆚 **vs China:** Lower MOQs, faster turnaround, competitive pricing
🆚 **vs Bangladesh:** Better quality control, more flexible
🆚 **vs Turkey:** More competitive pricing, similar quality`,followUp:["Get a quote","Our clients","Quality standards"]},"thank|thanks|thx|appreciate|great job|awesome|perfect|wonderful":{answer:`You're most welcome! 😊 We're glad to help!

Is there anything else you'd like to know about our manufacturing services?`,followUp:["Get a quote","Request human","Product range"]},"bye|goodbye|see you|talk later|that's all|done|no more":{answer:`Thank you for chatting with us! 👋

It was great talking to you. Here's a quick summary of how to reach us:

📧 haroon@revestitching.com
📧 abdul.basit@revestitching.com
🌐 [Contact Page](/contact/)

We look forward to working with you. Have a wonderful day! 🌟`},"okay|sure|got it|understood|i see|alright|noted":{answer:`Great! 👍 Is there anything else you'd like to know? I'm here to help with any questions about:

• Products & customization
• Pricing & MOQ
• Quality & certifications
• Lead times & shipping

Or I can connect you with our team directly!`,followUp:["Get a quote","Request human","Product range"]},"human|real person|agent|speak to someone|talk to someone|representative":{answer:"__REQUEST_HUMAN__"}},V={"Product range":"What products do you manufacture?","MOQ details":"What is your minimum order quantity?","Get a quote":"I want to get a price quote","Lead time":"What is your production lead time?","Quality standards":"What quality standards do you maintain?",Certifications:"What certifications do you have?","Fabric types":"What fabric types do you work with?","Request human":"I want to talk to a human representative","Contact team":"How can I contact your team?","About us":"Tell me about Reve Stitching","Our clients":"What brands do you work with?","Visit contact page":"__LINK__/contact/","T-shirt details":"Tell me about your t-shirts","Polo details":"Tell me about your polo shirts","Hoodie details":"Tell me about your hoodies","Jogger details":"Tell me about your joggers","Sweatshirt details":"Tell me about your sweatshirts","Ladies wear":"Tell me about ladies wear collection","Kids wear":"Tell me about kids wear range","Custom fabric":"Can you develop custom fabrics?","Fleece details":"Tell me about terry fleece fabric","Sample request":"Do you provide samples before bulk?","Payment terms":"What are your payment terms?","Shipping details":"What are your shipping options?","Order process":"How does the ordering process work?","Printing details":"What printing options do you offer?","Embroidery details":"What embroidery services do you offer?","Factory tour":"Can I visit your factory?","Location details":"Where are you located?","Send requirements":"How do I share my requirements?",Sustainability:"Tell me about your sustainability efforts","Capacity details":"What is your production capacity?"},Y=[{label:"📦 Product Range",value:"What products do you manufacture?"},{label:"📋 MOQ Details",value:"What is your minimum order quantity?"},{label:"💰 Get a Quote",value:"I want to get a price quote"},{label:"⏱️ Lead Time",value:"What is your production lead time?"}];function s(e,n){try{return n!==void 0?(sessionStorage.setItem(e,n),n):sessionStorage.getItem(e)}catch{return null}}function y(){return s(o.mode)||"bot"}function Q(e){s(o.mode,e)}function f(){return s(o.sessionId)}function w(){let e=s(o.visitorToken);return e||(e=crypto.randomUUID(),s(o.visitorToken,e)),e}function X(e,n){try{const t=JSON.parse(s(o.messages)||"[]");t.push({text:e,sender:n,time:W()}),s(o.messages,JSON.stringify(t))}catch{}}function M(){try{return JSON.parse(s(o.messages)||"[]")}catch{return[]}}function W(){return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function P(e){return e.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2" class="text-primary underline hover:text-primary-light">$1</a>').replace(/\n/g,"<br/>")}function O(e,n,t){if(!l)return;const a=t||W(),i=document.createElement("div");if(n==="system")i.className="chat-msg flex justify-center",i.innerHTML=`<div class="px-4 py-2 bg-zinc-100 rounded-full text-xs text-zinc-500">${P(e)}</div>`;else if(n==="user")i.className="chat-msg flex justify-end",i.innerHTML=`
          <div class="max-w-[80%]">
            <div class="bg-green-600 text-white rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed">${P(e)}</div>
            <span class="text-[10px] text-zinc-400 mt-1 block text-right pr-1">${a}</span>
          </div>`;else{const r=n==="admin"?K:H,p=n==="admin"?"bg-green-100":"bg-green-600/10";i.className="chat-msg flex justify-start",i.innerHTML=`
          <div class="flex gap-2.5 max-w-[85%]">
            <div class="w-7 h-7 rounded-full ${p} flex items-center justify-center shrink-0 mt-1">${r}</div>
            <div>
              ${n==="admin"?'<span class="text-[10px] text-green-600 font-medium mb-0.5 block">Team Member</span>':""}
              <div class="bg-zinc-100 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-zinc-700 leading-relaxed">${P(e)}</div>
              <span class="text-[10px] text-zinc-400 mt-1 block pl-1">${a}</span>
            </div>
          </div>`}l.appendChild(i)}function d(e,n){O(e,n),X(e,n),l&&(l.scrollTop=l.scrollHeight)}function Z(){if(!l)return;const e=document.createElement("div");e.id="typing-indicator",e.className="chat-msg flex justify-start",e.innerHTML=`
        <div class="flex gap-2.5">
          <div class="w-7 h-7 rounded-full bg-green-600/10 flex items-center justify-center shrink-0 mt-1">${H}</div>
          <div class="bg-zinc-100 rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
            <div class="w-2 h-2 bg-zinc-400 rounded-full typing-dot"></div>
            <div class="w-2 h-2 bg-zinc-400 rounded-full typing-dot"></div>
            <div class="w-2 h-2 bg-zinc-400 rounded-full typing-dot"></div>
          </div>
        </div>`,l.appendChild(e),l.scrollTop=l.scrollHeight}function U(){document.getElementById("typing-indicator")?.remove()}function h(e){if(!u)return;u.innerHTML="",(e?e.map(t=>({label:t,value:V[t]||t})):Y).forEach(t=>{if(t.value?.startsWith("__LINK__")){const i=document.createElement("a");i.href=t.value.replace("__LINK__",""),i.className="inline-flex items-center gap-1 px-3 py-2 bg-surface border border-border rounded-full text-xs font-medium text-green-600 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200 cursor-pointer",i.textContent=`🔗 ${t.label}`,u.appendChild(i);return}const a=document.createElement("button");a.className="px-3 py-2 bg-surface border border-border rounded-full text-xs font-medium text-zinc-600 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200 cursor-pointer",a.textContent=t.label,a.addEventListener("click",()=>x(t.value||t.label)),u.appendChild(a)})}function B(e){const n=e.toLowerCase();let t=null,a=0;for(const[i,r]of Object.entries($)){const p=i.split("|");let k=0;for(const m of p)m.length<=3?new RegExp(`\\b${m}\\b`,"i").test(n)&&(k+=m.length):n.includes(m)&&(k+=m.length);k>a&&(a=k,t=r)}return t||{answer:`Thanks for your message! I'm not sure about that specific question, but our team can definitely help.

You can:
• Ask me about **products, MOQ, quality, or certifications**
• Click **"Talk to a human"** below for direct assistance
• Visit our **[contact page](/contact/)** for detailed inquiries`,followUp:["Product range","MOQ details","Request human","Get a quote"]}}async function _(){if(d("I'm connecting you with a team member! 🤝","bot"),u){u.innerHTML=`
          <div class="w-full space-y-2 p-2">
            <p class="text-xs text-zinc-500">Optional: share your info so we can assist you better</p>
            <input id="live-name" type="text" placeholder="Your name" class="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-green-600" />
            <input id="live-email" type="email" placeholder="Your email" class="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs focus:outline-none focus:border-green-600" />
            <div class="flex gap-2">
              <button id="live-connect-btn" class="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">Connect Now</button>
              <button id="live-skip-btn" class="px-3 py-2 border border-zinc-200 rounded-lg text-xs text-zinc-600 hover:bg-zinc-50 transition-colors">Skip</button>
            </div>
          </div>`;const e=(n,t)=>{ee(n,t)};document.getElementById("live-connect-btn")?.addEventListener("click",()=>{const n=document.getElementById("live-name")?.value,t=document.getElementById("live-email")?.value;e(n,t)}),document.getElementById("live-skip-btn")?.addEventListener("click",()=>{e()})}}async function ee(e,n){u&&(u.innerHTML="");const t=w();try{const a=await fetch("/api/chat/session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({visitorToken:t,visitorName:e||null,visitorEmail:n||null})}),i=await a.json();if(!a.ok)throw new Error(i.error);s(o.sessionId,i.sessionId),Q("live"),d(`You're now connected! 🟢 A team member will join this chat shortly.

You can start typing your questions — they'll see your messages when they connect.

🕐 Typical response: Within a few minutes during business hours (Mon-Sat, 8AM-6PM PKT).`,"system"),D(),A()}catch{d("Sorry, I couldn't connect you right now. Please try emailing us at **haroon@revestitching.com** instead.","bot"),h(["Get a quote","Contact team"])}}async function ne(e){d(e,"user");const n=f(),t=w();if(n)try{await fetch("/api/chat/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:n,visitorToken:t,message:e})})}catch(a){console.warn("Failed to send live message:",a)}}function D(){if(v)return;const e=setInterval(async()=>{const n=f(),t=w();if(n)try{const i=await(await fetch(`/api/chat/poll?session=${n}&token=${t}&after=${encodeURIComponent(F)}`)).json();i.messages&&i.messages.length>0&&i.messages.forEach(r=>{if(!R.has(r.id)){R.add(r.id),F=r.created_at,O(r.message,"admin",new Date(r.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})),l&&(l.scrollTop=l.scrollHeight);try{const p=JSON.parse(s(o.messages)||"[]");p.some(m=>m.text===r.message&&m.sender==="admin")||(p.push({text:r.message,sender:"admin",time:new Date(r.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}),s(o.messages,JSON.stringify(p)))}catch{}}}),i.sessionStatus==="closed"&&(z(),T(),d("This chat session has ended. Thank you for chatting with us! 👋","system"),Q("bot"),sessionStorage.removeItem(o.sessionId),sessionStorage.removeItem(o.messages),sessionStorage.removeItem(o.hasOpened),sessionStorage.removeItem(o.wasOpen),sessionStorage.removeItem(o.mode),h(["Get a quote","Product range","Contact team"]))}catch(a){console.warn("Poll error:",a)}},3e3);v=e,window.__chatPollInterval=e}let S=null;function A(){if(S)return;const e=setInterval(async()=>{const n=f(),t=w();if(!n||y()!=="live"){T();return}try{await fetch("/api/chat/heartbeat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sessionId:n,visitorToken:t})})}catch{}},15e3);S=e,window.__chatHeartbeatInterval=e}function T(){S&&(clearInterval(S),S=null),window.__chatHeartbeatInterval&&(clearInterval(window.__chatHeartbeatInterval),window.__chatHeartbeatInterval=null)}function z(){v&&(clearInterval(v),v=null),window.__chatPollInterval&&(clearInterval(window.__chatPollInterval),window.__chatPollInterval=null)}async function x(e){if(y()==="live"){ne(e);return}d(e,"user"),u&&(u.innerHTML=""),Z();try{const a=M().slice(-10).map(r=>({text:r.text,sender:r.sender})),i=await fetch("/api/chat/bot",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e,history:a})});if(i.ok){const r=await i.json();if(U(),r.reply==="__REQUEST_HUMAN__"||r.reply?.includes("__REQUEST_HUMAN__")){_();return}d(r.reply,"bot");const p=te(r.reply);setTimeout(()=>h(p),300);return}}catch(a){console.warn("AI bot failed, using keyword fallback:",a)}U();const t=B(e);if(t.answer==="__REQUEST_HUMAN__"){_();return}d(t.answer,"bot"),setTimeout(()=>h(t.followUp),300)}function te(e){const n=e.toLowerCase(),t=[];return(n.includes("product")||n.includes("garment")||n.includes("manufacture"))&&t.push("Product range"),(n.includes("moq")||n.includes("minimum"))&&t.push("MOQ details"),(n.includes("price")||n.includes("quote")||n.includes("cost"))&&t.push("Get a quote"),(n.includes("quality")||n.includes("aql")||n.includes("inspection"))&&t.push("Quality standards"),(n.includes("certif")||n.includes("sedex")||n.includes("iso"))&&t.push("Certifications"),(n.includes("fabric")||n.includes("cotton")||n.includes("jersey"))&&t.push("Fabric types"),n.includes("sample")&&t.push("Sample request"),(n.includes("lead time")||n.includes("delivery")||n.includes("shipping"))&&t.push("Lead time"),t.length<2&&t.push("Get a quote"),t.length<3&&t.push("Request human"),t.length<4&&t.push("Product range"),[...new Set(t)].slice(0,4)}function oe(){if(!l)return;const e=M();e.length!==0&&(l.innerHTML="",e.forEach(n=>O(n.text,n.sender,n.time)),l.scrollTop=l.scrollHeight,I?.classList.add("hidden"))}function N(){if(q=!0,s(o.wasOpen,"true"),g?.classList.remove("opacity-0","scale-95","translate-y-4","pointer-events-none"),g?.classList.add("opacity-100","scale-100","translate-y-0","pointer-events-auto"),g?.setAttribute("aria-hidden","false"),E?.classList.add("opacity-0","rotate-90","scale-0"),C?.classList.remove("opacity-0"),C?.classList.add("rotate-0","scale-100"),I?.classList.add("hidden"),window.innerWidth<=480&&b&&(b.style.display="none"),!s(o.hasOpened))s(o.hasOpened,"true"),setTimeout(()=>{d(`Hello! 👋 Welcome to **Reve Stitching**!

I'm your virtual assistant. I can help you with:

• Product information & MOQ
• Pricing & quotes
• Quality standards & certifications
• Lead times & delivery

How can I help you today?`,"bot"),h()},400);else if(y()!=="live"){const e=M();if(e.length>0){const n=[...e].reverse().find(t=>t.sender==="bot");if(n){const t=B(n.text);t.answer!=="__REQUEST_HUMAN__"&&h(t.followUp)}else h()}}c?.focus()}function G(){q=!1,s(o.wasOpen,"false"),g?.classList.add("opacity-0","scale-95","translate-y-4","pointer-events-none"),g?.classList.remove("opacity-100","scale-100","translate-y-0","pointer-events-auto"),g?.setAttribute("aria-hidden","true"),E?.classList.remove("opacity-0","rotate-90","scale-0"),C?.classList.add("opacity-0"),C?.classList.remove("rotate-0","scale-100"),b&&(b.style.display="")}function ie(){s(o.hasOpened)&&M().length>0&&(oe(),I?.classList.add("hidden"),y()==="live"&&f()&&(D(),A()),s(o.wasOpen)==="true"&&N())}b?.addEventListener("click",()=>{q?G():N()}),J?.addEventListener("click",G),document.getElementById("chat-reset-btn")?.addEventListener("click",()=>{if(!confirm("Start a new chat? This will clear your current conversation."))return;z(),T();const e=f(),n=w();e&&y()==="live"&&navigator.sendBeacon("/api/chat/close",JSON.stringify({sessionId:e,visitorToken:n})),sessionStorage.removeItem(o.messages),sessionStorage.removeItem(o.hasOpened),sessionStorage.removeItem(o.wasOpen),sessionStorage.removeItem(o.mode),sessionStorage.removeItem(o.sessionId),sessionStorage.removeItem(o.visitorToken),window.location.reload()}),L?.addEventListener("submit",e=>{e.preventDefault();const n=c?.value?.trim();n&&(x(n),c&&(c.value="",c.style.height="auto"))}),c?.addEventListener("keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),L?.dispatchEvent(new Event("submit")))}),c?.addEventListener("input",()=>{c&&(c.style.height="auto",c.style.height=Math.min(c.scrollHeight,120)+"px")}),j?.addEventListener("click",()=>{x("I want to talk to a human representative")}),document.addEventListener("keydown",e=>{e.key==="Escape"&&q&&G()}),window.addEventListener("beforeunload",()=>{const e=f(),n=w();e&&y()==="live"&&navigator.sendBeacon("/api/chat/close",JSON.stringify({sessionId:e,visitorToken:n}))}),ie()});
