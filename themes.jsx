// === Intercept prototype — themes.jsx ===
// Design tab: Themes / Customize / Intercept sub-tabs + survey device preview.

const THEME_PRESETS = [
  { id: "blue",   accent: "#1B87E6", bg: "#EEF2F7" },
  { id: "sky",    accent: "#38BDF8", bg: "#EFF8FE" },
  { id: "gray",   accent: "#6B768C", bg: "#F1F3F6" },
  { id: "slate",  accent: "#475569", bg: "#EEF1F5" },
  { id: "brown",  accent: "#92400E", bg: "#F6F0EB" },
  { id: "green",  accent: "#16A34A", bg: "#EDF8F0" },
  { id: "amber",  accent: "#F59E0B", bg: "#FEF6E7" },
  { id: "red",    accent: "#EF4444", bg: "#FDEEEE" },
  { id: "purple", accent: "#9333EA", bg: "#F6EEFC" },
  { id: "teal",   accent: "#0D9488", bg: "#E9F6F4" },
  { id: "rose",   accent: "#E11D48", bg: "#FCECF0" },
  { id: "powder", accent: "#2563EB", bg: "#DCE6FB" },
  { id: "navy",   accent: "#1B3380", bg: "#1B3380", dark: true },
  { id: "gold",   accent: "#1B3380", bg: "#F5C518", warm: true },
  { id: "cyan",   accent: "#06B6D4", bg: "#E6FAFD" },
  { id: "sand",   accent: "#CA8A04", bg: "#FBF6E9" },
];

const LAYOUTS = [
  { id: "classic", name: "Classic" },
  { id: "focus", name: "Focus" },
  { id: "visual", name: "Visual" },
  { id: "accessible", name: "Accessible" },
];

// ---- survey layout cards (Classic / Focus / Visual / Accessible) ----
function SurveyLayoutCards({ value, onChange }) {
  return (
    <div className="lay">
      <div className="lay__title">Survey layout <span className="help-dot" title="Choose how the survey is laid out for respondents.">?</span></div>
      <div className="lay__cards">
        {LAYOUTS.map(l => (
          <button key={l.id} className={"lay__card" + (value === l.id ? " on" : "")} onClick={() => onChange(l.id)}>
            <span className={"lay__thumb lay__thumb--" + l.id}>
              <span className="aa">Aa</span>
              <span className="ln"></span><span className="ln s"></span>
              {l.id === "accessible" && <span className="a11y"><Icon name="users" size={14}/></span>}
            </span>
            <span className="lay__label">{l.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- theme grid ----
function ThemeGrid({ value, onChange }) {
  return (
    <div className="thm-grid-wrap">
      <button className="thm-grid__tool" title="Theme settings"><Icon name="wrench" size={16}/></button>
      <div className="thm-grid">
        {THEME_PRESETS.map(t => (
          <button key={t.id} className={"thm" + (value === t.id ? " on" : "")} onClick={() => onChange(t)}>
            <span className="thm__bar" style={{ background: t.accent }}></span>
            <span className="thm__body" style={{ background: t.dark ? t.accent : (t.warm ? t.bg : "#fff") }}>
              <span className="thm__aa" style={{ color: t.dark ? "#fff" : t.accent }}>Aa</span>
              <span className="thm__rows">
                <span className="thm__box" style={{ borderColor: t.accent }}></span>
                <span className="thm__ln" style={{ background: t.dark ? "rgba(255,255,255,.5)" : "var(--qp-gray-300)" }}></span>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ---- color swatch (opens native picker) ----
function CZSwatch({ value, onChange }) {
  return (
    <label className="cz-sw" style={{ background: value }}>
      <input type="color" value={/^#/.test(value) ? value : "#ffffff"} onChange={(e) => onChange(e.target.value)}/>
    </label>
  );
}

// ---- per-element typography rows (Customize) ----
function TypeRows({ t, setTheme }) {
  const ty = t.type || defaultFeedbackDesign().theme.type;
  const setOne = (k, patch) => setTheme({ type: { ...ty, [k]: { ...ty[k], ...patch } } });
  const rows = [
    { k: "title", label: "Title" },
    { k: "question", label: "Question" },
    { k: "answer", label: "Answer" },
    { k: "button", label: "Button Text" },
    { k: "validation", label: "Validation Message" },
  ];
  return (
    <div className="cz-type">
      {rows.map(r => {
        const row = ty[r.k];
        return (
          <div className="cz-type__row" key={r.k}>
            <span className="cz__label">{r.label}</span>
            <CZSwatch value={row.color} onChange={(v) => setOne(r.k, { color: v })}/>
            <select className="cz-type__weight" value={row.weight} onChange={(e) => setOne(r.k, { weight: e.target.value })}>
              {WEIGHTS.map(w => <option key={w.v} value={w.v}>{w.label}</option>)}
            </select>
            <span className="cz-type__size">
              <input type="number" min={10} max={64} value={row.size}
                onChange={(e) => setOne(r.k, { size: e.target.value === "" ? "" : Number(e.target.value) })}
                onBlur={(e) => { let n = Number(e.target.value); if (Number.isNaN(n)) n = 16; setOne(r.k, { size: Math.max(10, Math.min(64, n)) }); }}/>
              <span className="cz-type__unit">px</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ---- customize panel ----
function CustomizeColors({ t, setColors, setTheme }) {
  const c = t.colors;
  const rows = [
    { k: "themeColor", label: "Theme Color" },
    { k: "logoBg", label: "Logo Background" },
    { k: "titleBg", label: "Title Background" },
    { k: "surveyBg", label: "Survey Background", image: true },
    { k: "contentArea", label: "Content Area" },
    { k: "answerHover", label: "Answer hover" },
    { k: "submitButton", label: "Submit Button" },
    { k: "progressBar", label: "Progress Bar" },
  ];
  return (
    <div className="cz">
      <div className="cz__top">
        <div className="cz-select">
          <span>Survey Customized</span><Icon name="chevron-down" size={15}/>
        </div>
        <button className="cz__tool" title="Reset"><Icon name="wrench" size={15}/></button>
        <span className="help-dot" title="Fine-tune every color of the survey.">?</span>
        <div className="cz__spacer"></div>
        <span className="cz__css">Custom CSS</span>
        <div className={"switch" + (t.customCss ? " on" : "")} onClick={() => setTheme({ customCss: !t.customCss })}></div>
      </div>

      <div className="cz__rows">
        {rows.map(r => (
          <div className="cz__row" key={r.k}>
            <span className="cz__label">{r.label}</span>
            <CZSwatch value={c[r.k]} onChange={(v) => setColors({ [r.k]: v })}/>
            {r.image && <a className="cz__img">Use image</a>}
          </div>
        ))}
      </div>

      <div className="cz__font">
        <span className="cz__label">Font Family</span>
        <select className="ds-select" value={t.font} onChange={(e) => setTheme({ font: e.target.value })}>
          <option value="'Fira Sans', sans-serif">Fira Sans</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="system-ui, sans-serif">System UI</option>
          <option value="'Courier New', monospace">Courier</option>
        </select>
      </div>

      <TypeRows t={t} setTheme={setTheme}/>
    </div>
  );
}

// ---- survey taker question (themed) ----
function TakerQuestion({ q, answer, setAnswer, colors }) {
  const accent = colors.themeColor;
  if (["single", "multi", "dropdown"].includes(q.type)) {
    const opts = q.options && q.options.length ? q.options : ["Yes", "No"];
    return (
      <div className="tk-opts">
        {opts.map((o, i) => (
          <label key={i} className={"tk-opt" + (answer === i ? " on" : "")}
            style={answer === i ? { borderColor: accent, background: colors.answerHover } : undefined}
            onMouseEnter={(e) => { if (answer !== i) e.currentTarget.style.background = colors.answerHover; }}
            onMouseLeave={(e) => { if (answer !== i) e.currentTarget.style.background = ""; }}
            onClick={() => setAnswer(i)}>
            <span className={"tk-mark " + (q.type === "multi" ? "sq" : "rd")} style={answer === i ? { borderColor: accent } : undefined}>
              {answer === i && <span className="tk-mark__dot" style={{ background: accent }}></span>}
            </span>
            {o}
          </label>
        ))}
      </div>
    );
  }
  if (q.type === "nps") return <NPSScale value={answer} onPick={setAnswer} labels={[q.left || "Not at all likely", q.right || "Extremely likely"]}/>;
  if (q.type === "comment" || q.type === "textrow" || q.type === "email")
    return <textarea className="tk-textarea" rows={q.type === "comment" ? 4 : 1} placeholder="Type your answer…" onChange={(e) => setAnswer(e.target.value)}/>;
  if (q.type === "star")
    return <div className="tk-stars">{[0,1,2,3,4].map(i => <span key={i} onClick={() => setAnswer(i)} style={{ cursor: "pointer", color: answer != null && i <= answer ? "#F5C518" : "var(--qp-gray-300)" }}><Icon name="star" size={32} fill={answer != null && i <= answer ? "currentColor" : "none"}/></span>)}</div>;
  return <div className="tk-opts"><label className="tk-opt">Yes</label><label className="tk-opt">No</label></div>;
}

// ---- device preview (survey taker in a frame) ----
function DevicePreview({ survey, theme, device, setDevice }) {
  const [answer, setAnswer] = useState(null);
  const c = theme.colors;
  const ty = theme.type || defaultFeedbackDesign().theme.type;
  const q = firstQuestion(survey);
  const devices = [
    { id: "desktop", icon: "monitor" }, { id: "tablet", icon: "tablet" }, { id: "smartphone", icon: "smartphone" },
  ];
  return (
    <div className="dt-preview">
      <div className="dt-preview__bar">
        <span className="dt-preview__title">Live preview</span>
        <span className="dt-preview__sub">Survey appearance</span>
        <div className="dt-preview__spacer"></div>
        <div className="dev-toggle">
          {devices.map(d => (
            <button key={d.id} className={device === d.id ? "on" : ""} onClick={() => setDevice(d.id)} title={d.id}>
              <Icon name={d.icon} size={18}/>
            </button>
          ))}
        </div>
      </div>
      <div className="dt-preview__stage">
        <div className={"device device--" + device}>
          <div className={"tk tk--" + theme.layout} style={{ background: c.surveyBg, fontFamily: theme.font }}>
            <div className="tk__progress"><div style={{ background: c.progressBar }}></div></div>
            <div className="tk__head" style={{ background: c.titleBg }}>
              <span className="tk__brand" style={{ color: ty.title.color, fontSize: ty.title.size, fontWeight: weightToCss(ty.title.weight) }}>{survey.title || "Survey"}</span>
              <Icon name="logout" size={18}/>
            </div>
            <div className="tk__card" style={{ background: c.contentArea }}>
              <div className="tk__req" style={{ color: ty.validation.color, fontSize: ty.validation.size }}>Questions marked with a <b>*</b> are required</div>
              <div className="tk__q" style={{ color: ty.question.color, fontSize: ty.question.size, fontWeight: weightToCss(ty.question.weight) }}><b style={{ color: ty.validation.color }}>*</b> {q ? q.text : survey.title} <span className="help-dot sm" title="Question help">?</span></div>
              <div style={{ fontSize: ty.answer.size, fontWeight: weightToCss(ty.answer.weight), color: ty.answer.color }}>
                {q && <TakerQuestion q={q} answer={answer} setAnswer={setAnswer} colors={c}/>}
              </div>
              <div className="tk__foot">
                <button className="tk__back" style={{ borderColor: c.themeColor, color: c.themeColor }}><Icon name="chevron-left" size={18}/></button>
                <button className="tk__next" style={{ background: c.submitButton, fontSize: ty.button.size, fontWeight: weightToCss(ty.button.weight), color: ty.button.color }}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Design tab wrapper (3 sub-tabs) ----
function DesignTab({ design, setDesign, survey, kind, onToast }) {
  const [sub, setSub] = useState("themes");
  const [device, setDevice] = useState("tablet");
  const wkind = kind === "popup" ? "popup" : (kind === "embed" ? "embed" : "feedback");
  const t = design.theme || defaultFeedbackDesign().theme;
  const setTheme = (patch) => setDesign({ ...design, theme: { ...t, ...patch } });
  const setColors = (patch) => setTheme({ colors: { ...t.colors, ...patch } });
  const pickTheme = (preset) => setTheme({
    themeId: preset.id,
    colors: { ...t.colors, themeColor: preset.accent, submitButton: preset.accent, progressBar: preset.accent,
      surveyBg: preset.bg || t.colors.surveyBg, titleBg: preset.dark ? preset.accent : "#FFFFFF" },
  });

  const subtabs = [
    { id: "themes", label: "Themes" },
    { id: "customize", label: "Customize" },
    { id: "widget", label: "Widget" },
  ];

  const widgetLabel = wkind === "popup" ? "Pop-up" : (wkind === "embed" ? "Embed" : "Feedback tab");
  const widgetDesc = wkind === "popup"
    ? "Configure how the pop-up appears to targeted visitors."
    : (wkind === "embed"
        ? "Configure how the survey embeds inline within your page."
        : "Configure the feedback tab and the widget it opens.");

  return (
    <div className="dt">
      <div className="dt__left">
        {sub !== "widget" && <SurveyLayoutCards value={t.layout} onChange={(v) => setTheme({ layout: v })}/>}
        <div className="dt__subtabs">
          {subtabs.map(s => (
            <button key={s.id} className={"dt__subtab" + (sub === s.id ? " on" : "")} onClick={() => setSub(s.id)}>{s.label}</button>
          ))}
        </div>
        <div className="dt__content">
          {sub === "themes" && <ThemeGrid value={t.themeId} onChange={pickTheme}/>}
          {sub === "customize" && <CustomizeColors t={t} setColors={setColors} setTheme={setTheme}/>}
          {sub === "widget" && (
            <div className="dt-settings">
              <div className="dt-settings__head">
                <h3>{widgetLabel} display settings</h3>
                <p>{widgetDesc}</p>
              </div>
              {wkind === "popup"
                ? <PopupSettings design={design} setDesign={setDesign}/>
                : (wkind === "embed"
                    ? <EmbedSettings design={design} setDesign={setDesign}/>
                    : <FeedbackSettings design={design} setDesign={setDesign}/>)}
            </div>
          )}
        </div>
        {sub !== "widget" && (
          <div className="dt__foot">
            <button className="btn btn-primary btn-sm" onClick={() => onToast && onToast("Theme applied")}>Save &amp; Apply</button>
            {sub === "customize" && <button className="btn btn-ghost btn-sm">Save as…</button>}
          </div>
        )}
      </div>
      <div className="dt__right">
        {sub === "widget"
          ? <div className="ds__preview" style={{ height: "100%" }}>
              <div className="ds__preview-head">
                <span className="ds__preview-title">Live preview</span>
                <span className="ds__preview-sub">{widgetLabel}</span>
              </div>
              {wkind === "popup"
                ? <PopupPreview d={design} survey={survey}/>
                : (wkind === "embed"
                    ? <EmbedPreview d={design} survey={survey}/>
                    : <FeedbackPreview d={design} survey={survey}/>)}
            </div>
          : <DevicePreview survey={survey} theme={t} device={device} setDevice={setDevice}/>}
      </div>
    </div>
  );
}

Object.assign(window, { THEME_PRESETS, LAYOUTS, SurveyLayoutCards, ThemeGrid, CZSwatch, CustomizeColors, TakerQuestion, DevicePreview, DesignTab });
