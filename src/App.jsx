import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────
const IGNITE_STAGES = [
  { key: "inspire",   label: "Inspire",    color: "#F97316", icon: "✦", desc: "Drive clarity, excellence & engagement" },
  { key: "gather",    label: "Gather",     color: "#EF4444", icon: "◎", desc: "Attract & capture new people" },
  { key: "navigate",  label: "Navigate",   color: "#8B5CF6", icon: "◈", desc: "Guide every visitor within 48h" },
  { key: "integrate", label: "Integrate",  color: "#3B82F6", icon: "⬡", desc: "Connect people into community" },
  { key: "transform", label: "Transform",  color: "#10B981", icon: "❋", desc: "Develop spiritual & personal growth" },
  { key: "expand",    label: "Expand",     color: "#F59E0B", icon: "⊕", desc: "Scale leadership & resources" },
];

const PILLARS = [
  { key: "experience", label: "Experience Excellence", icon: "★", color: "#F97316" },
  { key: "engagement", label: "Engagement System",     icon: "◉", color: "#EF4444" },
  { key: "financial",  label: "Financial Growth",      icon: "◈", color: "#10B981" },
  { key: "facility",   label: "Facility & Venue",      icon: "⬡", color: "#3B82F6" },
  { key: "data",       label: "Data & Technology",     icon: "✦", color: "#8B5CF6" },
];

const MOCK_PEOPLE = [
  { id: 1, name: "Amara Osei",       stage: "navigate",  firstVisit: "2026-04-20", followedUp: true,  inGroup: false, serving: false, giving: false, source: "Social Media" },
  { id: 2, name: "David Chen",       stage: "integrate", firstVisit: "2026-03-15", followedUp: true,  inGroup: true,  serving: false, giving: false, source: "Friend Invite" },
  { id: 3, name: "Priya Nair",       stage: "transform", firstVisit: "2026-01-08", followedUp: true,  inGroup: true,  serving: true,  giving: true,  source: "Website" },
  { id: 4, name: "Marcus Webb",      stage: "gather",    firstVisit: "2026-04-27", followedUp: false, inGroup: false, serving: false, giving: false, source: "Campus Event" },
  { id: 5, name: "Fatima Al-Rashid", stage: "navigate",  firstVisit: "2026-04-19", followedUp: true,  inGroup: false, serving: false, giving: false, source: "Friend Invite" },
  { id: 6, name: "James Okafor",     stage: "expand",    firstVisit: "2025-09-01", followedUp: true,  inGroup: true,  serving: true,  giving: true,  source: "Website" },
  { id: 7, name: "Sofia Martinez",   stage: "integrate", firstVisit: "2026-02-14", followedUp: true,  inGroup: true,  serving: false, giving: true,  source: "Social Media" },
  { id: 8, name: "Kwame Asante",     stage: "gather",    firstVisit: "2026-04-28", followedUp: false, inGroup: false, serving: false, giving: false, source: "Campus Event" },
  { id: 9, name: "Rachel Kim",       stage: "transform", firstVisit: "2026-01-20", followedUp: true,  inGroup: true,  serving: true,  giving: false, source: "Friend Invite" },
  { id: 10,"name": "Tom Adeyemi",    stage: "navigate",  firstVisit: "2026-04-13", followedUp: true,  inGroup: false, serving: false, giving: false, source: "Outreach Event" },
];

const MOCK_METRICS = {
  congregation: 187,
  newVisitorsThisMonth: 24,
  followUpRate: 79,
  returnRate: 61,
  groupParticipation: 43,
  volunteerEngagement: 28,
  givingParticipation: 52,
  weeklyGrowth: 4.2,
};

const MOCK_WEEKLY = [
  { week: "W1", visitors: 14, retained: 9 },
  { week: "W2", visitors: 18, retained: 12 },
  { week: "W3", visitors: 11, retained: 8 },
  { week: "W4", visitors: 24, retained: 16 },
];

const MOCK_TASKS = [
  { id: 1, title: "Follow up with Marcus Webb",       stage: "navigate",  due: "Today",     done: false, owner: "Admin" },
  { id: 2, title: "Follow up with Kwame Asante",      stage: "navigate",  due: "Today",     done: false, owner: "Admin" },
  { id: 3, title: "Send week 2 nurture email",        stage: "navigate",  due: "Tomorrow",  done: false, owner: "Tech" },
  { id: 4, title: "Launch small group invite series", stage: "integrate", due: "This week", done: false, owner: "Membership" },
  { id: 5, title: "Collect Finance team budget",      stage: "expand",    due: "This week", done: true,  owner: "Finance" },
  { id: 6, title: "Update website CTA",               stage: "gather",    due: "This week", done: true,  owner: "Tech" },
  { id: 7, title: "Prepare discipleship curriculum",  stage: "transform", due: "Next week", done: false, owner: "Ministry" },
  { id: 8, title: "Student outreach event planning",  stage: "gather",    due: "Next week", done: false, owner: "Missions" },
];

const STAGE_COUNTS = MOCK_PEOPLE.reduce((acc, p) => {
  acc[p.stage] = (acc[p.stage] || 0) + 1;
  return acc;
}, {});

// ─── MINI SPARKLINE ───────────────────────────────────────────
function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80, h = 30;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <circle cx={pts.split(" ").pop().split(",")[0]} cy={pts.split(" ").pop().split(",")[1]} r="3" fill={color} />
    </svg>
  );
}

// ─── PIPELINE FUNNEL ─────────────────────────────────────────
function PipelineFunnel({ people, onStageClick, activeStage }) {
  const total = people.length;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {IGNITE_STAGES.map((stage, i) => {
        const count = people.filter(p => {
          const idx = IGNITE_STAGES.findIndex(s => s.key === p.stage);
          return idx >= i;
        }).length;
        const pct = Math.round((count / total) * 100);
        const isActive = activeStage === stage.key;
        return (
          <div
            key={stage.key}
            onClick={() => onStageClick(stage.key)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 10,
              background: isActive ? `${stage.color}18` : "rgba(255,255,255,0.03)",
              border: `1px solid ${isActive ? stage.color : "rgba(255,255,255,0.06)"}`,
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 16, minWidth: 20, color: stage.color }}>{stage.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", fontFamily: "inherit", letterSpacing: 1, textTransform: "uppercase" }}>{stage.label}</span>
                <span style={{ fontSize: 12, color: stage.color, fontWeight: 700 }}>{count} <span style={{ color: "#666", fontWeight: 400 }}>({pct}%)</span></span>
              </div>
              <div style={{ height: 5, borderRadius: 99, background: "rgba(255,255,255,0.06)" }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: stage.color, transition: "width 0.6s ease" }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── METRIC CARD ─────────────────────────────────────────────
function MetricCard({ label, value, suffix = "", color, sparkData, sub }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "14px 14px 0 0", opacity: 0.7 }} />
      <span style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>{label}</span>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <span style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1, fontFamily: "'DM Mono', monospace" }}>
          {value}<span style={{ fontSize: 16, fontWeight: 400, color: "#888", marginLeft: 2 }}>{suffix}</span>
        </span>
        {sparkData && <Sparkline data={sparkData} color={color} />}
      </div>
      {sub && <span style={{ fontSize: 11, color: "#555" }}>{sub}</span>}
    </div>
  );
}

// ─── PERSON ROW ──────────────────────────────────────────────
function PersonRow({ person, onUpdate }) {
  const stage = IGNITE_STAGES.find(s => s.key === person.stage);
  const dot = (active, color) => (
    <div style={{ width: 9, height: 9, borderRadius: "50%", background: active ? color : "rgba(255,255,255,0.1)", border: `1px solid ${active ? color : "rgba(255,255,255,0.15)"}` }} />
  );
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 140px 80px 80px 80px 80px 100px",
      alignItems: "center",
      gap: 12,
      padding: "12px 16px",
      borderRadius: 10,
      background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.05)",
      marginBottom: 6,
      transition: "background 0.15s",
    }}
    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
    >
      <div>
        <div style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{person.name}</div>
        <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>via {person.source}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 13, color: stage.color }}>{stage.icon}</span>
        <select
          value={person.stage}
          onChange={e => onUpdate(person.id, { stage: e.target.value })}
          style={{ background: `${stage.color}22`, border: `1px solid ${stage.color}55`, borderRadius: 6, color: stage.color, fontSize: 11, padding: "3px 6px", fontWeight: 700, cursor: "pointer", letterSpacing: 0.5 }}
        >
          {IGNITE_STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }} onClick={() => onUpdate(person.id, { followedUp: !person.followedUp })} title="Followed up">
        {dot(person.followedUp, "#10B981")}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }} onClick={() => onUpdate(person.id, { inGroup: !person.inGroup })} title="In a group">
        {dot(person.inGroup, "#3B82F6")}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }} onClick={() => onUpdate(person.id, { serving: !person.serving })} title="Serving">
        {dot(person.serving, "#8B5CF6")}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }} onClick={() => onUpdate(person.id, { giving: !person.giving })} title="Giving">
        {dot(person.giving, "#F59E0B")}
      </div>
      <div style={{ fontSize: 11, color: "#444", textAlign: "right" }}>{person.firstVisit}</div>
    </div>
  );
}

// ─── ADD PERSON MODAL ────────────────────────────────────────
function AddPersonModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name: "", stage: "gather", source: "Friend Invite", firstVisit: new Date().toISOString().slice(0, 10) });
  const sources = ["Friend Invite", "Social Media", "Website", "Campus Event", "Outreach Event", "Walk-in", "Other"];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: 32, width: 420, maxWidth: "90vw" }}>
        <h3 style={{ color: "#fff", margin: "0 0 24px", fontFamily: "inherit", fontSize: 20, fontWeight: 700 }}>Add New Person</h3>
        {[
          { label: "Full Name", key: "name", type: "text" },
          { label: "First Visit Date", key: "firstVisit", type: "date" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: "#666", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 14, boxSizing: "border-box", fontFamily: "inherit" }}
            />
          </div>
        ))}
        {[
          { label: "IGNITE Stage", key: "stage", options: IGNITE_STAGES.map(s => ({ v: s.key, l: s.label })) },
          { label: "How They Found Us", key: "source", options: sources.map(s => ({ v: s, l: s })) },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: "#666", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 6 }}>{f.label}</label>
            <select
              value={form[f.key]}
              onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 14, boxSizing: "border-box", fontFamily: "inherit", cursor: "pointer" }}
            >
              {f.options.map(o => <option key={o.v} value={o.v} style={{ background: "#111" }}>{o.l}</option>)}
            </select>
          </div>
        ))}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#888", cursor: "pointer", fontSize: 14, fontFamily: "inherit" }}>Cancel</button>
          <button
            onClick={() => { if (form.name.trim()) { onAdd({ ...form, id: Date.now(), followedUp: false, inGroup: false, serving: false, giving: false }); onClose(); } }}
            style={{ flex: 2, padding: "11px", borderRadius: 9, border: "none", background: "#F97316", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}
          >Add to Pipeline</button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ──────────────────────────────────────────
function DashboardView({ people, tasks }) {
  const [activeStage, setActiveStage] = useState(null);
  const pendingFollowUps = people.filter(p => !p.followedUp).length;
  const sparkVisitors = MOCK_WEEKLY.map(w => w.visitors);
  const sparkRetained = MOCK_WEEKLY.map(w => w.retained);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
      {/* Top metrics row */}
      <MetricCard label="Congregation Size" value={MOCK_METRICS.congregation} color="#F97316" sparkData={[160,168,175,187]} sub="+4.2% this month" />
      <MetricCard label="New Visitors (Month)" value={MOCK_METRICS.newVisitorsThisMonth} color="#EF4444" sparkData={sparkVisitors} sub="Last 4 weeks" />
      <MetricCard label="Follow-up Rate" value={MOCK_METRICS.followUpRate} suffix="%" color="#10B981" sparkData={[68,72,75,79]} sub="Within 48 hours" />
      <MetricCard label="Return Rate" value={MOCK_METRICS.returnRate} suffix="%" color="#3B82F6" sparkData={[50,55,58,61]} sub="Visitors who returned" />
      <MetricCard label="Group Participation" value={MOCK_METRICS.groupParticipation} suffix="%" color="#8B5CF6" sparkData={[35,38,41,43]} sub="In a small group" />
      <MetricCard label="Giving Participation" value={MOCK_METRICS.givingParticipation} suffix="%" color="#F59E0B" sparkData={[44,47,50,52]} sub="Active givers" />

      {/* Pipeline funnel */}
      <div style={{ gridColumn: "1 / 3", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>IGNITE Pipeline</span>
          {activeStage && <button onClick={() => setActiveStage(null)} style={{ fontSize: 11, color: "#555", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Clear filter ×</button>}
        </div>
        <PipelineFunnel people={people} onStageClick={s => setActiveStage(activeStage === s ? null : s)} activeStage={activeStage} />
      </div>

      {/* Action items */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 20, gridRow: "span 1" }}>
        <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 14 }}>Action Items</div>
        {pendingFollowUps > 0 && (
          <div style={{ background: "#EF444415", border: "1px solid #EF444430", borderRadius: 9, padding: "10px 12px", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: "#EF4444", fontWeight: 600 }}>⚠ {pendingFollowUps} visitors need follow-up</span>
          </div>
        )}
        {tasks.filter(t => !t.done).slice(0, 5).map(task => {
          const stage = IGNITE_STAGES.find(s => s.key === task.stage);
          return (
            <div key={task.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ color: stage.color, fontSize: 12, marginTop: 2 }}>{stage.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "#ddd" }}>{task.title}</div>
                <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{task.due} · {task.owner}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly attendance chart */}
      <div style={{ gridColumn: "1 / -1", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 20 }}>
        <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 16 }}>Weekly Visitor Trend</div>
        <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 80 }}>
          {MOCK_WEEKLY.map((w, i) => {
            const maxV = Math.max(...MOCK_WEEKLY.map(x => x.visitors));
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, justifyContent: "flex-end", height: 60 }}>
                  <div style={{ width: "100%", height: `${(w.retained / maxV) * 60}px`, background: "#3B82F6", borderRadius: "4px 4px 0 0", opacity: 0.7, transition: "height 0.5s ease" }} title={`Retained: ${w.retained}`} />
                  <div style={{ width: "100%", height: `${((w.visitors - w.retained) / maxV) * 60}px`, background: "#F97316", borderRadius: "0", opacity: 0.5 }} title={`New: ${w.visitors - w.retained}`} />
                </div>
                <div style={{ fontSize: 11, color: "#555" }}>{w.week}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}><div style={{ width: 10, height: 10, background: "#F97316", borderRadius: 2, opacity: 0.5 }} /><span style={{ fontSize: 11, color: "#555" }}>New visitors</span></div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}><div style={{ width: 10, height: 10, background: "#3B82F6", borderRadius: 2, opacity: 0.7 }} /><span style={{ fontSize: 11, color: "#555" }}>Retained</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── PEOPLE VIEW ─────────────────────────────────────────────
function PeopleView({ people, setPeople }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = people.filter(p => {
    const matchStage = filter === "all" || p.stage === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.source.toLowerCase().includes(search.toLowerCase());
    return matchStage && matchSearch;
  });

  const handleUpdate = (id, updates) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <input
          placeholder="Search people..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: "9px 14px", color: "#fff", fontSize: 14, fontFamily: "inherit" }}
        />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[{ key: "all", label: "All" }, ...IGNITE_STAGES].map(s => (
            <button key={s.key} onClick={() => setFilter(s.key)} style={{
              padding: "7px 14px", borderRadius: 7, border: `1px solid ${filter === s.key ? (s.color || "#F97316") : "rgba(255,255,255,0.08)"}`,
              background: filter === s.key ? `${(s.color || "#F97316")}22` : "transparent",
              color: filter === s.key ? (s.color || "#F97316") : "#666", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: 0.5
            }}>{s.label || "All"}</button>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding: "9px 18px", borderRadius: 9, border: "none", background: "#F97316", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", letterSpacing: 0.5 }}>+ Add Person</button>
      </div>

      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 80px 80px 80px 80px 100px", gap: 12, padding: "8px 16px", marginBottom: 8 }}>
        {["Name", "Stage", "Followed Up", "In Group", "Serving", "Giving", "First Visit"].map((h, i) => (
          <div key={h} style={{ fontSize: 10, color: "#444", textTransform: "uppercase", letterSpacing: 1.5, textAlign: i > 1 ? "center" : "left" }}>{h}</div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: "#444", padding: 40, fontSize: 14 }}>No people found matching your filters.</div>
      ) : (
        filtered.map(p => <PersonRow key={p.id} person={p} onUpdate={handleUpdate} />)
      )}

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: 9 }}>
        <span style={{ fontSize: 11, color: "#444" }}>Click dots to toggle status:</span>
        {[{ c: "#10B981", l: "Followed Up" }, { c: "#3B82F6", l: "In Group" }, { c: "#8B5CF6", l: "Serving" }, { c: "#F59E0B", l: "Giving" }].map(x => (
          <div key={x.l} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: x.c }} />
            <span style={{ fontSize: 11, color: "#555" }}>{x.l}</span>
          </div>
        ))}
      </div>

      {showAdd && <AddPersonModal onAdd={p => setPeople(prev => [p, ...prev])} onClose={() => setShowAdd(false)} />}
    </div>
  );
}

// ─── TASKS VIEW ──────────────────────────────────────────────
function TasksView({ tasks, setTasks }) {
  const [newTask, setNewTask] = useState({ title: "", stage: "navigate", owner: "", due: "This week" });
  const [showForm, setShowForm] = useState(false);

  const toggle = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const add = () => {
    if (newTask.title.trim()) {
      setTasks(prev => [...prev, { ...newTask, id: Date.now(), done: false }]);
      setNewTask({ title: "", stage: "navigate", owner: "", due: "This week" });
      setShowForm(false);
    }
  };

  const grouped = IGNITE_STAGES.map(stage => ({
    ...stage,
    tasks: tasks.filter(t => t.stage === stage.key),
  })).filter(s => s.tasks.length > 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <span style={{ fontSize: 13, color: "#555" }}>{tasks.filter(t => !t.done).length} open · </span>
          <span style={{ fontSize: 13, color: "#555" }}>{tasks.filter(t => t.done).length} completed</span>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: "9px 18px", borderRadius: 9, border: "none", background: "#F97316", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit" }}>+ Add Task</button>
      </div>

      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 140px 120px 120px auto", gap: 10, alignItems: "center" }}>
          <input placeholder="Task description..." value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit" }} />
          <select value={newTask.stage} onChange={e => setNewTask(p => ({ ...p, stage: e.target.value }))} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "9px 10px", color: "#aaa", fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>
            {IGNITE_STAGES.map(s => <option key={s.key} value={s.key} style={{ background: "#111" }}>{s.label}</option>)}
          </select>
          <input placeholder="Owner" value={newTask.owner} onChange={e => setNewTask(p => ({ ...p, owner: e.target.value }))} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "9px 12px", color: "#fff", fontSize: 13, fontFamily: "inherit" }} />
          <select value={newTask.due} onChange={e => setNewTask(p => ({ ...p, due: e.target.value }))} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "9px 10px", color: "#aaa", fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>
            {["Today", "Tomorrow", "This week", "Next week"].map(d => <option key={d} value={d} style={{ background: "#111" }}>{d}</option>)}
          </select>
          <button onClick={add} style={{ padding: "9px 16px", borderRadius: 7, border: "none", background: "#F97316", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit", whiteSpace: "nowrap" }}>Add</button>
        </div>
      )}

      {grouped.map(group => (
        <div key={group.key} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ color: group.color, fontSize: 16 }}>{group.icon}</span>
            <span style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600 }}>{group.label}</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            <span style={{ fontSize: 11, color: "#444" }}>{group.tasks.filter(t => !t.done).length} open</span>
          </div>
          {group.tasks.map(task => (
            <div key={task.id} onClick={() => toggle(task.id)} style={{
              display: "flex", gap: 12, alignItems: "center", padding: "11px 14px",
              borderRadius: 9, background: task.done ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)", marginBottom: 6, cursor: "pointer",
              opacity: task.done ? 0.45 : 1, transition: "opacity 0.2s",
            }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${task.done ? group.color : "rgba(255,255,255,0.2)"}`, background: task.done ? group.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {task.done && <span style={{ color: "#000", fontSize: 9, fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ flex: 1, fontSize: 14, color: task.done ? "#555" : "#ddd", textDecoration: task.done ? "line-through" : "none" }}>{task.title}</span>
              <span style={{ fontSize: 11, color: "#444" }}>{task.owner}</span>
              <span style={{ fontSize: 11, color: task.due === "Today" ? "#EF4444" : "#444", fontWeight: task.due === "Today" ? 600 : 400 }}>{task.due}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── STRATEGY VIEW ───────────────────────────────────────────
function StrategyView() {
  const cadences = [
    { freq: "Weekly", color: "#F97316", items: ["Operations review", "Issue tracking & resolution", "Follow-up accountability"] },
    { freq: "Monthly", color: "#3B82F6", items: ["Strategic review", "Performance tracking", "Decision-making & prioritisation"] },
    { freq: "Quarterly", color: "#8B5CF6", items: ["Strategic reset", "Priority alignment", "Roadmap review"] },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* IGNITE Framework */}
      <div style={{ gridColumn: "1 / -1", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 20 }}>IGNITE Growth Framework</div>
        <div style={{ display: "flex", gap: 0, position: "relative" }}>
          {IGNITE_STAGES.map((stage, i) => (
            <div key={stage.key} style={{ flex: 1, position: "relative" }}>
              <div style={{
                margin: "0 2px",
                padding: "16px 12px",
                background: `${stage.color}18`,
                border: `1px solid ${stage.color}40`,
                borderRadius: i === 0 ? "10px 0 0 10px" : i === IGNITE_STAGES.length - 1 ? "0 10px 10px 0" : 0,
                clipPath: i < IGNITE_STAGES.length - 1 ? "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%, 8px 50%)" : undefined,
                minHeight: 90,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                textAlign: "center",
              }}>
                <span style={{ fontSize: 20, color: stage.color }}>{stage.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: stage.color, letterSpacing: 1, textTransform: "uppercase" }}>{stage.label}</span>
                <span style={{ fontSize: 10, color: "#555", lineHeight: 1.4 }}>{stage.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Pillars */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 16 }}>Strategic Pillars</div>
        {PILLARS.map((p, i) => (
          <div key={p.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < PILLARS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: `${p.color}20`, border: `1px solid ${p.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: p.color, flexShrink: 0 }}>{p.icon}</div>
            <div>
              <div style={{ fontSize: 13, color: "#ddd", fontWeight: 600 }}>0{i + 1} — {p.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* HCOS Model */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 20 }}>HCOS Operating Model</div>
        {[
          { label: "Growth", sub: "Strategic Engine", color: "#F97316", icon: "◎", size: "80%" },
          { label: "Operations", sub: "Backstage", color: "#D97706", icon: "⬡", size: "65%" },
          { label: "Experience", sub: "Frontstage", color: "#B45309", icon: "✦", size: "50%" },
        ].map((layer, i) => (
          <div key={layer.label} style={{ marginBottom: 10, marginLeft: `${i * 20}px` }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 16px", background: `${layer.color}15`, border: `1px solid ${layer.color}35`, borderRadius: 9 }}>
              <span style={{ color: layer.color, fontSize: 16 }}>{layer.icon}</span>
              <div>
                <div style={{ fontSize: 13, color: layer.color, fontWeight: 700 }}>{layer.label}</div>
                <div style={{ fontSize: 11, color: "#555" }}>{layer.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Execution Cadence */}
      <div style={{ gridColumn: "1 / -1", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 20 }}>Execution Cadence</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {cadences.map(c => (
            <div key={c.freq} style={{ padding: 18, background: `${c.color}10`, border: `1px solid ${c.color}30`, borderRadius: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: c.color, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>{c.freq}</div>
              {c.items.map(item => (
                <div key={item} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: c.color, marginTop: 5, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#aaa", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ENGAGEMENT VIEW ─────────────────────────────────────────
function EngagementView({ people }) {
  const sources = people.reduce((acc, p) => { acc[p.source] = (acc[p.source] || 0) + 1; return acc; }, {});
  const sortedSources = Object.entries(sources).sort((a, b) => b[1] - a[1]);
  const total = people.length;

  const engagementLevels = [
    { label: "Fully Engaged",    desc: "Followed up, in group, serving & giving",   count: people.filter(p => p.followedUp && p.inGroup && p.serving && p.giving).length,    color: "#10B981" },
    { label: "Growing",          desc: "In group + giving or serving",               count: people.filter(p => p.inGroup && (p.giving || p.serving) && !(p.serving && p.giving)).length, color: "#3B82F6" },
    { label: "Connected",        desc: "In a small group",                           count: people.filter(p => p.inGroup && !p.serving && !p.giving).length,                 color: "#8B5CF6" },
    { label: "Engaged",          desc: "Followed up, not yet in group",              count: people.filter(p => p.followedUp && !p.inGroup).length,                           color: "#F59E0B" },
    { label: "New / Uncontacted",desc: "Not yet followed up",                        count: people.filter(p => !p.followedUp).length,                                       color: "#EF4444" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* Engagement breakdown */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 20 }}>Engagement Levels</div>
        {engagementLevels.map(level => (
          <div key={level.label} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: level.color }}>{level.label}</span>
                <span style={{ fontSize: 11, color: "#555", marginLeft: 8 }}>{level.desc}</span>
              </div>
              <span style={{ fontSize: 13, color: level.color, fontWeight: 700 }}>{level.count}</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.05)" }}>
              <div style={{ height: "100%", width: `${(level.count / total) * 100}%`, borderRadius: 99, background: level.color, transition: "width 0.6s" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Discovery sources */}
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 12, color: "#666", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 20 }}>Discovery Sources</div>
        {sortedSources.map(([source, count], i) => {
          const colors = ["#F97316","#EF4444","#8B5CF6","#3B82F6","#10B981","#F59E0B"];
          const c = colors[i % colors.length];
          return (
            <div key={source} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 13, color: "#bbb" }}>{source}</span>
              <div style={{ flex: 2, height: 6, borderRadius: 99, background: "rgba(255,255,255,0.05)" }}>
                <div style={{ height: "100%", width: `${(count / total) * 100}%`, borderRadius: 99, background: c }} />
              </div>
              <span style={{ fontSize: 12, color: "#555", minWidth: 30, textAlign: "right" }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Key engagement metrics */}
      <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {[
          { label: "Follow-up within 48h", value: `${Math.round((people.filter(p=>p.followedUp).length/total)*100)}%`, color: "#10B981" },
          { label: "In Small Groups", value: `${Math.round((people.filter(p=>p.inGroup).length/total)*100)}%`, color: "#3B82F6" },
          { label: "Volunteer Serving", value: `${Math.round((people.filter(p=>p.serving).length/total)*100)}%`, color: "#8B5CF6" },
          { label: "Regular Givers", value: `${Math.round((people.filter(p=>p.giving).length/total)*100)}%`, color: "#F59E0B" },
        ].map(m => (
          <div key={m.label} style={{ background: `${m.color}12`, border: `1px solid ${m.color}30`, borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: m.color, fontFamily: "'DM Mono', monospace" }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function GoReach() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [people, setPeople] = useState(MOCK_PEOPLE);
  const [tasks, setTasks] = useState(MOCK_TASKS);

  const tabs = [
    { key: "dashboard",  label: "Dashboard",  icon: "◈" },
    { key: "pipeline",   label: "Pipeline",   icon: "◎" },
    { key: "engagement", label: "Engagement", icon: "✦" },
    { key: "tasks",      label: "Action Hub", icon: "⬡" },
    { key: "strategy",   label: "Strategy",   icon: "❋" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#fff",
      fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 28px",
        display: "flex",
        alignItems: "center",
        gap: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: 58,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 36 }}>
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #F97316, #EF4444)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🔥</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, color: "#fff" }}>Go<span style={{ color: "#F97316" }}>Reach</span></span>
          <span style={{ fontSize: 10, color: "#444", letterSpacing: 2, textTransform: "uppercase", marginLeft: 4, marginTop: 2 }}>Church OS</span>
        </div>

        {/* Nav */}
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
            padding: "0 16px",
            height: 58,
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 7,
            color: activeTab === tab.key ? "#fff" : "#555",
            borderBottom: `2px solid ${activeTab === tab.key ? "#F97316" : "transparent"}`,
            fontSize: 13,
            fontWeight: activeTab === tab.key ? 600 : 400,
            fontFamily: "inherit",
            letterSpacing: 0.3,
            transition: "color 0.15s",
          }}>
            <span style={{ color: activeTab === tab.key ? "#F97316" : "#444", fontSize: 12 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B98160" }} />
          <span style={{ fontSize: 12, color: "#555" }}>Live · {people.length} people</span>
        </div>
      </div>

      {/* Page title */}
      <div style={{ padding: "20px 28px 0", display: "flex", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
          {tabs.find(t => t.key === activeTab)?.label}
        </h1>
        {activeTab === "dashboard" && (
          <span style={{ fontSize: 13, color: "#444" }}>Week of May 3, 2026</span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 28px 40px", maxWidth: 1200, width: "100%", boxSizing: "border-box" }}>
        {activeTab === "dashboard"  && <DashboardView people={people} tasks={tasks} />}
        {activeTab === "pipeline"   && <PeopleView people={people} setPeople={setPeople} />}
        {activeTab === "engagement" && <EngagementView people={people} />}
        {activeTab === "tasks"      && <TasksView tasks={tasks} setTasks={setTasks} />}
        {activeTab === "strategy"   && <StrategyView />}
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#333" }}>GoReach Church OS · IGNITE Growth Framework</span>
        <span style={{ fontSize: 11, color: "#333" }}>ONE VISION. MANY LIVES. GREATER IMPACT.</span>
      </div>
    </div>
  );
}
