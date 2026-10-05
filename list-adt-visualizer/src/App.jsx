import { useMemo, useState } from "react";
import Header from "./components/Header";
import Visualization from "./components/Visualization";
import ExecutionPanel from "./components/ExecutionPanel";
import PseudocodePanel from "./components/PseudocodePanel";
import ComplexityPanel from "./components/ComplexityPanel";
import PlaybackBar from "./components/PlaybackBar";
import Education from "./components/Education";
import { ALL_OPS, OPERATION_GROUPS, OP_LABELS } from "./data/operations";
import { createList, generateSteps, parsePosition, parseValue } from "./adt/listADT";
import { useTheme } from "./hooks/useTheme";
import { useAnimator } from "./hooks/useAnimator";

export default function App() {
  const { theme, toggle } = useTheme();
  const animator = useAnimator();
  const [list, setList] = useState(() => createList([10, 20, 40]));
  const [opId, setOpId] = useState("insertAt");
  const [value, setValue] = useState("30");
  const [position, setPosition] = useState("2");
  const [formError, setFormError] = useState("");
  const [feedback, setFeedback] = useState(null);

  const opMeta = useMemo(() => ALL_OPS.find((o) => o.id === opId), [opId]);

  function execute() {
    setFormError("");
    let val;
    let pos;
    if (opMeta.needsValue) {
      const p = parseValue(value);
      if (!p.ok) {
        setFormError(p.error);
        return;
      }
      val = p.value;
    }
    if (opMeta.needsPos) {
      const p = parsePosition(position);
      if (!p.ok) {
        setFormError(p.error);
        return;
      }
      pos = p.value;
    }
    const { steps, nextList } = generateSteps(opId, list, { value: val, position: pos });
    setFeedback(null);
    animator.load(steps, nextList, (finalList) => {
      setList(finalList);
      const last = steps[steps.length - 1];
      if (last?.feedback) setFeedback(last.feedback);
    });
  }

  const displayList = animator.current ? animator.current.nodes : list;

  return (
    <div className="app">
      <Header theme={theme} onToggle={toggle} />
      <section className="hero">
        <span className="kicker">LIST ADT</span>
        <h2>Understand List Operations Visually</h2>
        <p>
          Learn how insertion, deletion, searching and traversal work through
          step-by-step animated execution — not just the final output.
        </p>
      </section>

      <main className="layout">
        <div className="card ops-bar" id="operations">
          <div className="chip-row">
            {OPERATION_GROUPS.map((g) =>
              g.ops.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={`chip ${opId === o.id ? "active" : ""}`}
                  onClick={() => setOpId(o.id)}
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
          {opMeta?.needsValue && (
            <div className="field">
              <label htmlFor="val">Value</label>
              <input
                id="val"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 30"
              />
            </div>
          )}
          {opMeta?.needsPos && (
            <div className="field">
              <label htmlFor="pos">Position (index)</label>
              <input
                id="pos"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. 2"
              />
            </div>
          )}
          <button className="btn btn-primary" type="button" onClick={execute}>
            Execute Operation
          </button>
          {formError && <p className="input-error">{formError}</p>}
        </div>

        <Visualization list={displayList} step={animator.current} />

        <div className="side">
          <ExecutionPanel
            opLabel={OP_LABELS[opId]}
            step={animator.current}
            index={animator.index}
            total={animator.total}
          />
          <PseudocodePanel opId={opId} line={animator.current?.line ?? -1} />
          <ComplexityPanel opId={opId} />
        </div>

        <PlaybackBar animator={animator} />

        {feedback && (
          <div className={`card feedback ${feedback.ok ? "" : "bad"}`}>
            <h4>
              {feedback.ok ? "✓" : "✕"} {feedback.title}
            </h4>
            <p>{feedback.text}</p>
          </div>
        )}

        <Education />
      </main>
    </div>
  );
}
