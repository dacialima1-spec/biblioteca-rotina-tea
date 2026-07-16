import type { ReactNode } from "react";

export function InfoSection({ title, icon, children, tone = "orange" }: { title: string; icon: ReactNode; children: ReactNode; tone?: string }) {
  return (
    <section className={`info-section tone-${tone}`}>
      <div className="info-section-title"><span>{icon}</span><h2>{title}</h2></div>
      <div className="info-section-content">{children}</div>
    </section>
  );
}

export function ApprovedList({ items, fallback }: { items: string[]; fallback: string }) {
  if (!items.length) return <p className="missing-information">{fallback}</p>;
  return <ul className="approved-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}
