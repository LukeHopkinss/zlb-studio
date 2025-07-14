import ClienteleMarquee from "../components/ClienteleMarquee";

export default function Work() {
  return (
    <div className="pt-20 min-h-screen bg-black text-white">
      <h1 className="text-5xl font-bold text-center mb-10">Our Work</h1>

      {/* Add top margin to push marquee lower */}
      <div className="mt-20">
        <ClienteleMarquee />
      </div>

      {/* Rest of your work content */}
    </div>
  );
}
