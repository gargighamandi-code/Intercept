// === Intercept prototype — design.jsx ===
// Type-aware Design tab. Feedback intercept: settings (left) + live preview (right).

// ---------- small control primitives ----------
function DSSection({ title, children }) {
  return (
    <div className="ds-sec">
      <h4>{title}</h4>
      {children}
    </div>
  );
}
function DSField({ label, hint, children, stacked }) {
  return (
    <div className={"ds-field" + (stacked ? " stacked" : "")}>
      <div className="ds-field__label">{label}{hint && <span className="ds-field__hint">{hint}</span>}</div>
      <div className="ds-field__control">{children}</div>
    </div>
  );
}
function DSSeg({ value, onChange, options }) {
  return (
    <div className="ds-seg">
      {options.map(o => (
        <button key={String(o.v)} className={value === o.v ? "on" : ""} onClick={() => onChange(o.v)}>
          {o.icon && <Icon name={o.icon} size={14}/>}{o.label}
        </button>
      ))}
    </div>
  );
}
function DSSlider({ value, onChange, min, max, step = 1, unit = "px" }) {
  return (
    <div className="ds-slider">
      <input type="range" className="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}/>
      <span className="ds-slider__val">{value}{unit}</span>
    </div>
  );
}
function DSNumber({ value, onChange, min, max, step = 1, unit = "px" }) {
  const commit = (v) => {
    let n = Number(v);
    if (Number.isNaN(n)) n = min;
    n = Math.max(min, Math.min(max, n));
    onChange(n);
  };
  return (
    <div className="ds-number">
      <input type="number" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        onBlur={(e) => commit(e.target.value)}/>
      <span className="ds-number__unit">{unit}</span>
    </div>
  );
}
function DSSwatches({ value, onChange, colors, allowCustom }) {
  const isPreset = colors.some(c => c.toLowerCase() === String(value).toLowerCase());
  const customActive = allowCustom && !isPreset;
  return (
    <div className="ds-swatches">
      {colors.map(c => (
        <button key={c} className={"ds-swatch" + (value.toLowerCase() === c.toLowerCase() ? " on" : "")}
          style={{ background: c }} onClick={() => onChange(c)} title={c}>
          {value.toLowerCase() === c.toLowerCase() && <Icon name="check" size={13}/>}
        </button>
      ))}
      {allowCustom && (
        <label className={"ds-swatch ds-swatch--custom" + (customActive ? " on" : "")}
          style={customActive ? { background: value } : undefined} title="Custom color">
          {customActive ? <Icon name="check" size={13}/> : <Icon name="plus" size={14}/>}
          <input type="color" value={/^#/.test(value) ? value : "#1B87E6"} onChange={(e) => onChange(e.target.value)}/>
        </label>
      )}
    </div>
  );
}
function DSToggle({ value, onChange }) {
  return <div className={"switch" + (value ? " on" : "")} onClick={() => onChange(!value)}/>;
}
function DSSelect({ value, onChange, options }) {
  return (
    <select className="ds-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}
    </select>
  );
}
function DSLogoUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const pick = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(f);
    e.target.value = "";
  };
  return (
    <div className="ds-logo">
      <div className="ds-logo__preview">
        {value ? <img src={value} alt="logo"/> : <Icon name="image" size={22}/>}
      </div>
      <div className="ds-logo__actions">
        <button className="ds-logo__btn" onClick={() => inputRef.current && inputRef.current.click()}>
          <Icon name="upload" size={14}/> {value ? "Replace logo" : "Upload logo"}
        </button>
        {value && <button className="ds-logo__remove" onClick={() => onChange(null)}>Remove</button>}
        <div className="ds-logo__hint">PNG or SVG, transparent background recommended.</div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={pick}/>
    </div>
  );
}

// ---------- live preview ----------
function FeedbackPreview({ d, survey }) {
  const [open, setOpen] = useState(true);
  const [answer, setAnswer] = useState(null);
  // Replay the entrance only when the Animation setting changes; resting state stays visible.
  const [playKey, setPlayKey] = useState(0);
  const firstRef = useRef(true);
  useEffect(() => { if (firstRef.current) { firstRef.current = false; return; } setPlayKey(k => k + 1); }, [d.anim]);
  const q = firstQuestion(survey);

  const alignPct = (a) => (a === "top" ? "20%" : a === "bottom" ? "80%" : "50%");
  const isVert = d.edge !== "bottom";
  const r = d.radius;

  // tab geometry
  const tabStyle = {
    background: d.bg, color: d.fg,
    fontFamily: d.font, fontSize: d.fontSize, fontWeight: d.fontWeight,
    boxShadow: "0 6px 18px -6px rgba(20,24,38,.4)",
  };
  let tabWrap = {}, tabBox = {};
  if (d.edge === "right") {
    tabWrap = { right: 0, top: alignPct(d.align), transform: "translateY(-50%)" };
    tabBox = { width: d.tabH, height: d.tabW, writingMode: "vertical-rl", borderRadius: `${r}px 0 0 ${r}px` };
  } else if (d.edge === "left") {
    tabWrap = { left: 0, top: alignPct(d.align), transform: "translateY(-50%)" };
    tabBox = { width: d.tabH, height: d.tabW, writingMode: "vertical-rl", transform: "rotate(180deg)", borderRadius: `${r}px 0 0 ${r}px` };
  } else {
    tabWrap = { bottom: 0, left: alignPct(d.align), transform: "translateX(-50%)" };
    tabBox = { width: d.tabW, height: d.tabH, borderRadius: `${r}px ${r}px 0 0` };
  }

  // widget anchor near the tab
  let widgetPos = {};
  if (d.edge === "right") widgetPos = { right: d.tabH + 14, bottom: 22 };
  else if (d.edge === "left") widgetPos = { left: d.tabH + 14, bottom: 22 };
  else widgetPos = { bottom: d.tabH + 14, left: "50%", transform: "translateX(-50%)" };

  return (
    <div className="fb-stage">
      {/* mock page */}
      <div className="fb-page">
        <div className="fb-page__nav"><span className="dotbar"></span><span className="dotbar s"></span></div>
        <div className="fb-page__hero"></div>
        <div className="fb-page__rows">
          <span className="l"></span><span className="m"></span><span className="s"></span>
        </div>
        <div className="fb-page__cards"><span></span><span></span><span></span></div>
      </div>

      {/* tab */}
      <div className="fb-tabwrap" style={tabWrap}>
        <div className="fb-tab" style={{ ...tabStyle, ...tabBox }} onClick={() => setOpen(o => !o)}>
          {d.showLogo && <img className="fb-tab__logo" src={d.logoUrl || (window.__resources && window.__resources.qpCube) || "assets/qp-cube.png"} alt="" onError={(e)=>{e.target.style.display='none';}}/>}
          <span className="fb-tab__label">{d.label || "Feedback"}</span>
        </div>
      </div>

      {/* widget */}
      {open && (
        <div className="fb-widget" style={widgetPos}>
          <div key={playKey} className={"fb-card" + (playKey > 0 ? " fb-anim-" + d.anim : "")} style={{ width: d.widgetW, height: d.widgetH, fontFamily: d.font }}>
            <div className="fb-card__head" style={{ background: d.bg, color: d.fg }}>
              {d.showLogo && <img className="fb-card__logo" src={d.logoUrl || (window.__resources && window.__resources.qpCube) || "assets/qp-cube.png"} alt="" onError={(e)=>{e.target.style.display='none';}}/>}
              <span className="fb-card__title" style={{ fontWeight: d.fontWeight }}>{d.label || "Feedback"}</span>
              {d.closeShow && (
                <button className="fb-card__close" style={{ color: d.closeColor }} onClick={() => setOpen(false)}><Icon name="x" size={18}/></button>
              )}
            </div>
            <div className="fb-card__body">
              <div className="fb-card__q" style={{ fontWeight: d.fontWeight }}>{q ? q.text : survey.title}</div>
              {q && <RespondentQuestion q={q} answer={answer} setAnswer={setAnswer}/>}
              <button className="fb-card__submit" style={{ background: d.bg, color: d.fg }}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {!open && <div className="fb-hint">Click the tab to preview the widget</div>}
    </div>
  );
}

// ---------- feedback settings panel ----------
function FeedbackSettings({ design: d, setDesign }) {
  const set = (patch) => setDesign({ ...d, ...patch });
  const alignOpts = d.edge === "bottom"
    ? [{ v: "top", label: "Left" }, { v: "middle", label: "Center" }, { v: "bottom", label: "Right" }]
    : [{ v: "top", label: "Top" }, { v: "middle", label: "Middle" }, { v: "bottom", label: "Bottom" }];

  return (
    <div className="ds__panel">
        <div className="ds__panel-head">
          <h3>Feedback design</h3>
          <p>Style the feedback tab and the survey widget it opens.</p>
        </div>

        <DSSection title="Position & behaviour">
          <DSField label="Tab position">
            <DSSeg value={d.edge} onChange={(v) => set({ edge: v })} options={[
              { v: "left", label: "Left" }, { v: "right", label: "Right" }, { v: "bottom", label: "Bottom" }]}/>
          </DSField>
          <DSField label="Alignment">
            <DSSeg value={d.align} onChange={(v) => set({ align: v })} options={alignOpts}/>
          </DSField>
          <DSField label="Behaviour" hint="On scroll">
            <DSSeg value={d.sticky} onChange={(v) => set({ sticky: v })} options={[
              { v: true, label: "Sticky" }, { v: false, label: "Non-sticky" }]}/>
          </DSField>
        </DSSection>

        <DSSection title="Tab dimensions">
          <DSField label="Length"><DSNumber value={d.tabW} onChange={(v) => set({ tabW: v })} min={80} max={220}/></DSField>
          <DSField label="Thickness"><DSNumber value={d.tabH} onChange={(v) => set({ tabH: v })} min={32} max={64}/></DSField>
        </DSSection>

        <DSSection title="Widget dimensions">
          <DSField label="Width"><DSNumber value={d.widgetW} onChange={(v) => set({ widgetW: v })} min={300} max={440}/></DSField>
          <DSField label="Height"><DSNumber value={d.widgetH} onChange={(v) => set({ widgetH: v })} min={360} max={560}/></DSField>
        </DSSection>

        <DSSection title="Tab appearance">
          <DSField label="Background" stacked>
            <DSSwatches value={d.bg} onChange={(v) => set({ bg: v })} allowCustom colors={["#1B87E6", "#1B3380", "#16A34A", "#7C3AED", "#F59E0B", "#0F172A"]}/>
          </DSField>
          <DSField label="Text color" stacked>
            <DSSwatches value={d.fg} onChange={(v) => set({ fg: v })} allowCustom colors={["#FFFFFF", "#1B3380", "#0F172A"]}/>
          </DSField>
          <DSField label="Corner radius"><DSNumber value={d.radius} onChange={(v) => set({ radius: v })} min={0} max={24}/></DSField>
        </DSSection>

        <DSSection title="Logo">
          <DSLogoUpload value={d.logoUrl} onChange={(url) => set({ logoUrl: url, showLogo: url ? true : d.showLogo })}/>
          <DSField label="Show logo" hint="On tab & widget">
            <DSToggle value={d.showLogo} onChange={(v) => set({ showLogo: v })}/>
          </DSField>
        </DSSection>

        <DSSection title="Label">
          <DSField label="Feedback label" stacked>
            <input className="ds-text" value={d.label} maxLength={24} placeholder="Feedback" onChange={(e) => set({ label: e.target.value })}/>
          </DSField>
        </DSSection>

        <DSSection title="Typography">
          <DSField label="Font" stacked>
            <DSSelect value={d.font} onChange={(v) => set({ font: v })} options={[
              { v: "'Fira Sans', sans-serif", label: "Fira Sans" },
              { v: "Georgia, serif", label: "Georgia" },
              { v: "system-ui, sans-serif", label: "System UI" },
              { v: "'Courier New', monospace", label: "Courier" }]}/>
          </DSField>
          <DSField label="Size"><DSNumber value={d.fontSize} onChange={(v) => set({ fontSize: v })} min={12} max={22}/></DSField>
          <DSField label="Weight" stacked>
            <DSSeg value={d.fontWeight} onChange={(v) => set({ fontWeight: v })} options={[
              { v: 300, label: "Light" }, { v: 400, label: "Regular" }, { v: 500, label: "Medium" }, { v: 700, label: "Bold" }]}/>
          </DSField>
        </DSSection>

        <DSSection title="Close button">
          <DSField label="Show close button">
            <DSToggle value={d.closeShow} onChange={(v) => set({ closeShow: v })}/>
          </DSField>
          {d.closeShow && (
            <DSField label="Close color" stacked>
              <DSSwatches value={d.closeColor} onChange={(v) => set({ closeColor: v })} allowCustom colors={["#FFFFFF", "#1B3380", "#6B768C", "#0F172A"]}/>
            </DSField>
          )}
        </DSSection>

        <DSSection title="Animation">
          <DSField label="Widget entrance" stacked>
            <DSSeg value={d.anim} onChange={(v) => set({ anim: v })} options={[
              { v: "slide", label: "Slide" }, { v: "fade", label: "Fade" }, { v: "pop", label: "Pop" }, { v: "none", label: "None" }]}/>
          </DSField>
        </DSSection>
    </div>
  );
}

// ---------- feedback design (settings + preview) ----------
function FeedbackDesign({ design, setDesign, survey }) {
  return (
    <div className="ds">
      <FeedbackSettings design={design} setDesign={setDesign}/>
      <div className="ds__preview">
        <div className="ds__preview-head">
          <span className="ds__preview-title">Live preview</span>
          <span className="ds__preview-sub">Feedback intercept</span>
        </div>
        <FeedbackPreview d={design} survey={survey}/>
      </div>
    </div>
  );
}

Object.assign(window, { DSSection, DSField, DSSeg, DSSlider, DSNumber, DSSwatches, DSToggle, DSSelect, DSLogoUpload, FeedbackPreview, FeedbackSettings, FeedbackDesign });