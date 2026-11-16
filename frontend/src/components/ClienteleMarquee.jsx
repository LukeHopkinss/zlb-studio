import '../index.css';

const clients = [
  { name: 'Zevor', src: '/zevorlogo.png' },
  { name: 'NYU Stern LARA', src: '/laralogo.png' },
  { name: 'Vista Kids Dental', src: '/clients/vista-kids-dental.svg' },
  { name: 'PEEYEW', src: '/clients/peeyew.png', scale: true },
  { name: '2econd2kin Magazine', src: '/clients/secondskin.png' },
];

export default function ClienteleMarquee() {
  return (
    <div className="overflow-hidden w-full bg-black py-4" role="region" aria-label="Selected clients">
      <div className="marquee-track">
        {[0, 1, 2].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy > 0 ? true : undefined}>
            {clients.map(({ name, src, scale }) => (
              <div key={name} className="mx-4 sm:mx-6 lg:mx-8 h-16 sm:h-28 lg:h-48 w-40 sm:w-60 lg:w-80 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={src}
                  alt={copy === 0 ? name : ''}
                  className={`w-full h-full object-contain grayscale ${scale ? 'scale-150' : ''}`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
