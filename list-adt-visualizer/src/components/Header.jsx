export default function Header({ theme, onToggle }) {
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">DS</div>
        <div>
          <h1>List ADT Visualizer</h1>
          <p>Interactive DSA Learning</p>
        </div>
      </div>
      <nav className="nav">
        <a href="#overview">Overview</a>
        <a href="#operations">Operations</a>
        <a href="#visualization">Visualization</a>
        <a href="#complexity">Complexity</a>
      </nav>
      <button className="theme-btn" onClick={onToggle} type="button">
        {theme === "dark" ? "☀ Light" : "🌙 Dark"}
      </button>
    </header>
  );
}
