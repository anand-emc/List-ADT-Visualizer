import { PSEUDOCODE } from "../data/operations";

export default function PseudocodePanel({ opId, line }) {
  const lines = PSEUDOCODE[opId] || ["Select an operation to view its algorithm."];
  return (
    <aside className="card panel">
      <h3>Algorithm / Logic</h3>
      <div className="pseudo">
        {lines.map((l, i) => (
          <div key={i} className={`line ${i === line ? "active" : ""}`}>
            {l}
          </div>
        ))}
      </div>
    </aside>
  );
}
