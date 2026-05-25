import React, { useState, useMemo, useEffect } from "react";

/**
 * A Reflective Awareness Tool for Faith Community Experiences — v2
 * ---------------------------------------------------------------
 * NOT a diagnostic instrument. Surfaces research-backed indicators of
 * high-control / spiritually abusive dynamics across TIME, so the user
 * can see how patterns shift from a first service through years of
 * involvement.
 *
 * Frameworks: Hassan BITE model, Lifton's thought-reform criteria,
 * Lalich bounded choice, Winell religious-trauma literature.
 *
 * v2 changes:
 *  - TIME: user reflects across every stage they've reached; results
 *    show a trajectory (how each dimension shifts over time).
 *  - OUTPUT: overall score/tier + per-dimension breakdown + the arc.
 *  - USER: perspective selector (current member / left or leaving /
 *    concerned friend or family) re-voices every question.
 */

const PERSPECTIVES = [
  { id: "current", label: "I'm currently involved" },
  { id: "former", label: "I've left or am leaving" },
  { id: "concerned", label: "I'm worried about someone else" },
];

const STAGES = [
  { id: "service", short: "1 service", label: "A single service or event", blurb: "First impressions; pressure of the moment." },
  { id: "week", short: "~1 week", label: "About a week", blurb: "The early 'courtship' — sometimes love bombing." },
  { id: "month", short: "~1 month", label: "About a month", blurb: "Norms and expectations become visible." },
  { id: "year", short: "~1 year", label: "Around a year", blurb: "Commitment deepens; control often consolidates." },
  { id: "longer", short: "1 year +", label: "More than a year", blurb: "Long-term effects on identity and autonomy." },
];
const STAGE_ORDER = STAGES.map((s) => s.id);
const stageIdx = (id) => STAGE_ORDER.indexOf(id);

const DIMENSIONS = [
  { id: "behavior", name: "Behavior Control", framework: "BITE — Behavior", color: "var(--c-clay)", desc: "Regulation of daily actions, time, body, and choices." },
  { id: "information", name: "Information Control", framework: "BITE — Information", color: "var(--c-ochre)", desc: "Restriction of outside information and honest questions." },
  { id: "thought", name: "Thought Control", framework: "BITE — Thought / Lifton", color: "var(--c-sage)", desc: "Black-and-white thinking and loaded language." },
  { id: "emotion", name: "Emotional Control", framework: "BITE — Emotional", color: "var(--c-plum)", desc: "Fear, guilt, and shame used to manage people." },
  { id: "exit", name: "Exit Costs & Autonomy", framework: "Lalich — Bounded Choice", color: "var(--c-slate)", desc: "What leaving would cost — socially, financially, spiritually." },
  { id: "wellbeing", name: "Personal Wellbeing", framework: "Religious-trauma literature", color: "var(--c-teal)", desc: "Direct effects on mental health, body, and sense of self." },
];
const DIM = (id) => DIMENSIONS.find((d) => d.id === id);

const BANK = [
  { dim: "behavior", stage: "service", m: "I felt unexpected pressure to commit, give money, or sign up before I was ready.", c: "They were pushed to commit, give money, or sign up very quickly." },
  { dim: "behavior", stage: "week", m: "Leaders or members began directing how I should spend my personal time.", c: "Leaders or members started directing how they spend their personal time." },
  { dim: "behavior", stage: "month", m: "There were rules about dress, diet, media, or relationships beyond shared values.", c: "New rules appeared about their dress, diet, media, or relationships." },
  { dim: "behavior", stage: "year", m: "I needed a leader's approval for significant personal decisions.", c: "They seem to need a leader's approval for significant personal decisions." },
  { dim: "behavior", stage: "longer", m: "Major life choices (career, marriage, where I live) were shaped or vetoed by the group.", c: "Major life choices of theirs appear shaped or vetoed by the group." },

  { dim: "information", stage: "service", m: "Questions or skepticism were discouraged or quickly redirected.", c: "When they asked questions, skepticism seemed discouraged or redirected." },
  { dim: "information", stage: "week", m: "I was warned about outside sources, critics, or 'negative' information.", c: "They were warned about outside sources, critics, or 'negative' information." },
  { dim: "information", stage: "month", m: "There was a clear gap between what newcomers are told and what insiders know.", c: "I sense a gap between what they're told and what insiders actually know." },
  { dim: "information", stage: "year", m: "I was discouraged from contact with people who'd left or who criticized the group.", c: "They've been discouraged from contact with people who left or criticized the group." },
  { dim: "information", stage: "longer", m: "I now realize important information was withheld from me for a long time.", c: "It looks like important information has been withheld from them for a long time." },

  { dim: "thought", stage: "service", m: "The group used special insider language outsiders wouldn't understand.", c: "The group uses special insider language outsiders wouldn't understand." },
  { dim: "thought", stage: "week", m: "The world was framed as 'us' (good/saved) versus 'them' (lost/dangerous).", c: "The world is framed to them as 'us' (good) versus 'them' (dangerous)." },
  { dim: "thought", stage: "month", m: "Doubt itself was treated as a spiritual failing or an attack to resist.", c: "Their doubts are treated as a spiritual failing or an attack to resist." },
  { dim: "thought", stage: "year", m: "I found myself shutting down my own critical thoughts to stay in good standing.", c: "They seem to shut down their own critical thoughts to stay in good standing." },
  { dim: "thought", stage: "longer", m: "I lost confidence in my own judgment apart from the group's framework.", c: "They seem to have lost confidence in their own judgment apart from the group." },

  { dim: "emotion", stage: "service", m: "I felt an intense, almost overwhelming warmth and acceptance very quickly.", c: "They were met with intense, almost overwhelming warmth very quickly." },
  { dim: "emotion", stage: "week", m: "Fear of bad consequences (hell, failure, loss) was used to motivate me.", c: "Fear of bad consequences seems used to motivate them." },
  { dim: "emotion", stage: "month", m: "Guilt or shame was a regular tool for correcting members' behavior.", c: "Guilt or shame appears to be a regular tool for correcting members." },
  { dim: "emotion", stage: "year", m: "My emotional highs and lows became tightly tied to my standing in the group.", c: "Their moods seem tightly tied to their standing in the group." },
  { dim: "emotion", stage: "longer", m: "I felt I couldn't express anger, grief, or doubt without being seen as unfaithful.", c: "They seem unable to express anger, grief, or doubt without being judged." },

  { dim: "exit", stage: "month", m: "I sensed that leaving would mean losing most of my friendships.", c: "Leaving would clearly mean losing most of their friendships." },
  { dim: "exit", stage: "year", m: "Leaving carried serious spiritual threats (damnation, curses, abandonment by God).", c: "Leaving is framed to them with serious spiritual threats." },
  { dim: "exit", stage: "year", m: "My finances, housing, or job were entangled with the group.", c: "Their finances, housing, or job have become entangled with the group." },
  { dim: "exit", stage: "longer", m: "I genuinely could not picture a life or identity outside this community.", c: "They genuinely can't seem to picture a life outside this community." },

  { dim: "wellbeing", stage: "week", m: "After involvement, my sleep, appetite, or anxiety noticeably worsened.", c: "Since involvement, their sleep, appetite, or anxiety has noticeably worsened." },
  { dim: "wellbeing", stage: "month", m: "I often felt I was never doing enough and was failing spiritually.", c: "They often seem to feel they're never doing enough spiritually." },
  { dim: "wellbeing", stage: "year", m: "I withdrew from outside friends, family, or interests that once mattered.", c: "They've withdrawn from friends, family, or interests that once mattered." },
  { dim: "wellbeing", stage: "longer", m: "I have guilt, fear, or intrusive thoughts I trace back to this involvement.", c: "They show guilt, fear, or distress that seems tied to this involvement." },
];

const SCALE = [
  { v: 0, label: "Not at all" }, { v: 1, label: "A little" }, { v: 2, label: "Somewhat" },
  { v: 3, label: "Quite a bit" }, { v: 4, label: "Very much" },
];

const TIERS = [
  { id: "supportive", max: 0.20, name: "Largely Healthy Signs", headline: "These responses point toward a supportive environment.", body: "The patterns described are mostly consistent with a healthy faith community — one that respects autonomy, welcomes questions, and doesn't rely on fear or control. No tool is the final word, so keep trusting what you observe over time." },
  { id: "watch", max: 0.40, name: "Worth Watching", headline: "A few patterns are worth keeping an eye on.", body: "Most of this seems healthy, but a handful of responses touch dynamics that can become concerning if they intensify. This is awareness, not alarm — watch whether they grow, and protect outside relationships and independent thinking." },
  { id: "caution", max: 0.62, name: "Meaningful Caution", headline: "Several responses align with high-control dynamics.", body: "This is a cluster of patterns researchers associate with controlling or spiritually unhealthy groups. Harm isn't certain, but it's a meaningful signal. Consider talking with a trusted person outside the group, and look closely at the dimensions and stages flagged below." },
  { id: "elevated", max: 1.01, name: "Elevated Concern", headline: "Many responses reflect known risk factors for psychological harm.", body: "The overall pattern strongly resembles dynamics documented in high-control and spiritually abusive groups. Please take this seriously — not as a verdict, but as a prompt to seek outside support. Belonging shouldn't depend on fear, isolation, or surrendering your own judgment." },
];
const tierFor = (r) => TIERS.find((t) => r <= t.max) || TIERS[TIERS.length - 1];

// Verified May 2026. "crisis" items shown first / most prominently.
const RESOURCES_US = [
  { kind: "crisis", name: "988 Suicide & Crisis Lifeline (US)", detail: "Call or text 988, or chat at 988lifeline.org. Free, confidential, 24/7 — for you or someone you're worried about. Not just for suicidal crises; emotional distress counts.", url: "https://988lifeline.org/" },
  { kind: "support", name: "Journey Free — Recovery from Harmful Religion", detail: "Founded by Dr. Marlene Winell, who named Religious Trauma Syndrome. Offers individual recovery coaching and the 'Release and Reclaim' online support group.", url: "https://www.journeyfree.org/" },
  { kind: "support", name: "Reclamation Collective", detail: "A nonprofit centering survivors of religious trauma and spiritual abuse. Hosts virtual support groups and a religious-trauma-informed clinician directory by state/province.", url: "https://www.reclamationcollective.com/" },
  { kind: "support", name: "Recovering from Religion", detail: "Peer support for people questioning or leaving their faith, including a confidential helpline and online and in-person support groups.", url: "https://www.recoveringfromreligion.org/" },
];

const RESOURCES_INTL = [
  { kind: "crisis", name: "Find A Helpline (global, by country)", detail: "A vetted directory from the International Association for Suicide Prevention. Choose your country to find free phone, text, and chat crisis support near you.", url: "https://findahelpline.com/" },
  { kind: "crisis", name: "Befrienders Worldwide", detail: "An international network of 90+ emotional-support centres (run by Samaritans). Find a local centre for confidential support if you're in distress, anywhere in the world.", url: "https://befrienders.org/" },
  { kind: "support", name: "Samaritans (UK & Ireland)", detail: "Free, 24/7 confidential emotional support. Call 116 123 (UK & ROI). For anyone struggling to cope, not only those who are suicidal.", url: "https://www.samaritans.org/" },
  { kind: "support", name: "Reclamation Collective (international community)", detail: "Connects survivors of religious trauma internationally through virtual, community-based support spaces, alongside its clinician directory.", url: "https://www.reclamationcollective.com/" },
];

function Stylesheet() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Newsreader:ital,opsz@0,6..72;1,6..72&family=IBM+Plex+Mono:wght@400;500&display=swap');
      .rt-root{--c-paper:#f4efe6;--c-paper-2:#ebe3d4;--c-ink:#2b2620;--c-ink-soft:#6a6256;--c-line:#d8cdb9;--c-clay:#b5593f;--c-ochre:#c08a2d;--c-sage:#6f7d52;--c-plum:#7a4a63;--c-slate:#4f6472;--c-teal:#3c7a73;--c-accent:#b5593f;font-family:'Newsreader',Georgia,serif;color:var(--c-ink);line-height:1.55;min-height:100vh;position:relative;background:radial-gradient(circle at 18% 12%,rgba(192,138,45,.10),transparent 42%),radial-gradient(circle at 84% 88%,rgba(60,122,115,.10),transparent 46%),var(--c-paper);padding:clamp(20px,5vw,72px) clamp(16px,5vw,40px);}
      .rt-root::before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.5;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");}
      .rt-shell{max-width:760px;margin:0 auto;position:relative;}
      .rt-eyebrow{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--c-accent);margin-bottom:18px;}
      .rt-h1{font-family:'Fraunces',serif;font-weight:500;font-size:clamp(28px,6vw,50px);line-height:1.05;letter-spacing:-.01em;margin:0 0 20px;}
      .rt-h1 em{font-style:italic;color:var(--c-clay);}
      .rt-lede{font-size:clamp(17px,2.4vw,20px);color:var(--c-ink-soft);max-width:58ch;}
      .rt-card{background:rgba(255,253,248,.55);border:1px solid var(--c-line);border-radius:4px;padding:clamp(20px,4vw,36px);backdrop-filter:blur(2px);}
      .rt-note{border-left:3px solid var(--c-accent);padding:14px 18px;margin:26px 0;background:rgba(181,89,63,.06);font-size:15px;color:var(--c-ink-soft);}
      .rt-note strong{color:var(--c-ink);font-weight:600;}
      .rt-btn{font-family:'IBM Plex Mono',monospace;font-size:13px;letter-spacing:.05em;background:var(--c-ink);color:var(--c-paper);border:none;border-radius:3px;padding:14px 26px;cursor:pointer;transition:transform .15s,opacity .15s;}
      .rt-btn:hover{transform:translateY(-1px);opacity:.92;}
      .rt-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;}
      .rt-btn-ghost{background:transparent;color:var(--c-ink);border:1px solid var(--c-line);}
      .rt-opt-grid{display:grid;gap:12px;margin-top:28px;}
      .rt-opt{text-align:left;width:100%;background:rgba(255,253,248,.5);border:1px solid var(--c-line);border-radius:4px;padding:18px 20px;cursor:pointer;transition:border-color .18s,background .18s,transform .18s;display:flex;align-items:baseline;gap:16px;}
      .rt-opt:hover{border-color:var(--c-accent);transform:translateX(3px);}
      .rt-opt.sel{border-color:var(--c-accent);background:rgba(181,89,63,.10);}
      .rt-opt-num{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--c-accent);}
      .rt-opt-label{font-family:'Fraunces',serif;font-size:19px;}
      .rt-opt-blurb{font-size:14px;color:var(--c-ink-soft);margin-top:3px;}
      .rt-progress-wrap{margin-bottom:28px;}
      .rt-progress-meta{display:flex;justify-content:space-between;align-items:baseline;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--c-ink-soft);margin-bottom:10px;}
      .rt-progress-track{height:4px;background:var(--c-paper-2);border-radius:2px;overflow:hidden;}
      .rt-progress-fill{height:100%;background:var(--c-accent);transition:width .4s cubic-bezier(.22,1,.36,1);}
      .rt-stage-chip{display:inline-block;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--c-paper);background:var(--c-ink);padding:4px 10px;border-radius:20px;margin-bottom:16px;}
      .rt-q-frame{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--c-ink-soft);margin-bottom:14px;}
      .rt-q-frame b{color:var(--c-accent);font-weight:500;}
      .rt-q-text{font-family:'Fraunces',serif;font-size:clamp(20px,3.6vw,27px);line-height:1.27;margin-bottom:28px;}
      .rt-scale{display:grid;gap:9px;}
      .rt-scale-opt{display:flex;align-items:center;gap:14px;border:1px solid var(--c-line);border-radius:4px;padding:13px 18px;cursor:pointer;background:rgba(255,253,248,.4);transition:border-color .15s,background .15s;font-size:16px;}
      .rt-scale-opt:hover{border-color:var(--c-accent);background:rgba(181,89,63,.05);}
      .rt-scale-opt.sel{border-color:var(--c-accent);background:rgba(181,89,63,.12);}
      .rt-dot{width:16px;height:16px;border-radius:50%;border:1.5px solid var(--c-ink-soft);flex:none;transition:all .15s;}
      .rt-scale-opt.sel .rt-dot{background:var(--c-accent);border-color:var(--c-accent);box-shadow:inset 0 0 0 3px var(--c-paper);}
      .rt-nav{display:flex;justify-content:space-between;margin-top:28px;gap:12px;}
      .rt-result-tier{font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:14px;}
      .rt-result-headline{font-family:'Fraunces',serif;font-size:clamp(23px,4.5vw,34px);line-height:1.16;margin-bottom:18px;}
      .rt-result-body{font-size:17px;color:var(--c-ink-soft);}
      .rt-meter{margin:30px 0;}
      .rt-meter-track{height:12px;border-radius:6px;background:linear-gradient(90deg,var(--c-sage),var(--c-ochre) 50%,var(--c-clay));position:relative;}
      .rt-meter-needle{position:absolute;top:-7px;width:3px;height:26px;background:var(--c-ink);border-radius:2px;transition:left .8s cubic-bezier(.22,1,.36,1);}
      .rt-meter-labels{display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft);margin-top:8px;}
      .rt-divider{border:none;border-top:1px solid var(--c-line);margin:34px 0;}
      .rt-h2{font-family:'Fraunces',serif;font-size:23px;margin-bottom:8px;}
      .rt-sub{color:var(--c-ink-soft);font-size:15px;margin-bottom:20px;}
      .rt-fine{margin-top:18px;padding:14px 16px;border:1px dashed var(--c-line);border-radius:4px;background:rgba(255,253,248,.35);font-size:13px;line-height:1.6;color:var(--c-ink-soft);}
      .rt-fine strong{color:var(--c-ink);font-weight:600;}
      .rt-traj{width:100%;}
      .rt-traj-legend{display:flex;flex-wrap:wrap;gap:14px;margin-top:18px;}
      .rt-traj-leg-item{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--c-ink-soft);}
      .rt-traj-swatch{width:14px;height:3px;border-radius:2px;}
      .rt-dim-row{margin:16px 0;}
      .rt-dim-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;}
      .rt-dim-name{font-family:'Fraunces',serif;font-size:18px;}
      .rt-dim-fw{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--c-ink-soft);}
      .rt-dim-track{height:8px;background:var(--c-paper-2);border-radius:4px;overflow:hidden;}
      .rt-dim-fill{height:100%;border-radius:4px;transition:width .8s cubic-bezier(.22,1,.36,1);}
      .rt-dim-desc{font-size:13.5px;color:var(--c-ink-soft);margin-top:6px;}
      .rt-list{padding-left:0;list-style:none;}
      .rt-list li{padding:10px 0;border-bottom:1px solid var(--c-line);font-size:16px;display:flex;gap:12px;}
      .rt-list li:last-child{border-bottom:none;}
      .rt-mark{color:var(--c-accent);font-family:'IBM Plex Mono',monospace;flex:none;}
      .rt-footer{margin-top:40px;font-size:13px;color:var(--c-ink-soft);text-align:center;line-height:1.7;}
      @keyframes rt-fade{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}
      .rt-anim{animation:rt-fade .5s cubic-bezier(.22,1,.36,1) both;}
      /* compare */
      .rt-cmp-controls{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:22px;}
      .rt-cmp-controls label{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--c-ink-soft);display:flex;flex-direction:column;gap:5px;}
      .rt-select{font-family:'Newsreader',serif;font-size:15px;padding:8px 12px;border:1px solid var(--c-line);border-radius:4px;background:rgba(255,253,248,.8);color:var(--c-ink);cursor:pointer;}
      .rt-cmp-grid{display:grid;grid-template-columns:1.4fr .7fr .7fr .8fr;gap:0 10px;align-items:center;}
      .rt-cmp-grid>div{padding:9px 0;border-bottom:1px solid var(--c-line);font-size:14px;}
      .rt-cmp-head{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--c-ink-soft);}
      .rt-cmp-name{font-family:'Fraunces',serif;font-size:15px;}
      .rt-cmp-val{font-variant-numeric:tabular-nums;}
      .rt-cmp-delta{font-family:'IBM Plex Mono',monospace;font-size:13px;font-variant-numeric:tabular-nums;}
      .rt-up{color:var(--c-clay);} .rt-down{color:var(--c-sage);} .rt-flat{color:var(--c-ink-soft);}
      /* resources */
      .rt-res{display:grid;gap:12px;}
      .rt-res-item{border:1px solid var(--c-line);border-radius:4px;padding:16px 18px;background:rgba(255,253,248,.5);}
      .rt-res-item.crisis{border-color:var(--c-clay);background:rgba(181,89,63,.06);}
      .rt-res-tag{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.16em;text-transform:uppercase;padding:3px 8px;border-radius:12px;background:var(--c-ink);color:var(--c-paper);}
      .rt-res-tag.crisis{background:var(--c-clay);}
      .rt-res-name{font-family:'Fraunces',serif;font-size:17px;margin:9px 0 5px;}
      .rt-res-detail{font-size:14px;color:var(--c-ink-soft);}
      .rt-res-link{font-family:'IBM Plex Mono',monospace;font-size:12px;color:var(--c-accent);text-decoration:none;display:inline-block;margin-top:8px;}
      .rt-res-link:hover{text-decoration:underline;}
      .rt-region-toggle{display:inline-flex;border:1px solid var(--c-line);border-radius:4px;overflow:hidden;margin-bottom:18px;}
      .rt-region-btn{font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:.08em;padding:9px 16px;background:transparent;color:var(--c-ink-soft);border:none;cursor:pointer;transition:background .15s,color .15s;}
      .rt-region-btn.on{background:var(--c-ink);color:var(--c-paper);}
      .rt-warn{display:flex;gap:12px;align-items:flex-start;border:1px solid var(--c-ochre);border-radius:4px;background:rgba(192,138,45,.10);padding:13px 16px;margin-bottom:16px;font-size:13.5px;line-height:1.55;color:var(--c-ink);}
      .rt-warn-icon{flex:none;font-size:16px;line-height:1.3;}
      /* print */
      @media print {
        .rt-root{background:#fff !important;padding:0;}
        .rt-root::before{display:none;}
        .rt-no-print{display:none !important;}
        .rt-card{border-color:#bbb;background:#fff;}
        .rt-anim{animation:none;}
        .rt-divider{border-color:#ccc;}
        a[href]:after{content:" (" attr(href) ")";font-size:10px;color:#555;}
      }
    `}</style>
  );
}

function Progress({ current, total }) {
  return (
    <div className="rt-progress-wrap">
      <div className="rt-progress-meta"><span>Reflection in progress</span><span>{current} / {total}</span></div>
      <div className="rt-progress-track"><div className="rt-progress-fill" style={{ width: `${(current / total) * 100}%` }} /></div>
    </div>
  );
}

function TrajectoryChart({ stages, perDimByStage }) {
  const W = 680, H = 280, padL = 40, padR = 20, padT = 20, padB = 40;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const n = stages.length;
  const x = (i) => padL + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const y = (r) => padT + (1 - r) * innerH;
  return (
    <div className="rt-traj">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Risk trajectory over time">
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line x1={padL} x2={W - padR} y1={y(g)} y2={y(g)} stroke="var(--c-line)" strokeWidth="1" strokeDasharray={g === 0 || g === 1 ? "0" : "3 4"} />
            <text x={padL - 8} y={y(g) + 4} textAnchor="end" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="var(--c-ink-soft)">{Math.round(g * 100)}</text>
          </g>
        ))}
        {stages.map((s, i) => (
          <text key={s} x={x(i)} y={H - padB + 20} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="var(--c-ink-soft)">
            {STAGES.find((st) => st.id === s).short}
          </text>
        ))}
        {DIMENSIONS.map((d) => {
          const pts = stages.map((s, i) => {
            const r = perDimByStage[d.id]?.[s];
            return r == null ? null : [x(i), y(r)];
          });
          const segs = []; let cur = [];
          pts.forEach((p) => { if (p) cur.push(p); else { if (cur.length) segs.push(cur); cur = []; } });
          if (cur.length) segs.push(cur);
          return (
            <g key={d.id}>
              {segs.map((seg, si) => (
                <polyline key={si} fill="none" stroke={d.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={seg.map((p) => p.join(",")).join(" ")} opacity="0.9" />
              ))}
              {pts.filter(Boolean).map((p, pi) => (<circle key={pi} cx={p[0]} cy={p[1]} r="3.5" fill={d.color} />))}
            </g>
          );
        })}
      </svg>
      <div className="rt-traj-legend">
        {DIMENSIONS.map((d) => (
          <span className="rt-traj-leg-item" key={d.id}><span className="rt-traj-swatch" style={{ background: d.color }} />{d.name}</span>
        ))}
      </div>
    </div>
  );
}

function pct(r) { return r == null ? "—" : `${Math.round(r * 100)}`; }

function StageCompare({ stages, perDimByStage }) {
  const [a, setA] = useState(stages[0]);
  const [b, setB] = useState(stages[stages.length - 1]);
  const label = (id) => STAGES.find((s) => s.id === id).short;
  return (
    <div>
      <div className="rt-cmp-controls">
        <label>Earlier
          <select className="rt-select" value={a} onChange={(e) => setA(e.target.value)}>
            {stages.map((s) => <option key={s} value={s}>{label(s)}</option>)}
          </select>
        </label>
        <label>Later
          <select className="rt-select" value={b} onChange={(e) => setB(e.target.value)}>
            {stages.map((s) => <option key={s} value={s}>{label(s)}</option>)}
          </select>
        </label>
      </div>
      <div className="rt-cmp-grid">
        <div className="rt-cmp-head">Dimension</div>
        <div className="rt-cmp-head">{label(a)}</div>
        <div className="rt-cmp-head">{label(b)}</div>
        <div className="rt-cmp-head">Change</div>
        {DIMENSIONS.map((d) => {
          const va = perDimByStage[d.id]?.[a];
          const vb = perDimByStage[d.id]?.[b];
          const has = va != null && vb != null;
          const delta = has ? Math.round((vb - va) * 100) : null;
          const cls = delta == null ? "rt-flat" : delta > 4 ? "rt-up" : delta < -4 ? "rt-down" : "rt-flat";
          const arrow = delta == null ? "" : delta > 4 ? "▲ " : delta < -4 ? "▼ " : "→ ";
          return (
            <React.Fragment key={d.id}>
              <div className="rt-cmp-name" style={{ color: d.color }}>{d.name}</div>
              <div className="rt-cmp-val">{pct(va)}</div>
              <div className="rt-cmp-val">{pct(vb)}</div>
              <div className={`rt-cmp-delta ${cls}`}>{delta == null ? "n/a" : `${arrow}${delta > 0 ? "+" : ""}${delta}`}</div>
            </React.Fragment>
          );
        })}
      </div>
      <div className="rt-fine" style={{ marginTop: 18 }}>
        Values are 0–100 risk-indicator scores for each stage. A dash means that dimension
        wasn't asked about at that stage. "Change" is a plain subtraction between the two
        stages you picked — a reflection aid, not a measurement. The same recall caveat above
        applies: these numbers describe how things are <em>remembered now</em>.
      </div>
    </div>
  );
}

function detectRegion() {
  try {
    const locales = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""]);
    // US if any locale region is US (e.g. en-US), else international.
    const isUS = locales.some((l) => {
      const region = (l.split("-")[1] || "").toUpperCase();
      return region === "US";
    });
    // Fall back: timezone in the Americas/US set also nudges toward US.
    if (!isUS) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (/America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Indiana|Kentucky)/.test(tz)) return "us";
    }
    return isUS ? "us" : "intl";
  } catch {
    return "intl";
  }
}

function ResourceList() {
  const [region, setRegion] = useState(detectRegion);
  const list = region === "us" ? RESOURCES_US : RESOURCES_INTL;
  return (
    <div>
      <div className="rt-region-toggle rt-no-print">
        <button className={`rt-region-btn ${region === "us" ? "on" : ""}`} onClick={() => setRegion("us")}>United States</button>
        <button className={`rt-region-btn ${region === "intl" ? "on" : ""}`} onClick={() => setRegion("intl")}>International</button>
      </div>
      <div className="rt-res">
        {list.map((r) => (
          <div key={r.name} className={`rt-res-item ${r.kind === "crisis" ? "crisis" : ""}`}>
            <span className={`rt-res-tag ${r.kind === "crisis" ? "crisis" : ""}`}>{r.kind === "crisis" ? "If in crisis" : "Support"}</span>
            <div className="rt-res-name">{r.name}</div>
            <div className="rt-res-detail">{r.detail}</div>
            <a className="rt-res-link" href={r.url} target="_blank" rel="noreferrer">{r.url.replace("https://", "")} ↗</a>
          </div>
        ))}
      </div>
      {region === "intl" && (
        <div className="rt-fine" style={{ marginTop: 14 }}>
          Religious-trauma-specific services are still concentrated in English-speaking countries.
          If none fit your language or region, the directories above can route you to local
          emotional support, and a local therapist can be asked directly about experience with
          high-control groups or spiritual abuse.
        </div>
      )}
    </div>
  );
}

export default function ReligiousHarmReflectionTool() {
  const [phase, setPhase] = useState("intro");
  const [perspective, setPerspective] = useState(null);
  const [tenure, setTenure] = useState(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  const isConcerned = perspective === "concerned";

  const coveredStages = useMemo(() => {
    if (!tenure) return [];
    const ti = stageIdx(tenure);
    return STAGE_ORDER.filter((_, i) => i <= ti);
  }, [tenure]);

  const activeQuestions = useMemo(() => {
    if (!tenure) return [];
    const ti = stageIdx(tenure);
    return BANK
      .map((q, originalIndex) => ({ ...q, key: `${q.dim}-${q.stage}-${originalIndex}` }))
      .filter((q) => stageIdx(q.stage) <= ti)
      .sort((a, b) => stageIdx(a.stage) - stageIdx(b.stage));
  }, [tenure]);

  const current = activeQuestions[idx];

  const results = useMemo(() => {
    if (phase !== "results") return null;
    const dimAgg = {}; DIMENSIONS.forEach((d) => (dimAgg[d.id] = { sum: 0, count: 0 }));
    const perDimByStage = {}; DIMENSIONS.forEach((d) => (perDimByStage[d.id] = {}));
    const stageAcc = {}; DIMENSIONS.forEach((d) => { stageAcc[d.id] = {}; coveredStages.forEach((s) => (stageAcc[d.id][s] = { sum: 0, count: 0 })); });
    let tot = 0, totMax = 0;
    activeQuestions.forEach((q) => {
      const v = answers[q.key] ?? 0;
      dimAgg[q.dim].sum += v; dimAgg[q.dim].count += 1; tot += v; totMax += 4;
      if (stageAcc[q.dim][q.stage]) { stageAcc[q.dim][q.stage].sum += v; stageAcc[q.dim][q.stage].count += 1; }
    });
    DIMENSIONS.forEach((d) => { coveredStages.forEach((s) => { const a = stageAcc[d.id][s]; perDimByStage[d.id][s] = a && a.count ? a.sum / (a.count * 4) : null; }); });
    const dims = DIMENSIONS.map((d) => ({ ...d, ratio: dimAgg[d.id].count ? dimAgg[d.id].sum / (dimAgg[d.id].count * 4) : 0, count: dimAgg[d.id].count })).filter((d) => d.count > 0);
    const overall = totMax ? tot / totMax : 0;
    const flagged = dims.filter((d) => d.ratio >= 0.5).sort((a, b) => b.ratio - a.ratio);
    const escalating = dims.map((d) => {
      const vals = coveredStages.map((s) => perDimByStage[d.id][s]).filter((x) => x != null);
      if (vals.length < 2) return null;
      const delta = vals[vals.length - 1] - vals[0];
      return delta >= 0.25 ? { ...d, delta } : null;
    }).filter(Boolean).sort((a, b) => b.delta - a.delta);
    return { overall, tier: tierFor(overall), dims, flagged, perDimByStage, escalating };
  }, [phase, activeQuestions, answers, coveredStages]);

  function answer(v) { setAnswers((a) => ({ ...a, [current.key]: v })); }
  function next() { if (idx < activeQuestions.length - 1) setIdx(idx + 1); else setPhase("results"); }
  function back() { if (idx > 0) setIdx(idx - 1); }
  function restart() { setPhase("intro"); setPerspective(null); setTenure(null); setIdx(0); setAnswers({}); }

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [phase, idx]);

  const qText = current ? (isConcerned ? current.c : current.m) : "";

  return (
    <div className="rt-root">
      <Stylesheet />
      <div className="rt-shell">

        {phase === "intro" && (
          <div className="rt-anim">
            <div className="rt-eyebrow">A Reflective Awareness Tool</div>
            <h1 className="rt-h1">How is this faith community <em>shaping you</em> over time?</h1>
            <p className="rt-lede">A private, research-informed reflection on an experience inside a religious or spiritual group — traced across a first service, a week, a month, a year, and beyond. It shows how risk patterns <em>shift over time</em>, because control rarely arrives all at once.</p>
            <div className="rt-note"><strong>Please read first.</strong> This is not a diagnosis and not a verdict on any organization. It can't replace a therapist, doctor, or your own judgment. It reflects known <em>risk indicators</em> back to you and points toward support. Nothing you enter leaves your device.</div>
            <div style={{ marginTop: 28 }}><button className="rt-btn" onClick={() => setPhase("perspective")}>Begin reflection →</button></div>
            <p className="rt-footer" style={{ textAlign: "left", marginTop: 34 }}>Frameworks: Hassan's BITE model (Behavior, Information, Thought, Emotional control), Lifton's criteria of thought reform, Lalich's bounded-choice research, and the clinical literature on religious trauma (Winell).</p>
          </div>
        )}

        {phase === "perspective" && (
          <div className="rt-anim">
            <div className="rt-eyebrow">Step 1 of 2 · Who is reflecting</div>
            <h1 className="rt-h1" style={{ fontSize: "clamp(24px,5vw,38px)" }}>Whose experience is this?</h1>
            <p className="rt-lede">The questions are re-voiced to fit your vantage point.</p>
            <div className="rt-opt-grid">
              {PERSPECTIVES.map((p, i) => (
                <button key={p.id} className={`rt-opt ${perspective === p.id ? "sel" : ""}`} onClick={() => { setPerspective(p.id); setPhase("tenure"); }}>
                  <span className="rt-opt-num">0{i + 1}</span><span className="rt-opt-label">{p.label}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 26 }}><button className="rt-btn rt-btn-ghost" onClick={() => setPhase("intro")}>← Back</button></div>
          </div>
        )}

        {phase === "tenure" && (
          <div className="rt-anim">
            <div className="rt-eyebrow">Step 2 of 2 · How long</div>
            <h1 className="rt-h1" style={{ fontSize: "clamp(24px,5vw,38px)" }}>{isConcerned ? "How long have they been involved?" : "How long have you been involved?"}</h1>
            <p className="rt-lede">You'll reflect on <em>every stage up to this point</em>, so the result can show how things changed along the way.</p>
            <div className="rt-opt-grid">
              {STAGES.map((t, i) => (
                <button key={t.id} className="rt-opt" onClick={() => { setTenure(t.id); setIdx(0); setAnswers({}); setPhase("survey"); }}>
                  <span className="rt-opt-num">0{i + 1}</span>
                  <span><div className="rt-opt-label">{t.label}</div><div className="rt-opt-blurb">{t.blurb}</div></span>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 26 }}><button className="rt-btn rt-btn-ghost" onClick={() => setPhase("perspective")}>← Back</button></div>
          </div>
        )}

        {phase === "survey" && current && (
          <div className="rt-card rt-anim" key={current.key}>
            <Progress current={idx + 1} total={activeQuestions.length} />
            <span className="rt-stage-chip">Stage: {STAGES.find((s) => s.id === current.stage).short}</span>
            <div className="rt-q-frame"><b>{DIM(current.dim).name}</b>{"  ·  "}{DIM(current.dim).framework}</div>
            <div className="rt-q-text">{qText}</div>
            <div className="rt-scale">
              {SCALE.map((s) => (
                <div key={s.v} className={`rt-scale-opt ${answers[current.key] === s.v ? "sel" : ""}`} onClick={() => answer(s.v)}>
                  <span className="rt-dot" /><span>{s.label}</span>
                </div>
              ))}
            </div>
            <div className="rt-nav">
              <button className="rt-btn rt-btn-ghost" onClick={back} disabled={idx === 0}>← Previous</button>
              <button className="rt-btn" onClick={next} disabled={answers[current.key] === undefined}>{idx === activeQuestions.length - 1 ? "See reflection →" : "Next →"}</button>
            </div>
          </div>
        )}

        {phase === "results" && results && (
          <div className="rt-anim">
            <div className="rt-eyebrow">The reflection</div>
            <div className="rt-card">
              <div className="rt-result-tier" style={{ color: results.tier.id === "supportive" ? "var(--c-sage)" : results.tier.id === "watch" ? "var(--c-ochre)" : "var(--c-clay)" }}>{results.tier.name}</div>
              <div className="rt-result-headline">{results.tier.headline}</div>
              <p className="rt-result-body">{results.tier.body}</p>
              <div className="rt-meter">
                <div className="rt-meter-track"><div className="rt-meter-needle" style={{ left: `calc(${results.overall * 100}% - 1.5px)` }} /></div>
                <div className="rt-meter-labels"><span>Supportive</span><span>Watch</span><span>Caution</span><span>Elevated</span></div>
              </div>
            </div>

            {coveredStages.length > 1 && (
              <>
                <hr className="rt-divider" />
                <h2 className="rt-h2">How the patterns shifted over time</h2>
                <p className="rt-sub">Each line is one dimension, tracked across the stages reflected on. Lines that climb left-to-right are the ones to watch — escalation is the signature of high-control dynamics.</p>
                <TrajectoryChart stages={coveredStages} perDimByStage={results.perDimByStage} />
                {results.escalating.length > 0 && (
                  <div className="rt-note" style={{ marginTop: 24 }}><strong>Rising over time:</strong> {results.escalating.map((d) => d.name).join(", ")}. A clear upward climb in these areas is worth taking seriously, even if any single stage felt manageable.</div>
                )}
                <div className="rt-fine">
                  <strong>How this is calculated, and its limits.</strong> A dimension is marked
                  as "rising" when its score at the most recent stage is at least 25 points
                  higher (on the 0–100 scale) than at the earliest stage reflected on. This is a
                  simple comparison of two points, not a clinical measurement or a prediction.
                  It depends entirely on how accurately the earlier stages are recalled — and
                  memory tends to reshape the past in light of how things feel now. Present
                  distress can make early days seem worse (or, sometimes, better) than they
                  actually were. Read any trend as a prompt for reflection and conversation, not
                  as proof of what happened or what will happen.
                </div>
              </>
            )}

            {coveredStages.length > 1 && (
              <>
                <hr className="rt-divider" />
                <h2 className="rt-h2">Compare two points in time</h2>
                <p className="rt-sub">Pick any earlier and later stage to see how each dimension changed between them.</p>
                <StageCompare stages={coveredStages} perDimByStage={results.perDimByStage} />
              </>
            )}

            <hr className="rt-divider" />
            <h2 className="rt-h2">Where the patterns concentrate</h2>
            <p className="rt-sub">How strongly the responses leaned toward known risk indicators in each area, overall.</p>
            {results.dims.map((d) => (
              <div className="rt-dim-row" key={d.id}>
                <div className="rt-dim-head"><span className="rt-dim-name">{d.name}</span><span className="rt-dim-fw">{d.framework}</span></div>
                <div className="rt-dim-track"><div className="rt-dim-fill" style={{ width: `${Math.max(d.ratio * 100, 3)}%`, background: d.color }} /></div>
                <div className="rt-dim-desc">{d.desc}</div>
              </div>
            ))}

            {results.flagged.length > 0 && (
              <>
                <hr className="rt-divider" />
                <h2 className="rt-h2">Worth paying attention to</h2>
                <ul className="rt-list">{results.flagged.map((d) => (<li key={d.id}><span className="rt-mark">→</span><span><strong>{d.name}.</strong> {d.desc}</span></li>))}</ul>
              </>
            )}

            <hr className="rt-divider" />
            <h2 className="rt-h2">Gentle next steps</h2>
            <ul className="rt-list">
              <li><span className="rt-mark">01</span><span>Talk with someone <strong>outside</strong> the group who is trusted — a friend, family member, or counselor.</span></li>
              <li><span className="rt-mark">02</span><span>Notice whether honest questions are <strong>welcomed or punished</strong>. Healthy communities can tolerate doubt.</span></li>
              <li><span className="rt-mark">03</span><span>For fear, guilt, or distress that won't ease, a therapist familiar with <strong>religious trauma</strong> can help.</span></li>
              <li><span className="rt-mark">04</span><span>{isConcerned ? "Stay connected and non-judgmental — pressure can push someone deeper. Keep the door open." : "If you ever feel unsafe, reach out to a local crisis line or someone you trust right away."}</span></li>
            </ul>

            <div className="rt-note" style={{ marginTop: 30 }}><strong>A reminder:</strong> a score is a mirror, not a judge. {isConcerned ? "You're seeing this from the outside, which has both blind spots and clear sight." : "You know your own experience better than any tool does."} If this raised hard feelings, be gentle and consider talking to someone you trust.</div>

            <hr className="rt-divider" />
            <h2 className="rt-h2">Where to find real support</h2>
            <p className="rt-sub">Independent organizations — not affiliated with this tool. Switch between US and international below. Verified current as of May 2026; details can change, so confirm on each site.</p>
            <ResourceList />

            <div className="rt-warn rt-no-print" style={{ marginTop: 26 }}>
              <span className="rt-warn-icon">⚠</span>
              <span>A printout or saved PDF is a physical record. If you're worried about it being found by people in the group, save it somewhere private (or to a personal device only), use a neutral filename, and consider deleting it once you no longer need it.</span>
            </div>
            <div className="rt-no-print" style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="rt-btn" onClick={() => window.print()}>Print / save as PDF</button>
              <button className="rt-btn rt-btn-ghost" onClick={() => setPhase("tenure")}>Change the time period</button>
              <button className="rt-btn rt-btn-ghost" onClick={restart}>Start over</button>
            </div>
            <p className="rt-footer">This tool does not store, transmit, or share answers. It is for personal reflection only and is not medical, psychological, or legal advice.</p>
          </div>
        )}
      </div>
    </div>
  );
}
