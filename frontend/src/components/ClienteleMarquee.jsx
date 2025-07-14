import '../index.css';

const clients = [
  '/yuremanelogo.png','/cozylogo.png','/madmerchlogo.png','/zevorlogo.png','/dyelablogo.png','/laralogo.png'
];

export default function ClienteleMarquee() {
  return (
    <div className="overflow-hidden w-full bg-black py-4">
      <div className="marquee-track">
        {[...clients, ...clients, ...clients].map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt={`Client logo ${i}`}
            className="mx-8 h-[12rem] w-auto object-contain shrink-0"
          />
        ))}
      </div>
    </div>
  );
}
