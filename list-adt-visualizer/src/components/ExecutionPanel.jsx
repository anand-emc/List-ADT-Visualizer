export default function ExecutionPanel({ opLabel, step, index, total }) {
  const result = step?.result || "Waiting for an operation…";
  const isTrue = /✓|TRUE|SUCCESS/i.test(result);
  const isFalse = /✗|✕|FALSE|Invalid|not found/i.test(result);
  return (
    <aside className="card panel">
      <h3>Execution Process</h3>
      <div className="kv">
        <b>Current Operation</b>
        {opLabel || "—"}
      </div>
      <div className="kv">
        <b>Current Step</b>
        {total ? `${index + 1} / ${total}` : "—"}
      </div>
      <div className="kv">
        <b>Action</b>
        {step?.action || "Idle"}
      </div>
      <div className="cond-box">
        CONDITION CHECK
        {"\n"}────────────────
        {"\n"}
        {step?.condition || "—"}
        {"\n"}
        <span className={isTrue ? "true" : isFalse ? "false" : ""}>{result}</span>
        {"\n\n"}Next: {step?.next || "—"}
      </div>
    </aside>
  );
}
