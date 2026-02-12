import React from 'react';

const INSIGHTS = [
  { value: "3+", label: "Projects" },
  { value: "2+", label: "Years Experience" },
  { value: "8+", label: "Skills" },
  { value: "100%", label: "Passion" },
];

export default function InsightsSidebar() {
  return (
    <aside className="insights-sidebar" aria-label="Insights">
      <div className="insights-sidebar-line" aria-hidden />
      <div className="insights-sidebar-items">
        {INSIGHTS.map((item, index) => (
          <div key={item.label} className="insights-sidebar-item" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="insights-sidebar-value">{item.value}</div>
            <div className="insights-sidebar-label">{item.label}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
