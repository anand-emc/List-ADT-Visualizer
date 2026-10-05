const STATE_CLASS = {
  normal: "",
  current: "current",
  checking: "checking",
  found: "found",
  inserting: "inserting",
  deleting: "deleting",
  success: "success",
  error: "error",
};

export default function Visualization({ list, step }) {
  const nodes = step?.nodes ?? list;
  const highlight = step?.highlight ?? {};
  const ghost = step?.ghost;
  const pointer = step?.pointer;

  const items = [...nodes];
  const showGhost =
    ghost && (ghost.at >= items.length || ghost.kind === "inserting");

  return (
    <section className="card viz" id="visualization">
      <h3>List Visualization</h3>
      <p className="note">
        List ADT describes operations and behaviour. This view uses an{" "}
        <strong>array-backed list</strong> so indices and shifts are explicit.
        Pointers between cards show sequence order, not linked-list nodes.
      </p>
      <div className="stage">
        {items.length === 0 && !ghost ? (
          <div className="empty-hint">List is empty — insert an element to begin.</div>
        ) : (
          <>
            {items.map((v, i) => (
              <div className="node-wrap" key={`${i}-${v}`}>
                {i > 0 && <div className="arrow" />}
                <div className={`node ${STATE_CLASS[highlight[i] || "normal"]}`}>
                  <span className="val">{v}</span>
                  <span className="idx">
                    {i}
                    {pointer === i ? "  ↑" : ""}
                  </span>
                </div>
              </div>
            ))}
            {showGhost && ghost.at === items.length && (
              <div className="node-wrap">
                {items.length > 0 && <div className="arrow" />}
                <div className={`node ghost ${ghost.kind}`}>
                  <span className="val">{ghost.value}</span>
                  <span className="idx">new</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="legend">
        <span><span className="dot" style={{ background: "#6d4aff" }} /> Current</span>
        <span><span className="dot" style={{ background: "#f59e0b" }} /> Checking</span>
        <span><span className="dot" style={{ background: "#10b981" }} /> Found / Success</span>
        <span><span className="dot" style={{ background: "#3b82f6" }} /> Inserting</span>
        <span><span className="dot" style={{ background: "#ef4444" }} /> Deleting / Error</span>
      </div>
    </section>
  );
}
