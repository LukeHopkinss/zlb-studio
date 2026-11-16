import DotBust from "../components/DotBust";

export default function Hopkins() {
  return (
    <div className="w-full max-w-3xl mx-auto text-white flex flex-col items-center text-center">
      <DotBust />

      <div className="mt-6">
        <h2 className="text-2xl font-creatoBold">Luke Hopkins</h2>
        <p className="text-sm text-white/60 mt-1">Founder &amp; Web Developer</p>
      </div>

      <p className="text-base text-white/80 leading-snug px-4 mt-4 max-w-md">
        Hopkins designs and builds websites end-to-end, from first concept through launch, with a focus on clean design and solid front-end engineering. His experience includes work at NBCUniversal and Y Combinator-backed startups.
      </p>
    </div>
  );
}
