export default function Topacio() {
  return (
    <div className="w-[320px] h-[380px] backdrop-blur-lg rounded-lg shadow-md p-4 text-white overflow-y-auto flex items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-3">
        {/* Avatar */}
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
          LT
        </div>

        {/* Name & Role */}
        <div>
          <h2 className="text-lg font-semibold">Luke Topacio</h2>
          <p className="text-xs text-white/60">Chief Marketing Officer</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-white/80 leading-snug px-2">
          Owns growth strategy and brand storytelling, leading campaigns across social, email, and partnerships. Builds the marketing funnel, tracks pipeline metrics, and drives creator/brand collaborations that convert.
        </p>
      </div>
    </div>
  );
}
