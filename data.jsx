// === Intercept prototype — data.jsx ===
// Seed data: one populated workspace ("Default") + empty states elsewhere.

let _id = 100;
const uid = (p = "id") => `${p}_${++_id}`;

// Question type registry — drives the palette + question card renderers.
const QTYPES = {
  single:   { label: "Select One",        icon: "radio",        group: "Multiple Choice" },
  multi:    { label: "Select Many",       icon: "checkbox",     group: "Multiple Choice" },
  dropdown: { label: "Drop-down Menu",    icon: "dropdown",     group: "Multiple Choice" },
  comment:  { label: "Comment Box",       icon: "comment",      group: "Text" },
  textrow:  { label: "Single Row Text",   icon: "text-row",     group: "Text" },
  email:    { label: "Email Address",     icon: "at",           group: "Text" },
  contact:  { label: "Contact Information",icon: "contact",     group: "Text" },
  star:     { label: "Star Rating",       icon: "star",         group: "Graphical Rating" },
  smiley:   { label: "Smiley - Rating",   icon: "smiley",       group: "Graphical Rating" },
  thumbs:   { label: "Thumbs Up/Down",    icon: "thumbs",       group: "Graphical Rating" },
  social:   { label: "Push To Social",    icon: "heart-share",  group: "Graphical Rating" },
  textslider:{ label: "Text Slider",      icon: "text-slider",  group: "Graphical Rating" },
  numslider:{ label: "Numeric Slider",    icon: "num-slider",   group: "Graphical Rating" },
  nps:      { label: "Net Promoter Score",icon: "nps",          group: "Graphical Rating" },
  heading:  { label: "Section Heading",   icon: "heading",      group: "Static Content" },
  paragraph:{ label: "Descriptive Text",  icon: "paragraph",    group: "Static Content" },
  image:    { label: "Image",             icon: "image",        group: "Static Content" },
};
const PALETTE_GROUPS = ["Multiple Choice", "Text", "Graphical Rating", "Static Content"];

// Default content for a freshly added question of a given type.
function defaultQuestion(type) {
  const base = { id: uid("q"), type, required: true };
  switch (type) {
    case "single":   return { ...base, text: "How satisfied are you with our website?", options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"] };
    case "multi":    return { ...base, text: "What brought you here today?", options: ["Browsing products", "Looking for support", "Making a purchase", "Just exploring"] };
    case "dropdown": return { ...base, text: "Which page were you visiting?", options: ["Home", "Pricing", "Product", "Support"] };
    case "comment":  return { ...base, text: "What could we do to improve your experience?" };
    case "textrow":  return { ...base, text: "What were you looking for today?" };
    case "email":    return { ...base, text: "Can we follow up? Add your email." };
    case "contact":  return { ...base, text: "Your contact details" };
    case "star":     return { ...base, text: "How would you rate your visit?" };
    case "smiley":   return { ...base, text: "How do you feel about this page?" };
    case "thumbs":   return { ...base, text: "Was this page helpful?" };
    case "social":   return { ...base, text: "Enjoying the experience? Share it." };
    case "textslider": return { ...base, text: "How likely are you to return?", left: "Not at all", right: "Definitely" };
    case "numslider":return { ...base, text: "Rate your experience from 0 to 10", min: 0, max: 10 };
    case "nps":      return { ...base, text: "How likely is it that you would recommend {company/product/service} to a friend or colleague?", left: "Very Unlikely", right: "Very Likely" };
    case "heading":  return { ...base, text: "We'd love your feedback", required: false };
    case "paragraph":return { ...base, text: "This quick survey takes less than a minute. Your answers help us improve.", required: false };
    case "image":    return { ...base, text: "", required: false };
    default:         return { ...base, text: "Untitled question" };
  }
}

const TRIGGERS = {
  exit:   { label: "Exit intent",  icon: "mouse-out" },
  scroll: { label: "On scroll",    icon: "scroll" },
  time:   { label: "After delay",  icon: "clock" },
  load:   { label: "On page load", icon: "target" },
};

function makeIntercept(name, status, trigger, responses, updated, type = "nps", kind = "feedback") {
  return {
    id: uid("ic"), name, status, trigger, responses, updated, kind,
    survey: {
      title: name,
      blocks: [{ id: uid("b"), name: "Block 1", collapsed: false, questions: [defaultQuestion(type)] }],
    },
  };
}

// A brand-new intercept opens with two default questions: NPS + open-ended follow-up.
function newInterceptSurvey() {
  return {
    title: "New Intercept",
    blocks: [{
      id: uid("b"), name: "Block 1", collapsed: false,
      questions: [
        defaultQuestion("nps"),
        { ...defaultQuestion("comment"), text: "What is the primary reason for your score?" },
      ],
    }],
  };
}

function seedWorkspaces() {
  return [
    {
      id: uid("ws"), name: "Default", initial: "D", color: "#1B87E6",
      members: 6, createdAt: "Jan 14, 2025",
      projects: [
        {
          id: uid("pr"), name: "Acme Store", url: "https://www.acmestore.com", status: "active",
          impressions: 48210, visitors: 12940, created: "Feb 3, 2025", updated: "2 days ago",
          intercepts: [
            makeIntercept("Post-purchase NPS", "active", "exit", 1284, "2 days ago", "nps", "popup"),
            makeIntercept("Cart abandonment feedback", "paused", "scroll", 342, "1 week ago", "single", "feedback"),
            makeIntercept("Homepage satisfaction", "draft", "time", 0, "3 weeks ago", "star", "embed"),
          ],
        },
        {
          id: uid("pr"), name: "Acme Help Center", url: "https://help.acmestore.com", status: "notinstalled",
          impressions: 0, visitors: 0, created: "Apr 22, 2025", updated: "5 days ago",
          intercepts: [],
        },
        {
          id: uid("pr"), name: "Marketing Site", url: "https://www.acme.io", status: "active",
          impressions: 21870, visitors: 8460, created: "Mar 10, 2025", updated: "yesterday",
          intercepts: [
            makeIntercept("Pricing page exit survey", "active", "exit", 612, "yesterday", "single", "popup"),
            makeIntercept("Newsletter intent", "active", "time", 1890, "4 days ago", "thumbs", "feedback"),
          ],
        },
      ],
    },
    {
      id: uid("ws"), name: "Growth Team", initial: "G", color: "#16A34A",
      members: 3, createdAt: "Mar 2, 2025",
      projects: [],
    },
    {
      id: uid("ws"), name: "EMEA Research", initial: "E", color: "#7C3AED",
      members: 9, createdAt: "Nov 28, 2024",
      projects: [
        {
          id: uid("pr"), name: "DACH Landing Pages", url: "https://de.acme.io", status: "active",
          impressions: 9120, visitors: 4030, created: "Dec 1, 2024", updated: "1 week ago",
          intercepts: [ makeIntercept("Localization feedback", "active", "scroll", 208, "1 week ago", "smiley", "embed") ],
        },
      ],
    },
  ];
}

// ---- Feedback intercept design config (defaults) ----
function defaultFeedbackDesign() {
  return {
    edge: "right",          // left | right | bottom
    align: "middle",        // top | middle | bottom (edge-relative)
    sticky: true,
    tabW: 168,              // tab length along the edge
    tabH: 56,               // tab thickness
    widgetW: 380,
    widgetH: 470,
    bg: "#1B87E6",
    fg: "#FFFFFF",
    radius: 8,
    showLogo: false,
    logoUrl: null,
    label: "Feedback",
    font: "'Fira Sans', sans-serif",
    fontSize: 15,
    fontWeight: 500,
    closeShow: true,
    closeColor: "#FFFFFF",
    anim: "slide",          // slide | fade | pop | none
    // ---- survey appearance (Themes + Customize tabs) ----
    theme: {
      layout: "classic",    // classic | focus | visual | accessible
      themeId: "blue",
      colors: {
        themeColor: "#1B87E6",
        logoBg: "#FFFFFF",
        titleBg: "#FFFFFF",
        surveyBg: "#EEF2F7",
        contentArea: "#FFFFFF",
        answerHover: "#EAF4FD",
        submitButton: "#1B87E6",
        progressBar: "#1B87E6",
      },
      font: "'Fira Sans', sans-serif",
      customCss: false,
      // per-element typography (Customize tab)
      type: {
        title:      { color: "#1B87E6", weight: "Regular", size: 32 },
        question:   { color: "#475569", weight: "Regular", size: 22 },
        answer:     { color: "#475569", weight: "Regular", size: 16 },
        button:     { color: "#FFFFFF", weight: "Regular", size: 20 },
        validation: { color: "#EF4444", weight: "Regular", size: 16 },
      },
    },
    // ---- pop-up widget display settings (Settings tab) ----
    popup: {
      position: "center",     // center | bottom-right | bottom-left | top-center
      sizeW: 460,
      sizeH: 430,
      bg: "#FFFFFF",
      overlay: true,
      overlayOpacity: 50,     // 0–80 %
      radius: 14,
      shadow: "lg",           // none | sm | md | lg
      font: "'Fira Sans', sans-serif",
      fontSize: 16,
      fontStyle: "normal",    // normal | italic
      fontWeight: 400,
      fontColor: "#1B3380",
      optIn: true,
      anim: "fade",           // fade | slide | pop | none
    },
    // ---- embed widget display settings (Settings tab) ----
    embed: {
      width: "fixed",         // full | fixed
      maxWidth: 640,
      align: "center",        // left | center | right
      bg: "#FFFFFF",
      border: true,
      radius: 12,
      shadow: "sm",           // none | sm | md
      font: "'Fira Sans', sans-serif",
      fontSize: 16,
      fontWeight: 400,
      fontColor: "#1B3380",
    },
  };
}

// ---- Intercept behaviour settings (Settings tab) ----
function defaultInterceptSettings() {
  return {
    allowMultiple: false,   // allow the same visitor to respond more than once
    triggerDelay: 3,        // seconds before the intercept appears
    sampleRate: 100,        // % of eligible visitors shown the intercept
    autoLanguage: true,     // auto-detect respondent language
    autoClose: true,        // close the widget automatically once completed
  };
}

// ---- Intercept targeting rules (Rules tab) ----
function defaultInterceptRules(trigger = "load") {
  return {
    trigger,                // load | exit | scroll | time
    frequency: "once",      // once | session | always | until-answered
    matchType: "all",       // all | any
    conditions: [
      { id: uid("cond"), type: "device", op: "is", value: "Desktop", key: "" },
      { id: uid("cond"), type: "pageurl", op: "includes", value: "/pricing", key: "" },
    ],
  };
}

// ---- Intercept data mapping (Mapping tab) ----
// Custom variables a visitor's context maps into when a response is captured.
const MAPPING_TYPES = [
  "Visitor id", "Website url", "Page title", "Referrer url", "Browser",
  "Operating system", "Device type", "Country", "Language", "Custom text", "Number", "Date",
];
const MAPPING_DATATYPES = ["String", "Number", "Boolean", "Date"];
const CUSTOM_VAR_TOTAL = 27;
const CUSTOM_VARS = Array.from({ length: CUSTOM_VAR_TOTAL }, (_, i) => "custom" + (45 + i));

function defaultInterceptMapping() {
  return [
    { id: uid("map"), name: "custom45", type: "Visitor id", mapping: "auto" },
    { id: uid("map"), name: "custom46", type: "Website url", mapping: "auto" },
  ];
}

Object.assign(window, { uid, QTYPES, PALETTE_GROUPS, defaultQuestion, TRIGGERS, makeIntercept, newInterceptSurvey, defaultFeedbackDesign, seedWorkspaces, defaultInterceptSettings, defaultInterceptRules, MAPPING_TYPES, MAPPING_DATATYPES, CUSTOM_VARS, CUSTOM_VAR_TOTAL, defaultInterceptMapping });
