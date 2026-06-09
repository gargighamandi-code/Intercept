// === Intercept prototype — app.jsx ===
// Root: routing/state machine + toasts.

function NavPlaceholder({ icon, title, body }) {
  return (
    <div className="empty" style={{ marginTop: 40 }}>
      <div className="empty__art"><Icon name={icon} size={34}/></div>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

function Toasts({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div className="toast" key={t.id}>
          <span className="ok"><Icon name="check-circle" size={18}/></span>{t.msg}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [workspaces, setWorkspaces] = useState(() => seedWorkspaces());
  const [route, setRoute] = useState("workspaces");   // workspaces | projects | project | editor
  const [wsId, setWsId] = useState(null);
  const [prId, setPrId] = useState(null);
  const [editing, setEditing] = useState(null);       // intercept object being edited
  const [modal, setModal] = useState(null);           // "create-project" | null
  const [collapsed, setCollapsed] = useState(false);
  const [toasts, setToasts] = useState([]);

  const workspace = workspaces.find(w => w.id === wsId) || null;
  const project = workspace ? (workspace.projects.find(p => p.id === prId) || null) : null;

  const toast = (msg) => {
    const id = uid("t");
    setToasts(ts => [...ts, { id, msg }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 2600);
  };

  // ---- workspace ops ----
  const updateWorkspace = (nw) => setWorkspaces(ws => ws.map(w => w.id === nw.id ? nw : w));
  const updateProject = (np) => {
    if (!workspace) return;
    updateWorkspace({ ...workspace, projects: workspace.projects.map(p => p.id === np.id ? np : p) });
  };

  const openWorkspace = (w) => { setWsId(w.id); setPrId(null); setRoute("projects"); };
  const openProject = (p) => { setPrId(p.id); setRoute("project"); };

  const createProject = ({ name, url }) => {
    const np = {
      id: uid("pr"), name, url, status: "notinstalled",
      impressions: 0, visitors: 0,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      updated: "just now", intercepts: [],
    };
    updateWorkspace({ ...workspace, projects: [...workspace.projects, np] });
    setModal(null);
    setPrId(np.id);
    setRoute("project");
    toast("Project created");
  };

  const newIntercept = () => setModal("create-intercept");
  const createIntercept = ({ name, kind }) => {
    const survey = newInterceptSurvey();
    survey.title = name;
    const ic = {
      id: uid("ic"), name, kind, status: "draft", trigger: "load",
      responses: 0, updated: "just now", survey, design: defaultFeedbackDesign(),
    };
    ic._projectUrl = project.url;
    setModal(null);
    setEditing(ic);
    setRoute("editor");
  };
  const editIntercept = (ic) => { setEditing({ ...ic, _projectUrl: project.url }); setRoute("editor"); };

  const publishIntercept = (ic) => {
    const exists = project.intercepts.some(i => i.id === ic.id);
    const clean = { ...ic, status: "active", updated: "just now" };
    delete clean._projectUrl;
    const nextInts = exists
      ? project.intercepts.map(i => i.id === ic.id ? clean : i)
      : [...project.intercepts, clean];
    const np = { ...project, intercepts: nextInts, status: project.status === "notinstalled" ? "active" : project.status };
    updateProject(np);
    setEditing(null);
    setRoute("project");
    toast(exists ? "Intercept updated & live" : "Intercept published & live");
  };

  const backFromEditor = () => { setEditing(null); setRoute("project"); };

  // ---- crumb / nav ----
  const onCrumb = (target) => {
    if (target === "workspaces") { setRoute("workspaces"); setWsId(null); setPrId(null); }
    else if (target === "projects") { setRoute("projects"); setPrId(null); }
  };
  const onNav = (id) => {
    if (id === "workspaces") onCrumb("workspaces");
    else if (id === "projects") setRoute("projects");
    else if (["code", "analytics", "admin", "settings"].includes(id)) setRoute(id);
  };

  // Editor is full-screen (no shell) but keeps the consistent left sidebar
  if (route === "editor" && editing) {
    const sidebar = {
      collapsed, setCollapsed, workspace, workspaces,
      onNav: (id) => { setEditing(null); onNav(id); },
      onPickWorkspace: (w) => { setEditing(null); openWorkspace(w); },
      onAllWorkspaces: () => { setEditing(null); onCrumb("workspaces"); },
    };
    return (
      <React.Fragment>
        <SurveyEditor intercept={editing} onBack={backFromEditor} onPublish={publishIntercept} sidebar={sidebar}/>
        <Toasts toasts={toasts}/>
      </React.Fragment>
    );
  }

  let screen = null;
  if (route === "workspaces") screen = <WorkspaceList workspaces={workspaces} onOpen={openWorkspace}/>;
  else if (route === "projects" && workspace) screen = (
    <ProjectsHome workspace={workspace} onOpenProject={openProject} onCreate={() => setModal("create-project")}
      onDeleteProject={(p) => updateWorkspace({ ...workspace, projects: workspace.projects.filter(x => x.id !== p.id) })}/>
  );
  else if (route === "project" && project) screen = (
    <ProjectDetail project={project} onNewIntercept={newIntercept} onEditIntercept={editIntercept} onUpdateProject={updateProject}/>
  );
  else if (route === "code") screen = <NavPlaceholder icon="code" title="Install code" body={"Copy the JavaScript snippet and add it to " + (workspace ? workspace.name : "your site") + " to start serving intercepts."}/>;
  else if (route === "analytics") screen = <NavPlaceholder icon="bar-chart" title="Analytics" body="Response rates, completion, and trends across every intercept in this workspace will appear here."/>;
  else if (route === "admin") screen = <NavPlaceholder icon="shield" title="Admin" body="Manage members, roles, and access for this workspace."/>;
  else if (route === "settings") screen = <NavPlaceholder icon="gear" title="Settings" body="Workspace name, branding defaults, and data preferences."/>;

  return (
    <React.Fragment>
      <AppShell collapsed={collapsed} setCollapsed={setCollapsed}
        workspace={workspace} project={route === "project" ? project : null} workspaces={workspaces}
        route={route} onNav={onNav} onCrumb={onCrumb}
        onPickWorkspace={openWorkspace} onAllWorkspaces={() => onCrumb("workspaces")}>
        {screen}
      </AppShell>
      {modal === "create-project" && <CreateProjectModal onClose={() => setModal(null)} onCreate={createProject}/>}
      {modal === "create-intercept" && <CreateInterceptModal onClose={() => setModal(null)} onCreate={createIntercept}/>}
      <Toasts toasts={toasts}/>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
