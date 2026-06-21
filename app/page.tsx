const products = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  badge: index === 0 ? "สินค้ายอดนิยม" : index > 4 ? "สินค้ายอดนิยม" : "",
  highlighted: index === 0,
}));

const stats = [
  { label: "ผู้ใช้งานทั้งหมด", title: "ผู้ใช้งานทั้งหมด", value: "4K" },
  { label: "ผู้ใช้งานวันนี้", title: "ผู้ใช้งานวันนี้", value: "1.3K" },
  { label: "ยอดซื้อทั้งหมด", title: "ยอดซื้อทั้งหมด", value: "10K" },
  { label: "ยอดขายวันนี้", title: "ยอดขายวันนี้", value: "420" },
];

function Logo() {
  return (
    <div className="relative h-16 w-28 rotate-[-8deg] drop-shadow-sm">
      <div className="absolute left-0 top-2 rounded-xl bg-gradient-to-br from-red-600 via-red-700 to-red-950 px-3 py-1 text-center text-[26px] font-black italic leading-none tracking-tighter text-white shadow-[inset_0_0_0_2px_rgba(255,255,255,.2)] [-webkit-text-stroke:1px_#250000]">
        EREAL
      </div>
      <div className="absolute bottom-1 left-7 rounded-md bg-black px-2 py-0.5 text-[14px] font-black italic text-white">
        BOXSER
      </div>
      <div className="absolute right-0 top-0 h-7 w-7 rounded-full bg-red-600 shadow-[7px_4px_0_#7f1010]" />
    </div>
  );
}

function ProductImage({ muted = false }: { muted?: boolean }) {
  return (
    <div className={`relative h-[104px] overflow-hidden rounded-md bg-[#111] ${muted ? "grayscale" : ""}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_23%,rgba(255,255,255,.9)_0_2px,transparent_3px),radial-gradient(circle_at_47%_18%,rgba(255,255,255,.8)_0_1px,transparent_2px),radial-gradient(circle_at_79%_28%,rgba(255,255,255,.7)_0_2px,transparent_3px),linear-gradient(165deg,#17233d_0%,#10141d_36%,#050505_100%)]" />
      <div className="absolute left-6 top-5 h-10 w-14 rounded-full border border-white/20 bg-[radial-gradient(circle,rgba(255,255,255,.8),rgba(255,255,255,.13)_34%,transparent_60%)] blur-[1px]" />
      <div className="absolute bottom-4 left-0 h-[2px] w-full bg-white/20" />
      <div className="absolute bottom-0 left-8 h-16 w-36 skew-x-[-24deg] border-l border-t border-white/20 bg-gradient-to-r from-white/10 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/5" />
      {!muted && <div className="absolute bottom-2 left-3 h-9 w-20 rounded-full bg-fuchsia-600/25 blur-xl" />}
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-[92px] max-w-[1040px] items-center justify-between px-4">
        <Logo />
        <nav className="flex items-center gap-2.5">
          <button className="flex h-9 items-center gap-2 rounded-lg bg-[#17171d] px-4 text-sm font-semibold text-white shadow-sm">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-stone-700 text-[12px]">♞</span>
            cvoppy
          </button>
          <button className="h-9 rounded-lg bg-[#17171d] px-5 text-sm font-semibold text-white shadow-sm">ออกจากระบบ</button>
          <button aria-label="cart" className="grid h-9 w-10 place-items-center rounded-lg border border-zinc-200 bg-white shadow-sm">⌂</button>
          <button aria-label="theme" className="grid h-9 w-10 place-items-center rounded-lg border border-zinc-200 bg-white shadow-sm">☼</button>
        </nav>
      </div>
    </header>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-16">
      <Header />
      <section className="relative mx-auto max-w-[1040px] px-4 pt-5">
        <button className="absolute -left-9 top-[166px] hidden h-10 w-10 rounded-full border border-zinc-100 bg-white text-2xl text-zinc-600 shadow-sm lg:block">‹</button>
        <button className="absolute -right-9 top-[166px] hidden h-10 w-10 rounded-full border border-zinc-100 bg-white text-2xl font-bold text-zinc-900 shadow-sm lg:block">›</button>
        <div className="h-[300px] rounded-md border border-zinc-200 bg-zinc-50/60" />

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="relative h-[78px] overflow-hidden rounded-md border border-zinc-200 bg-white px-5 py-3 shadow-sm">
              <p className="text-sm text-zinc-900">{stat.label}</p>
              <h2 className="relative z-10 text-[25px] font-black leading-7 tracking-tight text-zinc-950">{stat.title}</h2>
              <span className="absolute bottom-0 right-3 text-[50px] font-black leading-none text-zinc-400/70">{stat.value}</span>
            </article>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-5 md:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <article key={product.id} className="relative overflow-hidden rounded-md border border-zinc-200 bg-white p-1 shadow-sm">
              {product.badge && (
                <span className={`absolute left-0 top-0 z-10 rounded-br-md px-2 py-1 text-xs font-bold text-white ${product.highlighted ? "bg-red-600" : "bg-zinc-700"}`}>
                  {product.badge}
                </span>
              )}
              <ProductImage muted={!product.highlighted} />
              <div className="px-2 pb-2 pt-2">
                <h3 className="truncate text-[17px] font-black leading-tight text-zinc-950">Night Vision Goggles</h3>
                <p className="truncate text-xs text-zinc-700">อุปกรณ์มองกลางคืน เหมาะสำหรับภารกิจ...</p>
                <p className={`mt-1 text-xl font-black leading-none ${product.highlighted ? "text-red-800" : "text-zinc-700"}`}>฿ 3500.00</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
