// === Intercept prototype — shell.jsx ===
// App shell: blue sidebar header (workspace switcher), light nav, navy top bar.

const { useState, useRef, useEffect } = React;

// Close-on-outside-click hook
function useOutside(ref, onClose, active) {
  useEffect(() => {
    if (!active) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [active]);
}

function Sidebar({ collapsed, setCollapsed, workspace, workspaces, route, onNav, onPickWorkspace, onAllWorkspaces }) {
  const [wsOpen, setWsOpen] = useState(false);
  const popRef = useRef(null);
  useOutside(popRef, () => setWsOpen(false), wsOpen);

  // Main nav depends on whether a workspace is selected.
  const mainNav = workspace
    ? [
        { id: "projects", label: "Intercepts", icon: "home", on: ["projects", "project"].includes(route) },
        { id: "code", label: "Code", icon: "code", on: route === "code" },
        { id: "analytics", label: "Analytics", icon: "bar-chart", on: route === "analytics" },
      ]
    : [{ id: "workspaces", label: "Workspaces", icon: "grid", on: true }];
  const bottomNav = workspace
    ? [
        { id: "admin", label: "Admin", icon: "shield", on: route === "admin" },
        { id: "settings", label: "Settings", icon: "gear", on: route === "settings" },
      ]
    : [];

  const NavItem = (n) => (
    <div key={n.id} className={"sb-nav" + (n.on ? " on" : "")} onClick={() => onNav(n.id)} title={collapsed ? n.label : undefined}>
      <Icon name={n.icon} size={20}/>
      <span className="sb-nav__label">{n.label}</span>
    </div>
  );

  return (
    <React.Fragment>
      <div className={"sb-head" + (wsOpen ? " open" : "")} ref={popRef} onClick={() => setWsOpen(o => !o)}>
        <div className="sb-head__mark"><QPMark size={18}/></div>
        <span className="sb-head__name">Intercept</span>
        <span className="sb-head__chev"><Icon name="chevron-down" size={18}/></span>
        {wsOpen && (
          <div className="ws-pop" onClick={(e) => e.stopPropagation()}>
            <div className="ws-pop__label">Switch workspace</div>
            {workspaces.map(w => (
              <div key={w.id} className={"ws-pop__item" + (workspace && w.id === workspace.id ? " on" : "")}
                onClick={() => { setWsOpen(false); onPickWorkspace(w); }}>
                <span className="ini" style={{ background: w.color }}>{w.initial}</span>
                <span>{w.name}</span>
                {workspace && w.id === workspace.id && <span className="check"><Icon name="check" size={16}/></span>}
              </div>
            ))}
            <div className="ws-pop__divide"></div>
            <div className="ws-pop__item ws-pop__all" onClick={() => { setWsOpen(false); onAllWorkspaces(); }}>
              <span className="ini"><Icon name="grid" size={15}/></span>
              <span>View all workspaces</span>
            </div>
          </div>
        )}
      </div>

      <aside className="sb-body">
        <button className="sb-collapse" title={collapsed ? "Expand menu" : "Collapse menu"} onClick={() => setCollapsed(c => !c)}>
          <Icon name={collapsed ? "chevrons-right" : "chevrons-left"} size={20}/>
        </button>
        <nav className="sb-nav-group">{mainNav.map(NavItem)}</nav>
        <div className="sb-spacer"></div>
        {bottomNav.length > 0 && <nav className="sb-nav-group sb-nav-group--bottom">{bottomNav.map(NavItem)}</nav>}
      </aside>
    </React.Fragment>
  );
}

function TopBar({ workspace, project, onCrumb }) {
  return (
    <header className="topbar">
      <nav className="crumb">
        <a onClick={() => onCrumb("workspaces")}>Workspaces</a>
        {workspace && (
          <React.Fragment>
            <span className="sep"><Icon name="chevron-right" size={16}/></span>
            <span className={"seg" + (!project ? " cur" : "")} onClick={() => onCrumb("projects")}
              style={project ? { cursor: "pointer" } : undefined}>{workspace.name}</span>
          </React.Fragment>
        )}
        {project && (
          <React.Fragment>
            <span className="sep"><Icon name="chevron-right" size={16}/></span>
            <span className="seg cur">{project.name}</span>
          </React.Fragment>
        )}
      </nav>
      <div className="topbar__spacer"></div>
      <button className="topbar__icon" title="Help"><Icon name="help" size={22}/></button>
      <button className="topbar__avatar" title="Account">I</button>
    </header>
  );
}

function AppShell({ collapsed, setCollapsed, workspace, project, workspaces, route, onNav, onCrumb, onPickWorkspace, onAllWorkspaces, children }) {
  return (
    <div className={"app" + (collapsed ? " collapsed" : "")}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} workspace={workspace} workspaces={workspaces}
        route={route} onNav={onNav} onPickWorkspace={onPickWorkspace} onAllWorkspaces={onAllWorkspaces}/>
      <TopBar workspace={workspace} project={project} onCrumb={onCrumb}/>
      <main className="content">
        <span className="wick-ver">Wick UI: v1.1.0</span>
        <div className="content__inner">{children}</div>
        <div className="foot">Employee Edition QuestionPro</div>
      </main>
    </div>
  );
}

Object.assign(window, { useOutside, Sidebar, TopBar, AppShell });
