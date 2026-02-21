"use client";
import { useEffect, useMemo, useState } from "react";

const badges = ["🥇", "🥈", "🥉"];

export default function OpenPage() {
  const [state, setState] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [opening, setOpening] = useState(false);

  const qs = useMemo(() => new URLSearchParams(typeof window !== "undefined" ? window.location.search : ""), []);
  const token = qs.get("token") || "";
  const uid = qs.get("uid") || "";
  const name = qs.get("name") || "";

  useEffect(() => {
    fetch(`/api/open/state?token=${token}&uid=${uid}&name=${encodeURIComponent(name)}`).then(r=>r.json()).then((j)=>{ setState(j); setReceipt(j.participant?.receipt || null); });
    fetch(`/api/open/leaderboard`).then(r=>r.json()).then(setLeaderboard);
  }, [token, uid, name]);

  const claim = async () => {
    setOpening(true);
    await new Promise((r)=>setTimeout(r, 1600));
    const r = await fetch("/api/open/claim", { method: "POST", body: JSON.stringify({ token, uid, name }) });
    const j = await r.json();
    setOpening(false);
    if (!r.ok) return alert(j.error);
    setReceipt(j.receipt);
    const lb = await (await fetch(`/api/open/leaderboard`)).json();
    setLeaderboard(lb);
  };

  const rank = leaderboard.find((x) => x.amount === receipt?.amount && x.name.includes(name?.[0] || ""))?.rank;

  return (
    <main className="mx-auto min-h-screen max-w-md p-4 pb-20">
      <section className="card p-5 text-center">
        <h1 className="text-3xl font-black text-red-700">Lì Xì Tết 🧧</h1>
        <p className="mt-2 text-sm text-slate-600">Chúc bạn năm mới bùng nổ, tài lộc hanh thông!</p>
        {!receipt && <button className="btn-primary mt-5 w-full py-3 text-lg" onClick={claim} disabled={opening}>{opening ? "Đang mở phong bao..." : "Mở lì xì"}</button>}
        {opening && <p className="mt-4 animate-pulse text-2xl">🎉 ✨ 🎉</p>}
        {receipt && <div className="mt-4 rounded-xl bg-rose-50 p-4"><p className="text-sm text-slate-500">Bạn nhận được</p><p className="text-4xl font-black text-red-600">{receipt.amount.toLocaleString("vi-VN")}đ</p><p className="mt-2 text-sm font-semibold">Danh hiệu: {receipt.title}</p><p className="mt-2 text-sm italic">“{receipt.motto}”</p>{rank && <p className="mt-2 text-xs text-amber-600">Bạn đang trong top #{rank} leaderboard!</p>}</div>}
      </section>
      {state?.event?.enableLeaderboard && <section className="card mt-4 p-4"><h2 className="mb-2 font-bold">Leaderboard Top {state.event.leaderboardSize}</h2><ul className="space-y-2 text-sm">{leaderboard.map((row)=> <li key={row.rank} className="flex items-center justify-between rounded bg-white px-2 py-1"><span>{row.rank <= 3 ? badges[row.rank-1] : `#${row.rank}`} {row.name}</span><span className="font-semibold">{row.amount.toLocaleString('vi-VN')}đ</span></li>)}</ul></section>}
    </main>
  );
}
