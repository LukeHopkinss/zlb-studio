import { Link } from "react-router-dom";
import LoopVideo from "./LoopVideo";

export default function ProjectTile({ project }) {
  const { slug, name, assets } = project;
  const base = `/work/${slug}`;
  const hero = assets?.hero;

  return (
    <Link
      to={`/work/${slug}`}
      aria-label={`Learn more about ${name}`}
      className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-4"
    >
      <div className="relative w-full aspect-video overflow-hidden bg-neutral-900">
        {hero ? (
          <LoopVideo hero={hero} base={base} className="w-full h-full object-cover" />
        ) : (
          assets?.stills?.[0] && (
            <img
              src={`${base}/${assets.stills[0]}`}
              alt=""
              className="w-full h-full object-cover"
            />
          )
        )}
      </div>
      <div className="mt-4 space-y-1 text-center">
        <h3 className="text-xl sm:text-2xl">{name}</h3>
      </div>
    </Link>
  );
}
