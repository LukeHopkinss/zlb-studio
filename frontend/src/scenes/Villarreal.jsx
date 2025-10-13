export default function Villarreal() {
  return (
    <div className="w-[320px] h-[380px] backdrop-blur-lg rounded-lg shadow-md p-4 text-white overflow-y-auto flex items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Avatar */}
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
          RV
        </div>

        {/* Name & Role */}
        <div>
          <h2 className="text-lg font-semibold">Roberto Villarreal</h2>
          <p className="text-xs text-white/60">Creative Director</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-white/80 leading-snug px-2">
          Villareal defines the studio's visual language and guides concept-to-execution craft. Oversees mood boards, art direction, and review cycles to ensure every deliverable is on-brand, original, and production-ready.
        </p>
      </div>
    </div>
  );
}