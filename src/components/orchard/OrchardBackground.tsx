/** 果园分层背景 — 治愈系延伸渐变与柔和草坡 */
export function OrchardBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden orchard-bg">
      {/* 天空 → 草地 长渐变 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#dfe9f0] via-[#e4efe3] to-[#8fbf87]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#7aad72]/90" />

      {/* 远山 */}
      <svg
        className="absolute bottom-[32%] left-0 h-28 w-full opacity-35"
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0 80 L0 45 Q60 20 120 40 T240 35 T400 50 L400 80 Z" fill="#b8cdb0" />
        <path d="M0 80 L0 55 Q100 30 200 48 T400 58 L400 80 Z" fill="#a8bf9e" opacity="0.75" />
      </svg>

      {/* 云雾 */}
      <div className="absolute top-[10%] left-[6%] h-12 w-32 rounded-full bg-white/45 blur-2xl" />
      <div className="absolute top-[16%] right-[8%] h-14 w-40 rounded-full bg-white/35 blur-3xl" />
      <div className="absolute top-[28%] left-[40%] h-8 w-24 rounded-full bg-white/25 blur-xl" />

      {/* 中层草坡 */}
      <div className="absolute bottom-0 left-[-8%] right-[-8%] h-[55%] rounded-t-[50%] bg-gradient-to-t from-[#6fa56a]/55 via-[#8fbf87]/35 to-transparent" />

      {/* 前景草坡 */}
      <div className="absolute bottom-0 left-[-12%] right-[-12%] h-[38%] rounded-t-[45%] bg-gradient-to-t from-[#5a8f56]/40 via-[#7aad72]/28 to-transparent" />

      {/* 底部浓绿延伸 */}
      <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-gradient-to-t from-[#6fa56a]/65 to-transparent" />

      {/* 小花点缀 */}
      {[
        { left: '10%', bottom: '28%', color: '#f8c4d0' },
        { left: '82%', bottom: '32%', color: '#f3d77c' },
        { left: '48%', bottom: '22%', color: '#e9b8a6' },
        { left: '66%', bottom: '26%', color: '#f8c4d0' },
        { left: '24%', bottom: '30%', color: '#dcebd6' },
        { left: '56%', bottom: '34%', color: '#fff8ee' },
      ].map((f, i) => (
        <svg
          key={i}
          className="absolute h-3 w-3 opacity-65"
          style={{ left: f.left, bottom: f.bottom }}
          viewBox="0 0 12 12"
          aria-hidden
        >
          <circle cx="6" cy="6" r="2.5" fill={f.color} />
          <circle cx="6" cy="6" r="1" fill="white" opacity="0.45" />
        </svg>
      ))}
    </div>
  )
}
