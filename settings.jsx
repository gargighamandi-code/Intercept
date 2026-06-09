// === Intercept prototype — settings.jsx ===
// "Settings" sub-tab of the Design section = widget display settings.
// Two widget families: the Feedback tab (controls live in design.jsx →
// FeedbackSettings / FeedbackPreview) and the Pop-up (built here).

// ---------- weight helpers ----------
const WEIGHTS = [
  { v: "Light", label: "Light" },
  { v: "Regular", label: "Regular" },
  { v: "Medium", label: "Medium" },
  { v: "Bold", label: "Bold" },
];
const weightToCss = (w) => ({ Light: 300, Regular: 400, Medium: 500, Bold: 700 }[w] || 400);

// ---------- Pop-up settings panel ----------
function PopupSettings({ design, setDesign }) {
  const p = design.popup || defaultFeedbackDesign().popup;
  const set = (patch) => setDesign({ ...design, popup: { ...p, ...patch } });

  return (
    <div className="ds__panel ds__panel--flush">
      <DSSection title="Position">
        <DSField label="Pop-up position" stacked>
          <DSSeg value={p.position} onChange={(v) => set({ position: v })} options={[
            { v: "top-center", label: "Top" },
            { v: "center", label: "Center" },
            { v: "bottom-left", label: "Bottom left" },
            { v: "bottom-right", label: "Bottom right" }]}/>
        </DSField>
      </DSSection>

      <DSSection title="Size">
        <DSField label="Width"><DSNumber value={p.sizeW} onChange={(v) => set({ sizeW: v })} min={300} max={620}/></DSField>
        <DSField label="Height"><DSNumber value={p.sizeH} onChange={(v) => set({ sizeH: v })} min={300} max={620}/></DSField>
      </DSSection>

      <DSSection title="Appearance">
        <DSField label="Background color" stacked>
          <DSSwatches value={p.bg} onChange={(v) => set({ bg: v })} allowCustom colors={["#FFFFFF", "#F7F8FA", "#1B3380", "#0F172A", "#EEF2F7"]}/>
        </DSField>
        <DSField label="Corner radius"><DSNumber value={p.radius} onChange={(v) => set({ radius: v })} min={0} max={28}/></DSField>
        <DSField label="Shadow" stacked>
          <DSSeg value={p.shadow} onChange={(v) => set({ shadow: v })} options={[
            { v: "none", label: "None" }, { v: "sm", label: "Soft" }, { v: "md", label: "Medium" }, { v: "lg", label: "Strong" }]}/>
        </DSField>
      </DSSection>

      <DSSection title="Overlay">
        <DSField label="Show overlay" hint="Dim the page behind">
          <DSToggle value={p.overlay} onChange={(v) => set({ overlay: v })}/>
        </DSField>
        {p.overlay && (
          <DSField label="Overlay opacity" stacked>
            <DSSlider value={p.overlayOpacity} onChange={(v) => set({ overlayOpacity: v })} min={0} max={80} unit="%"/>
          </DSField>
        )}
      </DSSection>

      <DSSection title="Typography">
        <DSField label="Font" stacked>
          <DSSelect value={p.font} onChange={(v) => set({ font: v })} options={[
            { v: "'Fira Sans', sans-serif", label: "Fira Sans" },
            { v: "Georgia, serif", label: "Georgia" },
            { v: "system-ui, sans-serif", label: "System UI" },
            { v: "'Courier New', monospace", label: "Courier" }]}/>
        </DSField>
        <DSField label="Size"><DSNumber value={p.fontSize} onChange={(v) => set({ fontSize: v })} min={12} max={26}/></DSField>
        <DSField label="Style" stacked>
          <DSSeg value={p.fontStyle} onChange={(v) => set({ fontStyle: v })} options={[
            { v: "normal", label: "Normal" }, { v: "italic", label: "Italic" }]}/>
        </DSField>
        <DSField label="Weight" stacked>
          <DSSeg value={p.fontWeight} onChange={(v) => set({ fontWeight: v })} options={[
            { v: 300, label: "Light" }, { v: 400, label: "Regular" }, { v: 500, label: "Medium" }, { v: 700, label: "Bold" }]}/>
        </DSField>
        <DSField label="Text color" stacked>
          <DSSwatches value={p.fontColor} onChange={(v) => set({ fontColor: v })} allowCustom colors={["#1B3380", "#0F172A", "#475569", "#FFFFFF"]}/>
        </DSField>
      </DSSection>

      <DSSection title="Opt-in box">
        <DSField label="Show opt-in box" hint="Email follow-up consent">
          <DSToggle value={p.optIn} onChange={(v) => set({ optIn: v })}/>
        </DSField>
      </DSSection>

      <DSSection title="Animation">
        <DSField label="Entrance" stacked>
          <DSSeg value={p.anim} onChange={(v) => set({ anim: v })} options={[
            { v: "fade", label: "Fade" }, { v: "slide", label: "Slide" }, { v: "pop", label: "Pop" }, { v: "none", label: "None" }]}/>
        </DSField>
      </DSSection>
    </div>
  );
}

// ---------- Pop-up live preview ----------
function PopupPreview({ d, survey }) {
  const [answer, setAnswer] = useState(null);
  const p = d.popup || defaultFeedbackDesign().popup;
  // Replay the entrance only when the user changes the Animation setting — the
  // resting state is always fully visible (robust for screenshots / hidden tabs).
  const [playKey, setPlayKey] = useState(0);
  const firstRef = useRef(true);
  useEffect(() => { if (firstRef.current) { firstRef.current = false; return; } setPlayKey(k => k + 1); }, [p.anim]);
  const q = firstQuestion(survey);
  const accent = (d.theme && d.theme.colors.themeColor) || "#1B87E6";
  const darkBg = ["#1B3380", "#0F172A"].includes(String(p.bg).toUpperCase());

  const shadowMap = {
    none: "none",
    sm: "0 6px 18px -8px rgba(20,24,38,.28)",
    md: "0 18px 44px -14px rgba(20,24,38,.34)",
    lg: "0 30px 70px -18px rgba(20,24,38,.44)",
  };

  let anchor = {};
  if (p.position === "center") anchor = { top: "50%", left: "50%", transform: "translate(-50%,-50%)" };
  else if (p.position === "top-center") anchor = { top: 28, left: "50%", transform: "translateX(-50%)" };
  else if (p.position === "bottom-left") anchor = { left: 22, bottom: 22 };
  else anchor = { right: 22, bottom: 22 };

  const cardStyle = {
    width: Math.min(p.sizeW, 540),
    maxHeight: "84%",
    background: p.bg,
    borderRadius: p.radius,
    boxShadow: shadowMap[p.shadow],
    fontFamily: p.font,
    color: p.fontColor,
    ...anchor,
  };

  return (
    <div className="pp-stage">
      {/* mock page */}
      <div className="fb-page">
        <div className="fb-page__nav"><span className="dotbar"></span><span className="dotbar s"></span></div>
        <div className="fb-page__hero"></div>
        <div className="fb-page__rows"><span className="l"></span><span className="m"></span><span className="s"></span></div>
        <div className="fb-page__cards"><span></span><span></span><span></span></div>
      </div>

      {/* overlay */}
      {p.overlay && <div className="pp-overlay" style={{ background: `rgba(20,24,38,${p.overlayOpacity / 100})` }}></div>}

      {/* popup card */}
      <div key={playKey} className={"pp-card" + (playKey > 0 ? " pp-anim-" + p.anim : "") + (darkBg ? " pp-card--dark" : "")} style={cardStyle}>
        <button className="pp-card__close" style={{ color: darkBg ? "rgba(255,255,255,.8)" : "var(--fg-3)" }}><Icon name="x" size={18}/></button>
        <div className="pp-card__body">
          <div className="pp-card__q" style={{ fontSize: p.fontSize + 1, fontStyle: p.fontStyle, fontWeight: p.fontWeight }}>
            {q ? q.text : survey.title}
          </div>
          {q && <div className="pp-card__answer" style={{ fontSize: p.fontSize }}><RespondentQuestion q={q} answer={answer} setAnswer={setAnswer}/></div>}

          {p.optIn && (
            <label className="pp-optin" style={{ borderColor: darkBg ? "rgba(255,255,255,.25)" : "var(--border-1)" }}>
              <span className="pp-optin__check" style={{ borderColor: accent }}><Icon name="check" size={12}/></span>
              <span style={{ fontStyle: p.fontStyle }}>Email me about my feedback</span>
            </label>
          )}

          <div className="pp-card__foot">
            <button className="pp-skip" style={{ color: darkBg ? "rgba(255,255,255,.7)" : "var(--fg-3)" }}>No thanks</button>
            <button className="pp-submit" style={{ background: accent }}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Embed settings panel ----------
function EmbedSettings({ design, setDesign }) {
  const e = design.embed || defaultFeedbackDesign().embed;
  const set = (patch) => setDesign({ ...design, embed: { ...e, ...patch } });

  return (
    <div className="ds__panel ds__panel--flush">
      <DSSection title="Placement">
        <DSField label="Embed width" stacked>
          <DSSeg value={e.width} onChange={(v) => set({ width: v })} options={[
            { v: "full", label: "Full width" }, { v: "fixed", label: "Fixed" }]}/>
        </DSField>
        {e.width === "fixed" && (
          <DSField label="Max width"><DSNumber value={e.maxWidth} onChange={(v) => set({ maxWidth: v })} min={360} max={920}/></DSField>
        )}
        <DSField label="Alignment" stacked>
          <DSSeg value={e.align} onChange={(v) => set({ align: v })} options={[
            { v: "left", label: "Left" }, { v: "center", label: "Center" }, { v: "right", label: "Right" }]}/>
        </DSField>
      </DSSection>

      <DSSection title="Appearance">
        <DSField label="Background color" stacked>
          <DSSwatches value={e.bg} onChange={(v) => set({ bg: v })} allowCustom colors={["#FFFFFF", "#F7F8FA", "#EEF2F7", "#1B3380", "#0F172A"]}/>
        </DSField>
        <DSField label="Show border">
          <DSToggle value={e.border} onChange={(v) => set({ border: v })}/>
        </DSField>
        <DSField label="Corner radius"><DSNumber value={e.radius} onChange={(v) => set({ radius: v })} min={0} max={28}/></DSField>
        <DSField label="Shadow" stacked>
          <DSSeg value={e.shadow} onChange={(v) => set({ shadow: v })} options={[
            { v: "none", label: "None" }, { v: "sm", label: "Soft" }, { v: "md", label: "Medium" }]}/>
        </DSField>
      </DSSection>

      <DSSection title="Typography">
        <DSField label="Font" stacked>
          <DSSelect value={e.font} onChange={(v) => set({ font: v })} options={[
            { v: "'Fira Sans', sans-serif", label: "Fira Sans" },
            { v: "Georgia, serif", label: "Georgia" },
            { v: "system-ui, sans-serif", label: "System UI" },
            { v: "'Courier New', monospace", label: "Courier" }]}/>
        </DSField>
        <DSField label="Size"><DSNumber value={e.fontSize} onChange={(v) => set({ fontSize: v })} min={12} max={26}/></DSField>
        <DSField label="Weight" stacked>
          <DSSeg value={e.fontWeight} onChange={(v) => set({ fontWeight: v })} options={[
            { v: 300, label: "Light" }, { v: 400, label: "Regular" }, { v: 500, label: "Medium" }, { v: 700, label: "Bold" }]}/>
        </DSField>
        <DSField label="Text color" stacked>
          <DSSwatches value={e.fontColor} onChange={(v) => set({ fontColor: v })} allowCustom colors={["#1B3380", "#0F172A", "#475569", "#FFFFFF"]}/>
        </DSField>
      </DSSection>
    </div>
  );
}

// ---------- Embed live preview ----------
function EmbedPreview({ d, survey }) {
  const [answer, setAnswer] = useState(null);
  const e = d.embed || defaultFeedbackDesign().embed;
  const q = firstQuestion(survey);
  const accent = (d.theme && d.theme.colors.themeColor) || "#1B87E6";
  const darkBg = ["#1B3380", "#0F172A"].includes(String(e.bg).toUpperCase());

  const shadowMap = { none: "none", sm: "0 6px 18px -8px rgba(20,24,38,.22)", md: "0 18px 44px -14px rgba(20,24,38,.3)" };
  const cardStyle = {
    width: e.width === "full" ? "100%" : Math.min(e.maxWidth, 760),
    marginLeft: e.align === "left" ? 0 : (e.align === "right" ? "auto" : "auto"),
    marginRight: e.align === "right" ? 0 : (e.align === "left" ? "auto" : "auto"),
    background: e.bg,
    border: e.border ? `1px solid ${darkBg ? "rgba(255,255,255,.14)" : "var(--border-1)"}` : "0",
    borderRadius: e.radius,
    boxShadow: shadowMap[e.shadow],
    fontFamily: e.font,
    color: e.fontColor,
  };

  return (
    <div className="em-stage">
      <div className="em-page">
        <div className="fb-page__nav"><span className="dotbar"></span><span className="dotbar s"></span></div>
        <div className="em-page__rows"><span className="l"></span><span className="m"></span></div>

        {/* the embedded survey, inline in the page flow */}
        <div className="em-card" style={cardStyle}>
          <div className="em-card__q" style={{ fontSize: e.fontSize + 1, fontWeight: e.fontWeight }}>{q ? q.text : survey.title}</div>
          {q && <div className="em-card__answer" style={{ fontSize: e.fontSize }}><RespondentQuestion q={q} answer={answer} setAnswer={setAnswer}/></div>}
          <div className="em-card__foot">
            <button className="em-submit" style={{ background: accent }}>Submit</button>
          </div>
        </div>

        <div className="em-page__rows"><span className="m"></span><span className="s"></span></div>
        <div className="fb-page__cards"><span></span><span></span><span></span></div>
      </div>
    </div>
  );
}

Object.assign(window, { WEIGHTS, weightToCss, PopupSettings, PopupPreview, EmbedSettings, EmbedPreview });
