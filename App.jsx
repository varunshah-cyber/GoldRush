import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────
// SUPABASE CLIENT
// ─────────────────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────
const C = {
  gold:   "#D4A017",
  goldL:  "#FBF3DC",
  goldD:  "#A87800",
  goldB:  "#E8C84A",
  goldGlow: "rgba(212,160,23,0.35)",
  dark:   "#111418",
  darkM:  "#1A2030",
  darkL:  "#243050",
  card:   "#FFFFFF",
  bg:     "#F5F3EE",
  text:   "#111418",
  muted:  "#5A6478",
  faint:  "#9BA3B5",
  border: "#E2DDD4",
  green:  "#15803D",
  greenL: "#DCFCE7",
  red:    "#DC2626",
  redL:   "#FEE2E2",
  blue:   "#1D4ED8",
  blueL:  "#DBEAFE",
  purple: "#7C3AED",
  purpleL:"#EDE9FE",
  teal:   "#0E7490",
  tealL:  "#CFFAFE",
};

// ─────────────────────────────────────────────────────────────
// QUESTION BANK  (50 questions · 4 categories)
// ─────────────────────────────────────────────────────────────
const QUESTION_BANK = [
  // ── Personal Finance ──
  { id:1, cat:"Personal Finance", q:"What is the recommended minimum emergency fund size according to most financial planners?", opts:["1 month of expenses","3–6 months of expenses","12 months of expenses","No fixed amount"], ans:1 },
  { id:2, cat:"Personal Finance", q:"Under the 50-30-20 budgeting rule, the 20% portion is meant for:", opts:["Needs like rent and food","Wants like dining and travel","Savings and debt repayment","Healthcare and insurance"], ans:2 },
  { id:3, cat:"Personal Finance", q:"ELSS mutual funds qualify for a tax deduction under which section of the Income Tax Act?", opts:["Section 80D","Section 80C","Section 10(10D)","Section 24(b)"], ans:1 },
  { id:4, cat:"Personal Finance", q:"The 'Rule of 72' is used to estimate:", opts:["The maximum tax you owe","How long it takes to double money at a given return","The ideal debt-to-income ratio","Safe withdrawal rate in retirement"], ans:1 },
  { id:5, cat:"Personal Finance", q:"Which instrument offers guaranteed returns with complete capital protection in India?", opts:["Equity mutual funds","PPF (Public Provident Fund)","Corporate bonds","Real estate"], ans:1 },
  { id:6, cat:"Personal Finance", q:"Term insurance is best described as:", opts:["Insurance that builds a savings corpus","Pure life cover with no maturity benefit","Insurance linked to market performance","A pension-providing policy"], ans:1 },
  { id:7, cat:"Personal Finance", q:"What does the credit utilisation ratio measure?", opts:["Your income vs. EMI payments","How much of your credit limit you use","Total number of active loans","Credit score improvement over time"], ans:1 },
  { id:8, cat:"Personal Finance", q:"EPF stands for:", opts:["Employee Provident Fund","Equity Portfolio Fund","Equity Premium Fund","Enterprise Pension Facility"], ans:0 },
  { id:9, cat:"Personal Finance", q:"Which of the following is NOT a component of CIBIL score calculation?", opts:["Payment history","Credit utilisation","Annual income","Length of credit history"], ans:2 },
  { id:10, cat:"Personal Finance", q:"A demat account is used to:", opts:["Store physical share certificates","Hold securities electronically","Make fixed deposits","Apply for government bonds only"], ans:1 },
  { id:11, cat:"Personal Finance", q:"NPS (National Pension System) allows partial withdrawal after how many years?", opts:["3 years","5 years","7 years","10 years"], ans:0 },
  { id:12, cat:"Personal Finance", q:"Which type of mutual fund has the lowest interest rate risk?", opts:["Long-duration fund","Gilt fund","Liquid fund","Dynamic bond fund"], ans:2 },
  { id:13, cat:"Personal Finance", q:"An SIP in a mutual fund automatically invests a fixed amount:", opts:["Only when markets fall","Only when markets rise","At regular intervals regardless of market level","When NAV crosses a threshold"], ans:2 },

  // ── Markets & Investing ──
  { id:14, cat:"Markets & Investing", q:"The Nifty 50 index tracks the top 50 companies listed on which exchange?", opts:["BSE","NSE","MCX","CDSL"], ans:1 },
  { id:15, cat:"Markets & Investing", q:"In investing, what does 'P/E ratio' stand for?", opts:["Profit by Equity","Price-to-Earnings ratio","Premium-to-Earnings ratio","Portfolio-to-Equity ratio"], ans:1 },
  { id:16, cat:"Markets & Investing", q:"A 'Bear Market' is conventionally defined as a fall of at least how much from a recent peak?", opts:["10%","15%","20%","25%"], ans:2 },
  { id:17, cat:"Markets & Investing", q:"In India, silver is primarily traded as a commodity on:", opts:["NSE","BSE","MCX","NCDEX"], ans:2 },
  { id:18, cat:"Markets & Investing", q:"F&O in Indian capital markets stands for:", opts:["Fixed & Optional","Futures & Options","Forex & Obligations","Funds & Operations"], ans:1 },
  { id:19, cat:"Markets & Investing", q:"Sovereign Gold Bonds (SGBs) are issued by:", opts:["SEBI","RBI on behalf of the Government of India","NSE","World Gold Council"], ans:1 },
  { id:20, cat:"Markets & Investing", q:"What does 'going short' on a stock mean?", opts:["Buying a stock for the long term","Betting the stock price will fall","Holding a stock for under one year","Buying a small quantity of a stock"], ans:1 },
  { id:21, cat:"Markets & Investing", q:"Which Indian regulator oversees mutual funds and the stock market?", opts:["RBI","IRDAI","SEBI","PFRDA"], ans:2 },
  { id:22, cat:"Markets & Investing", q:"What is the lock-in period for ELSS mutual funds?", opts:["1 year","2 years","3 years","5 years"], ans:2 },
  { id:23, cat:"Markets & Investing", q:"Sensex is the benchmark index of which stock exchange?", opts:["NSE","BSE","MCX","NCDEX"], ans:1 },
  { id:24, cat:"Markets & Investing", q:"Digital gold in India is backed by:", opts:["RBI foreign currency reserves","24-karat physical gold in certified vaults","Government of India securities","Equity holdings of the platform"], ans:1 },
  { id:25, cat:"Markets & Investing", q:"What does 'dividend yield' measure?", opts:["Total return including capital gains","Dividend per share as a percentage of share price","Total dividends paid by a company in a year","Revenue growth rate"], ans:1 },
  { id:26, cat:"Markets & Investing", q:"An index fund aims to:", opts:["Beat the market index","Replicate the returns of a market index","Invest only in large-cap stocks","Invest only in government bonds"], ans:1 },
  { id:27, cat:"Markets & Investing", q:"Which of the following is a debt instrument?", opts:["Equity share","Debenture","Preference share","Depository receipt"], ans:1 },

  // ── Economics ──
  { id:28, cat:"Economics", q:"When the RBI raises the repo rate, home loan EMIs typically:", opts:["Fall","Stay unchanged","Rise","Have no relation to repo rate"], ans:2 },
  { id:29, cat:"Economics", q:"CPI, the most common inflation measure in India, stands for:", opts:["Corporate Price Index","Consumer Price Index","Capital Price Indicator","Credit Price Indicator"], ans:1 },
  { id:30, cat:"Economics", q:"GDP stands for:", opts:["Gross Domestic Product","General Development Plan","Gross Development Product","Government Deposit Pool"], ans:0 },
  { id:31, cat:"Economics", q:"What happens to the purchasing power of money during high inflation?", opts:["It increases","It stays the same","It decreases","It doubles"], ans:2 },
  { id:32, cat:"Economics", q:"The repo rate is the rate at which:", opts:["Banks lend to the public","The RBI lends money to commercial banks","Commercial banks lend to each other","The government borrows from the RBI"], ans:1 },
  { id:33, cat:"Economics", q:"A current account deficit means a country is:", opts:["Importing more than it exports","Exporting more than it imports","Spending less than it earns","Running a budget surplus"], ans:0 },
  { id:34, cat:"Economics", q:"Which Indian institution publishes the Monetary Policy Report?", opts:["Finance Ministry","SEBI","RBI","NITI Aayog"], ans:2 },
  { id:35, cat:"Economics", q:"Fiscal deficit is the difference between the government's:", opts:["Revenue and expenditure","Exports and imports","Tax and non-tax revenue","Capital receipts and capital payments"], ans:0 },
  { id:36, cat:"Economics", q:"Which type of tax is GST in India?", opts:["Direct tax","Indirect tax","Progressive tax","Corporate tax only"], ans:1 },
  { id:37, cat:"Economics", q:"What is stagflation?", opts:["High growth with low inflation","Low growth with low inflation","High inflation combined with stagnant economic growth","Rapid economic growth with falling prices"], ans:2 },
  { id:38, cat:"Economics", q:"India's financial year runs from:", opts:["January to December","April to March","July to June","October to September"], ans:1 },
  { id:39, cat:"Economics", q:"Which organisation publishes the World Economic Outlook report?", opts:["World Bank","IMF","WTO","UN"], ans:1 },

  // ── Current Affairs & Geopolitics ──
  { id:40, cat:"Current Affairs", q:"Which country is currently the world's largest producer of gold?", opts:["South Africa","Australia","China","Russia"], ans:2 },
  { id:41, cat:"Current Affairs", q:"The Russia–Ukraine war began in February:", opts:["2020","2021","2022","2023"], ans:2 },
  { id:42, cat:"Current Affairs", q:"Which central bank holds the world's largest official gold reserves?", opts:["Bank of England","People's Bank of China","US Federal Reserve","Bundesbank"], ans:2 },
  { id:43, cat:"Current Affairs", q:"The BRICS grouping originally comprised Brazil, Russia, India, China and:", opts:["Singapore","South Africa","Saudi Arabia","Sri Lanka"], ans:1 },
  { id:44, cat:"Current Affairs", q:"Operation Sindoor in 2025 was a military strike carried out by India against targets in:", opts:["China","Bangladesh","Pakistan","Myanmar"], ans:2 },
  { id:45, cat:"Current Affairs", q:"India's UPI payments system is overseen by:", opts:["RBI","SEBI","NPCI","Finance Ministry"], ans:2 },
  { id:46, cat:"Current Affairs", q:"Which country imposed sweeping 'Liberation Day' tariffs on imports in April 2025?", opts:["China","European Union","United States","Japan"], ans:2 },
  { id:47, cat:"Current Affairs", q:"The IMF's Special Drawing Rights (SDR) is:", opts:["A global currency replacing the dollar","A reserve asset created by the IMF","A loan facility for developing nations","A trade settlement mechanism"], ans:1 },
  { id:48, cat:"Current Affairs", q:"Gold crossed $3,000 per troy ounce for the first time in which year?", opts:["2023","2024","2025","2026"], ans:2 },
  { id:49, cat:"Current Affairs", q:"Which Indian state is the largest producer of turmeric, often called 'yellow gold'?", opts:["Maharashtra","Telangana","Karnataka","Tamil Nadu"], ans:1 },
  { id:50, cat:"Current Affairs", q:"The term 'de-dollarisation' refers to:", opts:["The US devaluing the dollar","Countries reducing reliance on the US dollar in trade","Banning dollar accounts in India","Replacing dollars with digital currency domestically"], ans:1 },
];

const CAT_META = {
  "Personal Finance":       { color: C.purple, icon: "💰" },
  "Markets & Investing":    { color: C.blue,   icon: "📈" },
  "Economics":              { color: C.teal,   icon: "🏦" },
  "Current Affairs":        { color: C.gold,   icon: "🌍" },
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function fmtTime(s) {
  if (s === null || s === undefined) return "—";
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}
function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}
function medal(i) { return ["🥇","🥈","🥉"][i] ?? null; }
function istDate() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
    .toISOString().slice(0, 10);
}
function rankPts(rank) {
  if (rank === 1) return 10;
  if (rank === 2) return 8;
  if (rank === 3) return 6;
  if (rank <= 10) return 3;
  return 1;
}
function pickQuestions() {
  const cats = ["Personal Finance","Markets & Investing","Economics","Current Affairs"];
  let selected = [];
  cats.forEach(cat => {
    const pool = QUESTION_BANK.filter(q => q.cat === cat);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    selected.push(...shuffled.slice(0, 2)); // 2 per category
  });
  // fill remaining 2 randomly
  const remaining = QUESTION_BANK.filter(q => !selected.find(s => s.id === q.id))
    .sort(() => Math.random() - 0.5).slice(0, 2);
  return [...selected, ...remaining].sort(() => Math.random() - 0.5);
}

// ─────────────────────────────────────────────────────────────
// SHARED UI ATOMS
// ─────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant = "primary", disabled, style = {} }) {
  const styles = {
    primary: { background: C.gold, color: "#fff", border: "none", boxShadow: `0 4px 18px ${C.goldGlow}` },
    secondary: { background: C.card, color: C.text, border: `1.5px solid ${C.border}` },
    dark: { background: C.dark, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: C.muted, border: `1.5px solid ${C.border}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: "13px 20px", borderRadius: 13, fontWeight: 700, fontSize: 14,
      cursor: disabled ? "default" : "pointer", fontFamily: "inherit",
      transition: "all 0.15s", opacity: disabled ? 0.5 : 1,
      ...styles[variant], ...style
    }}>{children}</button>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, display: "block", marginBottom: 6, letterSpacing: 0.8 }}>{label.toUpperCase()}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: "100%", padding: "12px 14px", border: `1.5px solid ${C.border}`,
          borderRadius: 10, fontSize: 14, color: C.text, boxSizing: "border-box",
          outline: "none", fontFamily: "inherit", background: C.bg,
          transition: "border-color 0.15s",
        }}
        onFocus={e => e.target.style.borderColor = C.gold}
        onBlur={e => e.target.style.borderColor = C.border}
      />
    </div>
  );
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)",
      background: type === "error" ? C.red : C.dark,
      color: "#fff", padding: "10px 20px", borderRadius: 30,
      fontSize: 13, fontWeight: 600, zIndex: 999,
      boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      maxWidth: 320, textAlign: "center", animation: "fadein 0.2s"
    }}>{msg}</div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.card, borderRadius: 18, padding: 20,
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)", ...style
    }}>{children}</div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN: AUTH
// ─────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [tab, setTab] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    setErr(""); setLoading(true);
    try {
      if (tab === "signup") {
        if (!name.trim()) { setErr("Please enter your name"); setLoading(false); return; }
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { name: name.trim() } }
        });
        if (error) throw error;
        if (data.user) onAuth(data.user, name.trim());
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const userName = data.user.user_metadata?.name || email.split("@")[0];
        onAuth(data.user, userName);
      }
    } catch (e) {
      setErr(e.message || "Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: "100vh", background: C.dark,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "24px 20px"
    }}>
      <style>{`@keyframes fadein{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: "rgba(212,160,23,0.12)", border: `1.5px solid ${C.gold}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 14px", fontSize: 34
        }}>⚡</div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 3, marginBottom: 6 }}>
          <span style={{ color: C.gold, fontWeight: 900, fontSize: 28, letterSpacing: -1 }}>GoldRush</span>
          <span style={{ color: "#fff", fontWeight: 500, fontSize: 22, letterSpacing: -0.5 }}>Quiz</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>
          10 questions · daily · fastest wins
        </div>
      </div>

      {/* Card */}
      <div style={{
        background: C.card, borderRadius: 22, padding: "28px 24px",
        width: "100%", maxWidth: 380, boxSizing: "border-box",
        boxShadow: "0 24px 64px rgba(0,0,0,0.4)"
      }}>
        {/* Tab toggle */}
        <div style={{ display: "flex", background: C.bg, borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {[["login","Sign In"],["signup","Sign Up"]].map(([v,l]) => (
            <button key={v} onClick={() => { setTab(v); setErr(""); }} style={{
              flex: 1, padding: "9px", border: "none", borderRadius: 9,
              background: tab === v ? C.dark : "transparent",
              color: tab === v ? "#fff" : C.muted,
              fontWeight: tab === v ? 700 : 500,
              fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s"
            }}>{l}</button>
          ))}
        </div>

        {tab === "signup" && <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Sharma" />}
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
        <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" />

        {err && (
          <div style={{
            background: C.redL, border: `1px solid ${C.red}30`, borderRadius: 9,
            padding: "10px 14px", color: C.red, fontSize: 13, marginBottom: 16
          }}>{err}</div>
        )}

        <Btn onClick={submit} disabled={loading} style={{ width: "100%" }}>
          {loading ? "Please wait..." : tab === "signup" ? "Create Account →" : "Sign In →"}
        </Btn>
      </div>

      <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, marginTop: 20 }}>
        Quiz live 10 AM – 10 PM IST · one attempt per day
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN: HOME
// ─────────────────────────────────────────────────────────────
function HomeScreen({ user, hasPlayed, todayAttempt, onStart, leaderboard, onViewLB, onSignOut }) {
  const top5 = leaderboard.slice(0, 5);
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const h = now.getHours();
  const quizOpen = h >= 10 && h < 22;

  return (
    <div style={{ padding: "20px 16px", paddingBottom: 32 }}>

      {/* Greeting row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 21, fontWeight: 800, color: C.text }}>
            Hey {user.name.split(" ")[0]} 👋
          </div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>
            {hasPlayed ? "Quiz done for today. See you tomorrow!" : quizOpen ? "Today's quiz is live." : "Quiz opens at 10 AM IST."}
          </div>
        </div>
        <button onClick={onSignOut} style={{
          background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
          padding: "6px 12px", color: C.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit"
        }}>Sign out</button>
      </div>

      {/* Prize banner */}
      <div style={{
        background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkL} 100%)`,
        borderRadius: 22, padding: "22px 22px 20px",
        marginBottom: 14, position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", right: -12, top: -12, fontSize: 90, opacity: 0.06, userSelect: "none" }}>🏆</div>
        <div style={{
          display: "inline-block", background: `${C.gold}20`,
          border: `1px solid ${C.gold}45`, borderRadius: 20,
          padding: "3px 11px", fontSize: 10, fontWeight: 700,
          color: C.gold, letterSpacing: 1.5, marginBottom: 10
        }}>TODAY'S PRIZES</div>
        <div style={{ color: "#fff", fontSize: 19, fontWeight: 800, lineHeight: 1.2 }}>
          Bragging rights + a little gold 🏅
        </div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginTop: 4, marginBottom: 18 }}>
          10 questions · fastest correct answer wins
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[["🥇","1st","0.10g Gold"],["🥈","2nd","0.05g Gold"],["🥉","3rd","0.02g Gold"]].map(([m,r,p]) => (
            <div key={r} style={{
              flex: 1, background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: "10px 6px", textAlign: "center"
            }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>{m}</div>
              <div style={{ color: C.gold, fontSize: 11, fontWeight: 700 }}>{p}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginTop: 2 }}>{r}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz CTA */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Today's Quiz</div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>10 questions · 4 categories</div>
          </div>
          {quizOpen
            ? <div style={{ background: C.greenL, color: C.green, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>● LIVE NOW</div>
            : <div style={{ background: C.bg, color: C.muted, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>OPENS 10 AM</div>
          }
        </div>

        {hasPlayed ? (
          <div style={{
            background: C.goldL, border: `1px solid ${C.goldB}60`,
            borderRadius: 14, padding: "16px 18px", textAlign: "center"
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>✅</div>
            <div style={{ fontWeight: 700, color: C.dark, fontSize: 14 }}>
              You scored {todayAttempt?.score}/10 in {fmtTime(todayAttempt?.time_seconds)}
            </div>
            <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
              Ranked #{todayAttempt?.rank ?? "—"} · {todayAttempt?.points ?? 1} pts earned
            </div>
            <button onClick={onViewLB} style={{
              marginTop: 12, padding: "9px 20px", background: C.dark,
              border: "none", borderRadius: 10, color: "#fff",
              fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit"
            }}>View Leaderboard →</button>
          </div>
        ) : (
          <Btn onClick={quizOpen ? onStart : null} disabled={!quizOpen} style={{ width: "100%" }}>
            {quizOpen ? "Start Quiz →" : "Opens at 10:00 AM IST"}
          </Btn>
        )}
      </Card>

      {/* Today's top 5 */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Today's Leaders</div>
          <button onClick={onViewLB} style={{
            fontSize: 13, color: C.gold, background: "none",
            border: "none", cursor: "pointer", fontWeight: 600, fontFamily: "inherit"
          }}>See all →</button>
        </div>
        {top5.length === 0 && (
          <div style={{ textAlign: "center", color: C.faint, fontSize: 14, padding: "16px 0" }}>
            No attempts yet today. Be the first!
          </div>
        )}
        {top5.map((e, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
            borderBottom: i < top5.length - 1 ? `1px solid ${C.border}` : "none"
          }}>
            <div style={{ width: 26, textAlign: "center", fontSize: 16 }}>
              {medal(i) || <span style={{ color: C.faint, fontWeight: 700, fontSize: 13 }}>{i+1}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{e.profiles?.name ?? "Anonymous"}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{e.score}/10 · {fmtTime(e.time_seconds)}</div>
            </div>
            <div style={{ fontWeight: 700, color: C.gold, fontSize: 13 }}>{e.points} pts</div>
          </div>
        ))}
      </Card>

      {/* Points system */}
      <Card>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 14 }}>Monthly Points System</div>
        {[["🥇","1st place","10 pts"],["🥈","2nd place","8 pts"],["🥉","3rd place","6 pts"],["4–10","Top 10 finish","3 pts"],["✔","Any completion","1 pt"],["🔥","7-day streak","1.2× multiplier"]].map(([icon,label,val]) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "9px 0", borderBottom: `1px solid ${C.border}`
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 14, width: 22, textAlign: "center" }}>{icon}</span>
              <span style={{ fontSize: 13, color: C.text }}>{label}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>{val}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN: QUIZ
// ─────────────────────────────────────────────────────────────
function QuizScreen({ questions, qIdx, elapsed, sel, revealed, onPick }) {
  const q = questions[qIdx];
  if (!q) return null;
  const meta = CAT_META[q.cat] ?? { color: C.dark, icon: "❓" };
  const pct = (qIdx / 10) * 100;

  return (
    <div style={{ padding: "20px 16px", paddingBottom: 32 }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>
          Question <span style={{ color: C.text, fontWeight: 800 }}>{qIdx + 1}</span>
          <span style={{ color: C.faint }}> / 10</span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: elapsed > 120 ? C.redL : C.bg,
          padding: "6px 14px", borderRadius: 20,
          border: `1.5px solid ${elapsed > 120 ? C.red + "40" : C.border}`
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: elapsed > 120 ? C.red : C.green,
            boxShadow: `0 0 0 2px ${elapsed > 120 ? C.red + "30" : C.green + "30"}`
          }} />
          <span style={{ fontWeight: 700, fontSize: 15, color: elapsed > 120 ? C.red : C.text, fontVariantNumeric: "tabular-nums" }}>
            {fmtTime(elapsed)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 5, background: C.border, borderRadius: 3, marginBottom: 10, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: `linear-gradient(90deg, ${C.goldD}, ${C.gold})`, borderRadius: 3, transition: "width 0.4s" }} />
      </div>

      {/* Dot strip */}
      <div style={{ display: "flex", gap: 4, marginBottom: 22 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i < qIdx ? C.gold : i === qIdx ? C.darkL : C.border,
            transition: "background 0.2s"
          }} />
        ))}
      </div>

      {/* Cat badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: `${meta.color}14`, color: meta.color,
        fontSize: 11, fontWeight: 700, padding: "4px 12px",
        borderRadius: 20, marginBottom: 14, letterSpacing: 0.5
      }}>
        {meta.icon} {q.cat.toUpperCase()}
      </div>

      {/* Question */}
      <Card style={{ marginBottom: 18 }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: C.text, lineHeight: 1.6 }}>{q.q}</div>
      </Card>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.opts.map((opt, i) => {
          const isCorrect = i === q.ans;
          const isSelected = i === sel;
          let bg = C.card, border = C.border, txtColor = C.text, iconBg = C.bg, iconTxt = C.muted;

          if (revealed) {
            if (isCorrect) { bg = C.greenL; border = C.green; txtColor = C.green; iconBg = C.green; iconTxt = "#fff"; }
            else if (isSelected) { bg = C.redL; border = C.red; txtColor = C.red; iconBg = C.red; iconTxt = "#fff"; }
          } else if (isSelected) {
            bg = C.goldL; border = C.gold; txtColor = C.dark; iconBg = C.gold; iconTxt = "#fff";
          }

          return (
            <button key={i} onClick={() => onPick(i)} disabled={revealed} style={{
              padding: "14px 16px", background: bg,
              border: `1.5px solid ${border}`, borderRadius: 14,
              textAlign: "left", fontSize: 14, color: txtColor,
              cursor: revealed ? "default" : "pointer",
              fontFamily: "inherit", fontWeight: isCorrect && revealed ? 600 : 400,
              display: "flex", alignItems: "center", gap: 12, transition: "all 0.15s",
            }}>
              <span style={{
                width: 30, height: 30, borderRadius: 15,
                background: iconBg, color: iconTxt,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, flexShrink: 0, transition: "all 0.15s"
              }}>
                {revealed && isCorrect ? "✓" : revealed && isSelected && !isCorrect ? "✗" : String.fromCharCode(65 + i)}
              </span>
              <span style={{ lineHeight: 1.45 }}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN: RESULTS
// ─────────────────────────────────────────────────────────────
function ResultsScreen({ result, questions, answers, onViewLB, onHome }) {
  if (!result) return null;
  const { score, time, rank, pts } = result;
  const isPrize = rank <= 3;

  return (
    <div style={{ padding: "20px 16px", paddingBottom: 32 }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${C.dark}, ${C.darkL})`,
        borderRadius: 22, padding: "28px 24px", textAlign: "center",
        marginBottom: 16, position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, fontSize: 110, display: "flex", alignItems: "center", justifyContent: "center" }}>⚡</div>
        <div style={{ fontSize: 56, fontWeight: 900, color: C.gold, lineHeight: 1 }}>{score}</div>
        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginTop: 3 }}>out of 10 correct</div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 22, gap: 0 }}>
          {[["Time", fmtTime(time), "rgba(255,255,255,0.85)"],["Rank", `#${rank}`, C.gold],["Points", `+${pts}`, "rgba(255,255,255,0.85)"]].map(([label,val,col], i) => (
            <div key={label} style={{
              flex: 1, textAlign: "center",
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.1)" : "none"
            }}>
              <div style={{ color: col, fontWeight: 800, fontSize: 20 }}>{val}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
        {isPrize && (
          <div style={{
            marginTop: 18, display: "inline-block",
            background: `${C.gold}20`, border: `1px solid ${C.gold}45`,
            borderRadius: 12, padding: "10px 18px"
          }}>
            <div style={{ color: C.gold, fontWeight: 700, fontSize: 14 }}>
              {medal(rank - 1)} You're in the prize zone!
            </div>
          </div>
        )}
      </div>

      {/* Accuracy */}
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>Accuracy</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: C.gold }}>{score * 10}%</span>
        </div>
        <div style={{ height: 8, background: C.border, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: `${score * 10}%`, height: "100%", background: `linear-gradient(90deg, ${C.goldD}, ${C.gold})`, borderRadius: 4, transition: "width 0.6s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <span style={{ fontSize: 13, color: C.green, fontWeight: 700 }}>✓ {score} correct</span>
          <span style={{ fontSize: 13, color: C.red, fontWeight: 700 }}>✗ {10 - score} wrong</span>
        </div>
      </Card>

      {/* Answer review */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 14 }}>Answer Review</div>
        {questions.map((q, i) => {
          const a = answers[i];
          if (!a) return null;
          const meta = CAT_META[q.cat] ?? { color: C.dark, icon: "❓" };
          return (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < questions.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 12, flexShrink: 0,
                  background: a.isCorrect ? C.greenL : C.redL,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: a.isCorrect ? C.green : C.red, fontWeight: 700, marginTop: 1
                }}>{a.isCorrect ? "✓" : "✗"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: meta.color, fontWeight: 700, marginBottom: 3, letterSpacing: 0.4 }}>
                    {meta.icon} {q.cat}
                  </div>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 500, lineHeight: 1.45, marginBottom: a.isCorrect ? 0 : 6 }}>{q.q}</div>
                  {!a.isCorrect && (
                    <>
                      <div style={{ fontSize: 12, color: C.green, marginBottom: 2, fontWeight: 500 }}>✓ {q.opts[q.ans]}</div>
                      <div style={{ fontSize: 12, color: C.red, fontWeight: 500 }}>✗ {q.opts[a.sel]}</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      <div style={{ display: "flex", gap: 10 }}>
        <Btn onClick={onHome} variant="ghost" style={{ flex: 1 }}>Home</Btn>
        <Btn onClick={onViewLB} style={{ flex: 2 }}>Leaderboard →</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN: LEADERBOARD
// ─────────────────────────────────────────────────────────────
function LeaderboardScreen({ daily, monthly, tab, setTab, user, loading }) {
  const list = tab === "daily" ? daily : monthly;
  const top3 = list.slice(0, 3);
  const rest = list.slice(3);

  return (
    <div style={{ padding: "20px 16px", paddingBottom: 32 }}>
      <div style={{ display: "flex", background: C.bg, borderRadius: 14, padding: 4, marginBottom: 20 }}>
        {[["daily","Daily"],["monthly","Monthly"]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            flex: 1, padding: "10px", border: "none", borderRadius: 11,
            background: tab === v ? C.dark : "transparent",
            color: tab === v ? "#fff" : C.muted,
            fontWeight: tab === v ? 700 : 500,
            fontSize: 14, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s"
          }}>{l}</button>
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", color: C.muted, padding: 40, fontSize: 14 }}>Loading...</div>}

      {!loading && top3.length >= 3 && (
        <div style={{
          background: `linear-gradient(135deg, ${C.dark}, ${C.darkL})`,
          borderRadius: 22, padding: "22px 16px 20px",
          marginBottom: 14
        }}>
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <div style={{ color: C.gold, fontSize: 11, fontWeight: 700, letterSpacing: 1.5 }}>
              {tab === "monthly" ? `${new Date().toLocaleString("en-IN", { month: "long" }).toUpperCase()} STANDINGS` : "TODAY'S LEADERBOARD"}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, justifyContent: "center" }}>
            {[1,0,2].map((rankIdx) => {
              const e = top3[rankIdx];
              const isFirst = rankIdx === 0;
              return (
                <div key={rankIdx} style={{
                  flex: 1, textAlign: "center",
                  transform: isFirst ? "translateY(-10px)" : "none"
                }}>
                  <div style={{ fontSize: isFirst ? 32 : 24, marginBottom: 6 }}>{medal(rankIdx)}</div>
                  <div style={{
                    background: isFirst ? `${C.gold}18` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${isFirst ? C.gold + "45" : "rgba(255,255,255,0.1)"}`,
                    borderTop: `3px solid ${isFirst ? C.gold : rankIdx === 1 ? "#94A3B8" : "#92400E"}`,
                    borderRadius: 14, padding: isFirst ? "16px 8px" : "12px 8px"
                  }}>
                    <div style={{ color: isFirst ? C.gold : "#fff", fontWeight: isFirst ? 800 : 700, fontSize: 13 }}>
                      {tab === "daily" ? (e.profiles?.name ?? "—") : (e.name ?? "—")}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 4 }}>
                      {tab === "daily"
                        ? `${e.score}/10 · ${fmtTime(e.time_seconds)}`
                        : `${e.total_pts} pts`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && rest.length > 0 && (
        <Card style={{ padding: "4px 16px" }}>
          {rest.map((e, i) => {
            const name = tab === "daily" ? (e.profiles?.name ?? "Anonymous") : (e.name ?? "Anonymous");
            const isMe = name === user.name;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "13px 0",
                borderBottom: i < rest.length - 1 ? `1px solid ${C.border}` : "none",
                background: isMe ? `${C.gold}06` : "transparent",
                margin: "0 -16px", padding: "13px 16px"
              }}>
                <div style={{ width: 26, fontWeight: 700, color: C.muted, fontSize: 14, textAlign: "center" }}>{i + 4}</div>
                <div style={{
                  width: 34, height: 34, borderRadius: 17,
                  background: isMe ? C.gold : C.bg,
                  color: isMe ? "#fff" : C.muted,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0
                }}>{getInitials(name)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.text, display: "flex", alignItems: "center", gap: 6 }}>
                    {name}
                    {isMe && <span style={{ fontSize: 9, background: C.goldL, color: C.goldD, padding: "1px 6px", borderRadius: 10, fontWeight: 800, letterSpacing: 0.5 }}>YOU</span>}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>
                    {tab === "daily" ? `${e.score}/10 · ${fmtTime(e.time_seconds)}` : `${e.days_played} days played`}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: C.gold, fontSize: 14 }}>
                  {tab === "daily" ? `${e.points} pts` : `${e.total_pts} pts`}
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {!loading && list.length === 0 && (
        <div style={{ textAlign: "center", color: C.muted, padding: "40px 20px", fontSize: 14 }}>
          {tab === "daily" ? "No attempts yet today. Be first! 🏁" : "No scores this month yet."}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────────────
function Header({ user, screen, onNav }) {
  if (!user || screen === "auth") return null;
  const hideNav = screen === "quiz";
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ background: C.dark, padding: "13px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span style={{ color: C.gold, fontWeight: 900, fontSize: 17, letterSpacing: -0.5 }}>GoldRush</span>
            <span style={{ color: "#fff", fontWeight: 500, fontSize: 15 }}>Quiz</span>
          </div>
          <div style={{ color: C.gold, fontSize: 8, fontWeight: 700, letterSpacing: 2.5, marginTop: 1, opacity: 0.7 }}>DAILY FINANCIAL QUIZ</div>
        </div>
        {!hideNav && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 15, background: C.gold,
              color: C.dark, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 11, fontWeight: 800
            }}>{getInitials(user.name)}</div>
          </div>
        )}
      </div>
      {!hideNav && (
        <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, display: "flex" }}>
          {[["home","Home"],["leaderboard","Board"]].map(([s,label]) => (
            <button key={s} onClick={() => onNav(s)} style={{
              flex: 1, padding: "11px 4px", border: "none", background: "none",
              cursor: "pointer", fontSize: 13,
              fontWeight: screen === s ? 700 : 400,
              color: screen === s ? C.gold : C.muted,
              borderBottom: screen === s ? `2.5px solid ${C.gold}` : "2.5px solid transparent",
              fontFamily: "inherit", transition: "all 0.15s"
            }}>{label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("auth");
  const [user, setUser] = useState(null);     // { id, name, email }
  const [hasPlayed, setHasPlayed] = useState(false);
  const [todayAttempt, setTodayAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [sel, setSel] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTs, setStartTs] = useState(null);
  const [result, setResult] = useState(null);
  const [dailyLB, setDailyLB] = useState([]);
  const [monthlyLB, setMonthlyLB] = useState([]);
  const [lbTab, setLbTab] = useState("daily");
  const [lbLoading, setLbLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });
  const timerRef = useRef(null);

  function showToast(msg, type = "info") {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  }

  // ── Session recovery ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        const u = data.session.user;
        const name = u.user_metadata?.name || u.email.split("@")[0];
        setUser({ id: u.id, name, email: u.email });
        setScreen("home");
      }
    });
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") { setUser(null); setScreen("auth"); }
    });
  }, []);

  // ── Load today's attempt & leaderboard when user is set ──
  useEffect(() => {
    if (!user) return;
    checkTodayAttempt();
    fetchLeaderboards();
  }, [user]);

  async function checkTodayAttempt() {
    const today = istDate();
    const { data } = await supabase
      .from("daily_attempts")
      .select("*")
      .eq("user_id", user.id)
      .eq("quiz_date", today)
      .single();
    if (data) { setHasPlayed(true); setTodayAttempt(data); }
  }

  async function fetchLeaderboards() {
    setLbLoading(true);
    const today = istDate();
    const ym = today.slice(0, 7);

    // Daily
    const { data: daily } = await supabase
      .from("daily_attempts")
      .select("*, profiles(name)")
      .eq("quiz_date", today)
      .order("score", { ascending: false })
      .order("time_seconds", { ascending: true })
      .limit(20);
    if (daily) setDailyLB(daily);

    // Monthly — aggregate
    const { data: monthly } = await supabase
      .from("daily_attempts")
      .select("user_id, points, profiles(name)")
      .gte("quiz_date", `${ym}-01`)
      .lte("quiz_date", `${ym}-31`);

    if (monthly) {
      const agg = {};
      monthly.forEach(r => {
        const name = r.profiles?.name ?? "Anonymous";
        if (!agg[r.user_id]) agg[r.user_id] = { name, total_pts: 0, days_played: 0 };
        agg[r.user_id].total_pts += (r.points ?? 1);
        agg[r.user_id].days_played += 1;
      });
      const sorted = Object.values(agg)
        .sort((a, b) => b.total_pts - a.total_pts)
        .slice(0, 20);
      setMonthlyLB(sorted);
    }

    setLbLoading(false);
  }

  // ── Auth ──
  function handleAuth(supaUser, name) {
    setUser({ id: supaUser.id, name, email: supaUser.email });
    setScreen("home");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null); setHasPlayed(false); setTodayAttempt(null); setScreen("auth");
  }

  // ── Timer ──
  useEffect(() => {
    if (screen === "quiz" && startTs) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTs) / 1000));
      }, 200);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [screen, startTs]);

  // ── Quiz flow ──
  function startQuiz() {
    if (hasPlayed) return;
    const qs = pickQuestions();
    setQuestions(qs); setQIdx(0); setAnswers([]);
    setSel(null); setRevealed(false); setElapsed(0); setStartTs(Date.now());
    setResult(null); setScreen("quiz");
  }

  function pickAnswer(optIdx) {
    if (revealed || sel !== null) return;
    const isCorrect = optIdx === questions[qIdx].ans;
    setSel(optIdx); setRevealed(true);

    setTimeout(() => {
      const newAnswers = [...answers, { sel: optIdx, isCorrect }];
      setAnswers(newAnswers);
      if (qIdx < 9) {
        setQIdx(i => i + 1); setSel(null); setRevealed(false);
      } else {
        finalize(newAnswers);
      }
    }, 950);
  }

  async function finalize(finalAnswers) {
    clearInterval(timerRef.current);
    const totalTime = Math.floor((Date.now() - startTs) / 1000);
    const score = finalAnswers.filter(a => a.isCorrect).length;
    const today = istDate();

    // Insert attempt (rank & points calculated after)
    const { data: inserted, error } = await supabase
      .from("daily_attempts")
      .insert({
        user_id: user.id,
        quiz_date: today,
        score,
        time_seconds: totalTime,
        answers: finalAnswers,
        points: 1,  // placeholder, updated below
        rank: 99,
      })
      .select()
      .single();

    if (error) { showToast("Could not save your score. Please check your connection.", "error"); return; }

    // Re-fetch today's board to compute rank
    const { data: todayAll } = await supabase
      .from("daily_attempts")
      .select("user_id, score, time_seconds")
      .eq("quiz_date", today)
      .order("score", { ascending: false })
      .order("time_seconds", { ascending: true });

    const rank = (todayAll?.findIndex(r => r.user_id === user.id) ?? 0) + 1;
    const pts = rankPts(rank);

    // Update with correct rank + points
    await supabase.from("daily_attempts").update({ rank, points: pts }).eq("id", inserted.id);

    setResult({ score, time: totalTime, rank, pts });
    setHasPlayed(true);
    setTodayAttempt({ ...inserted, score, time_seconds: totalTime, rank, points: pts });
    fetchLeaderboards();
    setScreen("results");
  }

  function nav(s) {
    if (screen === "quiz") return;
    if (s === "leaderboard") fetchLeaderboards();
    setScreen(s);
  }

  return (
    <div style={{
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      background: C.bg, minHeight: "100vh",
      maxWidth: 480, margin: "0 auto", color: C.text,
      position: "relative"
    }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadein { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        input, button { font-family: inherit; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      <Toast msg={toast.msg} type={toast.type} />
      <Header user={user} screen={screen} onNav={nav} />

      {screen === "auth" && <AuthScreen onAuth={handleAuth} />}
      {screen === "home" && user && (
        <HomeScreen
          user={user} hasPlayed={hasPlayed} todayAttempt={todayAttempt}
          onStart={startQuiz} leaderboard={dailyLB}
          onViewLB={() => { setLbTab("daily"); setScreen("leaderboard"); }}
          onSignOut={signOut}
        />
      )}
      {screen === "quiz" && (
        <QuizScreen
          questions={questions} qIdx={qIdx} elapsed={elapsed}
          sel={sel} revealed={revealed} onPick={pickAnswer}
        />
      )}
      {screen === "results" && (
        <ResultsScreen
          result={result} questions={questions} answers={answers}
          onViewLB={() => { setLbTab("daily"); setScreen("leaderboard"); }}
          onHome={() => setScreen("home")}
        />
      )}
      {screen === "leaderboard" && user && (
        <LeaderboardScreen
          daily={dailyLB} monthly={monthlyLB}
          tab={lbTab} setTab={setLbTab} user={user} loading={lbLoading}
        />
      )}
    </div>
  );
}
