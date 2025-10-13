export default function Reyzin() {
  return (
    <div className="w-[320px] h-[380px] backdrop-blur-lg rounded-lg shadow-md p-4 text-white overflow-y-auto flex items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Avatar */}
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
          NR
        </div>

        {/* Name & Role */}
        <div>
          <h2 className="text-lg font-semibold">Nick Reyzin</h2>
          <p className="text-xs text-white/60">Chief Operations Officer</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-white/80 leading-snug px-2">
          Reyzin runs day-to-day operations, turning ideas into schedules, budgets, and vendor plans. Optimizes resourcing, negotiates contracts, and keeps timelines unblocked so projects ship on time and on quality.
        </p>
      </div>
    </div>
  );
}