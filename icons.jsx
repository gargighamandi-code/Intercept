// === Intercept prototype — icons.jsx ===
// Lucide-style outlined icons (1.5–2px stroke, rounded caps) per QuestionPro DS.

const Icon = ({ name, size = 20, stroke = 2, fill = "none", ...rest }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill, stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", ...rest };
  switch (name) {
    case "home":      return (<svg {...p}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/></svg>);
    case "grid":      return (<svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>);
    case "chevron-down":  return (<svg {...p}><path d="m6 9 6 6 6-6"/></svg>);
    case "chevron-right": return (<svg {...p}><path d="m9 18 6-6-6-6"/></svg>);
    case "chevron-left":  return (<svg {...p}><path d="m15 18-6-6 6-6"/></svg>);
    case "chevron-up":    return (<svg {...p}><path d="m18 15-6-6-6 6"/></svg>);
    case "sort":      return (<svg {...p} strokeWidth="2"><path d="m8 9 4-4 4 4"/><path d="m16 15-4 4-4-4"/></svg>);
    case "x":         return (<svg {...p}><path d="M18 6 6 18M6 6l12 12"/></svg>);
    case "plus":      return (<svg {...p}><path d="M12 5v14M5 12h14"/></svg>);
    case "help":      return (<svg {...p}><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>);
    case "search":    return (<svg {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>);
    case "info":      return (<svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>);
    case "globe":     return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>);
    case "external":  return (<svg {...p}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>);
    case "calendar":  return (<svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>);
    case "layers":    return (<svg {...p}><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>);
    case "users":     return (<svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
    case "more":      return (<svg {...p}><circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>);
    case "more-v":    return (<svg {...p}><circle cx="12" cy="5" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.6" fill="currentColor" stroke="none"/></svg>);
    case "chevrons":  return (<svg {...p}><path d="m7 7 5 5 5-5M7 13l5 5 5-5"/></svg>);
    case "gear":      return (<svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>);
    case "shuffle":   return (<svg {...p}><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/></svg>);
    case "refresh":   return (<svg {...p}><path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>);
    case "palette":   return (<svg {...p}><circle cx="13.5" cy="6.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r="1.3" fill="currentColor" stroke="none"/><path d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 2-2 2 2 0 0 1 2-2h2a4 4 0 0 0 4-4 10 10 0 0 0-12-10Z"/></svg>);
    case "bell":      return (<svg {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>);
    case "columns":   return (<svg {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/></svg>);
    case "minus-box": return (<svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 12h8"/></svg>);
    case "split":     return (<svg {...p}><path d="M16 3h5v5M8 21H3v-5M21 3l-7 7M3 21l7-7"/></svg>);
    case "edit":      return (<svg {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z"/></svg>);
    case "copy":      return (<svg {...p}><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>);
    case "pause":     return (<svg {...p}><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>);
    case "play":      return (<svg {...p}><polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/></svg>);
    case "trash":     return (<svg {...p}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>);
    case "eye":       return (<svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>);
    case "check":     return (<svg {...p}><path d="M20 6 9 17l-5-5"/></svg>);
    case "check-circle": return (<svg {...p}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>);
    case "alert":     return (<svg {...p}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>);
    case "image":     return (<svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>);
    case "spark":     return (<svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4"/></svg>);
    case "sparkle":   return (<svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/></svg>);
    case "target":    return (<svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>);
    case "clock":     return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>);
    case "mouse-out": return (<svg {...p}><path d="M12 3v6M9 6l3-3 3 3"/><rect x="6" y="11" width="12" height="10" rx="5"/><path d="M12 14v3"/></svg>);
    case "scroll":    return (<svg {...p}><rect x="8" y="3" width="8" height="14" rx="4"/><path d="M12 6v3"/><path d="m9 20 3 3 3-3"/></svg>);
    case "message":   return (<svg {...p}><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.6-.6L3 21l1.3-3.9A8.4 8.4 0 0 1 3.6 13 8.4 8.4 0 0 1 12 4.5a8.4 8.4 0 0 1 9 7Z"/></svg>);
    case "inbox":     return (<svg {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 6.5 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-5.5A2 2 0 0 0 16.8 5H7.2a2 2 0 0 0-1.7 1.5Z"/></svg>);
    case "folder":    return (<svg {...p}><path d="M4 5h5l2 2.5h9A1.5 1.5 0 0 1 21.5 9v9A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V6.5A1.5 1.5 0 0 1 4 5Z"/></svg>);
    case "list":      return (<svg {...p}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>);
    case "code":      return (<svg {...p}><path d="m8 16-4-4 4-4M16 8l4 4-4 4M14 4l-4 16"/></svg>);
    case "bar-chart": return (<svg {...p}><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6" rx="0.5" fill="currentColor" stroke="none"/><rect x="12.5" y="7" width="3" height="10" rx="0.5" fill="currentColor" stroke="none"/><rect x="18" y="13" width="3" height="4" rx="0.5" fill="currentColor" stroke="none"/></svg>);
    case "shield":    return (<svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>);
    case "chevrons-left": return (<svg {...p}><path d="m11 17-5-5 5-5M18 17l-5-5 5-5"/></svg>);
    case "chevrons-right":return (<svg {...p}><path d="m13 17 5-5-5-5M6 17l5-5-5-5"/></svg>);
    case "upload":    return (<svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>);
    case "monitor":   return (<svg {...p}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>);
    case "tablet":    return (<svg {...p}><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>);
    case "smartphone":return (<svg {...p}><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>);
    case "wrench":    return (<svg {...p}><path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L3 18v3h3l6.4-6.3a4 4 0 0 0 5.3-5.4l-2.7 2.7-2.3-2.3 2.7-2.7Z"/></svg>);
    case "logout":    return (<svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>);
    case "filter":    return (<svg {...p}><path d="M3 4h18l-7 8.5V20l-4 1v-8.5L3 4Z"/></svg>);
    case "link":      return (<svg {...p}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>);
    case "sliders":   return (<svg {...p}><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>);

    /* --- question-type glyphs (palette) --- */
    case "radio":     return (<svg {...p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4" fill="currentColor" stroke="none"/></svg>);
    case "checkbox":  return (<svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 2.5 2.5L16 9"/></svg>);
    case "dropdown":  return (<svg {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M8 10.5 12 14l4-3.5"/></svg>);
    case "comment":   return (<svg {...p}><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h6"/></svg>);
    case "text-row":  return (<svg {...p}><rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 12h.01"/></svg>);
    case "at":        return (<svg {...p}><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>);
    case "contact":   return (<svg {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2.2"/><path d="M5.5 16a3.5 3.5 0 0 1 7 0M15 9h4M15 13h4"/></svg>);
    case "star":      return (<svg {...p}><path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19.7l1-5.8L3.5 9.7l5.9-.9L12 3Z"/></svg>);
    case "smiley":    return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M8 14s1.4 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/></svg>);
    case "smiley-sad":return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M16 16s-1.4-2-4-2-4 2-4 2"/><path d="M9 9h.01M15 9h.01"/></svg>);
    case "smiley-neutral":return (<svg {...p}><circle cx="12" cy="12" r="9"/><path d="M8 15h8"/><path d="M9 9h.01M15 9h.01"/></svg>);
    case "thumbs":    return (<svg {...p}><path d="M7 10v11"/><path d="M3 11h4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9Z"/><path d="M7 10 11 3a2 2 0 0 1 3 1.7V8h4.5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.3 19H7"/></svg>);
    case "thumbs-down":return (<svg {...p} style={{transform:"rotate(180deg)"}}><path d="M7 10v11"/><path d="M3 11h4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9Z"/><path d="M7 10 11 3a2 2 0 0 1 3 1.7V8h4.5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.3 19H7"/></svg>);
    case "heart-share":return (<svg {...p}><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M12 14.5 8.8 11.6a1.9 1.9 0 0 1 2.7-2.7l.5.5.5-.5a1.9 1.9 0 0 1 2.7 2.7L12 14.5Z"/></svg>);
    case "text-slider":return (<svg {...p}><path d="M3 8h18M3 16h18"/><circle cx="8" cy="8" r="2.4" fill="#fff"/><circle cx="15" cy="16" r="2.4" fill="#fff"/></svg>);
    case "num-slider":return (<svg {...p}><path d="M4 7h3M9 7h.01"/><path d="M4 17h16"/><circle cx="14" cy="17" r="2.4" fill="#fff"/><path d="M4 7l1.5-2v4"/></svg>);
    case "nps":       return (<svg {...p}><rect x="3" y="9" width="18" height="6" rx="2"/><path d="M7.5 9v6M12 9v6M16.5 9v6"/></svg>);
    case "heading":   return (<svg {...p}><path d="M6 4v16M18 4v16M6 12h12"/></svg>);
    case "paragraph": return (<svg {...p}><path d="M4 6h16M4 11h16M4 16h10"/></svg>);
    default: return null;
  }
};

// QuestionPro cube mark (white P glyph on rounded square) — for the blue sidebar header.
function QPMark({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <path fillRule="evenodd" clipRule="evenodd"
        d="M8.7 5.3h7.4c2.9 0 5.2 2.3 5.2 5.2s-2.3 5.2-5.2 5.2h-4.4v3h-3v-3h0v-3h7.4c1.2 0 2.2-1 2.2-2.2s-1-2.2-2.2-2.2H8.7V5.3Zm3 17.6a1.6 1.6 0 1 1-3.1 0 1.6 1.6 0 0 1 3.1 0Z"
        fill="var(--qp-blue)"/>
    </svg>
  );
}

Object.assign(window, { Icon, QPMark });
