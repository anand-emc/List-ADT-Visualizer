export default function PlaybackBar({ animator }) {
  const { playing, setPlaying, prev, next, reset, speed, setSpeed, total, index } = animator;
  return (
    <div className="card playback">
      <button className="btn btn-ghost" type="button" onClick={prev} disabled={!total}>
        ⏮ Previous
      </button>
      <button className="btn btn-primary" type="button" onClick={() => setPlaying(!playing)} disabled={!total}>
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>
      <button className="btn btn-ghost" type="button" onClick={next} disabled={!total}>
        Next ⏭
      </button>
      <button className="btn btn-ghost" type="button" onClick={reset} disabled={!total}>
        🔄 Reset
      </button>
      <span className="note">{total ? `Step ${index + 1} of ${total}` : "No animation loaded"}</span>
      <label className="speed">
        Slow
        <input
          type="range"
          min="0.4"
          max="2.4"
          step="0.2"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        Fast
      </label>
    </div>
  );
}
