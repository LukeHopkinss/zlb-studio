import { useEffect, useState } from "react";
import ProjectTile from "./ProjectTile";
import { workSlugs } from "../../data/workSlugs";

export default function WorkGrid() {
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      workSlugs.map((slug) =>
        fetch(`/work/${slug}/meta.json`)
          .then((res) => (res.ok ? res.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      setProjects(results.filter(Boolean));
      setLoaded(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loaded && projects.length === 0) {
    return <p className="text-sm opacity-50 text-center">Case studies coming soon.</p>;
  }

  return (
    <div className="flex flex-col items-center gap-20 sm:gap-28">
      {projects.map((project) => (
        <div key={project.slug} className="w-full max-w-3xl">
          <ProjectTile project={project} />
        </div>
      ))}
    </div>
  );
}
