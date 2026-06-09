// === Intercept prototype — preview.jsx ===
// Respondent preview: a mock browser with the live intercept popping up.

function firstQuestion(survey) {
  for (const b of survey.blocks) {
    for (const q of b.questions) {
      if (!["heading","paragraph","image"].includes(q.type)) return q;
    }
  }
  return null;
}

function RespondentQuestion({ q, answer, setAnswer }) {
  switch (q.type) {
    case "nps":
      return <NPSScale value={answer} onPick={setAnswer} compact labels={[q.left || "Not at all likely", q.right || "Extremely likely"]}/>;
    case "single":
    case "multi":
    case "dropdown":
      return (
        <div className="opt-list">
          {q.options.map((o, i) => (
            <div key={i} className="opt-row" onClick={() => setAnswer(i)}
              style={answer === i ? { borderColor: "var(--qp-blue)", background: "var(--qp-blue-50)" } : undefined}>
              <span className={"mark " + (q.type === "multi" ? "check" : "radio")}
                style={answer === i ? { borderColor: "var(--qp-blue)", background: "var(--qp-blue)" } : undefined}></span>
              {o}
            </div>
          ))}
        </div>
      );
    case "star":
      return (
        <div className="star-row" style={{ color: "var(--qp-yellow)" }}>
          {[0,1,2,3,4].map(i => (
            <span key={i} onClick={() => setAnswer(i)} style={{ cursor: "pointer" }}>
              <Icon name="star" size={34} fill={answer != null && i <= answer ? "currentColor" : "none"}
                style={answer != null && i <= answer ? undefined : { color: "var(--qp-gray-300)" }}/>
            </span>
          ))}
        </div>
      );
    case "smiley": {
      const faces = ["smiley-sad","smiley-sad","smiley-neutral","smiley","smiley"];
      return (
        <div className="smiley-row">
          {faces.map((f, i) => (
            <span key={i} className="face" onClick={() => setAnswer(i)}
              style={{ cursor: "pointer", opacity: answer == null || answer === i ? 1 : .35, transform: answer === i ? "scale(1.15)" : "none", transition: "all .15s" }}>
              <Icon name={f} size={34}/>
            </span>
          ))}
        </div>
      );
    }
    case "thumbs":
      return (
        <div className="thumbs-row">
          <span onClick={() => setAnswer("up")} style={{ cursor: "pointer", color: answer === "up" ? "var(--qp-success)" : undefined }}><Icon name="thumbs" size={34}/></span>
          <span onClick={() => setAnswer("down")} style={{ cursor: "pointer", color: answer === "down" ? "var(--qp-danger)" : undefined }}><Icon name="thumbs-down" size={34}/></span>
        </div>
      );
    case "comment":  return <textarea className="comment" rows="3" placeholder="Type your answer…" onChange={(e) => setAnswer(e.target.value)} style={{ background: "#fff" }}></textarea>;
    case "textrow":
    case "email":    return <input className="single-row" placeholder={q.type === "email" ? "name@email.com" : "Your answer…"} onChange={(e) => setAnswer(e.target.value)} style={{ background: "#fff" }}/>;
    default:
      return <div className="field-hint" style={{ color: "var(--fg-3)" }}>Preview not available for this question type.</div>;
  }
}

function PreviewOverlay({ survey, project, onClose }) {
  const [stage, setStage] = useState("ask"); // ask | thanks | dismissed
  const [answer, setAnswer] = useState(null);
  const q = firstQuestion(survey);
  const answered = answer !== null && answer !== "" && answer !== undefined;

  return (
    <div className="prev-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="prev-frame">
        <div className="prev-frame__bar">
          <div className="lights"><span></span><span></span><span></span></div>
          <div className="prev-frame__url">{project || "https://www.acmestore.com"}</div>
          <span style={{ fontSize: 12, color: "var(--fg-3)", marginRight: 4 }}>Live preview</span>
          <button className="prev-frame__close" onClick={onClose}><Icon name="x" size={18}/></button>
        </div>
        <div className="prev-frame__site">
          <div className="prev-mock">
            <div className="bar m"></div><div className="bar l"></div><div className="bar s"></div>
            <div className="block"></div>
            <div className="bar m"></div><div className="bar l"></div>
            <div className="block"></div>
          </div>

          {stage !== "dismissed" && (
            <div className="icpt">
              {stage === "thanks" ? (
                <div className="icpt-thanks">
                  <div className="ok"><Icon name="check" size={24}/></div>
                  <h3>Thanks for your feedback!</h3>
                  <p>Your response helps us improve.</p>
                </div>
              ) : (
                <React.Fragment>
                  <div className="icpt__head">
                    <span className="brand"><img src={(window.__resources && window.__resources.qpCube) || "assets/qp-cube.png"} alt="QP" onError={(e)=>{e.target.style.display='none';}}/> Quick survey</span>
                    <button className="x" onClick={() => setStage("dismissed")}><Icon name="x" size={14}/></button>
                  </div>
                  <div className="icpt__body">
                    <h3 className="icpt__title">{q ? q.text : survey.title}</h3>
                    {q && <RespondentQuestion q={q} answer={answer} setAnswer={setAnswer}/>}
                    <div className="icpt__foot">
                      <button className="icpt__skip" onClick={() => setStage("dismissed")}>No thanks</button>
                      <span className="sp"></span>
                      <button className="icpt__cta" disabled={!answered} style={!answered ? { opacity: .5, cursor: "not-allowed" } : undefined}
                        onClick={() => setStage("thanks")}>Submit</button>
                    </div>
                  </div>
                </React.Fragment>
              )}
            </div>
          )}

          {stage === "dismissed" && (
            <button className="icpt__cta" style={{ position: "absolute", right: 26, bottom: 26 }} onClick={() => { setStage("ask"); setAnswer(null); }}>
              Replay intercept
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { firstQuestion, RespondentQuestion, PreviewOverlay });
