// === Intercept prototype — rules.jsx ===
// Two full-width editor sections: Settings (behaviour) + Rules (targeting).
// Reuses the DS control primitives (DSSection/DSField/DSToggle/...) from design.jsx.

// ---- small helpers ----
function FormShell({ icon, title, sub, children }) {
  return (
    <div className="canvas ed-formwrap">
      <div className="ed-form">
        <div className="ed-form__head">
          <span className="ed-form__icon"><Icon name={icon} size={22}/></span>
          <div>
            <h1>{title}</h1>
            <p>{sub}</p>
          </div>
        </div>
        <div className="ed-form__card">{children}</div>
      </div>
    </div>
  );
}

function ChipToggle({ options, value, onChange }) {
  const toggle = (v) => onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  return (
    <div className="chipset">
      {options.map(o => (
        <button key={o.v} className={"chip" + (value.includes(o.v) ? " on" : "")} onClick={() => toggle(o.v)}>
          {o.icon && <Icon name={o.icon} size={15}/>}{o.label}
        </button>
      ))}
    </div>
  );
}

// ===================================================================
// Targeting criteria builder
// ===================================================================
const OPS = {
  is: "is", is_not: "is not", clicked: "is clicked", visible: "is visible",
  equals: "equals", not_equals: "not equals", includes: "includes", excludes: "excludes",
  gt: "greater than", gte: "at least", lt: "less than",
};

// Each criterion: label, group, allowed operators, and a value-input spec.
const CRITERIA = {
  country:   { label: "Country",          group: "Audience",    ops: ["is", "is_not"],                          value: { kind: "select", options: ["United States", "United Kingdom", "Canada", "Germany", "France", "India", "Australia", "Japan", "Brazil"] } },
  usertype:  { label: "User type",        group: "Audience",    ops: ["is"],                                    value: { kind: "select", options: ["New visitor", "Returning visitor"] } },
  ip:        { label: "IP address",       group: "Audience",    ops: ["is", "is_not"],                          value: { kind: "text", placeholder: "203.0.113.0" } },
  browser:   { label: "Browser type",     group: "Technology",  ops: ["is", "is_not"],                          value: { kind: "select", options: ["Chrome", "Firefox", "Safari", "Edge", "Opera"] } },
  device:    { label: "Device type",      group: "Technology",  ops: ["is", "is_not"],                          value: { kind: "select", options: ["Desktop", "Tablet", "Mobile"] } },
  os:        { label: "Operating system", group: "Technology",  ops: ["is", "is_not"],                          value: { kind: "select", options: ["Windows", "macOS", "iOS", "Android", "Linux"] } },
  pageurl:   { label: "Page URL",         group: "Page",        ops: ["equals", "not_equals", "includes", "excludes"], value: { kind: "text", prefix: "https://www.acmestore.com", placeholder: "/pricing" } },
  urlparam:  { label: "URL parameter",    group: "Page",        ops: ["equals", "not_equals", "includes", "excludes"], value: { kind: "kv", keyPh: "utm_source", valPh: "google" } },
  scroll:    { label: "Scroll depth",     group: "Behaviour",   ops: ["gte", "equals"],                         value: { kind: "percent" } },
  session:   { label: "Session duration", group: "Behaviour",   ops: ["gt", "lt"],                              value: { kind: "number", unit: "sec" } },
  pages:     { label: "Pages visited",    group: "Behaviour",   ops: ["gt", "equals", "lt"],                    value: { kind: "number", unit: "pages" } },
  visits:    { label: "Total visits",     group: "Behaviour",   ops: ["gt", "equals", "lt"],                    value: { kind: "number", unit: "visits" } },
  button:    { label: "Button click",     group: "Interaction", ops: ["clicked"],                               value: { kind: "text", prefix: "#", placeholder: "pay" } },
  selector:  { label: "HTML selector",    group: "Interaction", ops: ["clicked", "visible"],                    value: { kind: "text", placeholder: "#signup-button" } },
  datalayer: { label: "Data layer",       group: "Advanced",    ops: ["equals", "not_equals"],                  value: { kind: "kv", keyPh: "user.plan", valPh: "premium" } },
};
const CRITERIA_GROUPS = ["Audience", "Technology", "Page", "Behaviour", "Interaction", "Advanced"];

function defaultCondFor(type) {
  const c = CRITERIA[type];
  const op = c.ops[0];
  const v = c.value;
  let value = "", key = "";
  if (v.kind === "select") value = v.options[0];
  else if (v.kind === "percent") value = 50;
  else if (v.kind === "number") value = type === "session" ? 30 : (type === "visits" ? 2 : 3);
  else if (v.kind === "kv") { key = ""; value = ""; }
  return { id: uid("cond"), type, op, value, key };
}

function CondValue({ crit, cond, onChange }) {
  const v = crit.value;
  if (v.kind === "select") {
    return (
      <select className="cond__input" value={cond.value} onChange={(e) => onChange({ value: e.target.value })}>
        {v.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (v.kind === "number") {
    return (
      <span className="cond__num">
        <input type="number" value={cond.value} onChange={(e) => onChange({ value: e.target.value === "" ? "" : Number(e.target.value) })}
          onBlur={(e) => { let n = Number(e.target.value); if (Number.isNaN(n)) n = 0; onChange({ value: Math.max(0, n) }); }}/>
        <span className="cond__unit">{v.unit}</span>
      </span>
    );
  }
  if (v.kind === "percent") {
    return (
      <span className="cond__num">
        <input type="number" min={0} max={100} value={cond.value} onChange={(e) => onChange({ value: e.target.value === "" ? "" : Number(e.target.value) })}
          onBlur={(e) => { let n = Number(e.target.value); if (Number.isNaN(n)) n = 0; onChange({ value: Math.max(0, Math.min(100, n)) }); }}/>
        <span className="cond__unit">%</span>
      </span>
    );
  }
  if (v.kind === "kv") {
    return (
      <span className="cond__kv">
        <input className="cond__input" value={cond.key} placeholder={v.keyPh} onChange={(e) => onChange({ key: e.target.value })}/>
        <span className="cond__kvsep">=</span>
        <input className="cond__input" value={cond.value} placeholder={v.valPh} onChange={(e) => onChange({ value: e.target.value })}/>
      </span>
    );
  }
  // text
  return (
    <span className={"cond__text" + (v.prefix ? " has-prefix" : "")}>
      {v.prefix && <span className="cond__prefix">{v.prefix}</span>}
      <input className="cond__input" value={cond.value} placeholder={v.placeholder} onChange={(e) => onChange({ value: e.target.value })}/>
    </span>
  );
}

function ConditionRow({ cond, onChange, onRemove }) {
  const crit = CRITERIA[cond.type];
  const changeType = (type) => onChange(defaultCondFor(type));
  return (
    <div className="cond">
      <select className="cond__type" value={cond.type} onChange={(e) => changeType(e.target.value)}>
        {CRITERIA_GROUPS.map(g => (
          <optgroup key={g} label={g}>
            {Object.entries(CRITERIA).filter(([, c]) => c.group === g).map(([id, c]) => (
              <option key={id} value={id}>{c.label}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <select className="cond__op" value={cond.op} onChange={(e) => onChange({ ...cond, op: e.target.value })}>
        {crit.ops.map(o => <option key={o} value={o}>{OPS[o]}</option>)}
      </select>
      <CondValue crit={crit} cond={cond} onChange={(patch) => onChange({ ...cond, ...patch })}/>
      <button className="cond__del" title="Remove condition" onClick={onRemove}><Icon name="trash" size={16}/></button>
    </div>
  );
}

function ConditionsBuilder({ rules, set }) {
  const conditions = rules.conditions || [];
  const update = (id, next) => set({ conditions: conditions.map(c => c.id === id ? next : c) });
  const remove = (id) => set({ conditions: conditions.filter(c => c.id !== id) });
  const add = () => set({ conditions: [...conditions, defaultCondFor("country")] });
  return (
    <div className="conds">
      <div className="conds__match">
        <span>Show this intercept to visitors who match</span>
        <span className="wick-select wick-select--inline">
          <select value={rules.matchType} onChange={(e) => set({ matchType: e.target.value })}>
            <option value="all">all</option>
            <option value="any">any</option>
          </select>
        </span>
        <span>of these conditions</span>
      </div>

      {conditions.length === 0 && (
        <div className="conds__empty">No conditions yet — this intercept shows to everyone. Add a condition to narrow targeting.</div>
      )}

      <div className="conds__list">
        {conditions.map((c, i) => (
          <React.Fragment key={c.id}>
            {i > 0 && <span className="conds__joiner">{rules.matchType === "all" ? "and" : "or"}</span>}
            <ConditionRow cond={c} onChange={(next) => update(c.id, next)} onRemove={() => remove(c.id)}/>
          </React.Fragment>
        ))}
      </div>

      <button className="btn btn-secondary cond-add" onClick={add}><Icon name="plus" size={16}/> Add condition</button>
    </div>
  );
}

// ---- Settings (behaviour) — flat list matching the Intercept settings reference ----
function ISetField({ value, onChange, max }) {
  return (
    <input className="iset__field" type="number" min={0} max={max} value={value}
      onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      onBlur={(e) => { let n = Number(e.target.value); if (Number.isNaN(n)) n = 0; onChange(Math.max(0, max != null ? Math.min(max, n) : n)); }}/>
  );
}

function InterceptSettings({ settings, setSettings, onSave }) {
  const s = settings;
  const set = (patch) => setSettings({ ...s, ...patch });
  const [savedFlash, setSavedFlash] = useState(false);
  const save = () => { if (onSave) onSave(); setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1800); };

  const rows = [
    { label: "Allow multiple response", control: <DSToggle value={s.allowMultiple} onChange={(v) => set({ allowMultiple: v })}/> },
    { label: "Trigger delay", info: "Seconds to wait before the intercept appears.", control: <ISetField value={s.triggerDelay} onChange={(v) => set({ triggerDelay: v })} max={300}/> },
    { label: "Display Sample Rate", info: "Percentage of eligible visitors who are shown the intercept.", control: <ISetField value={s.sampleRate} onChange={(v) => set({ sampleRate: v })} max={100}/> },
    { label: "Auto language selection", control: <DSToggle value={s.autoLanguage} onChange={(v) => set({ autoLanguage: v })}/> },
    { label: "Auto close on completion", control: <DSToggle value={s.autoClose} onChange={(v) => set({ autoClose: v })}/> },
  ];

  return (
    <div className="iset">
      <div className="iset__inner">
        <div className="iset__rule"></div>
        {rows.map((r, i) => (
          <div className="iset__row" key={i}>
            <span className="iset__label">
              {r.label}
              {r.info && <span className="iset__info" title={r.info}>i</span>}
            </span>
            <div className="iset__control">{r.control}</div>
          </div>
        ))}
        <div className="iset__rule"></div>
        <div className="iset__actions">
          <button className={"btn btn-primary" + (savedFlash ? " is-saved" : "")} onClick={save}>
            {savedFlash ? <React.Fragment><Icon name="check" size={16}/> Saved</React.Fragment> : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Rules (targeting) ----
function InterceptRules({ rules, setRules, onSave }) {
  const r = rules;
  const set = (patch) => setRules({ ...r, ...patch });
  const [savedFlash, setSavedFlash] = useState(false);
  const save = () => { if (onSave) onSave(); setSavedFlash(true); setTimeout(() => setSavedFlash(false), 1800); };
  const count = (r.conditions || []).length;
  return (
    <FormShell icon="filter" title="Rules" sub="Choose who sees this intercept. Add one or more targeting conditions to narrow your audience.">
      <div className="rules-sec">
        <div className="rules-sec__head">
          <h2>Targeting conditions</h2>
          <span className="rules-sec__count">{count} {count === 1 ? "condition" : "conditions"}</span>
        </div>
        <ConditionsBuilder rules={r} set={set}/>
      </div>
      <div className="rules-foot">
        <button className={"btn btn-primary" + (savedFlash ? " is-saved" : "")} onClick={save}>
          {savedFlash ? <React.Fragment><Icon name="check" size={16}/> Saved</React.Fragment> : "Save changes"}
        </button>
      </div>
    </FormShell>
  );
}

Object.assign(window, { FormShell, ChipToggle, OPS, CRITERIA, CRITERIA_GROUPS, defaultCondFor, CondValue, ConditionRow, ConditionsBuilder, ISetField, InterceptSettings, InterceptRules });
