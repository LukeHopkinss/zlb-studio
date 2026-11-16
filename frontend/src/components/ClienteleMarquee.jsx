import '../index.css';

// Artwork bounds exclude each source file's empty margins. An SVG viewport
// fits the complete mark without enlarging it past an overflow-hidden frame.
const clients = [
  { name: 'Zevor', src: '/zevorlogo.png', width: 280, height: 280, bounds: [58, 100, 172, 26] },
  { name: 'NYU Stern LARA', src: '/laralogo.png', width: 280, height: 280, bounds: [53, 98, 173, 42] },
  { name: 'Vista Kids Dental', larger: true, src: '/clients/vista-kids-dental.svg', width: 1280, height: 555, bounds: [0, 1, 1280, 554] },
  { name: 'PEEYEW', src: '/clients/peeyew.png', width: 960, height: 560, bounds: [170, 221, 656, 140] },
  { name: '2econd2kin', src: '/clients/secondskin.png', width: 854, height: 228, bounds: [21, 43, 816, 169] },
];

export default function ClienteleMarquee() {
  return (
    <div className="overflow-hidden w-full bg-black py-4" role="region" aria-label="Selected clients">
      {/* Extra copies keep the tighter logo group continuous on wide screens. */}
      <div className="marquee-track" style={{ '--marquee-shift': '-16.666667%' }}>
        {[0, 1, 2, 3, 4, 5].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy > 0 ? true : undefined}>
            {clients.map(({ name, src, width, height, larger, bounds: [x, y, w, h] }) => {
              // Two percent of breathing room protects antialiased edges.
              const padding = h * 0.02;
              return (
                <div key={name} className="mx-5 sm:mx-7 lg:mx-10 h-16 sm:h-28 lg:h-48 flex items-center justify-center shrink-0">
                  <svg
                    viewBox={`${x - padding} ${y - padding} ${w + padding * 2} ${h + padding * 2}`}
                    width={w + padding * 2}
                    height={h + padding * 2}
                    role="img"
                    aria-label={copy === 0 ? name : undefined}
                    aria-hidden={copy > 0 ? true : undefined}
                    className={`${larger ? 'h-14 sm:h-20 lg:h-24' : 'h-4 sm:h-6 lg:h-8'} w-auto shrink-0 grayscale`}
                  >
                    <image href={src} width={width} height={height} aria-hidden="true" />
                  </svg>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
