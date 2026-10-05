export default function Education() {
  return (
    <section className="card edu" id="overview">
      <h3>What is List ADT?</h3>
      <p className="note" style={{ fontSize: 14, marginTop: 8 }}>
        List ADT is an abstract data type that represents an ordered collection of elements.
        It defines operations such as insertion, deletion, searching, updating, and traversal
        without requiring a specific implementation. The ADT is the contract; array lists and
        linked lists are two common ways to realise it.
      </p>
      <div className="edu-grid">
        <article>
          <h4>List ADT operations</h4>
          <ul>
            <li>Create / clear the list</li>
            <li>Insert (begin, end, position)</li>
            <li>Delete (value, begin, end, position)</li>
            <li>Search, get, update, traverse</li>
            <li>Size and emptiness queries</li>
          </ul>
        </article>
        <article>
          <h4>Advantages</h4>
          <ul>
            <li>Ordered, indexable collection</li>
            <li>Implementation can change without changing client code</li>
            <li>Natural model for sequences, playlists, undo buffers</li>
          </ul>
        </article>
        <article>
          <h4>Applications</h4>
          <ul>
            <li>Student records, playlists, undo/redo</li>
            <li>Polynomial terms, sparse tables</li>
            <li>Queues/stacks built on list primitives</li>
          </ul>
        </article>
        <article>
          <h4>Array-based List</h4>
          <p>
            Elements live in contiguous slots. Get/update at an index is O(1). Insert/delete
            in the middle costs O(n) because of shifting. This visualizer uses this model so
            indices and shifts are visible.
          </p>
        </article>
        <article>
          <h4>Linked List implementation</h4>
          <p>
            Nodes hold a value and a pointer to the next node. Insert/delete at a known node
            is O(1), but reaching position k is O(n). Same ADT operations, different costs.
          </p>
        </article>
      </div>
    </section>
  );
}
