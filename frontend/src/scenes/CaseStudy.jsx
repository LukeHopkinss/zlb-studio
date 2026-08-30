import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LoopVideo from "../components/work/LoopVideo";
import Lightbox from "../components/work/Lightbox";
import useDocumentMeta from "../hooks/useDocumentMeta";

export default function CaseStudy() {
  const { slug } = useParams();
  const [meta, setMeta] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const base = `/work/${slug}`;

  useDocumentMeta({
    title: meta?.name ?? slug,
    description: meta?.outcome,
    path: base,
    // The .jpg twin of the AVIF poster: social scrapers largely don't decode
    // AVIF, which is exactly why the capture pipeline emits both.
    image: meta?.assets?.hero?.poster
      ? `${base}/${meta.assets.hero.poster.replace(/\.avif$/, ".jpg")}`
      : undefined,
  });

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setMeta(null);

    fetch(`${base}/meta.json`)
      .then((res) => (res.ok ? res.json() : null))
      .catch(() => null)
      .then((data) => {
        if (!cancelled) {
          setMeta(data);
          setLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Close the lightbox if the visitor navigates to another case study while
  // it's open — otherwise the index would point into the previous gallery.
  useEffect(() => {
    setExpandedIndex(null);
  }, [slug]);

  const stills = meta?.assets?.stills ?? [];
  const stillUrls = stills.map((still) => `${base}/${still}`);

  return (
    <div className="pt-32 pb-40 min-h-screen bg-black text-white px-6 sm:pl-28 sm:pr-12 lg:pl-38 lg:pr-16">
      <Link to="/" className="text-sm opacity-70 hover:opacity-100">
        &larr; back to work
      </Link>

      {!meta && loaded && (
        <>
          <h1 className="text-4xl sm:text-5xl mt-8">{slug}</h1>
          <p className="mt-4 opacity-70">Case study content coming soon.</p>
        </>
      )}

      {meta && (
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl mt-8">{meta.name}</h1>
          {meta.outcome && <p className="mt-3 text-lg opacity-80">{meta.outcome}</p>}

          {meta.assets?.hero ? (
            <div className="mt-10 w-full aspect-video overflow-hidden bg-neutral-900">
              <LoopVideo
                hero={meta.assets.hero}
                base={base}
                className="w-full h-full object-cover"
                threshold={0}
              />
            </div>
          ) : meta.assets?.stills?.[0] ? (
            <img
              src={`${base}/${meta.assets.stills[0]}`}
              alt=""
              className="mt-10 w-full aspect-video object-cover bg-neutral-900"
            />
          ) : null}

          {meta.caseStudy?.problem && (
            <section className="mt-12 space-y-2">
              <h2 className="text-sm uppercase tracking-wide opacity-50">The problem</h2>
              <p className="text-lg sm:text-xl">{meta.caseStudy.problem}</p>
            </section>
          )}

          {meta.caseStudy?.whatWeBuilt && (
            <section className="mt-10 space-y-2">
              <h2 className="text-sm uppercase tracking-wide opacity-50">What we built</h2>
              <p className="text-lg sm:text-xl">{meta.caseStudy.whatWeBuilt}</p>
            </section>
          )}

          {stills.length > 0 && (
            <section className="mt-12">
              <h2 className="text-sm uppercase tracking-wide opacity-50 mb-4">In detail</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {stills.map((still, i) => (
                  <button
                    key={still}
                    type="button"
                    onClick={() => setExpandedIndex(i)}
                    aria-label={`Expand image ${i + 1} of ${stills.length}`}
                    className="group relative block w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                  >
                    <img
                      src={`${base}/${still}`}
                      alt=""
                      loading="lazy"
                      className="w-full aspect-video object-cover bg-neutral-900 transition-opacity group-hover:opacity-80"
                    />
                  </button>
                ))}
              </div>
            </section>
          )}

          {meta.caseStudy?.results && (
            <section className="mt-12 space-y-2">
              <h2 className="text-sm uppercase tracking-wide opacity-50">Results</h2>
              <p className="text-lg sm:text-xl">{meta.caseStudy.results}</p>
            </section>
          )}

          {meta.url && (
            <a
              href={meta.url}
              target="_blank"
              rel="noopener"
              className="inline-block mt-12 text-sm underline opacity-80 hover:opacity-100"
            >
              Visit site
            </a>
          )}
        </div>
      )}

      <Lightbox
        images={stillUrls}
        index={expandedIndex}
        onClose={() => setExpandedIndex(null)}
        onNavigate={setExpandedIndex}
      />
    </div>
  );
}
