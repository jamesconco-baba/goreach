import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN SYSTEM — Deep Navy + Emerald + Gold church aesthetic
═══════════════════════════════════════════════════════════════ */
const C = {
  navy:       "#0B1437",
  navyMid:    "#0F1D4A",
  navyLight:  "#162260",
  blue:       "#1E3A8A",
  blueMid:    "#2563EB",
  blueLight:  "#3B82F6",
  emerald:    "#059669",
  emeraldMid: "#10B981",
  emeraldLight:"#34D399",
  gold:       "#B45309",
  goldMid:    "#D97706",
  goldLight:  "#F59E0B",
  amber:      "#F59E0B",
  rose:       "#E11D48",
  roseMid:    "#F43F5E",
  violet:     "#7C3AED",
  violetMid:  "#8B5CF6",
  sky:        "#0EA5E9",
  teal:       "#0D9488",
  white:      "#FFFFFF",
  offwhite:   "#F0F4FF",
  muted:      "#94A3B8",
  mutedDark:  "#475569",
  border:     "rgba(255,255,255,0.08)",
  borderLight:"rgba(255,255,255,0.14)",
  glass:      "rgba(255,255,255,0.04)",
  glassMid:   "rgba(255,255,255,0.07)",
  glassBright:"rgba(255,255,255,0.11)",
};

const FONT_HEAD = "'Georgia', 'Palatino Linotype', serif";
const FONT_BODY = "'Trebuchet MS', 'Gill Sans', system-ui, sans-serif";
const FONT_MONO = "'Courier New', monospace";

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */
const IGNITE_STAGES = [
  { key:"inspire",   label:"Inspire",   color:C.blueMid,    icon:"✦", desc:"Drive clarity, excellence & engagement" },
  { key:"gather",    label:"Gather",    color:C.sky,        icon:"◎", desc:"Attract & capture new people" },
  { key:"navigate",  label:"Navigate",  color:C.violetMid,  icon:"◈", desc:"Guide every visitor within 48h" },
  { key:"integrate", label:"Integrate", color:C.emeraldMid, icon:"⬡", desc:"Connect people into community" },
  { key:"transform", label:"Transform", color:C.teal,       icon:"❋", desc:"Develop spiritual & personal growth" },
  { key:"expand",    label:"Expand",    color:C.goldMid,    icon:"⊕", desc:"Scale leadership & resources" },
];

const VOLUNTEER_ROLES = [
  { id:1, team:"Welcome & Ushers",    commitment:"2h/Sunday",  slots:8,  filled:5, description:"Greet first-time visitors, manage seating, create warm atmosphere" },
  { id:2, team:"Worship & Music",     commitment:"4h/Sunday",  slots:6,  filled:4, description:"Lead congregational worship through song and instruments" },
  { id:3, team:"Children's Ministry", commitment:"2h/Sunday",  slots:10, filled:6, description:"Care and teach children aged 3–12 during Sunday services" },
  { id:4, team:"AV & Technology",     commitment:"3h/Sunday",  slots:4,  filled:2, description:"Manage sound, visuals, live streaming and recording" },
  { id:5, team:"Hospitality & Café",  commitment:"1.5h/Sunday",slots:6,  filled:6, description:"Prepare and serve refreshments, foster community connection" },
  { id:6, team:"Prayer Team",         commitment:"1h/week",    slots:12, filled:7, description:"Pray with and for congregation members before and after service" },
  { id:7, team:"Small Group Leaders", commitment:"2h/week",    slots:8,  filled:3, description:"Facilitate weekly small group discussions and pastoral care" },
  { id:8, team:"Outreach & Missions", commitment:"Flexible",   slots:10, filled:4, description:"Lead and support community outreach and evangelism initiatives" },
];

const INIT_VOLUNTEERS = [
  { id:1, name:"Priya Nair",       role:"Worship & Music",     status:"Active",   signupDate:"2026-01-10", deployedDate:"2026-01-20", retained:true,  phone:"", notes:"" },
  { id:2, name:"James Okafor",     role:"Small Group Leaders", status:"Active",   signupDate:"2025-09-05", deployedDate:"2025-09-15", retained:true,  phone:"", notes:"" },
  { id:3, name:"Sofia Martinez",   role:"Children's Ministry", status:"Active",   signupDate:"2026-02-18", deployedDate:"2026-02-25", retained:true,  phone:"", notes:"" },
  { id:4, name:"Rachel Kim",       role:"AV & Technology",     status:"Active",   signupDate:"2026-01-22", deployedDate:"2026-02-01", retained:true,  phone:"", notes:"" },
  { id:5, name:"Tom Adeyemi",      role:"Welcome & Ushers",    status:"Training", signupDate:"2026-04-15", deployedDate:"",          retained:false, phone:"", notes:"" },
  { id:6, name:"David Chen",       role:"Prayer Team",         status:"Training", signupDate:"2026-03-20", deployedDate:"",          retained:false, phone:"", notes:"" },
];

const INIT_BUDGETS = [
  { id:1, team:"Worship & Music",     allocated:1200, spent:870,  status:"Submitted" },
  { id:2, team:"Children's Ministry", allocated:800,  spent:420,  status:"Submitted" },
  { id:3, team:"Outreach & Missions", allocated:1500, spent:1100, status:"Submitted" },
  { id:4, team:"AV & Technology",     allocated:600,  spent:580,  status:"Submitted" },
  { id:5, team:"Administration",      allocated:400,  spent:210,  status:"Pending" },
  { id:6, team:"Hospitality",         allocated:300,  spent:180,  status:"Submitted" },
  { id:7, team:"Facilities",          allocated:900,  spent:0,    status:"Pending" },
];

const INIT_DONORS = [
  { id:1, name:"Emmanuel & Grace Osei",  tier:"Capital Group", amount:500,  frequency:"Monthly", lastContact:"2026-04-01", status:"Active",  notes:"Interested in naming a room" },
  { id:2, name:"The Patel Family",        tier:"Major Donor",   amount:200,  frequency:"Monthly", lastContact:"2026-03-15", status:"Active",  notes:"Connect re: student outreach" },
  { id:3, name:"Michael Ashford",         tier:"Regular Giver", amount:50,   frequency:"Weekly",  lastContact:"2026-04-20", status:"Active",  notes:"" },
  { id:4, name:"Blessings Foundation",    tier:"Capital Group", amount:1000, frequency:"Quarterly",lastContact:"2026-02-10", status:"Prospect",notes:"Awaiting proposal follow-up" },
  { id:5, name:"Ruth & Daniel Mensah",    tier:"Regular Giver", amount:75,   frequency:"Monthly", lastContact:"2026-04-15", status:"Active",  notes:"" },
];

const INIT_PEOPLE = [
  { id:1,  name:"Amara Osei",       stage:"navigate",  firstVisit:"2026-04-20", followedUp:true,  inGroup:false, serving:false, giving:false, source:"Social Media" },
  { id:2,  name:"David Chen",       stage:"integrate", firstVisit:"2026-03-15", followedUp:true,  inGroup:true,  serving:false, giving:false, source:"Friend Invite" },
  { id:3,  name:"Priya Nair",       stage:"transform", firstVisit:"2026-01-08", followedUp:true,  inGroup:true,  serving:true,  giving:true,  source:"Website" },
  { id:4,  name:"Marcus Webb",      stage:"gather",    firstVisit:"2026-04-27", followedUp:false, inGroup:false, serving:false, giving:false, source:"Campus Event" },
  { id:5,  name:"Fatima Al-Rashid", stage:"navigate",  firstVisit:"2026-04-19", followedUp:true,  inGroup:false, serving:false, giving:false, source:"Friend Invite" },
  { id:6,  name:"James Okafor",     stage:"expand",    firstVisit:"2025-09-01", followedUp:true,  inGroup:true,  serving:true,  giving:true,  source:"Website" },
  { id:7,  name:"Sofia Martinez",   stage:"integrate", firstVisit:"2026-02-14", followedUp:true,  inGroup:true,  serving:false, giving:true,  source:"Social Media" },
  { id:8,  name:"Kwame Asante",     stage:"gather",    firstVisit:"2026-04-28", followedUp:false, inGroup:false, serving:false, giving:false, source:"Campus Event" },
  { id:9,  name:"Rachel Kim",       stage:"transform", firstVisit:"2026-01-20", followedUp:true,  inGroup:true,  serving:true,  giving:false, source:"Friend Invite" },
  { id:10, name:"Tom Adeyemi",      stage:"navigate",  firstVisit:"2026-04-13", followedUp:true,  inGroup:false, serving:false, giving:false, source:"Outreach Event" },
];

const INIT_TASKS = [
  { id:1, title:"Follow up with Marcus Webb",       stage:"navigate",  due:"Today",     done:false, owner:"Admin" },
  { id:2, title:"Follow up with Kwame Asante",      stage:"navigate",  due:"Today",     done:false, owner:"Admin" },
  { id:3, title:"Send week 2 nurture email",        stage:"navigate",  due:"Tomorrow",  done:false, owner:"Tech" },
  { id:4, title:"Launch small group invite series", stage:"integrate", due:"This week", done:false, owner:"Membership" },
  { id:5, title:"Collect Finance team budget",      stage:"expand",    due:"This week", done:true,  owner:"Finance" },
  { id:6, title:"Update website CTA",               stage:"gather",    due:"This week", done:true,  owner:"Tech" },
  { id:7, title:"Prepare discipleship curriculum",  stage:"transform", due:"Next week", done:false, owner:"Ministry" },
  { id:8, title:"Student outreach event planning",  stage:"gather",    due:"Next week", done:false, owner:"Missions" },
];

/* ═══════════════════════════════════════════════════════════════
   HOOKS & HELPERS
═══════════════════════════════════════════════════════════════ */
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  return w;
}

function fmt(n) { return n >= 1000 ? `£${(n/1000).toFixed(1)}k` : `£${n}`; }

/* ═══════════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
═══════════════════════════════════════════════════════════════ */
function GlassCard({ children, style = {}, accent }) {
  return (
    <div style={{
      background: `linear-gradient(145deg, ${C.navyMid}, ${C.navy})`,
      border: `1px solid ${accent ? accent + "40" : C.border}`,
      borderRadius: 16,
      padding: 20,
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      {accent && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, ${accent}, ${accent}88)`, borderRadius:"16px 16px 0 0" }} />}
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:2, fontWeight:700, marginBottom:14, fontFamily:FONT_BODY }}>{children}</div>;
}

function Badge({ label, color, small }) {
  return (
    <span style={{ display:"inline-block", padding: small ? "2px 7px" : "3px 10px", borderRadius:99, background:`${color}22`, border:`1px solid ${color}55`, color, fontSize: small ? 10 : 11, fontWeight:700, letterSpacing:0.5 }}>{label}</span>
  );
}

function ProgressBar({ value, max, color, height = 6 }) {
  const pct = Math.min(100, Math.round((value / (max || 1)) * 100));
  return (
    <div style={{ height, borderRadius:99, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${pct}%`, borderRadius:99, background:`linear-gradient(90deg, ${color}, ${color}cc)`, transition:"width 0.7s ease" }} />
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{ background:`${color}14`, border:`1px solid ${color}35`, borderRadius:12, padding:"13px 16px", textAlign:"center" }}>
      <div style={{ fontSize:24, fontWeight:800, color, fontFamily:FONT_MONO }}>{value}</div>
      <div style={{ fontSize:10, color:C.muted, marginTop:4, textTransform:"uppercase", letterSpacing:1 }}>{label}</div>
    </div>
  );
}

function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const w = 64, h = 24;
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h-((v-min)/range)*h}`).join(" ");
  const last = pts.split(" ").pop().split(",");
  return (
    <svg width={w} height={h} style={{ overflow:"visible", flexShrink:0 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <circle cx={last[0]} cy={last[1]} r="2.8" fill={color} />
    </svg>
  );
}

function MetricCard({ label, value, suffix="", color, sparkData, sub, trend }) {
  return (
    <GlassCard accent={color} style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <SectionLabel>{label}</SectionLabel>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", gap:8 }}>
        <span style={{ fontSize:30, fontWeight:800, color, lineHeight:1, fontFamily:FONT_MONO }}>
          {value}<span style={{ fontSize:14, fontWeight:400, color:C.mutedDark, marginLeft:2 }}>{suffix}</span>
        </span>
        {sparkData && <Sparkline data={sparkData} color={color} />}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        {sub && <span style={{ fontSize:11, color:C.mutedDark }}>{sub}</span>}
        {trend !== undefined && <span style={{ fontSize:11, fontWeight:700, color: trend >= 0 ? C.emeraldMid : C.roseMid }}>{trend >= 0 ? "↑" : "↓"} {Math.abs(Math.round(trend))}%</span>}
      </div>
    </GlassCard>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(7,14,40,0.88)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:2000, padding:16 }}>
      <div style={{ background:C.navyMid, border:`1px solid ${C.borderLight}`, borderRadius:18, padding:30, width:340, maxWidth:"100%", textAlign:"center" }}>
        <div style={{ fontSize:34, marginBottom:12 }}>🗑</div>
        <div style={{ fontSize:15, color:C.white, marginBottom:8, fontWeight:700, fontFamily:FONT_HEAD }}>Confirm Delete</div>
        <div style={{ fontSize:13, color:C.muted, marginBottom:24, lineHeight:1.6 }}>{message}</div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"11px", borderRadius:10, border:`1px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:FONT_BODY }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"11px", borderRadius:10, border:"none", background:C.rose, color:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:FONT_BODY }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PIPELINE FUNNEL
═══════════════════════════════════════════════════════════════ */
function PipelineFunnel({ people, onStageClick, activeStage }) {
  const total = people.length || 1;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      {IGNITE_STAGES.map((stage, i) => {
        const cum = people.filter(p => IGNITE_STAGES.findIndex(s => s.key === p.stage) >= i).length;
        const exact = people.filter(p => p.stage === stage.key).length;
        const pct = Math.round((cum / total) * 100);
        const isActive = activeStage === stage.key;
        return (
          <div key={stage.key} onClick={() => onStageClick(stage.key)}
            style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:10, padding:"10px 13px", borderRadius:10, background: isActive ? `${stage.color}20` : C.glass, border:`1px solid ${isActive ? stage.color+"70" : C.border}`, transition:"all 0.2s" }}>
            <span style={{ fontSize:14, minWidth:18, color:stage.color }}>{stage.icon}</span>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:11, fontWeight:700, color:C.offwhite, letterSpacing:0.8, textTransform:"uppercase", fontFamily:FONT_BODY }}>{stage.label}</span>
                <span style={{ fontSize:11, color:stage.color, fontWeight:700 }}>{exact} <span style={{ color:C.mutedDark, fontWeight:400 }}>({pct}%)</span></span>
              </div>
              <ProgressBar value={cum} max={total} color={stage.color} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADD PERSON MODAL
═══════════════════════════════════════════════════════════════ */
function AddPersonModal({ onAdd, onClose }) {
  const [form, setForm] = useState({ name:"", stage:"gather", source:"Friend Invite", firstVisit: new Date().toISOString().slice(0,10) });
  const sources = ["Friend Invite","Social Media","Website","Campus Event","Outreach Event","Walk-in","Other"];
  const inputStyle = { width:"100%", background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:9, padding:"10px 12px", color:C.white, fontSize:13, boxSizing:"border-box", fontFamily:FONT_BODY };
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(7,14,40,0.88)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
      <GlassCard style={{ width:420, maxWidth:"100%", maxHeight:"90vh", overflowY:"auto", padding:28 }}>
        <div style={{ fontSize:20, fontWeight:700, color:C.white, marginBottom:22, fontFamily:FONT_HEAD }}>Add New Person</div>
        {[["Full Name","name","text"],["First Visit Date","firstVisit","date"]].map(([l,k,t]) => (
          <div key={k} style={{ marginBottom:14 }}>
            <label style={{ fontSize:10, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", display:"block", marginBottom:5, fontFamily:FONT_BODY }}>{l}</label>
            <input type={t} value={form[k]} onChange={e => setForm(p=>({...p,[k]:e.target.value}))} style={inputStyle} />
          </div>
        ))}
        {[["IGNITE Stage","stage",IGNITE_STAGES.map(s=>({v:s.key,l:s.label}))],["How They Found Us","source",sources.map(s=>({v:s,l:s}))]].map(([l,k,opts]) => (
          <div key={k} style={{ marginBottom:14 }}>
            <label style={{ fontSize:10, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", display:"block", marginBottom:5, fontFamily:FONT_BODY }}>{l}</label>
            <select value={form[k]} onChange={e => setForm(p=>({...p,[k]:e.target.value}))} style={{ ...inputStyle, cursor:"pointer", background:C.navy }}>
              {opts.map(o => <option key={o.v} value={o.v} style={{ background:C.navy }}>{o.l}</option>)}
            </select>
          </div>
        ))}
        <div style={{ display:"flex", gap:10, marginTop:22 }}>
          <button onClick={onClose} style={{ flex:1, padding:"11px", borderRadius:10, border:`1px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:FONT_BODY }}>Cancel</button>
          <button onClick={() => { if(form.name.trim()){ onAdd({...form,id:Date.now(),followedUp:false,inGroup:false,serving:false,giving:false}); onClose(); }}}
            style={{ flex:2, padding:"11px", borderRadius:10, border:"none", background:`linear-gradient(135deg, ${C.blueMid}, ${C.emerald})`, color:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:FONT_BODY }}>
            Add to Pipeline
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD VIEW
═══════════════════════════════════════════════════════════════ */
function DashboardView({ people, tasks, volunteers, budgets, donors }) {
  const [activeStage, setActiveStage] = useState(null);
  const total = people.length || 1;
  const pending = people.filter(p => !p.followedUp).length;
  const followUpRate = Math.round((people.filter(p=>p.followedUp).length/total)*100);
  const engageRate   = Math.round((people.filter(p=>p.inGroup||p.serving||p.giving).length/total)*100);
  const groupPct     = Math.round((people.filter(p=>p.inGroup).length/total)*100);
  const givingPct    = Math.round((people.filter(p=>p.giving).length/total)*100);
  const openTasks    = tasks.filter(t=>!t.done).length;
  const activeVols   = volunteers.filter(v=>v.status==="Active").length;
  const totalGiving  = donors.filter(d=>d.status==="Active").reduce((s,d)=>s+(d.frequency==="Weekly"?d.amount*4:d.frequency==="Monthly"?d.amount:d.amount/3),0);
  const totalBudget  = budgets.reduce((s,b)=>s+b.allocated,0);
  const stageFiltered = activeStage ? people.filter(p=>p.stage===activeStage) : null;

  return (
    <div>
      {/* Hero welcome strip */}
      <div style={{ background:`linear-gradient(135deg, ${C.navyLight} 0%, ${C.navy} 60%, ${C.emerald}22 100%)`, border:`1px solid ${C.blueMid}40`, borderRadius:18, padding:"22px 26px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:700, color:C.white, fontFamily:FONT_HEAD, marginBottom:4 }}>Welcome back to GoReach 🙏</div>
          <div style={{ fontSize:13, color:C.muted }}>Your church community is growing. Here's today's snapshot.</div>
        </div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          {pending>0 && <div style={{ background:"rgba(228,29,72,0.15)", border:`1px solid ${C.rose}40`, borderRadius:10, padding:"9px 14px" }}><span style={{ fontSize:12, color:C.roseMid, fontWeight:700 }}>⚠ {pending} follow-up{pending>1?"s":""} needed</span></div>}
          <div style={{ background:`${C.emerald}18`, border:`1px solid ${C.emerald}40`, borderRadius:10, padding:"9px 14px" }}><span style={{ fontSize:12, color:C.emeraldMid, fontWeight:700 }}>● Live · {people.length} in pipeline</span></div>
        </div>
      </div>

      {/* Key metrics */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(155px, 1fr))", gap:12, marginBottom:18 }}>
        <MetricCard label="Total People"       value={people.length}  color={C.blueMid}    sparkData={[Math.max(1,people.length-13),Math.max(1,people.length-9),Math.max(1,people.length-5),people.length]} sub="In pipeline" trend={4.2} />
        <MetricCard label="Follow-up Rate"     value={followUpRate}   suffix="%" color={C.emeraldMid} sparkData={[65,70,74,followUpRate]} sub="Within 48h" />
        <MetricCard label="Engagement Rate"    value={engageRate}     suffix="%" color={C.sky}        sparkData={[45,50,55,engageRate]} sub="Active in church" />
        <MetricCard label="Small Groups"       value={groupPct}       suffix="%" color={C.teal}       sparkData={[30,35,40,groupPct]} sub="Participating" />
        <MetricCard label="Active Volunteers"  value={activeVols}     color={C.violetMid}  sub={`of ${volunteers.length} total`} />
        <MetricCard label="Monthly Giving Est." value={`£${Math.round(totalGiving).toLocaleString()}`} color={C.goldMid} sub="From tracked donors" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:14, marginBottom:14 }}>
        {/* IGNITE Pipeline */}
        <GlassCard accent={C.blueMid}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <SectionLabel>IGNITE Pipeline</SectionLabel>
            {activeStage && <button onClick={()=>setActiveStage(null)} style={{ fontSize:11, color:C.muted, background:"none", border:"none", cursor:"pointer", fontFamily:FONT_BODY }}>Clear ×</button>}
          </div>
          <PipelineFunnel people={people} onStageClick={s=>setActiveStage(activeStage===s?null:s)} activeStage={activeStage} />
          {activeStage && stageFiltered && (
            <div style={{ marginTop:12, padding:"10px 12px", background:C.glass, borderRadius:9, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10, color:C.muted, marginBottom:5, textTransform:"uppercase", letterSpacing:1 }}>In {activeStage} ({stageFiltered.length})</div>
              {stageFiltered.length===0 ? <div style={{ fontSize:12, color:C.mutedDark }}>No one at this stage yet</div>
                : stageFiltered.map(p=><div key={p.id} style={{ fontSize:12, color:C.offwhite, padding:"3px 0", borderBottom:`1px solid ${C.border}` }}>{p.name}</div>)}
            </div>
          )}
        </GlassCard>

        {/* Open tasks */}
        <GlassCard accent={C.goldMid}>
          <SectionLabel>Open Action Items</SectionLabel>
          {tasks.filter(t=>!t.done).length===0
            ? <div style={{ fontSize:13, color:C.mutedDark, textAlign:"center", padding:"20px 0" }}>All caught up ✓</div>
            : tasks.filter(t=>!t.done).slice(0,6).map(task=>{
                const s=IGNITE_STAGES.find(x=>x.key===task.stage);
                return (
                  <div key={task.id} style={{ display:"flex", gap:8, padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                    <span style={{ color:s.color, fontSize:11, marginTop:2, flexShrink:0 }}>{s.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, color:C.offwhite, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{task.title}</div>
                      <div style={{ fontSize:10, color:C.mutedDark, marginTop:1 }}>{task.due} · {task.owner}</div>
                    </div>
                  </div>
                );
              })
          }
        </GlassCard>

        {/* Volunteer snapshot */}
        <GlassCard accent={C.violetMid}>
          <SectionLabel>Volunteer Capacity</SectionLabel>
          {VOLUNTEER_ROLES.slice(0,5).map(role=>{
            const pct=Math.round((role.filled/role.slots)*100);
            return (
              <div key={role.id} style={{ marginBottom:10 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:11, color:C.offwhite, fontWeight:600 }}>{role.team}</span>
                  <span style={{ fontSize:11, color: pct===100 ? C.emeraldMid : pct>=50 ? C.goldMid : C.roseMid, fontWeight:700 }}>{role.filled}/{role.slots}</span>
                </div>
                <ProgressBar value={role.filled} max={role.slots} color={pct===100?C.emeraldMid:pct>=50?C.goldMid:C.roseMid} />
              </div>
            );
          })}
        </GlassCard>

        {/* Giving snapshot */}
        <GlassCard accent={C.goldMid}>
          <SectionLabel>Financial Snapshot</SectionLabel>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
            <StatPill label="Budget" value={fmt(totalBudget)} color={C.blueMid} />
            <StatPill label="Est. Monthly" value={`£${Math.round(totalGiving).toLocaleString()}`} color={C.goldMid} />
          </div>
          {budgets.slice(0,4).map(b=>{
            const pct=Math.round((b.spent/b.allocated)*100);
            return (
              <div key={b.id} style={{ marginBottom:9 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:11, color:C.offwhite }}>{b.team}</span>
                  <span style={{ fontSize:11, color:pct>90?C.roseMid:C.emeraldMid, fontWeight:700 }}>{fmt(b.spent)} / {fmt(b.allocated)}</span>
                </div>
                <ProgressBar value={b.spent} max={b.allocated} color={pct>90?C.roseMid:pct>70?C.goldMid:C.emeraldMid} height={4} />
              </div>
            );
          })}
        </GlassCard>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PEOPLE VIEW
═══════════════════════════════════════════════════════════════ */
function PeopleView({ people, setPeople }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const width = useWindowWidth();
  const isMobile = width < 720;

  const filtered = people.filter(p =>
    (filter==="all"||p.stage===filter) &&
    (p.name.toLowerCase().includes(search.toLowerCase())||p.source.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUpdate = (id, updates) => setPeople(prev=>prev.map(p=>p.id===id?{...p,...updates}:p));
  const handleDelete = id => setConfirmDelete(people.find(p=>p.id===id));
  const confirmDel = () => { setPeople(prev=>prev.filter(p=>p.id!==confirmDelete.id)); setConfirmDelete(null); };

  const inputStyle = { background:C.glass, border:`1px solid ${C.border}`, borderRadius:9, padding:"9px 13px", color:C.white, fontSize:13, fontFamily:FONT_BODY };

  const Dot = ({ active, color, field, personId }) => (
    <div onClick={()=>handleUpdate(personId,{[field]:!active})}
      style={{ width:11, height:11, borderRadius:"50%", background: active?color:"rgba(255,255,255,0.07)", border:`1.5px solid ${active?color:"rgba(255,255,255,0.15)"}`, cursor:"pointer", transition:"all 0.15s" }} />
  );

  return (
    <div>
      {confirmDelete && <ConfirmModal message={`Remove ${confirmDelete.name} from the pipeline?`} onConfirm={confirmDel} onCancel={()=>setConfirmDelete(null)} />}

      <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap", alignItems:"center" }}>
        <input placeholder="Search people…" value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inputStyle, flex:1, minWidth:160 }} />
        <button onClick={()=>setShowAdd(true)} style={{ padding:"9px 18px", borderRadius:10, border:"none", background:`linear-gradient(135deg, ${C.blueMid}, ${C.emerald})`, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:FONT_BODY, whiteSpace:"nowrap" }}>+ Add Person</button>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
        {[{key:"all",label:"All",color:C.muted},...IGNITE_STAGES].map(s=>(
          <button key={s.key} onClick={()=>setFilter(s.key)}
            style={{ padding:"5px 12px", borderRadius:7, border:`1px solid ${filter===s.key?s.color:C.border}`, background: filter===s.key?`${s.color}20`:C.glass, color: filter===s.key?s.color:C.muted, fontSize:11, cursor:"pointer", fontFamily:FONT_BODY, fontWeight:600 }}>
            {s.key==="all"?`All (${people.length})`:`${s.label} (${people.filter(p=>p.stage===s.key).length})`}
          </button>
        ))}
      </div>

      {!isMobile && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 150px 68px 68px 68px 68px 110px 34px", gap:8, padding:"5px 13px", marginBottom:6 }}>
          {["Name","Stage","Followed Up","In Group","Serving","Giving","First Visit",""].map((h,i)=>(
            <div key={i} style={{ fontSize:9, color:C.mutedDark, textTransform:"uppercase", letterSpacing:1.5, textAlign:i>1&&i<6?"center":i===6?"right":"left" }}>{h}</div>
          ))}
        </div>
      )}

      {filtered.length===0
        ? <div style={{ textAlign:"center", color:C.mutedDark, padding:48, fontSize:14 }}>No people match your filters.</div>
        : filtered.map(person=>{
            const stage=IGNITE_STAGES.find(s=>s.key===person.stage);
            if(isMobile) return (
              <GlassCard key={person.id} style={{ marginBottom:9, padding:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div>
                    <div style={{ fontWeight:700, color:C.white, fontSize:14, fontFamily:FONT_HEAD }}>{person.name}</div>
                    <div style={{ fontSize:10, color:C.mutedDark, marginTop:2 }}>via {person.source} · {person.firstVisit}</div>
                  </div>
                  <div style={{ display:"flex", gap:7 }}>
                    <select value={person.stage} onChange={e=>handleUpdate(person.id,{stage:e.target.value})}
                      style={{ background:`${stage.color}25`, border:`1px solid ${stage.color}60`, borderRadius:7, color:stage.color, fontSize:10, padding:"4px 7px", fontWeight:700, cursor:"pointer" }}>
                      {IGNITE_STAGES.map(s=><option key={s.key} value={s.key} style={{ background:C.navy }}>{s.label}</option>)}
                    </select>
                    <button onClick={()=>handleDelete(person.id)} style={{ background:`${C.rose}18`, border:`1px solid ${C.rose}30`, borderRadius:7, color:C.roseMid, cursor:"pointer", padding:"4px 8px", fontSize:12 }}>✕</button>
                  </div>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {[{f:"followedUp",c:C.emeraldMid,l:"Followed Up"},{f:"inGroup",c:C.blueMid,l:"In Group"},{f:"serving",c:C.violetMid,l:"Serving"},{f:"giving",c:C.goldMid,l:"Giving"}].map(x=>(
                    <button key={x.f} onClick={()=>handleUpdate(person.id,{[x.f]:!person[x.f]})}
                      style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 9px", borderRadius:7, border:`1px solid ${person[x.f]?x.c:C.border}`, background: person[x.f]?`${x.c}18`:C.glass, cursor:"pointer" }}>
                      <div style={{ width:7, height:7, borderRadius:"50%", background: person[x.f]?x.c:"rgba(255,255,255,0.1)" }} />
                      <span style={{ fontSize:10, color: person[x.f]?x.c:C.muted, fontWeight:600 }}>{x.l}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            );
            return (
              <div key={person.id}
                style={{ display:"grid", gridTemplateColumns:"1fr 150px 68px 68px 68px 68px 110px 34px", alignItems:"center", gap:8, padding:"11px 13px", borderRadius:10, background:C.glass, border:`1px solid ${C.border}`, marginBottom:5, transition:"background 0.15s" }}
                onMouseEnter={e=>e.currentTarget.style.background=C.glassMid}
                onMouseLeave={e=>e.currentTarget.style.background=C.glass}>
                <div>
                  <div style={{ fontWeight:600, color:C.white, fontSize:13, fontFamily:FONT_HEAD }}>{person.name}</div>
                  <div style={{ fontSize:10, color:C.mutedDark, marginTop:1 }}>via {person.source}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ color:stage.color, fontSize:10 }}>{stage.icon}</span>
                  <select value={person.stage} onChange={e=>handleUpdate(person.id,{stage:e.target.value})}
                    style={{ background:`${stage.color}20`, border:`1px solid ${stage.color}55`, borderRadius:6, color:stage.color, fontSize:10, padding:"3px 5px", fontWeight:700, cursor:"pointer" }}>
                    {IGNITE_STAGES.map(s=><option key={s.key} value={s.key} style={{ background:C.navy }}>{s.label}</option>)}
                  </select>
                </div>
                <div style={{ display:"flex", justifyContent:"center" }}><Dot active={person.followedUp} color={C.emeraldMid} field="followedUp" personId={person.id} /></div>
                <div style={{ display:"flex", justifyContent:"center" }}><Dot active={person.inGroup}    color={C.blueMid}    field="inGroup"    personId={person.id} /></div>
                <div style={{ display:"flex", justifyContent:"center" }}><Dot active={person.serving}    color={C.violetMid}  field="serving"    personId={person.id} /></div>
                <div style={{ display:"flex", justifyContent:"center" }}><Dot active={person.giving}     color={C.goldMid}    field="giving"     personId={person.id} /></div>
                <div style={{ fontSize:10, color:C.mutedDark, textAlign:"right" }}>{person.firstVisit}</div>
                <button onClick={()=>handleDelete(person.id)}
                  style={{ background:"none", border:"none", color:C.roseMid, cursor:"pointer", fontSize:13, opacity:0.3, padding:3, borderRadius:4, transition:"opacity 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.3"}>✕</button>
              </div>
            );
          })
      }

      {showAdd && <AddPersonModal onAdd={p=>setPeople(prev=>[p,...prev])} onClose={()=>setShowAdd(false)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TASKS VIEW
═══════════════════════════════════════════════════════════════ */
function TasksView({ tasks, setTasks }) {
  const [form, setForm] = useState({ title:"", stage:"navigate", owner:"", due:"This week" });
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const width = useWindowWidth();
  const isMobile = width<640;

  const toggle = id => setTasks(prev=>prev.map(t=>t.id===id?{...t,done:!t.done}:t));
  const add = () => { if(form.title.trim()){ setTasks(prev=>[...prev,{...form,id:Date.now(),done:false}]); setForm({title:"",stage:"navigate",owner:"",due:"This week"}); setShowForm(false); }};
  const confirmDel = () => { setTasks(prev=>prev.filter(t=>t.id!==confirmDelete.id)); setConfirmDelete(null); };

  const TaskItem = ({task}) => {
    const s = IGNITE_STAGES.find(x=>x.key===task.stage);
    return (
      <div style={{ display:"flex", gap:10, alignItems:"center", padding:"11px 13px", borderRadius:10, background: task.done?C.glass:C.glassMid, border:`1px solid ${C.border}`, marginBottom:5, opacity: task.done?0.4:1, transition:"opacity 0.2s" }}>
        <div onClick={()=>toggle(task.id)} style={{ width:17, height:17, borderRadius:5, border:`2px solid ${task.done?s.color:"rgba(255,255,255,0.2)"}`, background: task.done?s.color:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer" }}>
          {task.done && <span style={{ color:"#000", fontSize:9, fontWeight:900 }}>✓</span>}
        </div>
        <span style={{ color:s.color, fontSize:11, flexShrink:0 }}>{s.icon}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, color: task.done?C.muted:C.offwhite, textDecoration: task.done?"line-through":"none", overflow:"hidden", textOverflow:"ellipsis", whiteSpace: isMobile?"normal":"nowrap" }}>{task.title}</div>
          {isMobile && <div style={{ fontSize:10, color:C.mutedDark, marginTop:2 }}>{s.label} · {task.owner||"—"} · {task.due}</div>}
        </div>
        {!isMobile && <><Badge label={task.due} color={task.due==="Today"?C.roseMid:C.muted} small /><span style={{ fontSize:11, color:C.mutedDark, flexShrink:0, minWidth:60, textAlign:"right" }}>{task.owner||"—"}</span></>}
        <button onClick={()=>setConfirmDelete(task)} style={{ background:"none", border:"none", color:C.roseMid, cursor:"pointer", fontSize:12, opacity:0.3, padding:"2px 5px", flexShrink:0, transition:"opacity 0.15s" }} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.3"}>✕</button>
      </div>
    );
  };

  return (
    <div>
      {confirmDelete && <ConfirmModal message={`Delete "${confirmDelete.title}"?`} onConfirm={confirmDel} onCancel={()=>setConfirmDelete(null)} />}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:9 }}>
        <div><span style={{ fontSize:13, color:C.emeraldMid, fontWeight:700 }}>{tasks.filter(t=>!t.done).length} open</span><span style={{ fontSize:13, color:C.muted }}> · {tasks.filter(t=>t.done).length} completed</span></div>
        <button onClick={()=>setShowForm(!showForm)} style={{ padding:"9px 18px", borderRadius:10, border:"none", background:`linear-gradient(135deg, ${C.blueMid}, ${C.emerald})`, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:FONT_BODY }}>
          {showForm?"× Cancel":"+ Add Task"}
        </button>
      </div>
      {showForm && (
        <GlassCard style={{ marginBottom:18, padding:16 }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:9, alignItems:"center" }}>
            <input placeholder="Task description…" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} style={{ flex:"2 1 180px", background:C.glass, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 11px", color:C.white, fontSize:13, fontFamily:FONT_BODY }} />
            <select value={form.stage} onChange={e=>setForm(p=>({...p,stage:e.target.value}))} style={{ flex:"1 1 100px", background:C.navy, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 10px", color:C.muted, fontSize:12, fontFamily:FONT_BODY, cursor:"pointer" }}>
              {IGNITE_STAGES.map(s=><option key={s.key} value={s.key} style={{ background:C.navy }}>{s.label}</option>)}
            </select>
            <input placeholder="Owner" value={form.owner} onChange={e=>setForm(p=>({...p,owner:e.target.value}))} style={{ flex:"1 1 90px", background:C.glass, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 11px", color:C.white, fontSize:13, fontFamily:FONT_BODY }} />
            <select value={form.due} onChange={e=>setForm(p=>({...p,due:e.target.value}))} style={{ flex:"1 1 90px", background:C.navy, border:`1px solid ${C.border}`, borderRadius:8, padding:"9px 10px", color:C.muted, fontSize:12, fontFamily:FONT_BODY, cursor:"pointer" }}>
              {["Today","Tomorrow","This week","Next week"].map(d=><option key={d} value={d} style={{ background:C.navy }}>{d}</option>)}
            </select>
            <button onClick={add} style={{ padding:"9px 18px", borderRadius:8, border:"none", background:`linear-gradient(135deg, ${C.blueMid}, ${C.emerald})`, color:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:FONT_BODY }}>Add</button>
          </div>
        </GlassCard>
      )}
      {tasks.filter(t=>!t.done).length>0 && (
        <div style={{ marginBottom:22 }}>
          <SectionLabel>Open — {tasks.filter(t=>!t.done).length}</SectionLabel>
          {tasks.filter(t=>!t.done).map(t=><TaskItem key={t.id} task={t} />)}
        </div>
      )}
      {tasks.filter(t=>t.done).length>0 && (
        <div>
          <SectionLabel>Completed — {tasks.filter(t=>t.done).length}</SectionLabel>
          {tasks.filter(t=>t.done).map(t=><TaskItem key={t.id} task={t} />)}
        </div>
      )}
      {tasks.length===0 && <div style={{ textAlign:"center", color:C.mutedDark, padding:48 }}>No tasks yet. Add your first action item.</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ENGAGEMENT VIEW
═══════════════════════════════════════════════════════════════ */
function EngagementView({ people }) {
  const total = people.length||1;
  const sources = people.reduce((acc,p)=>{acc[p.source]=(acc[p.source]||0)+1;return acc;},{});
  const sorted = Object.entries(sources).sort((a,b)=>b[1]-a[1]);
  const PALETTE = [C.blueMid,C.emeraldMid,C.violetMid,C.sky,C.goldMid,C.teal];
  const levels = [
    { label:"Fully Engaged",     desc:"Followed up · group · serving · giving", count:people.filter(p=>p.followedUp&&p.inGroup&&p.serving&&p.giving).length,    color:C.emeraldMid },
    { label:"Growing",           desc:"In group + giving or serving",            count:people.filter(p=>p.inGroup&&(p.giving||p.serving)&&!(p.followedUp&&p.inGroup&&p.serving&&p.giving)).length, color:C.blueMid },
    { label:"Connected",         desc:"In a small group only",                  count:people.filter(p=>p.inGroup&&!p.serving&&!p.giving).length,                color:C.sky },
    { label:"Engaged",           desc:"Followed up · not yet in group",         count:people.filter(p=>p.followedUp&&!p.inGroup).length,                        color:C.goldMid },
    { label:"New / Uncontacted", desc:"Awaiting first follow-up",               count:people.filter(p=>!p.followedUp).length,                                  color:C.roseMid },
  ];
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(270px, 1fr))", gap:16 }}>
      <GlassCard accent={C.emeraldMid}>
        <SectionLabel>Engagement Levels</SectionLabel>
        {people.length===0
          ? <div style={{ color:C.mutedDark, textAlign:"center", padding:20 }}>Add people to see engagement data</div>
          : levels.map(level=>(
              <div key={level.label} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, gap:8 }}>
                  <div style={{ minWidth:0 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:level.color }}>{level.label}</span>
                    <span style={{ fontSize:10, color:C.muted, marginLeft:6 }}>{level.desc}</span>
                  </div>
                  <span style={{ fontSize:12, color:level.color, fontWeight:700, flexShrink:0 }}>{level.count}</span>
                </div>
                <ProgressBar value={level.count} max={total} color={level.color} />
              </div>
            ))
        }
      </GlassCard>
      <GlassCard accent={C.sky}>
        <SectionLabel>Discovery Sources</SectionLabel>
        {sorted.length===0
          ? <div style={{ color:C.mutedDark, textAlign:"center", padding:20 }}>No data yet</div>
          : sorted.map(([source,count],i)=>(
              <div key={source} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:11 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:PALETTE[i%PALETTE.length], flexShrink:0 }} />
                <span style={{ flex:1, fontSize:12, color:C.offwhite, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{source}</span>
                <div style={{ flex:2, height:5, borderRadius:99, background:"rgba(255,255,255,0.05)" }}>
                  <div style={{ height:"100%", width:`${(count/total)*100}%`, borderRadius:99, background:PALETTE[i%PALETTE.length], transition:"width 0.5s" }} />
                </div>
                <span style={{ fontSize:11, color:C.muted, minWidth:22, textAlign:"right" }}>{count}</span>
              </div>
            ))
        }
      </GlassCard>
      <div style={{ gridColumn:"1 / -1", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:12 }}>
        {[{l:"Followed Up",f:"followedUp",c:C.emeraldMid},{l:"In Groups",f:"inGroup",c:C.blueMid},{l:"Serving",f:"serving",c:C.violetMid},{l:"Giving",f:"giving",c:C.goldMid}].map(m=>{
          const raw=people.filter(p=>p[m.f]).length;
          return <StatPill key={m.l} label={`${m.l} · ${raw} of ${people.length}`} value={`${Math.round((raw/total)*100)}%`} color={m.c} />;
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VOLUNTEERS VIEW  (Page 19 of build guide)
═══════════════════════════════════════════════════════════════ */
function VolunteersView({ volunteers, setVolunteers }) {
  const [activeTab, setActiveTab] = useState("roster");
  const [showAdd, setShowAdd] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ name:"", role:VOLUNTEER_ROLES[0].team, status:"Training", signupDate: new Date().toISOString().slice(0,10), deployedDate:"", phone:"", notes:"" });
  const width = useWindowWidth();
  const isMobile = width < 700;

  const activeVols   = volunteers.filter(v=>v.status==="Active");
  const trainingVols = volunteers.filter(v=>v.status==="Training");
  const retainedPct  = volunteers.length ? Math.round((volunteers.filter(v=>v.retained).length/volunteers.length)*100) : 0;
  const avgDeploy    = volunteers.filter(v=>v.deployedDate&&v.signupDate).length
    ? Math.round(volunteers.filter(v=>v.deployedDate&&v.signupDate).reduce((s,v)=>{
        const days=(new Date(v.deployedDate)-new Date(v.signupDate))/(1000*60*60*24);
        return s+days;
      },0)/volunteers.filter(v=>v.deployedDate&&v.signupDate).length)
    : "—";

  const addVolunteer = () => {
    if(form.name.trim()){ setVolunteers(prev=>[{...form,id:Date.now(),retained:false},...prev]); setShowAdd(false); setForm({name:"",role:VOLUNTEER_ROLES[0].team,status:"Training",signupDate:new Date().toISOString().slice(0,10),deployedDate:"",phone:"",notes:""}); }
  };
  const confirmDel = () => { setVolunteers(prev=>prev.filter(v=>v.id!==confirmDelete.id)); setConfirmDelete(null); };
  const updateVol = (id,updates) => setVolunteers(prev=>prev.map(v=>v.id===id?{...v,...updates}:v));

  const tabs = ["roster","roles","metrics"];

  return (
    <div>
      {confirmDelete && <ConfirmModal message={`Remove ${confirmDelete.name} from volunteers?`} onConfirm={confirmDel} onCancel={()=>setConfirmDelete(null)} />}

      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:12, marginBottom:18 }}>
        <StatPill label="Active Volunteers" value={activeVols.length}   color={C.emeraldMid} />
        <StatPill label="In Training"        value={trainingVols.length} color={C.blueMid} />
        <StatPill label="Retention Rate"     value={`${retainedPct}%`}  color={C.goldMid} />
        <StatPill label="Avg Days to Deploy" value={avgDeploy}           color={C.violetMid} />
        <StatPill label="Total Volunteers"   value={volunteers.length}   color={C.sky} />
      </div>

      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            style={{ padding:"7px 16px", borderRadius:8, border:`1px solid ${activeTab===t?C.violetMid:C.border}`, background: activeTab===t?`${C.violetMid}20`:C.glass, color: activeTab===t?C.violetMid:C.muted, fontSize:12, cursor:"pointer", fontFamily:FONT_BODY, fontWeight:600, textTransform:"capitalize" }}>
            {t==="roster"?"👥 Volunteer Roster":t==="roles"?"📋 Role Openings":"📊 Metrics"}
          </button>
        ))}
        <div style={{ flex:1 }} />
        <button onClick={()=>setShowAdd(true)} style={{ padding:"7px 18px", borderRadius:8, border:"none", background:`linear-gradient(135deg, ${C.violetMid}, ${C.blueMid})`, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:FONT_BODY }}>+ Add Volunteer</button>
      </div>

      {/* Add volunteer modal */}
      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(7,14,40,0.88)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
          <GlassCard style={{ width:460, maxWidth:"100%", maxHeight:"90vh", overflowY:"auto", padding:28 }}>
            <div style={{ fontSize:20, fontWeight:700, color:C.white, marginBottom:22, fontFamily:FONT_HEAD }}>Add New Volunteer</div>
            {[["Full Name","name","text"],["Sign-up Date","signupDate","date"],["Phone (optional)","phone","text"]].map(([l,k,t])=>(
              <div key={k} style={{ marginBottom:13 }}>
                <label style={{ fontSize:10, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", display:"block", marginBottom:5 }}>{l}</label>
                <input type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} style={{ width:"100%", background:C.glass, border:`1px solid ${C.border}`, borderRadius:9, padding:"9px 12px", color:C.white, fontSize:13, boxSizing:"border-box", fontFamily:FONT_BODY }} />
              </div>
            ))}
            {[["Role",VOLUNTEER_ROLES.map(r=>({v:r.team,l:r.team}))],["Status",[{v:"Training",l:"Training"},{v:"Active",l:"Active"},{v:"On Leave",l:"On Leave"}]]].map(([l,opts])=>(
              <div key={l} style={{ marginBottom:13 }}>
                <label style={{ fontSize:10, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", display:"block", marginBottom:5 }}>{l}</label>
                <select value={form[l==="Role"?"role":"status"]} onChange={e=>setForm(p=>({...p,[l==="Role"?"role":"status"]:e.target.value}))} style={{ width:"100%", background:C.navy, border:`1px solid ${C.border}`, borderRadius:9, padding:"9px 12px", color:C.offwhite, fontSize:13, boxSizing:"border-box", fontFamily:FONT_BODY, cursor:"pointer" }}>
                  {opts.map(o=><option key={o.v} value={o.v} style={{ background:C.navy }}>{o.l}</option>)}
                </select>
              </div>
            ))}
            <div style={{ marginBottom:13 }}>
              <label style={{ fontSize:10, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", display:"block", marginBottom:5 }}>Notes</label>
              <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={2} style={{ width:"100%", background:C.glass, border:`1px solid ${C.border}`, borderRadius:9, padding:"9px 12px", color:C.white, fontSize:13, boxSizing:"border-box", fontFamily:FONT_BODY, resize:"none" }} />
            </div>
            <div style={{ display:"flex", gap:10, marginTop:20 }}>
              <button onClick={()=>setShowAdd(false)} style={{ flex:1, padding:"11px", borderRadius:10, border:`1px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:FONT_BODY }}>Cancel</button>
              <button onClick={addVolunteer} style={{ flex:2, padding:"11px", borderRadius:10, border:"none", background:`linear-gradient(135deg, ${C.violetMid}, ${C.blueMid})`, color:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:FONT_BODY }}>Add Volunteer</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* ROSTER tab */}
      {activeTab==="roster" && (
        <div>
          {volunteers.length===0 && <div style={{ textAlign:"center", color:C.mutedDark, padding:48 }}>No volunteers yet. Add your first volunteer.</div>}
          {volunteers.map(vol=>(
            <GlassCard key={vol.id} style={{ marginBottom:9, padding:isMobile?14:"14px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
                <div style={{ flex:1, minWidth:180 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                    <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg, ${C.blueMid}, ${C.violetMid})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:"#fff", fontWeight:700, flexShrink:0 }}>{vol.name.charAt(0)}</div>
                    <div>
                      <div style={{ fontWeight:700, color:C.white, fontSize:14, fontFamily:FONT_HEAD }}>{vol.name}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{vol.role}</div>
                    </div>
                  </div>
                  {vol.notes && <div style={{ fontSize:11, color:C.mutedDark, marginLeft:44, fontStyle:"italic" }}>{vol.notes}</div>}
                </div>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                  <select value={vol.status} onChange={e=>updateVol(vol.id,{status:e.target.value,retained:e.target.value==="Active"})}
                    style={{ background: vol.status==="Active"?`${C.emerald}20`:vol.status==="Training"?`${C.blueMid}20`:`${C.goldMid}20`, border:`1px solid ${vol.status==="Active"?C.emerald:vol.status==="Training"?C.blueMid:C.goldMid}55`, borderRadius:7, color: vol.status==="Active"?C.emeraldMid:vol.status==="Training"?C.blueLight:C.goldMid, fontSize:11, padding:"5px 8px", fontWeight:700, cursor:"pointer" }}>
                    <option value="Training" style={{ background:C.navy }}>Training</option>
                    <option value="Active"   style={{ background:C.navy }}>Active</option>
                    <option value="On Leave" style={{ background:C.navy }}>On Leave</option>
                  </select>
                  <div style={{ fontSize:10, color:C.mutedDark }}>Since {vol.signupDate}</div>
                  <button onClick={()=>setConfirmDelete(vol)} style={{ background:`${C.rose}18`, border:`1px solid ${C.rose}30`, borderRadius:7, color:C.roseMid, cursor:"pointer", padding:"5px 9px", fontSize:11 }}>✕</button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* ROLES tab */}
      {activeTab==="roles" && (
        <div>
          <div style={{ background:`${C.blueMid}15`, border:`1px solid ${C.blueMid}30`, borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:C.blueLight }}>
            💡 Define roles clearly and embed sign-up calls in Sunday services, follow-up messages, and events to build your volunteer pipeline.
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:12 }}>
            {VOLUNTEER_ROLES.map(role=>{
              const pct=Math.round((role.filled/role.slots)*100);
              const statusColor = pct===100?C.emeraldMid:pct>=50?C.goldMid:C.roseMid;
              return (
                <GlassCard key={role.id} accent={statusColor} style={{ padding:18 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:C.white, marginBottom:3, fontFamily:FONT_HEAD }}>{role.team}</div>
                      <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>{role.description}</div>
                      <Badge label={role.commitment} color={C.sky} small />
                    </div>
                    <div style={{ textAlign:"center", marginLeft:12, flexShrink:0 }}>
                      <div style={{ fontSize:20, fontWeight:800, color:statusColor, fontFamily:FONT_MONO }}>{role.filled}/{role.slots}</div>
                      <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>filled</div>
                    </div>
                  </div>
                  <ProgressBar value={role.filled} max={role.slots} color={statusColor} height={7} />
                  {pct<100 && <div style={{ marginTop:8, fontSize:11, color:statusColor }}>⚡ {role.slots-role.filled} spot{role.slots-role.filled>1?"s":""} open — recruit now</div>}
                  {pct===100 && <div style={{ marginTop:8, fontSize:11, color:C.emeraldMid }}>✓ Fully staffed</div>}
                </GlassCard>
              );
            })}
          </div>
        </div>
      )}

      {/* METRICS tab */}
      {activeTab==="metrics" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(270px, 1fr))", gap:16 }}>
          <GlassCard accent={C.violetMid}>
            <SectionLabel>Volunteers by Role</SectionLabel>
            {VOLUNTEER_ROLES.map(role=>{
              const count=volunteers.filter(v=>v.role===role.team).length;
              return (
                <div key={role.id} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <span style={{ flex:"0 0 160px", fontSize:11, color:C.offwhite, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{role.team}</span>
                  <div style={{ flex:1, height:5, borderRadius:99, background:"rgba(255,255,255,0.06)" }}>
                    <div style={{ height:"100%", width:`${(count/Math.max(volunteers.length,1))*100}%`, borderRadius:99, background:C.violetMid }} />
                  </div>
                  <span style={{ fontSize:11, color:C.violetMid, fontWeight:700, minWidth:20, textAlign:"right" }}>{count}</span>
                </div>
              );
            })}
          </GlassCard>
          <GlassCard accent={C.emeraldMid}>
            <SectionLabel>Key Metrics</SectionLabel>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {[
                { label:"Total Volunteers",        value:volunteers.length,       color:C.blueMid },
                { label:"Active & Deployed",        value:activeVols.length,       color:C.emeraldMid },
                { label:"In Training",              value:trainingVols.length,     color:C.sky },
                { label:"4-6 Week Retention",       value:`${retainedPct}%`,       color:C.goldMid },
                { label:"Avg Days to First Deploy", value:avgDeploy,              color:C.violetMid },
                { label:"% of Congregation Serving",value:`${people?Math.round((activeVols.length/10)*100):0}%`, color:C.teal },
              ].map(m=>(
                <div key={m.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:12, color:C.muted }}>{m.label}</span>
                  <span style={{ fontSize:16, fontWeight:800, color:m.color, fontFamily:FONT_MONO }}>{m.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard accent={C.goldMid} style={{ gridColumn:"1 / -1" }}>
            <SectionLabel>Capacity Overview — All Roles</SectionLabel>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:10 }}>
              {VOLUNTEER_ROLES.map(role=>{
                const pct=Math.round((role.filled/role.slots)*100);
                return (
                  <div key={role.id} style={{ background:C.glass, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:11, color:C.offwhite, fontWeight:600 }}>{role.team}</span>
                      <span style={{ fontSize:11, color: pct===100?C.emeraldMid:pct>=50?C.goldMid:C.roseMid, fontWeight:700 }}>{pct}%</span>
                    </div>
                    <ProgressBar value={role.filled} max={role.slots} color={pct===100?C.emeraldMid:pct>=50?C.goldMid:C.roseMid} />
                    <div style={{ fontSize:10, color:C.mutedDark, marginTop:5 }}>{role.filled} of {role.slots} slots · {role.commitment}</div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FINANCE VIEW  (Page 20 of build guide)
═══════════════════════════════════════════════════════════════ */
function FinanceView({ budgets, setBudgets, donors, setDonors }) {
  const [activeTab, setActiveTab] = useState("budgets");
  const [showAddDonor, setShowAddDonor] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [donorForm, setDonorForm] = useState({ name:"", tier:"Regular Giver", amount:"", frequency:"Monthly", status:"Active", notes:"" });
  const width = useWindowWidth();

  const totalAllocated = budgets.reduce((s,b)=>s+b.allocated,0);
  const totalSpent     = budgets.reduce((s,b)=>s+b.spent,0);
  const totalRemaining = totalAllocated - totalSpent;
  const monthlyGiving  = donors.filter(d=>d.status==="Active").reduce((s,d)=>s+(d.frequency==="Weekly"?d.amount*4:d.frequency==="Monthly"?d.amount:d.amount/3),0);
  const capitalDonors  = donors.filter(d=>d.tier==="Capital Group").length;
  const activeDonors   = donors.filter(d=>d.status==="Active").length;

  const updateBudget = (id,updates) => setBudgets(prev=>prev.map(b=>b.id===id?{...b,...updates}:b));
  const addDonor = () => {
    if(donorForm.name.trim()&&donorForm.amount){ setDonors(prev=>[{...donorForm,id:Date.now(),amount:Number(donorForm.amount),lastContact:new Date().toISOString().slice(0,10)},...prev]); setShowAddDonor(false); setDonorForm({name:"",tier:"Regular Giver",amount:"",frequency:"Monthly",status:"Active",notes:""}); }
  };
  const confirmDel = () => { setDonors(prev=>prev.filter(d=>d.id!==confirmDelete.id)); setConfirmDelete(null); };

  const tierColor = t => t==="Capital Group"?C.goldMid:t==="Major Donor"?C.emeraldMid:C.blueMid;

  return (
    <div>
      {confirmDelete && <ConfirmModal message={`Remove ${confirmDelete.name} from donor records?`} onConfirm={confirmDel} onCancel={()=>setConfirmDelete(null)} />}

      {/* Summary row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:12, marginBottom:18 }}>
        <StatPill label="Total Budget"       value={fmt(totalAllocated)} color={C.blueMid} />
        <StatPill label="Total Spent"        value={fmt(totalSpent)}     color={C.roseMid} />
        <StatPill label="Remaining"          value={fmt(totalRemaining)} color={C.emeraldMid} />
        <StatPill label="Est. Monthly Giving" value={`£${Math.round(monthlyGiving).toLocaleString()}`} color={C.goldMid} />
        <StatPill label="Active Donors"      value={activeDonors}        color={C.teal} />
        <StatPill label="Capital Group"      value={capitalDonors}       color={C.violetMid} />
      </div>

      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:18, flexWrap:"wrap" }}>
        {[["budgets","📊 Team Budgets"],["donors","💛 Donor Tracker"],["giving","📈 Giving Strategy"]].map(([k,l])=>(
          <button key={k} onClick={()=>setActiveTab(k)}
            style={{ padding:"7px 16px", borderRadius:8, border:`1px solid ${activeTab===k?C.goldMid:C.border}`, background: activeTab===k?`${C.goldMid}20`:C.glass, color: activeTab===k?C.goldMid:C.muted, fontSize:12, cursor:"pointer", fontFamily:FONT_BODY, fontWeight:600 }}>
            {l}
          </button>
        ))}
        {activeTab==="donors" && (
          <>
            <div style={{ flex:1 }} />
            <button onClick={()=>setShowAddDonor(true)} style={{ padding:"7px 18px", borderRadius:8, border:"none", background:`linear-gradient(135deg, ${C.goldMid}, ${C.emerald})`, color:"#fff", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:FONT_BODY }}>+ Add Donor</button>
          </>
        )}
      </div>

      {/* BUDGETS tab */}
      {activeTab==="budgets" && (
        <div>
          <div style={{ background:`${C.emerald}12`, border:`1px solid ${C.emerald}30`, borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:C.emeraldLight }}>
            💡 Collect budgets from all teams and consolidate into a church-wide view. Align spending to high-impact initiatives only.
          </div>
          <GlassCard accent={C.blueMid} style={{ marginBottom:16 }}>
            <SectionLabel>Overall Budget Health</SectionLabel>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ fontSize:13, color:C.muted }}>Total spent vs allocated</span>
              <span style={{ fontSize:13, color: totalSpent/totalAllocated>0.9?C.roseMid:C.emeraldMid, fontWeight:700 }}>{Math.round((totalSpent/totalAllocated)*100)}%</span>
            </div>
            <ProgressBar value={totalSpent} max={totalAllocated} color={totalSpent/totalAllocated>0.9?C.roseMid:totalSpent/totalAllocated>0.7?C.goldMid:C.emeraldMid} height={10} />
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
              <span style={{ fontSize:11, color:C.mutedDark }}>Spent: {fmt(totalSpent)}</span>
              <span style={{ fontSize:11, color:C.mutedDark }}>Remaining: {fmt(totalRemaining)}</span>
              <span style={{ fontSize:11, color:C.mutedDark }}>Total: {fmt(totalAllocated)}</span>
            </div>
          </GlassCard>
          {budgets.map(b=>{
            const pct=Math.round((b.spent/b.allocated)*100);
            const barColor = pct>90?C.roseMid:pct>70?C.goldMid:C.emeraldMid;
            return (
              <GlassCard key={b.id} style={{ marginBottom:9, padding:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:8 }}>
                  <div>
                    <span style={{ fontSize:14, fontWeight:700, color:C.white, fontFamily:FONT_HEAD }}>{b.team}</span>
                    <Badge label={b.status} color={b.status==="Submitted"?C.emeraldMid:C.goldMid} small style={{ marginLeft:10 }} />
                  </div>
                  <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                    <span style={{ fontSize:13, color:barColor, fontWeight:700, fontFamily:FONT_MONO }}>{fmt(b.spent)} <span style={{ color:C.mutedDark, fontWeight:400 }}>/ {fmt(b.allocated)}</span></span>
                    <span style={{ fontSize:11, color:barColor, fontWeight:700 }}>{pct}%</span>
                  </div>
                </div>
                <ProgressBar value={b.spent} max={b.allocated} color={barColor} height={8} />
                <div style={{ display:"flex", gap:12, marginTop:10 }}>
                  <span style={{ fontSize:11, color:C.mutedDark }}>Remaining: {fmt(b.allocated-b.spent)}</span>
                  {pct>90 && <span style={{ fontSize:11, color:C.roseMid, fontWeight:600 }}>⚠ Near limit</span>}
                  <div style={{ flex:1 }} />
                  <button onClick={()=>updateBudget(b.id,{status:b.status==="Submitted"?"Pending":"Submitted"})}
                    style={{ fontSize:10, color:b.status==="Submitted"?C.emeraldMid:C.goldMid, background:"none", border:`1px solid ${b.status==="Submitted"?C.emerald:C.goldMid}40`, borderRadius:6, padding:"3px 8px", cursor:"pointer", fontFamily:FONT_BODY }}>
                    {b.status==="Submitted"?"Mark Pending":"Mark Submitted"}
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* DONORS tab */}
      {activeTab==="donors" && (
        <div>
          {showAddDonor && (
            <div style={{ position:"fixed", inset:0, background:"rgba(7,14,40,0.88)", backdropFilter:"blur(10px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:16 }}>
              <GlassCard style={{ width:440, maxWidth:"100%", maxHeight:"90vh", overflowY:"auto", padding:28 }}>
                <div style={{ fontSize:20, fontWeight:700, color:C.white, marginBottom:22, fontFamily:FONT_HEAD }}>Add Donor / Partner</div>
                {[["Full Name / Organisation","name","text"],["Amount (£)","amount","number"]].map(([l,k,t])=>(
                  <div key={k} style={{ marginBottom:13 }}>
                    <label style={{ fontSize:10, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", display:"block", marginBottom:5 }}>{l}</label>
                    <input type={t} value={donorForm[k]} onChange={e=>setDonorForm(p=>({...p,[k]:e.target.value}))} style={{ width:"100%", background:C.glass, border:`1px solid ${C.border}`, borderRadius:9, padding:"9px 12px", color:C.white, fontSize:13, boxSizing:"border-box", fontFamily:FONT_BODY }} />
                  </div>
                ))}
                {[["Tier",["Regular Giver","Major Donor","Capital Group"]],["Frequency",["Weekly","Monthly","Quarterly","One-off"]],["Status",["Active","Prospect","Lapsed"]]].map(([l,opts])=>(
                  <div key={l} style={{ marginBottom:13 }}>
                    <label style={{ fontSize:10, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", display:"block", marginBottom:5 }}>{l}</label>
                    <select value={donorForm[l.toLowerCase()]} onChange={e=>setDonorForm(p=>({...p,[l.toLowerCase()]:e.target.value}))} style={{ width:"100%", background:C.navy, border:`1px solid ${C.border}`, borderRadius:9, padding:"9px 12px", color:C.offwhite, fontSize:13, boxSizing:"border-box", fontFamily:FONT_BODY, cursor:"pointer" }}>
                      {opts.map(o=><option key={o} value={o} style={{ background:C.navy }}>{o}</option>)}
                    </select>
                  </div>
                ))}
                <div style={{ marginBottom:13 }}>
                  <label style={{ fontSize:10, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", display:"block", marginBottom:5 }}>Notes</label>
                  <textarea value={donorForm.notes} onChange={e=>setDonorForm(p=>({...p,notes:e.target.value}))} rows={2} style={{ width:"100%", background:C.glass, border:`1px solid ${C.border}`, borderRadius:9, padding:"9px 12px", color:C.white, fontSize:13, boxSizing:"border-box", fontFamily:FONT_BODY, resize:"none" }} />
                </div>
                <div style={{ display:"flex", gap:10, marginTop:20 }}>
                  <button onClick={()=>setShowAddDonor(false)} style={{ flex:1, padding:"11px", borderRadius:10, border:`1px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer", fontSize:13, fontFamily:FONT_BODY }}>Cancel</button>
                  <button onClick={addDonor} style={{ flex:2, padding:"11px", borderRadius:10, border:"none", background:`linear-gradient(135deg, ${C.goldMid}, ${C.emerald})`, color:"#fff", cursor:"pointer", fontSize:13, fontWeight:700, fontFamily:FONT_BODY }}>Add Donor</button>
                </div>
              </GlassCard>
            </div>
          )}

          <div style={{ background:`${C.gold}12`, border:`1px solid ${C.gold}30`, borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:C.goldLight }}>
            🏛 Track all donors and giving partners. Capital Group members are your highest-impact financial partners — initiate early conversations and follow up consistently.
          </div>

          {donors.length===0 && <div style={{ textAlign:"center", color:C.mutedDark, padding:48 }}>No donors tracked yet. Add your first giving partner.</div>}

          {["Capital Group","Major Donor","Regular Giver"].map(tier=>{
            const tierDonors=donors.filter(d=>d.tier===tier);
            if(tierDonors.length===0) return null;
            return (
              <div key={tier} style={{ marginBottom:22 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                  <Badge label={tier} color={tierColor(tier)} />
                  <div style={{ flex:1, height:1, background:C.border }} />
                  <span style={{ fontSize:11, color:C.mutedDark }}>{tierDonors.length} donor{tierDonors.length>1?"s":""}</span>
                </div>
                {tierDonors.map(donor=>(
                  <GlassCard key={donor.id} style={{ marginBottom:9, padding:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, flexWrap:"wrap" }}>
                      <div style={{ flex:1, minWidth:160 }}>
                        <div style={{ fontWeight:700, color:C.white, fontSize:14, fontFamily:FONT_HEAD, marginBottom:4 }}>{donor.name}</div>
                        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                          <Badge label={donor.status} color={donor.status==="Active"?C.emeraldMid:donor.status==="Prospect"?C.goldMid:C.muted} small />
                          <span style={{ fontSize:11, color:C.muted }}>Last contact: {donor.lastContact}</span>
                        </div>
                        {donor.notes && <div style={{ fontSize:11, color:C.mutedDark, marginTop:6, fontStyle:"italic" }}>{donor.notes}</div>}
                      </div>
                      <div style={{ display:"flex", gap:10, alignItems:"center", flexShrink:0 }}>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontSize:18, fontWeight:800, color:tierColor(tier), fontFamily:FONT_MONO }}>£{donor.amount}</div>
                          <div style={{ fontSize:10, color:C.mutedDark }}>{donor.frequency}</div>
                        </div>
                        <button onClick={()=>setConfirmDelete(donor)} style={{ background:`${C.rose}18`, border:`1px solid ${C.rose}30`, borderRadius:7, color:C.roseMid, cursor:"pointer", padding:"5px 9px", fontSize:11 }}>✕</button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* GIVING STRATEGY tab */}
      {activeTab==="giving" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(270px, 1fr))", gap:16 }}>
          <GlassCard accent={C.goldMid}>
            <SectionLabel>Giving Structure Checklist</SectionLabel>
            {[
              { item:"Define giving communication plan",    done:true },
              { item:"Launch giving education in services", done:true },
              { item:"Set up online giving system",         done:false },
              { item:"Collect all team budgets",            done:budgets.filter(b=>b.status==="Submitted").length===budgets.length },
              { item:"Consolidate church-wide budget",      done:false },
              { item:"Set up donor tracking (CRM)",         done:donors.length>0 },
              { item:"Initiate Capital Group outreach",     done:donors.some(d=>d.tier==="Capital Group") },
              { item:"Align spending to high-impact only",  done:false },
            ].map((item,i)=>(
              <div key={i} style={{ display:"flex", gap:10, alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${item.done?C.emeraldMid:"rgba(255,255,255,0.2)"}`, background: item.done?C.emeraldMid:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {item.done && <span style={{ color:"#000", fontSize:10, fontWeight:900 }}>✓</span>}
                </div>
                <span style={{ fontSize:12, color: item.done?C.emeraldLight:C.muted, textDecoration: item.done?"line-through":"none" }}>{item.item}</span>
              </div>
            ))}
          </GlassCard>

          <GlassCard accent={C.emeraldMid}>
            <SectionLabel>Giving Tiers</SectionLabel>
            {[
              { tier:"Capital Group",  desc:"Major financial partners — strategic, project-based giving", color:C.goldMid,    target:"£500+/mo",  count:donors.filter(d=>d.tier==="Capital Group").length },
              { tier:"Major Donors",   desc:"Committed regular givers with capacity for impact",         color:C.emeraldMid, target:"£100-499/mo",count:donors.filter(d=>d.tier==="Major Donor").length },
              { tier:"Regular Givers", desc:"Consistent congregation giving — backbone of finances",     color:C.blueMid,    target:"£10-99/mo",  count:donors.filter(d=>d.tier==="Regular Giver").length },
            ].map(t=>(
              <div key={t.tier} style={{ marginBottom:16, padding:"14px", background:C.glass, borderRadius:11, border:`1px solid ${t.color}30` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:t.color, fontFamily:FONT_HEAD }}>{t.tier}</span>
                  <span style={{ fontSize:11, color:C.muted }}>{t.count} tracked</span>
                </div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>{t.desc}</div>
                <Badge label={`Target: ${t.target}`} color={t.color} small />
              </div>
            ))}
          </GlassCard>

          <GlassCard accent={C.teal} style={{ gridColumn:"1 / -1" }}>
            <SectionLabel>Success Metrics — Financial Growth</SectionLabel>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:12 }}>
              {[
                { label:"Teams with Submitted Budgets",  value:`${budgets.filter(b=>b.status==="Submitted").length} / ${budgets.length}`, color:C.blueMid },
                { label:"Budget Utilisation",             value:`${Math.round((totalSpent/totalAllocated)*100)}%`,                         color: totalSpent/totalAllocated>0.9?C.roseMid:C.emeraldMid },
                { label:"Giving Participation Est.",      value:`${Math.round((activeDonors/10)*100)}%`,                                  color:C.goldMid },
                { label:"Est. Annual Giving",             value:`£${Math.round(monthlyGiving*12).toLocaleString()}`,                       color:C.emeraldMid },
                { label:"Capital Group Conversations",    value:capitalDonors,                                                             color:C.violetMid },
                { label:"Total Donor Pipeline",           value:donors.length,                                                             color:C.teal },
              ].map(m=>(
                <div key={m.label} style={{ background:C.glass, borderRadius:10, padding:"13px 15px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:11, color:C.muted, flex:1, lineHeight:1.4 }}>{m.label}</span>
                  <span style={{ fontSize:18, fontWeight:800, color:m.color, fontFamily:FONT_MONO, marginLeft:8, flexShrink:0 }}>{m.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STRATEGY VIEW
═══════════════════════════════════════════════════════════════ */
function StrategyView() {
  const PILLARS = [
    { key:"experience", label:"Experience Excellence", icon:"★", color:C.blueMid },
    { key:"engagement", label:"Engagement System",     icon:"◉", color:C.sky },
    { key:"financial",  label:"Financial Growth",      icon:"◈", color:C.goldMid },
    { key:"facility",   label:"Facility & Venue",      icon:"⬡", color:C.teal },
    { key:"data",       label:"Data & Technology",     icon:"✦", color:C.violetMid },
  ];
  const cadences = [
    { freq:"Weekly",    color:C.blueMid,   items:["Operations review","Issue tracking & resolution","Follow-up accountability"] },
    { freq:"Monthly",   color:C.emeraldMid,items:["Strategic review","Performance tracking","Decision-making"] },
    { freq:"Quarterly", color:C.goldMid,   items:["Strategic reset","Priority alignment","Roadmap review"] },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <GlassCard accent={C.blueMid}>
        <SectionLabel>IGNITE Growth Framework</SectionLabel>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {IGNITE_STAGES.map(stage=>(
            <div key={stage.key} style={{ flex:"1 1 120px", padding:"14px 12px", background:`${stage.color}14`, border:`1px solid ${stage.color}40`, borderRadius:12, textAlign:"center" }}>
              <div style={{ fontSize:20, color:stage.color, marginBottom:6 }}>{stage.icon}</div>
              <div style={{ fontSize:10, fontWeight:800, color:stage.color, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>{stage.label}</div>
              <div style={{ fontSize:10, color:C.muted, lineHeight:1.5 }}>{stage.desc}</div>
            </div>
          ))}
        </div>
      </GlassCard>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:14 }}>
        <GlassCard accent={C.emeraldMid}>
          <SectionLabel>Strategic Pillars</SectionLabel>
          {PILLARS.map((p,i)=>(
            <div key={p.key} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:i<PILLARS.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:32, height:32, borderRadius:9, background:`${p.color}20`, border:`1px solid ${p.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, color:p.color, flexShrink:0 }}>{p.icon}</div>
              <div style={{ fontSize:12, color:C.offwhite, fontWeight:600 }}>0{i+1} — {p.label}</div>
            </div>
          ))}
        </GlassCard>
        <GlassCard accent={C.teal}>
          <SectionLabel>HCOS Operating Model</SectionLabel>
          {[
            { label:"Growth",     sub:"Strategic Engine — IGNITE Programme",         color:C.blueMid,    icon:"◎" },
            { label:"Operations", sub:"Backstage — General Services Control Tower",   color:C.emeraldMid, icon:"⬡" },
            { label:"Experience", sub:"Frontstage — Sunday services & visitor care",  color:C.goldMid,    icon:"✦" },
          ].map((layer,i)=>(
            <div key={layer.label} style={{ marginBottom:10, marginLeft:`${i*14}px` }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", padding:"11px 14px", background:`${layer.color}14`, border:`1px solid ${layer.color}35`, borderRadius:10 }}>
                <span style={{ color:layer.color, fontSize:14 }}>{layer.icon}</span>
                <div>
                  <div style={{ fontSize:12, color:layer.color, fontWeight:700 }}>{layer.label}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{layer.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </GlassCard>
      </div>
      <GlassCard accent={C.goldMid}>
        <SectionLabel>Execution Cadence</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:12 }}>
          {cadences.map(c=>(
            <div key={c.freq} style={{ padding:16, background:`${c.color}10`, border:`1px solid ${c.color}30`, borderRadius:12 }}>
              <div style={{ fontSize:13, fontWeight:700, color:c.color, marginBottom:10, textTransform:"uppercase", letterSpacing:1 }}>{c.freq}</div>
              {c.items.map(item=>(
                <div key={item} style={{ display:"flex", gap:7, marginBottom:7 }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:c.color, marginTop:6, flexShrink:0 }} />
                  <span style={{ fontSize:12, color:C.muted, lineHeight:1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE BOTTOM NAV
═══════════════════════════════════════════════════════════════ */
function MobileNav({ activeTab, setActiveTab, tabs }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, background:`rgba(11,20,55,0.97)`, borderTop:`1px solid ${C.border}`, display:"flex", zIndex:200, backdropFilter:"blur(20px)" }}>
      {tabs.map(tab=>(
        <button key={tab.key} onClick={()=>setActiveTab(tab.key)} style={{ flex:1, padding:"8px 2px 12px", background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3, position:"relative" }}>
          {tab.badge>0 && <div style={{ position:"absolute", top:5, right:"calc(50% - 14px)", width:14, height:14, borderRadius:"50%", background:C.rose, fontSize:8, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{tab.badge}</div>}
          <span style={{ fontSize:14, color: activeTab===tab.key?C.emeraldMid:C.mutedDark }}>{tab.icon}</span>
          <span style={{ fontSize:8, color: activeTab===tab.key?C.emeraldMid:C.mutedDark, fontWeight: activeTab===tab.key?700:400, letterSpacing:0.3 }}>{tab.short}</span>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function GoReach() {
  const [activeTab, setActiveTab]       = useState("dashboard");
  const [people,    setPeople]           = useState(INIT_PEOPLE);
  const [tasks,     setTasks]            = useState(INIT_TASKS);
  const [volunteers,setVolunteers]       = useState(INIT_VOLUNTEERS);
  const [budgets,   setBudgets]          = useState(INIT_BUDGETS);
  const [donors,    setDonors]           = useState(INIT_DONORS);
  const width    = useWindowWidth();
  const isMobile = width < 768;

  const openTaskCount    = tasks.filter(t=>!t.done).length;
  const pendingFollowUps = people.filter(p=>!p.followedUp).length;

  const tabs = [
    { key:"dashboard",  label:"Dashboard",  short:"Dash",     icon:"◈", badge:0 },
    { key:"pipeline",   label:"Pipeline",   short:"People",   icon:"◎", badge:0 },
    { key:"engagement", label:"Engagement", short:"Engage",   icon:"✦", badge:0 },
    { key:"tasks",      label:"Action Hub", short:"Tasks",    icon:"⬡", badge:openTaskCount },
    { key:"volunteers", label:"Volunteers", short:"Serve",    icon:"❋", badge:0 },
    { key:"finance",    label:"Finance",    short:"Finance",  icon:"⊕", badge:0 },
    { key:"strategy",   label:"Strategy",   short:"Strategy", icon:"★", badge:0 },
  ];

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(180deg, ${C.navy} 0%, #080D28 100%)`, color:C.white, fontFamily:FONT_BODY, display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ borderBottom:`1px solid ${C.border}`, padding:"0 20px", display:"flex", alignItems:"center", background:"rgba(11,20,55,0.85)", backdropFilter:"blur(24px)", position:"sticky", top:0, zIndex:100, height:54 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginRight: isMobile?"auto":30 }}>
          <div style={{ width:30, height:30, background:`linear-gradient(135deg, ${C.blueMid}, ${C.emerald})`, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>🔥</div>
          <span style={{ fontWeight:700, fontSize:17, letterSpacing:-0.5, color:C.white, fontFamily:FONT_HEAD }}>Go<span style={{ color:C.emeraldMid }}>Reach</span></span>
          {!isMobile && <span style={{ fontSize:9, color:C.mutedDark, letterSpacing:2.5, textTransform:"uppercase", marginLeft:2 }}>Church OS</span>}
        </div>

        {!isMobile && tabs.map(tab=>(
          <button key={tab.key} onClick={()=>setActiveTab(tab.key)}
            style={{ padding:"0 12px", height:54, background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, color: activeTab===tab.key?C.white:C.mutedDark, borderBottom:`2px solid ${activeTab===tab.key?C.emeraldMid:"transparent"}`, fontSize:11, fontWeight: activeTab===tab.key?700:400, fontFamily:FONT_BODY, transition:"color 0.15s", position:"relative", whiteSpace:"nowrap" }}>
            <span style={{ color: activeTab===tab.key?C.emeraldMid:C.mutedDark, fontSize:10 }}>{tab.icon}</span>
            {tab.label}
            {tab.badge>0 && <span style={{ position:"absolute", top:8, right:2, width:14, height:14, borderRadius:"50%", background:C.rose, fontSize:8, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{tab.badge}</span>}
          </button>
        ))}

        <div style={{ flex:1 }} />
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {pendingFollowUps>0 && <div style={{ background:`${C.rose}18`, border:`1px solid ${C.rose}35`, borderRadius:7, padding:"3px 8px" }}><span style={{ fontSize:10, color:C.roseMid, fontWeight:700 }}>⚠ {pendingFollowUps}</span></div>}
          <div style={{ width:7, height:7, borderRadius:"50%", background:C.emeraldMid, boxShadow:`0 0 8px ${C.emerald}90` }} />
          {!isMobile && <span style={{ fontSize:11, color:C.mutedDark }}>{people.length} people</span>}
        </div>
      </div>

      {/* Page title */}
      <div style={{ padding:"16px 20px 0", display:"flex", alignItems:"baseline", gap:10 }}>
        <h1 style={{ margin:0, fontSize: isMobile?17:20, fontWeight:700, color:C.white, letterSpacing:-0.5, fontFamily:FONT_HEAD }}>
          {tabs.find(t=>t.key===activeTab)?.label}
        </h1>
        <span style={{ fontSize:10, color:C.mutedDark }}>{people.length} people · {openTaskCount} open tasks</span>
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:`14px 20px ${isMobile?"78px":"36px"}`, maxWidth:1280, width:"100%", boxSizing:"border-box" }}>
        {activeTab==="dashboard"  && <DashboardView  people={people} tasks={tasks} volunteers={volunteers} budgets={budgets} donors={donors} />}
        {activeTab==="pipeline"   && <PeopleView     people={people} setPeople={setPeople} />}
        {activeTab==="engagement" && <EngagementView people={people} />}
        {activeTab==="tasks"      && <TasksView      tasks={tasks}   setTasks={setTasks} />}
        {activeTab==="volunteers" && <VolunteersView  volunteers={volunteers} setVolunteers={setVolunteers} />}
        {activeTab==="finance"    && <FinanceView     budgets={budgets} setBudgets={setBudgets} donors={donors} setDonors={setDonors} />}
        {activeTab==="strategy"   && <StrategyView />}
      </div>

      {isMobile && <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />}

      {!isMobile && (
        <div style={{ borderTop:`1px solid ${C.border}`, padding:"10px 20px", display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontSize:10, color:C.mutedDark }}>GoReach Church OS · IGNITE Growth Framework</span>
          <span style={{ fontSize:10, color:C.mutedDark }}>ONE VISION. MANY LIVES. GREATER IMPACT.</span>
        </div>
      )}
    </div>
  );
}
