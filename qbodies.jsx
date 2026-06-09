// === Intercept prototype — qbodies.jsx ===
// Non-interactive previews of each question type, shown inside editor question cards.

// NPS sentiment colors (red detractors → amber passives → green promoters)
function npsColor(i) {
  const c = i <= 6 ? [239, 68, 68] : i <= 8 ? [245, 158, 11] : [22, 163, 74];
  return {
    solid: `rgb(${c[0]},${c[1]},${c[2]})`,
    soft: `rgba(${c[0]},${c[1]},${c[2]},0.10)`,
    border: `rgba(${c[0]},${c[1]},${c[2]},0.32)`,
    text: i <= 6 ? "#b91c1c" : i <= 8 ? "#b45309" : "#15803d",
  };
}

// Modern NPS scale — used in the editor (static) and respondent previews (interactive).
function NPSScale({ value, onPick, labels, compact }) {
  return (
    <div className={"nps2" + (compact ? " nps2--compact" : "")}>
      <div className="nps2__row">
        {Array.from({ length: 11 }, (_, i) => {
          const on = value === i;
          return (
            <button key={i} type="button"
              className={"nps2__btn" + (on ? " on" : "") + (onPick ? "" : " static")}
              onClick={onPick ? () => onPick(i) : undefined}>{i}</button>
          );
        })}
      </div>
      <div className="nps2__labels"><span>{labels[0]}</span><span>{labels[1]}</span></div>
    </div>
  );
}

function OptionEditor({ q, onChange, mark }) {
  const set = (i, v) => { const o = [...q.options]; o[i] = v; onChange({ ...q, options: o }); };
  const add = () => onChange({ ...q, options: [...q.options, "New option"] });
  const del = (i) => onChange({ ...q, options: q.options.filter((_, j) => j !== i) });
  return (
    <div className="opt-list">
      {q.options.map((o, i) => (
        <div className="opt-row" key={i}>
          <span className={"mark " + mark}></span>
          <input value={o} onChange={(e) => set(i, e.target.value)}/>
          {q.options.length > 1 && (
            <button className="icon-btn del" title="Remove" onClick={() => del(i)}><Icon name="x" size={14}/></button>
          )}
        </div>
      ))}
      <span className="opt-add" onClick={add}><Icon name="plus" size={14}/> Add option</span>
    </div>
  );
}

function QBody({ q, onChange }) {
  switch (q.type) {
    case "single":   return <OptionEditor q={q} onChange={onChange} mark="radio"/>;
    case "multi":    return <OptionEditor q={q} onChange={onChange} mark="check"/>;
    case "dropdown":
      return (
        <select className="dd" disabled>
          <option>Select an option…</option>
          {q.options.map((o, i) => <option key={i}>{o}</option>)}
        </select>
      );
    case "comment":  return <textarea className="comment" rows="3" placeholder="Respondent's answer…" disabled></textarea>;
    case "textrow":  return <input className="single-row" placeholder="Respondent's short answer…" disabled/>;
    case "email":    return <input className="single-row" placeholder="name@email.com" disabled/>;
    case "contact":
      return (
        <div className="contact-grid">
          <div className="ci">First name</div><div className="ci">Last name</div>
          <div className="ci full">Email address</div><div className="ci full">Phone (optional)</div>
        </div>
      );
    case "star":
      return <div className="star-row">{[0,1,2,3,4].map(i => <Icon key={i} name="star" size={30} fill={i < 2 ? "currentColor" : "none"} style={i < 2 ? { color: "var(--qp-yellow)" } : undefined}/>)}</div>;
    case "smiley":
      return (
        <div className="smiley-row">
          <span className="face"><Icon name="smiley-sad" size={32}/></span>
          <span className="face"><Icon name="smiley-sad" size={32}/></span>
          <span className="face"><Icon name="smiley-neutral" size={32}/></span>
          <span className="face"><Icon name="smiley" size={32}/></span>
          <span className="face"><Icon name="smiley" size={32}/></span>
        </div>
      );
    case "thumbs":
      return <div className="thumbs-row"><Icon name="thumbs" size={30}/><Icon name="thumbs-down" size={30}/></div>;
    case "social":
      return (
        <div className="thumbs-row" style={{ color: "var(--qp-blue)" }}>
          <Icon name="heart-share" size={26}/><Icon name="external" size={26}/><Icon name="copy" size={26}/>
        </div>
      );
    case "nps":
      return <NPSScale labels={[q.left || "Not at all likely", q.right || "Extremely likely"]}/>;
    case "textslider":
    case "numslider":
      return (
        <div className="slider-prev">
          <div className="track"><div className="fill"></div><div className="knob"></div></div>
          <div className="ticks"><span>{q.left || q.min || 0}</span><span>{q.right || q.max || 10}</span></div>
        </div>
      );
    case "heading":   return <div className="static-head">{q.text || "Section heading"}</div>;
    case "paragraph": return <div className="static-text">{q.text}</div>;
    case "image":
      return (
        <div style={{ border: "1px dashed var(--border-2)", borderRadius: 10, padding: 28, textAlign: "center", color: "var(--fg-4)", background: "var(--bg-alt)", maxWidth: 420 }}>
          <Icon name="image" size={28}/><div style={{ marginTop: 8, fontSize: 13 }}>Click to upload an image</div>
        </div>
      );
    default: return null;
  }
}

Object.assign(window, { npsColor, NPSScale, OptionEditor, QBody });
