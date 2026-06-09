// === Intercept prototype — editor.jsx ===
// Survey editor matching the QuestionPro builder reference:
//  top tabs (Edit / Settings / Integrations), a Builder/Design/Notifications rail,
//  light canvas, per-question Validation·Logic·Settings, inter-question separators.

// ---- Inline contentEditable helper ----
function CE({ tag = "div", html, onText, className, ph }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current && ref.current.innerText !== html) ref.current.innerText = html; }, [html]);
  const Tag = tag;
  return (
    <Tag ref={ref} className={className} data-ph={ph} contentEditable suppressContentEditableWarning
      onBlur={(e) => onText(e.currentTarget.innerText)}
      onKeyDown={(e) => { if (e.key === "Enter" && tag !== "p") { e.preventDefault(); e.currentTarget.blur(); } }}/>
  );
}

// ---- Type picker menu (opens from an Add Question caret) ----
function TypeMenu({ onPick, onClose, style }) {
  const byGroup = {};
  Object.entries(QTYPES).forEach(([id, t]) => { (byGroup[t.group] = byGroup[t.group] || []).push({ id, ...t }); });
  return (
    <div className="type-picker" style={style} onClick={(e) => e.stopPropagation()}>
      {PALETTE_GROUPS.map(g => (
        <div className="type-picker__group" key={g}>
          <div className="type-picker__label">{g}</div>
          {byGroup[g].map(it => (
            <div key={it.id} className="type-picker__item" onClick={() => { onPick(it.id); onClose(); }}>
              <span className="ic"><Icon name={it.icon} size={16}/></span>{it.label}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ---- Centered "Add Question" split button — opens the palette drawer ----
function AddQuestionBar({ onAdd, withTools, onOpenPalette }) {
  const open = () => onOpenPalette(onAdd);
  return (
    <div className={"aqbar" + (withTools ? " aqbar--sep" : "")}>
      <span className="aqbar__btn">
        <button className="aq-main" onClick={open}><Icon name="plus" size={15}/> Add Question</button>
        <button className="aq-caret" onClick={open}><Icon name="chevron-down" size={15}/></button>
      </span>
      {withTools && (
        <div className="aqbar__tools">
          <button className="sep-btn"><Icon name="columns" size={14}/> Page Break</button>
          <button className="sep-btn"><Icon name="minus-box" size={14}/> Remove Separator</button>
          <button className="sep-btn"><Icon name="split" size={14}/> Split Block</button>
        </div>
      )}
    </div>
  );
}

// ---- Question type palette drawer (slides in from the left, dims the canvas) ----
function PaletteDrawer({ onPick, onClose }) {
  const byGroup = {};
  Object.entries(QTYPES).forEach(([id, t]) => { (byGroup[t.group] = byGroup[t.group] || []).push({ id, ...t }); });
  const columns = [["Multiple Choice", "Graphical Rating", "Static Content"], ["Text"]];
  return (
    <div className="palette-overlay">
      <aside className="palette-drawer">
        <div className="palette-cols">
          {columns.map((groups, ci) => (
            <div className="pal2-col" key={ci}>
              {groups.map(g => (
                <div className="pal2-group" key={g}>
                  <h4>{g}</h4>
                  {(byGroup[g] || []).map(it => (
                    <div className="pal2-item" key={it.id} onClick={() => onPick(it.id)}>
                      <span className="ic"><Icon name={it.icon} size={20}/></span>
                      <span>{it.label}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </aside>
      <div className="palette-scrim" onClick={onClose}></div>
    </div>
  );
}

// ---- Per-question control cluster (Validation · Logic · Settings · kebab) ----
function QuestionTools({ q, onDuplicate, onDelete, onSwitchType }) {
  const [open, setOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const ref = useRef(null);
  useOutside(ref, () => { setOpen(false); setTypeOpen(false); }, open);
  return (
    <div className="qsection__tools">
      <span className="qlink">Validation</span>
      <span className="qlink">Logic</span>
      <span className="qlink">Settings</span>
      <span style={{ position: "relative" }} ref={ref}>
        <button className="icon-btn" onClick={() => setOpen(o => !o)}><Icon name="more" size={18}/></button>
        {open && !typeOpen && (
          <div className="menu" style={{ top: "calc(100% + 4px)", right: 0, minWidth: 180 }}>
            <div className="menu__item" onClick={() => { setOpen(false); onDuplicate(); }}><Icon name="copy" size={16}/> Duplicate</div>
            <div className="menu__item" onClick={() => setTypeOpen(true)}><Icon name="refresh" size={16}/> Change type</div>
            <div className="menu__divide"></div>
            <div className="menu__item danger" onClick={() => { setOpen(false); onDelete(); }}><Icon name="trash" size={16}/> Delete</div>
          </div>
        )}
        {open && typeOpen && (
          <TypeMenu onPick={(t) => onSwitchType(t)} onClose={() => { setOpen(false); setTypeOpen(false); }}
            style={{ top: "calc(100% + 4px)", right: 0 }}/>
        )}
      </span>
    </div>
  );
}

// ---- A single question section (no card border; gutter Qn label) ----
function QuestionSection({ q, index, onChange, onDelete, onDuplicate, onSwitchType }) {
  const isStatic = q.type === "heading" || q.type === "paragraph" || q.type === "image";
  return (
    <div className="qsection">
      {!isStatic && <span className="qn">Q{index}</span>}
      <QuestionTools q={q} onDuplicate={onDuplicate} onDelete={onDelete} onSwitchType={onSwitchType}/>
      <CE tag="div" className="qtext" html={q.text} ph="Type your question…" onText={(t) => onChange({ ...q, text: t })}/>
      <div className="qbody"><QBody q={q} onChange={onChange}/></div>
    </div>
  );
}

// ---- A block ----
function Block({ block, onChange, onDelete, numberOffset, onOpenPalette }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const setQuestions = (qs) => onChange({ ...block, questions: qs });
  const addAt = (i, type) => { const qs = [...block.questions]; qs.splice(i, 0, defaultQuestion(type)); setQuestions(qs); };
  const updateQ = (qid, nq) => setQuestions(block.questions.map(q => q.id === qid ? nq : q));
  const switchType = (qid, t) => setQuestions(block.questions.map(q => q.id === qid
    ? { ...defaultQuestion(t), id: q.id, text: q.text } : q));
  const delQ = (qid) => setQuestions(block.questions.filter(q => q.id !== qid));
  const dupQ = (q) => {
    const i = block.questions.findIndex(x => x.id === q.id);
    const copy = { ...q, id: uid("q"), options: q.options ? [...q.options] : undefined };
    const qs = [...block.questions]; qs.splice(i + 1, 0, copy); setQuestions(qs);
  };
  const empty = block.questions.length === 0;

  return (
    <div className={"block" + (block.collapsed ? " collapsed" : "")}>
      <div className="block__head">
        <CE tag="span" className="block__name" html={block.name} onText={(t) => onChange({ ...block, name: t })}/>
        <div className="block__spacer"></div>
        <button className="icon-btn" title={block.collapsed ? "Expand" : "Collapse"} onClick={() => onChange({ ...block, collapsed: !block.collapsed })}>
          <span className="block__chev"><Icon name="chevrons" size={18}/></span>
        </button>
        <span style={{ position: "relative" }} ref={menuRef}>
          <button className="icon-btn" onClick={() => setMenuOpen(o => !o)}><Icon name="more-v" size={18}/></button>
          {menuOpen && (
            <div className="menu" style={{ top: "calc(100% + 4px)", right: 0 }}>
              <div className="menu__item" onClick={() => { setMenuOpen(false); addAt(block.questions.length, "single"); }}><Icon name="plus" size={16}/> Add question</div>
              <div className="menu__item" onClick={() => { setMenuOpen(false); onChange({ ...block, collapsed: !block.collapsed }); }}><Icon name={block.collapsed ? "chevron-down" : "chevron-up"} size={16}/> {block.collapsed ? "Expand" : "Collapse"}</div>
              <div className="menu__divide"></div>
              <div className="menu__item danger" onClick={() => { setMenuOpen(false); onDelete(); }}><Icon name="trash" size={16}/> Delete block</div>
            </div>
          )}
        </span>
      </div>

      <div className="block__body">
        {empty ? (
          <div className="block__empty">
            <AddQuestionBar onAdd={(t) => addAt(0, t)} onOpenPalette={onOpenPalette}/>
            <p>This block doesn't have any questions yet</p>
            <span className="block__ai"><Icon name="sparkle" size={16}/> Build with QuestionPro AI</span>
          </div>
        ) : (
          <React.Fragment>
            <AddQuestionBar onAdd={(t) => addAt(0, t)} onOpenPalette={onOpenPalette}/>
            {block.questions.map((q, i) => (
              <React.Fragment key={q.id}>
                <QuestionSection q={q} index={numberOffset + i + 1}
                  onChange={(nq) => updateQ(q.id, nq)}
                  onSwitchType={(t) => switchType(q.id, t)}
                  onDelete={() => delQ(q.id)}
                  onDuplicate={() => dupQ(q)}/>
                <AddQuestionBar withTools onAdd={(t) => addAt(i + 1, t)} onOpenPalette={onOpenPalette}/>
              </React.Fragment>
            ))}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

// ---- Placeholder panel for non-Builder sections ----
function SectionPanel({ icon, title, body }) {
  return (
    <div className="ph-panel">
      <div className="ph-panel__art"><Icon name={icon} size={30}/></div>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

// ---- Builder canvas ----
function BuilderCanvas({ survey, mutate, onOpenPalette }) {
  const setBlock = (bid, nb) => mutate({ ...survey, blocks: survey.blocks.map(b => b.id === bid ? nb : b) });
  const delBlock = (bid) => mutate({ ...survey, blocks: survey.blocks.filter(b => b.id !== bid) });
  const addBlock = (atEnd) => {
    const nb = { id: uid("b"), name: `Block ${survey.blocks.length + 1}`, collapsed: false, questions: [] };
    mutate({ ...survey, blocks: atEnd ? [...survey.blocks, nb] : [nb, ...survey.blocks] });
  };
  let offset = 0;
  const offsets = survey.blocks.map(b => { const o = offset; offset += b.questions.length; return o; });

  return (
    <div className="canvas__col">
      <div className="survey-card">
        <button className="survey-card__logo"><Icon name="image" size={15}/> Add Logo</button>
        <CE tag="div" className="survey-title" html={survey.title} onText={(t) => mutate({ ...survey, title: t })}/>
      </div>

      <div className="add-block" onClick={() => addBlock(false)}>
        <span className="ic"><Icon name="plus" size={18}/></span> Add Block
      </div>

      {survey.blocks.map((b, i) => (
        <React.Fragment key={b.id}>
          <Block block={b} numberOffset={offsets[i]} onChange={(nb) => setBlock(b.id, nb)} onDelete={() => delBlock(b.id)} onOpenPalette={onOpenPalette}/>
          <div className="add-block" onClick={() => addBlock(true)}>
            <span className="ic"><Icon name="plus" size={18}/></span> Add Block
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ---- Editor top bar ----
function EditorBar({ tab, setTab, mode, setMode, onBack, onPreview, onPublish }) {
  const tabs = [
    { id: "builder", name: "Builder", icon: "list" },
    { id: "design", name: "Design", icon: "palette" },
    { id: "notifications", name: "Notifications", icon: "bell" },
    { id: "settings", name: "Settings", icon: "gear" },
    { id: "rules", name: "Rules", icon: "filter" },
    { id: "mapping", name: "Mapping", icon: "link" },
  ];
  return (
    <header className="ed-bar">
      <button className="ed-bar__back" onClick={onBack} title="Back to project"><Icon name="chevron-left" size={20}/></button>
      <div className="ed-tabs">
        {tabs.map(t => (
          <div key={t.id} className={"ed-tab" + (tab === t.id ? " on" : "")} onClick={() => setTab(t.id)}>
            <Icon name={t.icon} size={20}/><span>{t.name}</span>
          </div>
        ))}
      </div>
      <div className="ed-bar__spacer"></div>
      <div className="ed-bar__actions">
        <div className="seg">
          <button className={mode === "draft" ? "on" : ""} onClick={() => setMode("draft")}>Draft</button>
          <button className={mode === "publish" ? "on publish" : ""} onClick={onPublish}>Publish</button>
        </div>
        <button className="ed-eye" title="Preview" onClick={onPreview}><Icon name="eye" size={20}/></button>
      </div>
    </header>
  );
}

// ---- Editor root ----
function SurveyEditor({ intercept, onBack, onPublish, sidebar }) {
  const [survey, setSurvey] = useState(intercept.survey);
  const [design, setDesign] = useState(intercept.design || defaultFeedbackDesign());
  const [settings, setSettings] = useState(intercept.settings || defaultInterceptSettings());
  const [rules, setRules] = useState(intercept.rules || defaultInterceptRules(intercept.trigger || "load"));
  const [mapping, setMapping] = useState(intercept.mapping || defaultInterceptMapping());
  const [mode, setMode] = useState(intercept.status === "active" ? "publish" : "draft");
  const [tab, setTab] = useState("builder");     // top tab: builder | design | notifications | settings
  const [saved, setSaved] = useState(true);
  const [preview, setPreview] = useState(false);
  const [palette, setPalette] = useState(null);  // null, or the insert fn (type)=>void
  const saver = useRef(null);

  const mutate = (next) => {
    setSurvey(next); setSaved(false);
    clearTimeout(saver.current);
    saver.current = setTimeout(() => setSaved(true), 700);
  };

  const touch = () => { setSaved(false); clearTimeout(saver.current); saver.current = setTimeout(() => setSaved(true), 700); };

  const editorBody = (
    <div className="editor">
      <EditorBar tab={tab} setTab={setTab} mode={mode} setMode={setMode}
        onBack={onBack} onPreview={() => setPreview(true)}
        onPublish={() => onPublish({ ...intercept, survey, design, settings, rules, mapping, name: survey.title })}/>
      <div className="ed-body no-rail">
        <div className="ed-main">
          {tab === "builder" && <div className="canvas"><BuilderCanvas survey={survey} mutate={mutate} onOpenPalette={(fn) => setPalette(() => fn)}/></div>}
          {tab === "design" && (
            <DesignTab design={design} kind={intercept.kind} survey={survey}
              setDesign={(n) => { setDesign(n); setSaved(false); clearTimeout(saver.current); saver.current = setTimeout(() => setSaved(true), 700); }}/>
          )}
          {tab === "notifications" && <div className="canvas"><SectionPanel icon="bell" title="Notifications" body="Send an email or Slack alert to your team whenever a new response comes in."/></div>}
          {tab === "settings" && <InterceptSettings settings={settings} setSettings={(n) => { setSettings(n); touch(); }} onSave={() => setSaved(true)}/>}
          {tab === "rules" && <InterceptRules rules={rules} setRules={(n) => { setRules(n); touch(); }} onSave={() => setSaved(true)}/>}
          {tab === "mapping" && <InterceptMapping mapping={mapping} setMapping={(n) => { setMapping(n); touch(); }}/>}
        </div>
      </div>
      {preview && <PreviewOverlay survey={survey} project={intercept._projectUrl} onClose={() => setPreview(false)}/>}
      {palette && <PaletteDrawer onPick={(t) => { palette(t); setPalette(null); }} onClose={() => setPalette(null)}/>}
    </div>
  );

  if (!sidebar) return editorBody;

  return (
    <div className={"ed-shell" + (sidebar.collapsed ? " collapsed" : "")}>
      <div className="ed-shell__sb">
        <Sidebar collapsed={sidebar.collapsed} setCollapsed={sidebar.setCollapsed}
          workspace={sidebar.workspace} workspaces={sidebar.workspaces} route="project"
          onNav={sidebar.onNav} onPickWorkspace={sidebar.onPickWorkspace} onAllWorkspaces={sidebar.onAllWorkspaces}/>
      </div>
      {editorBody}
    </div>
  );
}

Object.assign(window, { CE, TypeMenu, AddQuestionBar, PaletteDrawer, QuestionTools, QuestionSection, Block, SectionPanel, BuilderCanvas, EditorBar, SurveyEditor });
