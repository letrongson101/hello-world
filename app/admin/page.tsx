"use client";
import { useEffect, useMemo, useState } from "react";
import Histogram from "@/components/Histogram";

type EventCfg = {
  nRecipients: number; minAmount: number; maxAmount: number; avgTarget: number; avgTolerance: number; roundTo: number;
  enableLeaderboard: boolean; leaderboardSize: number; mode: "SSO" | "MAGIC_LINK"; maskName: boolean; shareAmount: boolean;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const [tab, setTab] = useState(1);
  const [cfg, setCfg] = useState<EventCfg>({ nRecipients: 50, minAmount: 20000, maxAmount: 200000, avgTarget: 100000, avgTolerance: 0.1, roundTo: 10000, enableLeaderboard: true, leaderboardSize: 10, mode: "MAGIC_LINK", maskName: false, shareAmount: false });
  const [preview, setPreview] = useState<any>();
  const [rows, setRows] = useState("");
  const [links, setLinks] = useState<any[]>([]);
  const [monitor, setMonitor] = useState<any>();

  const save = async () => { await fetch("/api/admin/event", { method: "POST", body: JSON.stringify(cfg) }); alert("Đã lưu cấu hình"); };
  const generate = async () => { const r = await fetch("/api/admin/generate", { method: "POST" }); const j = await r.json(); if (!r.ok) return alert(j.error); setPreview(j.summary); };
  const upload = async () => {
    const parsed = rows.split("\n").slice(1).filter(Boolean).map((l) => {
      const [fullName, email, employeeCode] = l.split(",");
      return { fullName: fullName?.trim(), email: email?.trim(), employeeCode: employeeCode?.trim() };
    });
    const r = await fetch("/api/admin/upload", { method: "POST", body: JSON.stringify({ rows: parsed }) });
    const j = await r.json(); alert(`Đã nạp ${j.count} user`);
  };
  const fetchLinks = async () => setLinks(await (await fetch("/api/admin/links")).json());
  const fetchMonitor = async () => setMonitor(await (await fetch("/api/admin/monitor")).json());
  const reset = async () => { await fetch("/api/admin/reset", { method: "POST" }); alert("Đã reset"); };

  useEffect(() => { if (tab === 4) fetchMonitor(); }, [tab]);

  if (!logged) return <main className="mx-auto max-w-md p-6"><div className="card p-6"><h1 className="mb-2 text-2xl font-bold">Admin Login</h1><input className="w-full rounded border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><button className="btn-primary mt-3" onClick={async()=>{const r=await fetch('/api/admin/login',{method:'POST',body:JSON.stringify({password})}); setLogged(r.ok); if(!r.ok) alert('Sai mật khẩu')}}>Đăng nhập</button></div></main>;

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-8 space-y-4">
      <h1 className="text-3xl font-black text-red-700">Admin Lì Xì</h1>
      <div className="flex gap-2">{[1,2,3,4,5].map((n)=><button key={n} className={`rounded px-3 py-2 ${tab===n?'bg-red-600 text-white':'bg-white'}`} onClick={()=>setTab(n)}>Tab {n}</button>)}</div>
      {tab===1 && <div className="card p-4 grid grid-cols-2 gap-3">{Object.entries(cfg).map(([k,v])=> typeof v === 'boolean' ? <label key={k}><input type="checkbox" checked={v} onChange={e=>setCfg({...cfg,[k]:e.target.checked})}/> {k}</label> : <label key={k} className="text-sm">{k}<input className="mt-1 w-full rounded border p-2" value={v as any} onChange={e=>setCfg({...cfg,[k]: k==='mode' ? e.target.value : Number(e.target.value)})}/></label>)}<button className="btn-primary col-span-2" onClick={save}>Lưu Setup Event</button></div>}
      {tab===2 && <div className="card p-4"><p className="mb-2">CSV format: fullName,email,employeeCode</p><textarea className="h-48 w-full rounded border p-2" value={rows} onChange={e=>setRows(e.target.value)} /><div className="mt-3 flex gap-2"><button className="btn-primary" onClick={upload}>Upload CSV</button><button className="rounded border px-3" onClick={fetchLinks}>Load links</button></div><ul className="mt-2 text-sm">{links.slice(0,20).map((l,i)=><li key={i}>{l.displayName}: /open?token={l.token}</li>)}</ul></div>}
      {tab===3 && <div className="card p-4"><button className="btn-primary" onClick={generate}>Generate envelopes + preview</button>{preview && <div className="mt-4 space-y-2"><p>Min/Median/Max: {preview.min} / {preview.median} / {preview.max}</p><p>AVG_ACTUAL: {Math.round(preview.avg)}</p><Histogram items={preview.histogram} /></div>}</div>}
      {tab===4 && <div className="card p-4"><button className="rounded border px-3 py-2" onClick={fetchMonitor}>Refresh Monitor</button><p className="mt-2">Claimed: {monitor?.claimed || 0}</p><ul>{monitor?.top?.map((t:any)=><li key={t.rank}>#{t.rank} {t.name} - {t.amount.toLocaleString('vi-VN')}đ</li>)}</ul></div>}
      {tab===5 && <div className="card p-4"><button className="rounded bg-black px-3 py-2 text-white" onClick={reset}>Reset Event</button></div>}
    </main>
  );
}
