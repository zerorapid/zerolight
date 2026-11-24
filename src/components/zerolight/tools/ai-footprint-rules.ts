/**
 * ZeroAuditor Deterministic Scanner Engine
 * Audits HTML/TSX markup or live DOM containers against 30+ Anti-AI-Slop footprints,
 * WCAG contrast, Title Case & grammar checks, truncation safety, and ZeroLight token discipline.
 */

export type AuditSeverity = "Blocker" | "Major" | "Minor";

export type AuditCategory =
  | "Colors & Surfaces"
  | "Icons & Media"
  | "Layout & Structure"
  | "Copy & Typography"
  | "Accessibility & Tokens";

export interface AuditFinding {
  id: string;
  ruleNumber: number;
  category: AuditCategory;
  title: string;
  severity: AuditSeverity;
  nielsenHeuristic: string;
  whatISee: string;
  zerolightFix: string;
}

export interface AuditReport {
  score: number;
  grade: "A+" | "A" | "B" | "C" | "D";
  findings: AuditFinding[];
  summary: {
    blockers: number;
    majors: number;
    minors: number;
    rulesEvaluated: number;
  };
}

interface AuditRuleDefinition {
  ruleNumber: number;
  category: AuditCategory;
  title: string;
  severity: AuditSeverity;
  nielsenHeuristic: string;
  whatISee: string;
  zerolightFix: string;
  test: (input: string) => boolean;
}

const MINOR_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "if", "in", "nor", "of", "on", "or", "so", "the", "to", "via", "with",
]);

const TYPOS: { typo: string; correct: string }[] = [
  { typo: "teh", correct: "the" },
  { typo: "recieve", correct: "receive" },
  { typo: "seperate", correct: "separate" },
  { typo: "definately", correct: "definitely" },
  { typo: "occured", correct: "occurred" },
  { typo: "untill", correct: "until" },
  { typo: "calender", correct: "calendar" },
  { typo: "accomodate", correct: "accommodate" },
  { typo: "maintainance", correct: "maintenance" },
  { typo: "tommorrow", correct: "tomorrow" },
];

export const AI_FOOTPRINT_RULES: AuditRuleDefinition[] = [
  // 1. Colors & Surfaces
  {
    ruleNumber: 1,
    category: "Colors & Surfaces",
    title: "AI Purple-to-Cyan Neon Gradient",
    severity: "Major",
    nielsenHeuristic: "Consistency & Standards / Visual Hierarchy",
    whatISee: "Generic indigo/purple/cyan gradients create cliché AI visual noise.",
    zerolightFix: "Bind primary actions to solid `tokens.primaryButtonColor` and hairline `tokens.universalBorderColor`.",
    test: (s) =>
      /(from-indigo|to-cyan|from-purple|via-purple|#6366f1|#a855f7|#06b6d4)/i.test(s) ||
      /linear-gradient\([^)]*(indigo|purple|cyan|#6366|#a855)/i.test(s),
  },
  {
    ruleNumber: 2,
    category: "Colors & Surfaces",
    title: "Pitch-Black Low-Contrast Dark Mode",
    severity: "Major",
    nielsenHeuristic: "Aesthetic & Minimalist Design / WCAG AA",
    whatISee: "Raw black (`#000000` / `bg-black`) paired with muted gray copy causes optical halation and contrast failures.",
    zerolightFix: "Switch to ZeroLight dark polarity (`#09090B` / `#0E0E10`) with YIQ-verified `getContrastColor()` text.",
    test: (s) => /(#000000\b|bg-black\b|#09090b|#0f172a)/.test(s) && /(text-zinc-500|text-slate-500|text-gray-500|text-muted)/.test(s),
  },
  {
    ruleNumber: 3,
    category: "Colors & Surfaces",
    title: "Ambient Glowing Mesh Blur Blobs",
    severity: "Minor",
    nielsenHeuristic: "Aesthetic & Minimalist Design / Visual Noise",
    whatISee: "Floating radial blur orbs behind hero copy add visual noise without aiding comprehension.",
    zerolightFix: "Remove radial blur spotlights and rely on crisp spacing and `elevation` luminance stepping.",
    test: (s) => /blur-(\[100px\]|\[120px\]|2xl|3xl)/.test(s) || /radial-gradient\([^)]*(ellipse|circle|rgba\(1[0-9]{2})/i.test(s),
  },
  {
    ruleNumber: 4,
    category: "Colors & Surfaces",
    title: "Glassmorphism Panels Reducing Readability",
    severity: "Minor",
    nielsenHeuristic: "Visibility of System Status",
    whatISee: "Overuse of frosted `backdrop-blur` translucent cards lowers foreground legibility over busy backgrounds.",
    zerolightFix: "Use opaque `tokens.universalFillColor` cards separated by `1px` `tokens.universalBorderColor` hairlines.",
    test: (s) => (s.match(/backdrop-blur|backdrop-filter/g) || []).length >= 2,
  },
  {
    ruleNumber: 5,
    category: "Colors & Surfaces",
    title: "Animated Meteor / Perimeter Beam Borders",
    severity: "Minor",
    nielsenHeuristic: "Vestibular Comfort & Focus",
    whatISee: "Looping light streaks tracing card perimeters pull attention away from primary operational tasks.",
    zerolightFix: "Replace looping beam animations with calm static hairline focus/hover borders.",
    test: (s) => /(border-beam|meteor|animate-border)/i.test(s),
  },
  {
    ruleNumber: 6,
    category: "Colors & Surfaces",
    title: "Artificial Graph-Paper / Dot-Matrix Canvas",
    severity: "Minor",
    nielsenHeuristic: "Aesthetic & Minimalist Design",
    whatISee: "Faint decorative grid or dot-matrix hero overlays clutter neutral reading surfaces.",
    zerolightFix: "Use clean neutral `#F8F9FA` / `#FFFFFF` backgrounds reserved for actual chart grids.",
    test: (s) => /(bg-grid|bg-dot|dot-matrix)/.test(s) || /radial-gradient\(circle,.*1px/i.test(s),
  },
  {
    ruleNumber: 7,
    category: "Colors & Surfaces",
    title: "Hardcoded Inline Hex Colors Bypassing Tokens",
    severity: "Minor",
    nielsenHeuristic: "System Maintainability",
    whatISee: "Inline `style` props contain static `#RRGGBB` literals instead of ZeroLight tokens.",
    zerolightFix: "Read colors from `useZeroLight().tokens` (`universalFillColor`, `primaryButtonColor`, `textIconColor`).",
    test: (s) => /style=.*#[0-9a-fA-F]{6}/.test(s) && !s.includes("tokens."),
  },

  // 2. Icons & Media
  {
    ruleNumber: 8,
    category: "Icons & Media",
    title: "Mystery-Meat Sparkle (✨) Button Slop",
    severity: "Major",
    nielsenHeuristic: "Consistency & Standards / Jakob's Law",
    whatISee: "Unlabeled sparkle emojis or overuse of `lucide-sparkles` force users to guess button intent.",
    zerolightFix: "Replace vague sparkle icons with clear imperative verb labels (e.g., `Export CSV`, `Run Audit`).",
    test: (s) => (s.match(/✨/g) || []).length >= 2 || (s.match(/lucide-sparkles/g) || []).length >= 2,
  },
  {
    ruleNumber: 9,
    category: "Icons & Media",
    title: "Generic 3D Iridescent Spheres / Spline Orbs",
    severity: "Minor",
    nielsenHeuristic: "Match Between System & Real World",
    whatISee: "Abstract glossy 3D shapes add page weight with zero explanation of the SaaS domain.",
    zerolightFix: "Showcase crisp `ProductWindow` or `HeroShowcase` UI framing showing a real 3–5 beat interaction.",
    test: (s) => /(spline|three\.js|3d-sphere|iridescent|glass-orb)/i.test(s),
  },
  {
    ruleNumber: 10,
    category: "Icons & Media",
    title: "Synthetic AI Stock Avatar Footprints",
    severity: "Major",
    nielsenHeuristic: "User Trust & Credibility",
    whatISee: "Placeholder URLs (`thispersondoesnotexist`, `midjourney`) detected in testimonial or user blocks.",
    zerolightFix: "Use ZeroLight `<Avatar>` initials fallbacks or verified team assets.",
    test: (s) => /thispersondoesnotexist|avatar.*(midjourney|generated)/i.test(s),
  },
  {
    ruleNumber: 11,
    category: "Icons & Media",
    title: "Monochrome Big-Tech Trust Logo Wall",
    severity: "Minor",
    nielsenHeuristic: "Authentic Social Proof",
    whatISee: "Generic 'Powered by / Trusted by' strips displaying unrelated mega-cap logos undermine enterprise credibility.",
    zerolightFix: "Replace decorative trust walls with verified metrics or actual customer deployment proof.",
    test: (s) =>
      /(logo-cloud|trusted by|powered by)/i.test(s) &&
      /(openai|anthropic|vercel)/i.test(s),
  },
  {
    ruleNumber: 12,
    category: "Icons & Media",
    title: "Decorative Emoji Spam Inside Navigation & Headers",
    severity: "Minor",
    nielsenHeuristic: "Tactile Calm Restraint",
    whatISee: "Rocket/fire/sparkles emojis inside headings or sidebar items look uncrafted in enterprise SaaS.",
    zerolightFix: "Use uniform Lucide icons calibrated through `<DynamicIcon>` and `tokens.iconStrokeWidth`.",
    test: (s) => /[\u{1F680}\u{2728}\u{1F525}\u{1F4A1}\u{1F389}]/u.test(s),
  },

  // 3. Layout & Structure
  {
    ruleNumber: 13,
    category: "Layout & Structure",
    title: "Overloaded Bento Grid Without Single Focus",
    severity: "Minor",
    nielsenHeuristic: "Visual Hierarchy & Hick's Law",
    whatISee: "4+ competing `rounded-2xl` bento panels crowd working memory without a single visual anchor.",
    zerolightFix: "Apply ZeroLight's 3-Zone Law and `BentoShowcase` discipline (single window chrome frame + contrasting stat/control tiles).",
    test: (s) => (/bento/i.test(s) || s.includes("col-span-2")) && (s.match(/rounded-2xl/g) || []).length >= 4,
  },
  {
    ruleNumber: 14,
    category: "Layout & Structure",
    title: "Blank-Page Hero Prompt Box Paralysis",
    severity: "Major",
    nielsenHeuristic: "Recognition Rather Than Recall",
    whatISee: "Centering an empty 'Ask anything...' input box above the fold forces users to guess product capabilities.",
    zerolightFix: "Provide concrete navigation, preset workflows, or deterministic Gen-UI actions instead of blank prompts.",
    test: (s) => /<input[^>]+placeholder=["'][^"']*(ask anything|type a prompt|generate anything)[^"']*["']/i.test(s),
  },
  {
    ruleNumber: 15,
    category: "Layout & Structure",
    title: "Suggested Prompt Pill Cluster Anti-Pattern",
    severity: "Minor",
    nielsenHeuristic: "Flexibility & Efficiency",
    whatISee: "Clustered chat suggestion pills mask missing dedicated SaaS controls.",
    zerolightFix: "Replace vague prompt chips with explicit buttons and structured `FilterBuilder` / `CommandPalette` actions.",
    test: (s) => /summarize/i.test(s) && /draft/i.test(s) && /explain/i.test(s),
  },
  {
    ruleNumber: 16,
    category: "Layout & Structure",
    title: "Floating Persistent Bottom-Right Chat Orb",
    severity: "Minor",
    nielsenHeuristic: "Screen Real Estate Hygiene",
    whatISee: "Fixed bottom-right floating chat bubble obscures mobile buttons and table pagination controls.",
    zerolightFix: "Host AI copilots cleanly inside a collapsible `DetailDrawer` or dedicated navigation route.",
    test: (s) => /fixed\s+bottom-/.test(s) && /(chat|intercom|crisp)/i.test(s),
  },
  {
    ruleNumber: 17,
    category: "Layout & Structure",
    title: "Formulaic 3-Card Glowing Pricing Table",
    severity: "Minor",
    nielsenHeuristic: "Consistency & Standards",
    whatISee: "Starter / Pro / Enterprise grid with glowing middle 'Most Popular' halo distracts from real plan differences.",
    zerolightFix: "Use ZeroLight `<BillingPortal>` with clean border tokens and structured capability rows.",
    test: (s) =>
      /(starter|basic)/i.test(s) &&
      /\bpro\b/i.test(s) &&
      /(enterprise|custom)/i.test(s) &&
      /(most popular|best value)/i.test(s),
  },
  {
    ruleNumber: 18,
    category: "Layout & Structure",
    title: "Infinite Auto-Scrolling Testimonial Marquee",
    severity: "Minor",
    nielsenHeuristic: "User Control & Vestibular Comfort",
    whatISee: "Unpausable continuous marquee loops trigger motion discomfort and prevent reading.",
    zerolightFix: "Use crisp static 3-column grids or user-controlled pagination.",
    test: (s) => /(animate-marquee|marquee|infinite-scroll)/i.test(s),
  },
  {
    ruleNumber: 19,
    category: "Layout & Structure",
    title: "Uniform Pill-Shaped Everything (`rounded-full` Overuse)",
    severity: "Minor",
    nielsenHeuristic: "Geometry Hierarchy",
    whatISee: "Applying `rounded-full` across cards, inputs, and buttons blurs interactive boundaries.",
    zerolightFix: "Bind radii to `scaled.scaledCardRadius` (`12px–16px`) and `scaled.scaledRadius` (`6px–10px`).",
    test: (s) => (s.match(/rounded-full/g) || []).length >= 8,
  },
  {
    ruleNumber: 20,
    category: "Layout & Structure",
    title: "Shimmer Sweep & Neon Shadow CTA Slop",
    severity: "Minor",
    nielsenHeuristic: "Tactile Calm Restraint",
    whatISee: "Continuous diagonal glossy sweeps or colored glow shadows compete with screen hierarchy.",
    zerolightFix: "Use ZeroLight `<Button variant=\"primary\" />` with calibrated `motionConfig.spring` press physics.",
    test: (s) => /(animate-shimmer|shimmer-button|shadow-\[0_0_)/i.test(s),
  },

  // 4. Copy & Typography
  {
    ruleNumber: 21,
    category: "Copy & Typography",
    title: "Typewriter Character-Streaming Headline",
    severity: "Minor",
    nielsenHeuristic: "Reading Speed & Control",
    whatISee: "Typewriter animations stall comprehension while characters draw slowly across the hero.",
    zerolightFix: "Render static headlines immediately so users scan in <200ms.",
    test: (s) => /(typewriter|typewrite|cursor-blink)/i.test(s),
  },
  {
    ruleNumber: 22,
    category: "Copy & Typography",
    title: "Gradient Text Clip Highlights (`bg-clip-text`)",
    severity: "Minor",
    nielsenHeuristic: "Scannability & Typography",
    whatISee: "Multi-color `bg-clip-text` gradient words break monochrome editorial clarity.",
    zerolightFix: "Emphasize key words with font weight (`font-bold`) or clean contrast tokens.",
    test: (s) => s.includes("bg-clip-text") && /(from-|gradient)/.test(s),
  },
  {
    ruleNumber: 23,
    category: "Copy & Typography",
    title: "Uppercase Eyebrow Buzz Pill (`INTRODUCING V2.0`)",
    severity: "Minor",
    nielsenHeuristic: "Aesthetic & Minimalist Design",
    whatISee: "Tiny uppercase eyebrow pills floating above headings add generic launch-template clutter.",
    zerolightFix: "Fold release status cleanly into breadcrumbs or quiet metadata lines.",
    test: (s) => /class(Name)?=["'][^"']*(uppercase|tracking-widest)[^"']*["'][^>]*>\s*(introducing|powered by|new release)/i.test(s),
  },
  {
    ruleNumber: 24,
    category: "Copy & Typography",
    title: "Cliché LLM SaaS Marketing Buzzwords",
    severity: "Major",
    nielsenHeuristic: "Plain Operational Language",
    whatISee: "Detected formulaic AI hype phrases ('Supercharge your workflow', 'Unlock actionable insights', 'Elevate your productivity').",
    zerolightFix: "Write concrete operational SaaS nouns & metrics (e.g. 'Monthly Recurring Revenue', 'GST Filing Status').",
    test: (s) =>
      /(unlock actionable insights|supercharge your workflow|elevate your productivity|unleash next-gen|a testament to|delve into|revolutionize your|game-changing platform)/i.test(
        s
      ),
  },
  {
    ruleNumber: 25,
    category: "Copy & Typography",
    title: "Em-Dash (—) Bold-Lead AI Bullet Wall",
    severity: "Major",
    nielsenHeuristic: "Scannability",
    whatISee: "Repeated `**Bold Label:** ... — ...` formulaic AI prose makes UI documentation exhausting to read.",
    zerolightFix: "Use terse 1-line UI labels backed by progressive disclosure drawers.",
    test: (s) => (s.match(/—/g) || []).length >= 4 || (s.match(/\*\*([^*]+)\*\*:/g) || []).length >= 3,
  },
  {
    ruleNumber: 26,
    category: "Copy & Typography",
    title: "Fake Placeholder Identities (`John Doe` / `Acme Corp`)",
    severity: "Major",
    nielsenHeuristic: "Real-World Domain Realism",
    whatISee: "Detected stale demo copy ('John Doe', 'Jane Doe', 'Acme Corp', 'foo@example.com').",
    zerolightFix: "Populate samples with authentic B2B tenant names, INR/USD currency, and real telemetry.",
    test: (s) => /\b(john doe|jane doe|acme corp|acme corporation|foo@example\.com)\b/i.test(s),
  },
  {
    ruleNumber: 27,
    category: "Copy & Typography",
    title: "Unrendered Raw Markdown Syntax (`**bold**` / Backticks)",
    severity: "Blocker",
    nielsenHeuristic: "Error Prevention & Production Polish",
    whatISee: "Raw Markdown tokens (`**text**`, fenced code blocks) leaked straight into rendered page HTML.",
    zerolightFix: "Render structured outputs safely through `<ZeroLightGenUIRenderer />` and typed UI components.",
    test: (s) => /\*\*[a-zA-Z0-9\s]{3,32}\*\*/.test(s) || /```[a-z]*\n/.test(s),
  },
  {
    ruleNumber: 28,
    category: "Copy & Typography",
    title: "Raw LLM Clipboard Attributes (`data-start` / ZWSP)",
    severity: "Blocker",
    nielsenHeuristic: "Error Prevention",
    whatISee: "Invisible zero-width spaces or pasted chat attributes (`data-start=`, `data-message-author-role`) found in DOM.",
    zerolightFix: "Strip clipboard HTML metadata before persisting UI copy.",
    test: (s) =>
      s.includes("data-start=") ||
      s.includes("data-message-author-role") ||
      s.includes("\u200B") ||
      s.includes("\uFEFF"),
  },

  // 5. Accessibility & ZeroLight Token Discipline
  {
    ruleNumber: 29,
    category: "Accessibility & Tokens",
    title: "Monospace Class (`font-mono`) on KPIs or Buttons",
    severity: "Minor",
    nielsenHeuristic: "Visual Alignment & ZeroLight Invariant",
    whatISee: "Using `font-mono` breaks numeric kerning rhythm compared to ZeroLight's `font-sans tabular-nums` standard.",
    zerolightFix: "Replace `font-mono` with `font-sans tabular-nums` across currencies, counts, and timestamps.",
    test: (s) => /\bfont-mono\b/.test(s),
  },
  {
    ruleNumber: 30,
    category: "Accessibility & Tokens",
    title: "Image Element Missing Alt Text",
    severity: "Blocker",
    nielsenHeuristic: "WCAG 2.1 AA Screen Reader Access",
    whatISee: "Found an `<img>` element without an `alt` attribute.",
    zerolightFix: "Add meaningful `alt=\"...\"` descriptions (or `alt=\"\"` for decorative images).",
    test: (s) => /<img\b(?![^>]*\balt=)[^>]*>/i.test(s),
  },
];

function stripHtmlTags(raw: string): string {
  return raw.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function findHeadingCasingIssues(raw: string): string[] {
  const issues: string[] = [];
  const headingMatches = raw.match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/gi) || [];
  for (const tag of headingMatches) {
    const text = tag.replace(/<[^>]+>/g, "").trim();
    const words = text.split(/\s+/);
    const bad = words.filter((w, idx) => {
      const clean = w.replace(/[^a-zA-Z]/g, "");
      if (clean.length < 2) return false;
      const lower = clean.toLowerCase();
      return (idx === 0 && /^[a-z]/.test(clean)) || (idx > 0 && !MINOR_WORDS.has(lower) && /^[a-z]/.test(clean));
    });
    if (bad.length > 0 && text.length < 90) {
      issues.push(text);
    }
  }
  return issues;
}

export function runZeroAuditorScan(sourceInput: string): AuditReport {
  const input = (sourceInput || "").trim();
  const findings: AuditFinding[] = [];

  for (const rule of AI_FOOTPRINT_RULES) {
    if (rule.test(input)) {
      findings.push({
        id: `zl-audit-${rule.ruleNumber}`,
        ruleNumber: rule.ruleNumber,
        category: rule.category,
        title: rule.title,
        severity: rule.severity,
        nielsenHeuristic: rule.nielsenHeuristic,
        whatISee: rule.whatISee,
        zerolightFix: rule.zerolightFix,
      });
    }
  }

  // Rule 31: Truncated containers missing title tooltip
  const truncMatches = input.match(/class(Name)?=["'][^"']*\btruncate\b[^"']*["'][^>]*>/g) || [];
  const missingTitleCount = truncMatches.filter((tag) => !/\btitle=/.test(tag)).length;
  if (missingTitleCount > 0) {
    findings.push({
      id: "zl-audit-31",
      ruleNumber: 31,
      category: "Accessibility & Tokens",
      title: `Truncated Text Missing Tooltip / title (${missingTitleCount})`,
      severity: "Major",
      nielsenHeuristic: "Visibility of Truncated Labels",
      whatISee: `Detected ${missingTitleCount} truncated element(s) without a native \`title="..."\` attribute.`,
      zerolightFix: "Add `title={fullText}` or `<Tooltip>` on every truncated element.",
    });
  }

  // Rule 32: Heading Title Case inconsistency
  const casingIssues = findHeadingCasingIssues(input);
  if (casingIssues.length > 0) {
    findings.push({
      id: "zl-audit-32",
      ruleNumber: 32,
      category: "Copy & Typography",
      title: `Headline Missing Title Case (${casingIssues.length})`,
      severity: "Minor",
      nielsenHeuristic: "Consistency & Standards",
      whatISee: `Found lowercase major words inside heading: "${casingIssues[0]}".`,
      zerolightFix: "Apply consistent Title Case formatting to primary section and hero headings.",
    });
  }

  // Rule 33: Repeated stutter words & spelling typos
  const plainText = stripHtmlTags(input);
  const stutterMatch = plainText.match(/\b(the|and|in|to|is|of|for|with|on|at|this|that)\s+\1\b/i);
  const matchedTypo = TYPOS.find((t) => new RegExp(`\\b${t.typo}\\b`, "i").test(plainText));
  if (stutterMatch || matchedTypo) {
    findings.push({
      id: "zl-audit-33",
      ruleNumber: 33,
      category: "Copy & Typography",
      title: matchedTypo ? `Spelling Typo ("${matchedTypo.typo}")` : `Repeated Word ("${stutterMatch?.[0]}")`,
      severity: "Minor",
      nielsenHeuristic: "Error Prevention",
      whatISee: matchedTypo
        ? `Detected misspelling "${matchedTypo.typo}" in rendered text.`
        : `Detected duplicate stutter phrase "${stutterMatch?.[0]}" in rendered text.`,
      zerolightFix: matchedTypo
        ? `Correct spelling to "${matchedTypo.correct}".`
        : `Remove duplicate word to keep single "${stutterMatch?.[1]}".`,
    });
  }

  let penalty = 0;
  let blockers = 0;
  let majors = 0;
  let minors = 0;

  for (const f of findings) {
    if (f.severity === "Blocker") {
      blockers += 1;
      penalty += 20;
    } else if (f.severity === "Major") {
      majors += 1;
      penalty += 11;
    } else {
      minors += 1;
      penalty += 4;
    }
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));
  const grade: AuditReport["grade"] =
    score >= 95 ? "A+" : score >= 85 ? "A" : score >= 70 ? "B" : score >= 50 ? "C" : "D";

  return {
    score,
    grade,
    findings,
    summary: {
      blockers,
      majors,
      minors,
      rulesEvaluated: AI_FOOTPRINT_RULES.length + 3,
    },
  };
}

export function formatAuditMarkdown(report: AuditReport, targetLabel: string): string {
  const lines = [
    `# ZeroAuditor UI & AI-Slop Report — ${targetLabel}`,
    `Score: **${report.score}/100 (Grade ${report.grade})** | Blockers: ${report.summary.blockers} | Major: ${report.summary.majors} | Minor: ${report.summary.minors}`,
    "",
  ];
  if (report.findings.length === 0) {
    lines.push("Zero AI-slop footprints or accessibility violations detected across evaluated rules.");
  } else {
    for (const f of report.findings) {
      lines.push(`- **[${f.severity}] #${f.ruleNumber} ${f.title}** (${f.category} · ${f.nielsenHeuristic})`);
      lines.push(`  - Finding: ${f.whatISee}`);
      lines.push(`  - ZeroLight Fix: ${f.zerolightFix}`);
    }
  }
  return lines.join("\n");
}

export function formatAuditTSV(report: AuditReport): string {
  const header = ["Rule #", "Severity", "Category", "Title", "Heuristic", "Finding", "ZeroLight Fix"].join("\t");
  const rows = report.findings.map((f) =>
    [f.ruleNumber, f.severity, f.category, f.title, f.nielsenHeuristic, f.whatISee, f.zerolightFix]
      .map((cell) => String(cell).replace(/\t|\n/g, " "))
      .join("\t")
  );
  return [header, ...rows].join("\n");
}
