---
layout: archive
permalink: /index.html
title: ""
author_profile: false
redirect_from: 
  - /about/
  - /about.html
---

{% include base_path %}

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<style>
  /* ============================================================
     "Signal & System" — home page
     Palette + type scale match /_includes/head/custom.html
     ============================================================ */
  :root{
    --sg-bg: var(--sys-bg);
    --sg-panel: var(--sys-panel);
    --sg-line: var(--sys-line);
    --sg-line-strong: var(--sys-line-strong);
    --sg-ink: var(--sys-ink);
    --sg-ink-muted: var(--sys-ink-muted);
    --sg-ink-dim: var(--sys-ink-dim);
    --sg-warm: var(--sys-warm);
    --sg-warm-soft: var(--sys-warm-soft);
    --sg-cool: var(--sys-cool);
    --sg-cool-soft: var(--sys-cool-soft);
  }

  .home{
    max-width: 1060px;
    margin: 0 auto;
    padding: 0.2rem 1.25rem 2rem;
    font-family: 'IBM Plex Sans', sans-serif;
    color: var(--sg-ink-muted);
    line-height: 1.6;
  }
  .home a{ color: var(--sg-warm); text-decoration: none; }
  .home a:hover{ color: var(--sg-cool); }

  /* hero */
  .sg-hero{ padding: 0.8rem 0 1.8rem; }
  .sg-status{
    display:inline-flex; align-items:center; gap:0.55rem;
    font-family:'IBM Plex Mono', monospace; font-size:0.76rem; color:var(--sg-ink-muted);
    border:1px solid var(--sg-line-strong); border-radius:100px;
    padding:0.35rem 0.8rem 0.35rem 0.6rem; margin-bottom:1.5rem;
  }
  .sg-status .dot{
    width:7px; height:7px; border-radius:50%; background:var(--sg-cool);
    animation:sg-pulse 2.4s ease-out infinite;
  }
  @keyframes sg-pulse{
    0%{ box-shadow:0 0 0 0 rgba(79,195,176,0.5); }
    70%{ box-shadow:0 0 0 7px rgba(79,195,176,0); }
    100%{ box-shadow:0 0 0 0 rgba(79,195,176,0); }
  }
  .sg-name{
    font-family:'Space Grotesk', sans-serif; font-weight:700;
    font-size:clamp(2rem, 5.4vw, 3rem); line-height:1.08; letter-spacing:-0.015em;
    margin:0 0 0.5rem; max-width:11ch; color: var(--sg-ink);
  }
  .sg-role{
    font-family:'IBM Plex Mono', monospace; font-size:0.82rem; font-weight:500;
    letter-spacing:0.02em; color: #000; margin:0 0 1.2rem;
  }
  .sg-role .sep{ color:inherit; margin:0 0.5rem; }
  .sg-intro{ max-width:56ch; font-size:1.01rem; margin:0 0 1.75rem; }
  .sg-intro strong{ color: var(--sg-ink); font-weight:600; }

  .sg-trace{ width:100%; max-width:480px; height:48px; display:block; margin:0 0 1.9rem -2px; }
  .sg-trace path{
    fill:none; stroke: var(--sg-cool); stroke-width:1.6;
    stroke-dasharray:900; stroke-dashoffset:900;
    animation: sg-draw 2.1s cubic-bezier(.65,0,.35,1) 0.2s forwards;
  }
  @keyframes sg-draw{ to{ stroke-dashoffset:0; } }
  @media (prefers-reduced-motion: reduce){
    .sg-trace path{ animation:none; stroke-dashoffset:0; }
    .sg-status .dot{ animation:none; }
  }

  .sg-links{ display:flex; gap:0.6rem; }
  .sg-icon-link{
    display:flex; align-items:center; justify-content:center;
    width:38px; height:38px; border-radius:9px;
    border:1px solid var(--sg-line-strong); color:var(--sg-ink-muted) !important;
    transition:border-color .15s, color .15s, background .15s;
  }
  .sg-icon-link:hover{ border-color:var(--sg-warm); color:var(--sg-warm) !important; background:var(--sg-warm-soft); }
  .sg-icon-link svg{ width:16px; height:16px; }

  /* sections */
  .home section{ padding:2.25rem 0; border-top:1px solid var(--sg-line); }
  .sg-label{
    font-family:'IBM Plex Mono', monospace; font-size:0.74rem;
    color: var(--sg-ink-dim); margin-bottom:0.9rem; display:flex; align-items:center; gap:0.55rem;
  }
  .sg-label::before{ content:''; width:5px; height:5px; border-radius:50%; background:var(--sg-warm); }
  .home h2{
    font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:1.35rem;
    margin:0 0 1rem; color: var(--sg-ink);
  }
  .home h3.sg-sub{ font-size:1.02rem; margin: 1.8rem 0 0; color: var(--sg-ink); }
  .home p{ max-width:62ch; }

  .sg-chips{ display:flex; flex-wrap:wrap; gap:0.55rem; list-style:none; padding:0; margin:1.2rem 0 0; }
  .sg-chip{
    font-family:'IBM Plex Mono', monospace; font-size:0.78rem;
    color: var(--sg-cool); background: var(--sg-cool-soft);
    border:1px solid var(--sys-cool-line); border-radius:7px; padding:0.45rem 0.75rem;
  }

  .sg-focus{ list-style:none; padding:0; margin:1.1rem 0 0; display:flex; flex-direction:column; gap:0.9rem; }
  .sg-focus li{ display:flex; gap:0.85rem; max-width:60ch; font-size:0.96rem; }
  .sg-focus li::before{ content:''; flex:0 0 auto; width:1px; margin-top:0.3rem; align-self:stretch; background:var(--sg-line-strong); }
  .sg-focus li b{ color: var(--sg-ink); font-weight:600; }

  .sg-edu{ display:flex; flex-direction:column; margin-top:1.1rem; }
  .sg-edu-item{
    display:flex; justify-content:space-between; gap:1rem;
    padding:0.9rem 0; border-top:1px solid var(--sg-line); font-size:0.94rem;
  }
  .sg-edu-item:first-child{ border-top:none; }
  .sg-edu-item .what{ color: var(--sg-ink); font-weight:500; max-width:38ch; }
  .sg-edu-item--masters .what{ font-family:'IBM Plex Mono', monospace; }
  .sg-edu-item .where{ color: var(--sg-ink); font-family:'IBM Plex Mono', monospace; font-size:0.78rem; text-align:right; flex:0 0 auto; padding-top:0.15rem; }

  .sg-projects{ display:flex; flex-direction:column; margin-top:1.1rem; }
  .sg-proj{
    display:grid; grid-template-columns:3px 1fr; gap:1.1rem;
    padding:1.1rem 0; border-top:1px solid var(--sg-line);
    transition:padding-left .15s;
  }
  .sg-proj:first-child{ border-top:none; }
  .sg-proj:hover{ padding-left:0.35rem; }
  .sg-proj .bar{ background: var(--sg-line-strong); border-radius:2px; transition:background .15s; }
  .sg-proj:hover .bar{ background: var(--sg-warm); }
  .sg-proj .name{ color: var(--sg-ink); font-weight:600; font-size:1rem; margin-bottom:0.3rem; }
  .sg-proj .name a{ color: inherit; }
  .sg-proj .desc{ font-size:0.9rem; max-width:58ch; margin-bottom:0.55rem; }
  .sg-proj .tags{ display:flex; flex-wrap:wrap; gap:0.45rem; }
  .sg-proj .tags span{
    font-family:'IBM Plex Mono', monospace; font-size:0.7rem; color: var(--sg-ink-dim);
    border:1px solid var(--sg-line); border-radius:5px; padding:0.2rem 0.5rem;
  }

  .sg-footer{ padding:2.4rem 0 1rem; border-top:1px solid var(--sg-line); }
  .sg-cta{ font-family:'Space Grotesk', sans-serif; font-size:1.25rem; font-weight:600; margin:0 0 1.3rem; max-width:20ch; color: var(--sg-ink); }
  .sg-contact-row{ display:flex; flex-wrap:wrap; align-items:center; gap:1.3rem; }
  .sg-mail{
    color: var(--sg-warm) !important; font-family:'IBM Plex Mono', monospace; font-size:0.9rem;
    border-bottom:1px solid var(--sys-warm-line);
  }

  /* two-column layout: main content + right sidebar */
  .home-grid{
    display:grid;
    grid-template-columns: minmax(0, 1fr) 280px;
    align-items:start;
    gap: 0 3rem;
  }
  .home-main section:first-child{ border-top:1px solid var(--sg-line); }
  .home-main{ min-width:0; }

  .home-sidebar{
    position:sticky;
    top:1.75rem;
    padding:2.25rem 0 2.25rem 0;
    border-top:1px solid var(--sg-line);
  }
  .home-sidebar section.sg-sidebar-section{ padding:0; border-top:none; }
  .sg-sidebar-section + .sg-sidebar-section{ margin-top:2rem; padding-top:2rem; border-top:1px solid var(--sg-line); }
  .home-sidebar h2{
    font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:1.02rem;
    margin:0 0 1rem; color: var(--sg-ink);
  }

  .sg-ext-list{ list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:1.1rem; }
  .sg-ext-post a{
    display:block; padding:0.85rem 0.9rem; border:1px solid var(--sg-line);
    border-radius:9px; transition:border-color .15s, background .15s, transform .15s;
  }
  .sg-ext-post a:hover{ border-color: var(--sg-warm); background: var(--sg-warm-soft); transform:translateX(2px); }
  .sg-ext-title{
    display:block; font-family:'Space Grotesk', sans-serif; font-weight:600;
    font-size:0.92rem; line-height:1.35; color: var(--sg-ink); margin-bottom:0.4rem;
  }
  .sg-ext-post a:hover .sg-ext-title{ color: var(--sg-warm); }
  .sg-ext-meta{
    display:flex; align-items:center; gap:0.4rem;
    font-family:'IBM Plex Mono', monospace; font-size:0.7rem; color: var(--sg-ink-dim);
    text-transform:uppercase; letter-spacing:0.03em;
  }
  .sg-ext-meta .fa-arrow-up-right-from-square{ font-size:0.65rem; margin-left:auto; color: var(--sg-ink-dim); }
  .sg-ext-post a:hover .sg-ext-meta,
  .sg-ext-post a:hover .sg-ext-meta .fa-arrow-up-right-from-square{ color: var(--sg-cool); }

  .sg-ext-more{ margin-top:1.2rem; }
  .sg-ext-more a{
    font-family:'IBM Plex Mono', monospace; font-size:0.78rem; color: var(--sg-warm);
  }

  .sg-file-desc{
    display:block; font-size:0.8rem; color: var(--sg-ink-muted);
    margin-bottom:0.5rem; line-height:1.4;
  }
  .sg-file-post .sg-ext-meta .fa-arrow-down{
    font-size:0.65rem; margin-left:auto; color: var(--sg-ink-dim);
  }
  .sg-file-post a:hover .fa-arrow-down{ color: var(--sg-cool); }


  /* hero status pill + labelled links */
  .sg-status .loc{ color: var(--sg-ink); }
  .sg-status .dot{ flex:0 0 auto; }
  @media (max-width:600px){ .sg-status-extra{ display:none; } }
  .sg-links{ flex-wrap:wrap; align-items:center; }
  .sg-links .sg-divider{ width:1px; height:22px; background:var(--sg-line-strong); margin:0 0.25rem; }
  .sg-photo-list .ico svg{ width:16px; height:16px; }

  /* latest writing */
  .sg-writing{ list-style:none; margin:1.1rem 0 0; padding:0; }
  .sg-writing li{ margin:0; }
  .sg-writing a{
    display:grid; grid-template-columns: 5.6rem 1fr auto; gap:1rem; align-items:baseline;
    padding:0.85rem 0.25rem; border-top:1px solid var(--sg-line);
    transition: background .15s, padding-left .15s;
  }
  .sg-writing li:first-child a{ border-top:none; }
  .sg-writing a:hover{ background: var(--sg-warm-soft); padding-left:0.6rem; }
  .sg-writing .when{ font-family:'IBM Plex Mono', monospace; font-size:0.74rem; color: var(--sg-ink-dim); }
  .sg-writing .what{ color: var(--sg-ink); font-weight:500; font-size:0.97rem; line-height:1.4; }
  .sg-writing a:hover .what{ color: var(--sg-warm); }
  .sg-writing .kind{
    font-family:'IBM Plex Mono', monospace; font-size:0.66rem; text-transform:uppercase; letter-spacing:0.04em;
    color: var(--sg-cool); border:1px solid var(--sys-cool-line); border-radius:5px; padding:0.12rem 0.45rem; white-space:nowrap;
  }
  .sg-more-row{ display:flex; flex-wrap:wrap; gap:1.2rem; margin-top:1rem; font-family:'IBM Plex Mono', monospace; font-size:0.78rem; }

  /* travel photo banner → /vukclicks/ */
  .sg-photo-banner{
    position:relative; display:block; overflow:hidden;
    margin: 1rem 0 1.5rem; border-radius:14px; border:1px solid var(--sg-line);
    /* 30% of the old width, 150% of the old height (old box was 21:8) */
    width: 100%; min-width: 280px; aspect-ratio: 21 / 9; background: var(--sg-panel);
  }
  .sg-photo-banner img{
    position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position: center 40%;
    transition: transform .5s ease;
  }
  .sg-photo-banner::after{
    content:''; position:absolute; inset:0;
    background: linear-gradient(0deg, rgba(10,8,6,0.82) 0%, rgba(10,8,6,0.25) 45%, rgba(10,8,6,0) 70%);
  }
  .sg-photo-banner:hover img{ transform: scale(1.04); }
  .sg-photo-banner__text{
    position:absolute; z-index:1; left:0; bottom:0; padding: 1.4rem 1.4rem;
    display:flex; flex-direction:column; gap:0.35rem; max-width: 30rem;
  }
  .sg-photo-banner__kicker{ font-family:'IBM Plex Mono', monospace; font-size:0.72rem; color:#e8c48a; }
  .sg-photo-banner__title{ font-family:'Space Grotesk', sans-serif; font-weight:600; font-size:1.2rem; line-height:1.25; color:#f7f2ea; }
  .sg-photo-banner__cta{ font-family:'IBM Plex Mono', monospace; font-size:0.8rem; color:#f7f2ea; opacity:0.85; }
  .sg-photo-banner:hover .sg-photo-banner__cta{ opacity:1; text-decoration: underline; text-underline-offset:3px; }
  @media (max-width:600px){
    .sg-photo-banner{ width: 100%; min-width: 0; aspect-ratio: 8 / 9; } /* phones: full width, 50% taller than before */
    .sg-photo-banner__text{ padding: 1.2rem; }
    .sg-photo-banner__title{ font-size:1.1rem; }
    .sg-photo-banner::after{ background: linear-gradient(0deg, rgba(10,8,6,0.8) 0%, rgba(10,8,6,0.2) 70%); }
  }

  .sg-contact-row a.sg-plain{ font-family:'IBM Plex Mono', monospace; font-size:0.82rem; color: var(--sg-ink-muted); }
  .sg-contact-row a.sg-plain:hover{ color: var(--sg-warm); }

  @media (max-width:600px){
    .sg-writing a{ grid-template-columns: 1fr auto; gap:0.25rem 0.75rem; }
    .sg-writing .when{ grid-column: 1 / -1; }
  }

  @media (max-width:900px){
    .home-grid{ grid-template-columns: 1fr; }
    .home-sidebar{ position:static; border-top:none; padding-top:0; }
    .home-main section:first-child{ border-top:none; }
  }

  @media (max-width:600px){
    .sg-edu-item{ flex-direction:column; gap:0.2rem; }
    .sg-edu-item .where{ text-align:left; }
  }
</style>

<div class="home">

  <header class="sg-hero">
    <div class="sg-status"><span class="dot"></span><span><span class="loc">Singapore</span> · Sr. Engineering Tech Lead</span></div>
    <h1 class="sg-name">{{ site.author.name }}</h1>
    <p class="sg-role">shipping software <span class="sep">|</span> chasing AI <span class="sep">|</span> never done learning</p>

    <svg class="sg-trace" viewBox="0 0 480 48" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,24 L55,24 L69,7 L88,41 L106,13 L120,24 L185,24 C199,24 199,9 213,9 C227,9 227,24 241,24 L314,24 L328,37 L347,11 L363,24 L480,24" />
    </svg>

    <p class="sg-intro">I'm an <strong>Engineering Lead</strong> with a strong track record across Banking, Energy &amp; Utilities, and Digital Transformation. I specialise in closing the gap between business strategy and technical delivery — bringing hands-on depth in designing and shipping production-ready applications at enterprise scale.</p>

    <div class="sg-links">
      {% if site.author.linkedin %}
        <a class="sg-icon-link" href="https://www.linkedin.com/in/{{ site.author.linkedin }}" aria-label="LinkedIn" title="LinkedIn" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
        </a>
      {% endif %}
      {% if site.author.github %}
        <a class="sg-icon-link" href="https://github.com/{{ site.author.github }}" aria-label="GitHub" title="GitHub" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.93.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.68-.1-.26-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.66.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
        </a>
      {% endif %}
      {% if site.author.medium %}
        <a class="sg-icon-link" href="{{ site.author.medium }}" aria-label="Medium" title="Medium" target="_blank" rel="noopener">
          {% include brand-icon.html name="medium" %}
        </a>
      {% endif %}
    
    </div>
  </header>

  <div class="home-grid">
    <div class="home-main">

      <section id="working-on">
        <div class="sg-label">Working on</div>
        <ul class="sg-chips">
          <li class="sg-chip">PyTorch</li>
          <li class="sg-chip">Conversational AI</li>
          <li class="sg-chip">AI Adoption</li>
          <li class="sg-chip">Autonomous Multi-Agent AI Systems</li>
          <li class="sg-chip">AI Transformation</li>
          <li class="sg-chip">LLM</li>
          <li class="sg-chip">Multi-Modal AI</li>
          <li class="sg-chip">Automatic Speech Recognition</li>
        </ul>
      </section>

      <section id="overview">
        <div class="sg-label">Background</div>
        <p>My background spans the full delivery lifecycle: requirements gathering, architecture, API management, backend and test engineering, and production-grade execution. Having begun my career in the IT sector at age 20, I currently serve as Sr. Engineering Tech Lead for the SME Digital Channels, Open API and Partnerships program at <i>Standard Chartered, Singapore</i>, where I continue to deliver high-impact solutions across multiple domains.</p>
        <h3 class="sg-sub">Education</h3>
        <div class="sg-edu">
          <div class="sg-edu-item"><span class="what">PG Certification Program in Artificial Intelligence and Machine Learning</span><span class="where">IIIT Hyderabad</span></div>
          <div class="sg-edu-item sg-edu-item--masters"><span class="what">Master's in Software Engineering</span><span class="where">BITS Pilani</span></div>
        </div>
      </section>

      <section id="focus">
        <div class="sg-label">Current focus</div>
        <h2>What I write and build about</h2>
        <p>I use this space to publish technical insights and posts drawn from hands-on implementation, not theory.</p>
        <ul class="sg-focus">
          <li><span><b>AI-first problem solving</b> — analysing organisational challenges and driving productivity through strategic AI implementations.</span></li>
          <li><span><b>Conversational &amp; speech systems</b> — building AI-powered applications focused on automatic speech recognition and conversational AI.</span></li>
          <li><span><b>Research into practice</b> — translating cutting-edge research papers into practical solutions that deliver measurable business value.</span></li>
          <li><span><b>Responsible AI</b> — promoting awareness and education around safe, ethical AI usage — what to do, and what to avoid.</span></li>
        </ul>
      </section>

      <section id="latest">
        <div class="sg-label">Latest writing</div>
        <h2>Recently published</h2>
        {% assign writing = site.aiengineering | concat: site.greensoftware | concat: site.notes | where_exp: "d", "d.title" | sort: "date" | reverse %}
        <ul class="sg-writing">
          {% for w in writing limit:5 %}
            {% case w.collection %}
              {% when "aiengineering" %}{% assign kind = "AI Eng" %}
              {% when "greensoftware" %}{% assign kind = "Green SW" %}
              {% when "notes" %}{% assign kind = "Note" %}
              {% else %}{% assign kind = w.collection %}
            {% endcase %}
            <li>
              <a href="{{ w.url | relative_url }}">
                <span class="when">{{ w.date | date: "%d %b %Y" }}</span>
                <span class="what">{{ w.title }}</span>
                <span class="kind">{{ kind }}</span>
              </a>
            </li>
          {% endfor %}
        </ul>
        <div class="sg-more-row">
          <a href="{{ '/aiengineering/' | relative_url }}">AI Engineering →</a>
          <a href="{{ '/greensoftware/' | relative_url }}">Green Software →</a>
          <a href="{{ '/notes/' | relative_url }}">Notes →</a>
          {% if site.author.medium %}<a href="{{ site.author.medium }}" target="_blank" rel="noopener">Medium ↗</a>{% endif %}
        </div>
      </section>

     

    </div>

    <aside class="home-sidebar">
      <section id="external-posts" class="sg-sidebar-section">
        <div class="sg-label">Elsewhere</div>
        <ul class="sg-ext-list">
          {% assign ext_posts = site.data.external_posts | sort: "date" | reverse %}
          {% for post in ext_posts limit:5 %}
            <li class="sg-ext-post">
              <a href="{{ post.url }}" target="_blank" rel="noopener noreferrer">
                <span class="sg-ext-title">{{ post.title }}</span>
                <span class="sg-ext-meta">
                  {{ post.source }} · {{ post.date | date: "%b %Y" }}
                  <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                </span>
              </a>
            </li>
          {% endfor %}
        </ul>
        {% if site.author.medium %}
          <p class="sg-ext-more"><a href="{{ site.author.medium }}" target="_blank" rel="noopener noreferrer">More on Medium →</a></p>
        {% endif %}
      </section>

      

      {% assign site_files = site.data.files | sort: "date" | reverse %}
      {% if site_files.size > 0 %}
        <section id="files" class="sg-sidebar-section">
          <div class="sg-label">Downloads</div>
          <ul class="sg-ext-list">
            {% for file in site_files %}
              <li class="sg-ext-post sg-file-post">
                <a href="{{ file.url | relative_url }}" target="_blank" rel="noopener noreferrer" download>
                  <span class="sg-ext-title">{{ file.title }}</span>
                  {% if file.description %}<span class="sg-file-desc">{{ file.description }}</span>{% endif %}
                  <span class="sg-ext-meta">
                    {% if file.type %}{{ file.type }} ·{% endif %} {{ file.date | date: "%b %Y" }}
                    <i class="fa-solid fa-arrow-down" aria-hidden="true"></i>
                  </span>
                </a>
              </li>
            {% endfor %}
          </ul>
        </section>
      {% endif %}
    </aside>
  </div>

  <hr/>

  <a class="sg-photo-banner" href="{{ '/vukclicks/' | relative_url }}">
    <img src="{{ '/images/aboutme/travel.jpeg' | relative_url }}" alt="Travel photograph by Uday" loading="lazy">
    <span class="sg-photo-banner__text">
      <span class="sg-photo-banner__kicker">Off the keyboard</span>
      <span class="sg-photo-banner__title">VUK Clicks — travel &amp; street photography</span>
      <span class="sg-photo-banner__cta">See the gallery →</span>
    </span>
  </a>

</div>