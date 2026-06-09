// === Intercept prototype — mapping.jsx ===
// "Mapping" top tab: data-mapping table + "Add variable mapping" modal.
// Maps a visitor's runtime context (visitor id, url, etc.) into custom variables.

// ---------- sortable column header ----------
function MapTh({ label, col, sort, setSort, style }) {
  const active = sort.col === col;
  const next = () => setSort({ col, dir: active && sort.dir === "asc" ? "desc" : "asc" });
  return (
    <th className={"map-th" + (active ? " on" : "")} style={style} onClick={next}>
      <span>{label}</span>
      <span className="map-th__arrows" aria-hidden="true">
        <i className={active && sort.dir === "asc" ? "on" : ""}>▲</i>
        <i className={active && sort.dir === "desc" ? "on" : ""}>▼</i>
      </span>
    </th>
  );
}

// ---------- a single dropdown row inside the modal ----------
function VarMapRow({ row, onChange, usedVars }) {
  return (
    <div className="vmap-row">
      <label className="vmap-cell">
        <select className="vmap-select" value={row.variable}
          onChange={(e) => onChange({ ...row, variable: e.target.value })}>
          <option value="">Custom variable</option>
          {CUSTOM_VARS.map(v => (
            <option key={v} value={v} disabled={usedVars.has(v) && v !== row.variable}>{v}</option>
          ))}
        </select>
      </label>
      <label className="vmap-cell">
        <select className="vmap-select" value={row.dataType}
          onChange={(e) => onChange({ ...row, dataType: e.target.value })}>
          <option value="">Data type</option>
          {MAPPING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </label>
      <label className="vmap-cell vmap-cell--value">
        <input className="vmap-input" placeholder="Value" value={row.value}
          onChange={(e) => onChange({ ...row, value: e.target.value })}/>
      </label>
    </div>
  );
}

// ---------- Add variable mapping modal ----------
function AddMappingModal({ existing, onClose, onSave }) {
  const blank = () => ({ id: uid("vm"), variable: "", dataType: "", value: "" });
  const [rows, setRows] = useState(() => Array.from({ length: 5 }, blank));
  const usedCount = existing.length;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const usedVars = useMemo(() => {
    const s = new Set(existing.map(r => r.name));
    rows.forEach(r => r.variable && s.add(r.variable));
    return s;
  }, [rows, existing]);

  const setRow = (id, nr) => setRows(rows.map(r => r.id === id ? nr : r));
  const addMore = () => setRows([...rows, blank()]);

  const save = () => {
    const filled = rows.filter(r => r.variable && r.dataType)
      .map(r => ({ id: uid("map"), name: r.variable, type: r.dataType, mapping: r.value ? "manual" : "auto" }));
    onSave(filled);
  };

  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="vmap" role="dialog" aria-modal="true" aria-label="Add variable mapping">
        <div className="vmap__head">
          <h2>Add variable mapping</h2>
          <button className="vmap__close" onClick={onClose} aria-label="Close"><Icon name="x" size={18}/></button>
        </div>
        <div className="vmap__body">
          <div className="vmap__note">
            <span className="vmap__note-ic"><Icon name="info" size={15}/></span>
            <span><b>{usedCount}</b> / {CUSTOM_VAR_TOTAL} custom variables used</span>
          </div>
          <div className="vmap__rows">
            {rows.map(r => (
              <VarMapRow key={r.id} row={r} usedVars={usedVars} onChange={(nr) => setRow(r.id, nr)}/>
            ))}
          </div>
        </div>
        <div className="vmap__foot">
          <button className="vmap__more" onClick={addMore}>Add more variables</button>
          <button className="btn btn-primary" onClick={save}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Mapping tab ----------
function InterceptMapping({ mapping, setMapping }) {
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ col: "name", dir: "asc" });

  const rows = useMemo(() => {
    let r = mapping.filter(m =>
      !query ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.type.toLowerCase().includes(query.toLowerCase()));
    r = [...r].sort((a, b) => {
      const av = String(a[sort.col]).toLowerCase(), bv = String(b[sort.col]).toLowerCase();
      return (av < bv ? -1 : av > bv ? 1 : 0) * (sort.dir === "asc" ? 1 : -1);
    });
    return r;
  }, [mapping, query, sort]);

  const onSave = (filled) => {
    if (filled.length) {
      // de-dupe by variable name, last write wins
      const byName = new Map(mapping.map(m => [m.name, m]));
      filled.forEach(f => byName.set(f.name, f));
      setMapping(Array.from(byName.values()));
    }
    setModal(false);
  };

  const remove = (id) => setMapping(mapping.filter(m => m.id !== id));

  return (
    <div className="mapping">
      <div className="mapping__inner">
        <div className="mapping__bar">
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            <Icon name="plus" size={16}/> Add data mapping
          </button>
          <div className="mapping__search">
            <Icon name="search" size={16}/>
            <input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)}/>
          </div>
        </div>

        <div className="map-table">
          <table>
            <thead>
              <tr>
                <MapTh label="Name" col="name" sort={sort} setSort={setSort}/>
                <MapTh label="Type" col="type" sort={sort} setSort={setSort}/>
                <MapTh label="Mapping" col="mapping" sort={sort} setSort={setSort}/>
                <th className="map-th map-th--act" aria-label="Actions"></th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td className="map-empty" colSpan={4}>No data mappings yet. Click “Add data mapping” to create one.</td></tr>
              ) : rows.map(m => (
                <tr key={m.id} className="map-row">
                  <td className="map-name">{m.name}</td>
                  <td>{m.type}</td>
                  <td><span className={"map-pill map-pill--" + m.mapping}>{m.mapping}</span></td>
                  <td className="map-act">
                    <button className="icon-btn" title="Remove" onClick={() => remove(m.id)}><Icon name="trash" size={16}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && <AddMappingModal existing={mapping} onClose={() => setModal(false)} onSave={onSave}/>}
    </div>
  );
}

Object.assign(window, { MapTh, VarMapRow, AddMappingModal, InterceptMapping });
