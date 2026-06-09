// === Intercept prototype — screens.jsx ===

// ---- Small shared bits ----
function SortHeader({ label, num }) {
  return (
    <span className="th-sort">
      {label}
      <span className="sort"><Icon name="sort" size={14}/></span>
    </span>
  );
}

function RowMenu({ items, align = "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => setOpen(false), open);
  return (
    <span style={{ position: "relative" }} ref={ref}>
      <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }} title="More">
        <Icon name="more" size={18}/>
      </button>
      {open && (
        <div className="menu" style={{ top: "calc(100% + 4px)", [align]: 0 }} onClick={(e) => e.stopPropagation()}>
          {items.map((it, i) => it.divide
            ? <div key={i} className="menu__divide"></div>
            : (
              <div key={i} className={"menu__item" + (it.danger ? " danger" : "")}
                onClick={() => { setOpen(false); it.onClick(); }}>
                <Icon name={it.icon} size={16}/> {it.label}
              </div>
            ))}
        </div>
      )}
    </span>
  );
}

function Pager({ total }) {
  return (
    <div className="pager">
      <button title="Previous"><Icon name="chevron-left" size={18}/></button>
      <span>1–{total} of {total}</span>
      <button title="Next"><Icon name="chevron-right" size={18}/></button>
    </div>
  );
}

// ===================================================================
// Workspace selection
// ===================================================================
function WorkspaceList({ workspaces, onOpen }) {
  const [q, setQ] = useState("");
  const rows = workspaces.filter(w => w.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <React.Fragment>
      <div className="page-head">
        <h1>Workspaces</h1>
        <span className="help-dot" title="Workspaces group your projects by team or brand.">?</span>
      </div>
      <div className="toolbar">
        <button className="btn btn-primary"><Icon name="plus" size={16}/> New workspace</button>
        <div className="toolbar__spacer"></div>
        <div className="search">
          <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)}/>
        </div>
        <Pager total={rows.length}/>
      </div>
      <table className="tbl">
        <thead>
          <tr>
            <th><SortHeader label="Name"/></th>
            <th><SortHeader label="Projects"/></th>
            <th><SortHeader label="Members"/></th>
            <th><SortHeader label="Created"/></th>
            <th style={{ width: 60 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(w => (
            <tr key={w.id} onClick={() => onOpen(w)} style={{ cursor: "pointer" }}>
              <td>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                  <span className="proj-head__logo" style={{ width: 34, height: 34, fontSize: 14, background: w.color + "1a", color: w.color, borderColor: w.color + "33" }}>{w.initial}</span>
                  <span className="link cell-strong">{w.name}</span>
                </span>
              </td>
              <td>{w.projects.length}</td>
              <td>{w.members}</td>
              <td className="cell-url">{w.createdAt}</td>
              <td>
                <div className="row-actions">
                  <RowMenu items={[
                    { icon: "external", label: "Open", onClick: () => onOpen(w) },
                    { icon: "edit", label: "Rename", onClick: () => {} },
                    { divide: true },
                    { icon: "trash", label: "Delete", danger: true, onClick: () => {} },
                  ]}/>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
}

// ===================================================================
// Workspace home — Projects
// ===================================================================
function ProjectsHome({ workspace, onOpenProject, onCreate, onDeleteProject }) {
  const [q, setQ] = useState("");
  const projects = workspace.projects.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  const empty = workspace.projects.length === 0;

  return (
    <React.Fragment>
      <div className="page-head">
        <h1>Projects</h1>
        <span className="help-dot" title="Projects organize the websites you run intercepts on.">?</span>
      </div>

      {empty ? (
        <div className="empty">
          <div className="empty__art"><Icon name="folder" size={34}/></div>
          <h2>No projects yet</h2>
          <p>Projects help you organize websites and their intercept surveys. Create your first project to get started.</p>
          <button className="btn btn-primary" onClick={onCreate}><Icon name="plus" size={16}/> Create project</button>
        </div>
      ) : (
        <React.Fragment>
          <div className="toolbar">
            <button className="btn btn-primary" onClick={onCreate}><Icon name="plus" size={16}/> New project</button>
            <div className="toolbar__spacer"></div>
            <div className="search">
              <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)}/>
            </div>
            <Pager total={projects.length}/>
          </div>
          <table className="tbl">
            <thead>
              <tr>
                <th><SortHeader label="Name"/></th>
                <th><SortHeader label="URL"/></th>
                <th><SortHeader label="Status"/></th>
                <th className="num"><SortHeader label="Intercepts"/></th>
                <th className="num"><SortHeader label="Impressions"/></th>
                <th><SortHeader label="Last updated"/></th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} onClick={() => onOpenProject(p)} style={{ cursor: "pointer" }}>
                  <td><span className="link cell-strong">{p.name}</span></td>
                  <td className="cell-url">{p.url.replace(/^https?:\/\//, "")}</td>
                  <td><StatusPill status={p.status}/></td>
                  <td className="num">{p.intercepts.length}</td>
                  <td className="num">{p.impressions.toLocaleString()}</td>
                  <td className="cell-url">{p.updated}</td>
                  <td>
                    <div className="row-actions">
                      <RowMenu items={[
                        { icon: "external", label: "Open project", onClick: () => onOpenProject(p) },
                        { icon: "edit", label: "Rename", onClick: () => {} },
                        { icon: "copy", label: "Duplicate", onClick: () => {} },
                        { divide: true },
                        { icon: "trash", label: "Delete", danger: true, onClick: () => onDeleteProject(p) },
                      ]}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

const STATUS_LABEL = { active: "Active", notinstalled: "Not installed", draft: "Draft", paused: "Paused" };
function StatusPill({ status }) {
  return <span className={"pill pill-" + status}><span className="dot"></span>{STATUS_LABEL[status] || status}</span>;
}

// ===================================================================
// Project detail
// ===================================================================
function ProjectDetail({ project, onNewIntercept, onEditIntercept, onUpdateProject }) {
  const ints = project.intercepts;
  const empty = ints.length === 0;
  const totalResp = ints.reduce((s, i) => s + i.responses, 0);
  const live = ints.filter(i => i.status === "active").length;

  const togglePause = (ic) => {
    const next = { ...project, intercepts: ints.map(i =>
      i.id === ic.id ? { ...i, status: i.status === "active" ? "paused" : "active" } : i) };
    onUpdateProject(next);
  };
  const duplicate = (ic) => {
    const copy = { ...ic, id: uid("ic"), name: ic.name + " (copy)", status: "draft", responses: 0, updated: "just now" };
    onUpdateProject({ ...project, intercepts: [...ints, copy] });
  };
  const remove = (ic) => onUpdateProject({ ...project, intercepts: ints.filter(i => i.id !== ic.id) });

  return (
    <React.Fragment>
      <div className="proj-head">
        <div className="proj-head__logo">{project.name.charAt(0)}</div>
        <div className="proj-head__main">
          <div className="proj-head__title">
            <h1>{project.name}</h1>
            <StatusPill status={project.status}/>
          </div>
          <a className="proj-head__url" href={project.url} target="_blank" rel="noreferrer">
            <Icon name="globe" size={15}/> {project.url.replace(/^https?:\/\//, "")} <Icon name="external" size={13}/>
          </a>
          <div className="proj-head__meta">
            <span className="m"><Icon name="calendar" size={14}/> Created {project.created}</span>
            <span className="m"><Icon name="layers" size={14}/> <b>{ints.length}</b> intercepts</span>
            <span className="m"><Icon name="inbox" size={14}/> <b>{totalResp.toLocaleString()}</b> responses</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={onNewIntercept}><Icon name="plus" size={16}/> New intercept</button>
      </div>

      {!empty && (
        <div className="stats">
          <div className="stat"><div className="k">Live intercepts</div><div className="v">{live}</div></div>
          <div className="stat"><div className="k">Total responses</div><div className="v">{totalResp.toLocaleString()}</div></div>
          <div className="stat"><div className="k">Impressions</div><div className="v">{project.impressions.toLocaleString()}</div></div>
          <div className="stat"><div className="k">Avg. response rate</div><div className="v">{project.impressions ? ((totalResp / project.impressions) * 100).toFixed(1) : "0.0"}<small>%</small></div></div>
        </div>
      )}

      {empty ? (
        <div className="empty">
          <div className="empty__art"><Icon name="message" size={34}/></div>
          <h2>No intercepts yet</h2>
          <p>Create your first intercept survey and start collecting feedback from your website visitors.</p>
          <button className="btn btn-primary" onClick={onNewIntercept}><Icon name="plus" size={16}/> New intercept</button>
        </div>
      ) : (
        <React.Fragment>
          <h3 className="sec-label">Intercept surveys</h3>
          <table className="tbl">
            <thead>
              <tr>
                <th><SortHeader label="Survey name"/></th>
                <th><SortHeader label="Status"/></th>
                <th><SortHeader label="Trigger"/></th>
                <th className="num"><SortHeader label="Responses"/></th>
                <th><SortHeader label="Last updated"/></th>
                <th style={{ width: 60 }}></th>
              </tr>
            </thead>
            <tbody>
              {ints.map(ic => {
                const trig = TRIGGERS[ic.trigger] || TRIGGERS.load;
                return (
                  <tr key={ic.id} onClick={() => onEditIntercept(ic)} style={{ cursor: "pointer" }}>
                    <td><span className="link cell-strong">{ic.name}</span></td>
                    <td><StatusPill status={ic.status}/></td>
                    <td><span className="trig"><Icon name={trig.icon} size={15}/> {trig.label}</span></td>
                    <td className="num">{ic.responses.toLocaleString()}</td>
                    <td className="cell-url">{ic.updated}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" title="Edit" onClick={(e) => { e.stopPropagation(); onEditIntercept(ic); }}><Icon name="edit" size={17}/></button>
                        <button className="icon-btn" title={ic.status === "active" ? "Pause" : "Resume"} onClick={(e) => { e.stopPropagation(); togglePause(ic); }}>
                          <Icon name={ic.status === "active" ? "pause" : "play"} size={17}/>
                        </button>
                        <RowMenu items={[
                          { icon: "edit", label: "Edit survey", onClick: () => onEditIntercept(ic) },
                          { icon: "copy", label: "Duplicate", onClick: () => duplicate(ic) },
                          { icon: ic.status === "active" ? "pause" : "play", label: ic.status === "active" ? "Pause" : "Resume", onClick: () => togglePause(ic) },
                          { divide: true },
                          { icon: "trash", label: "Delete", danger: true, onClick: () => remove(ic) },
                        ]}/>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

// ===================================================================
// Wick UI modal shell — used by every dialog in the app
// ===================================================================
function WickModal({ title, subtitle, onClose, footer, children, width = 480 }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="wmodal" role="dialog" aria-modal="true" aria-label={title} style={{ maxWidth: width }}>
        <div className="wmodal__head">
          <div className="wmodal__ttl">
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="wmodal__close" onClick={onClose} aria-label="Close"><Icon name="x" size={18}/></button>
        </div>
        <div className="wmodal__body">{children}</div>
        {footer && <div className="wmodal__foot">{footer}</div>}
      </div>
    </div>
  );
}

// ===================================================================
// Create Project modal
// ===================================================================
function CreateProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState({});
  const nameRef = useRef(null);
  useEffect(() => { nameRef.current && nameRef.current.focus(); }, []);

  const urlOk = (v) => /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i.test(v.trim());
  const nameErr = !name.trim() ? "Project name is required." : "";
  const urlErr = !url.trim() ? "Website URL is required." : (!urlOk(url) ? "Enter a valid URL, e.g. https://www.acme.com" : "");
  const valid = !nameErr && !urlErr;

  const submit = () => {
    setTouched({ name: true, url: true });
    if (!valid) return;
    let u = url.trim();
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    onCreate({ name: name.trim(), url: u });
  };

  return (
    <WickModal title="Create project"
      subtitle="Projects are containers for websites and the intercept surveys associated with them."
      onClose={onClose} width={480}
      footer={<React.Fragment>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={!valid && (touched.name || touched.url)}>Create project</button>
      </React.Fragment>}>
      <div className="field">
        <label>Project name <span className="req">*</span></label>
        <input ref={nameRef} type="text" placeholder="Acme Store" value={name}
          className={touched.name && nameErr ? "invalid" : ""}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, name: true }))}
          onKeyDown={(e) => e.key === "Enter" && submit()}/>
        {touched.name && nameErr && <div className="err"><Icon name="alert" size={13}/> {nameErr}</div>}
      </div>
      <div className="field">
        <label>Website URL <span className="req">*</span></label>
        <div className="input-wrap">
          <span className="prefix"><Icon name="globe" size={16}/></span>
          <input type="text" placeholder="https://www.acme.com" value={url}
            className={"has-prefix " + (touched.url && urlErr ? "invalid" : "")}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, url: true }))}
            onKeyDown={(e) => e.key === "Enter" && submit()}/>
        </div>
        {touched.url && urlErr
          ? <div className="err"><Icon name="alert" size={13}/> {urlErr}</div>
          : <div className="hint">We'll install the intercept snippet on this domain.</div>}
      </div>
    </WickModal>
  );
}

// ===================================================================
// Create Intercept modal (name + type)
// ===================================================================
const INTERCEPT_TYPES = [
  { id: "feedback", name: "Feedback", icon: "message", desc: "A tab anchored to the edge of the page that opens a survey on click." },
  { id: "popup",    name: "Pop-up",   icon: "inbox",   desc: "A modal or slide-in card shown to targeted visitors." },
  { id: "embed",    name: "Embed",    icon: "layers",  desc: "A survey embedded inline within a section of your page." },
];

function CreateInterceptModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("popup");
  const [touched, setTouched] = useState(false);
  const nameRef = useRef(null);
  useEffect(() => { nameRef.current && nameRef.current.focus(); }, []);

  const nameErr = !name.trim() ? "Intercept name is required." : "";
  const valid = !nameErr && !!kind;
  const submit = () => { setTouched(true); if (!valid) return; onCreate({ name: name.trim(), kind }); };

  return (
    <WickModal title="Create intercept"
      subtitle="Name your intercept and choose how it appears to visitors on your site."
      onClose={onClose} width={540}
      footer={<React.Fragment>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={submit} disabled={touched && !valid}>Create intercept</button>
      </React.Fragment>}>
      <div className="field">
        <label>Intercept name <span className="req">*</span></label>
        <input ref={nameRef} type="text" placeholder="Post-purchase feedback" value={name}
          className={touched && nameErr ? "invalid" : ""}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched(true)}
          onKeyDown={(e) => e.key === "Enter" && submit()}/>
        {touched && nameErr && <div className="err"><Icon name="alert" size={13}/> {nameErr}</div>}
      </div>
      <div className="field">
        <label>Intercept type <span className="req">*</span></label>
        <div className="type-cards">
          {INTERCEPT_TYPES.map(t => (
            <div key={t.id} className={"type-card" + (kind === t.id ? " on" : "")} onClick={() => setKind(t.id)}>
              <span className="type-card__radio"></span>
              <span className="type-card__ic"><Icon name={t.icon} size={22}/></span>
              <span className="type-card__name">{t.name}</span>
              <span className="type-card__desc">{t.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </WickModal>
  );
}

Object.assign(window, { SortHeader, RowMenu, Pager, WorkspaceList, ProjectsHome, ProjectDetail, StatusPill, WickModal, CreateProjectModal, CreateInterceptModal });
