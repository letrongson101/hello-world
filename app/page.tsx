import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-4 text-4xl font-black text-red-700">Lì Xì Tết 🎊</h1>
      <p className="mb-8 text-slate-700">App mở lì xì zero-input cho team ngân hàng.</p>
      <div className="flex gap-3">
        <Link href="/open" className="btn-primary">Đi mở lì xì</Link>
        <Link href="/admin" className="rounded-xl border border-red-200 bg-white px-4 py-2 font-semibold text-red-700">Vào Admin</Link>
      </div>
    </main>
  );
}
