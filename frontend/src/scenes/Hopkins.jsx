export default function Hopkins() {
  return (
    <div className="w-[320px] h-[380px] backdrop-blur-lg rounded-lg shadow-md p-4 text-white overflow-y-auto flex items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Avatar */}
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
          LH
        </div>

        {/* Name & Role */}
        <div>
          <h2 className="text-lg font-semibold">Luke Hopkins</h2>
          <p className="text-xs text-white/60">Chief Technical & Executive Officer</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-white/80 leading-snug px-2">
          Owns the technical stack and production pipeline—prototyping, tooling, and final output. Directs leadership across teams, sets engineering standards, and aligns priorities to deliver reliable, scalable work.
        </p>
      </div>
    </div>
  );
}
