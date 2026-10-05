import { COMPLEXITY } from "../data/operations";

export default function ComplexityPanel({ opId }) {
  const c = COMPLEXITY[opId];
  return (
    <aside className="card panel" id="complexity">
      <h3>Complexity</h3>
      {c ? (
        <>
          <div className="kv"><b>Time</b>{c.time}</div>
          <div className="kv"><b>Space</b>{c.space}</div>
          <p className="note">{c.note} Implementation: array-backed List ADT.</p>
        </>
      ) : (
        <p className="note">Select an operation to see time and space complexity.</p>
      )}
    </aside>
  );
}
