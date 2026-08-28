"use client";

import { useState } from "react";
import { ctfResults } from "@/data/ctf";

const filters = ["All", "Jeopardy", "Attack and Defense", "International", "APU"] as const;

export function CtfArchive({ compact = false }: { compact?: boolean }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const items = (compact ? ctfResults.filter((item) => item.featured) : ctfResults).filter((item) => {
    if (filter === "All") return true;
    if (filter === "International" || filter === "APU") return item.scope === filter;
    return item.type === filter;
  });

  return (
    <>
      {!compact ? (
        <div className="filters" aria-label="Filter CTF results">
          {filters.map((item) => (
            <button key={item} type="button" className="filter" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>
      ) : null}
      <div className="archive">
        <div className="archive-head" aria-hidden="true"><span>Year</span><span>Event</span><span>Result</span><span>Type</span></div>
        {items.map((item) => (
          <div className="archive-row" key={item.event} tabIndex={0}>
            <span className="archive-year">{item.year}</span>
            <span className="archive-event">
              <strong>{item.shortEvent}</strong>
              <small>{[item.team ? `Team: ${item.team}` : null, item.organization, item.representation, item.detail].filter(Boolean).join(" / ")}</small>
            </span>
            <span className="archive-result">{item.result}</span>
            <span className="archive-type">{item.type}</span>
          </div>
        ))}
      </div>
    </>
  );
}
