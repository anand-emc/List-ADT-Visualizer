/**
 * Array-backed List ADT + animation step generator.
 * List ADT describes operations; visualization uses an array representation.
 */

function snapshot(items) {
  return items.map((v) => v);
}

function step(partial) {
  return {
    action: "",
    condition: "",
    result: "",
    next: "",
    nodes: [],
    highlight: {}, // index -> state
    ghost: null, // { value, at, kind }
    pointer: null,
    line: 1,
    feedback: null,
    success: null,
    ...partial,
  };
}

function nodeStates(n, map = {}) {
  const h = {};
  for (let i = 0; i < n; i++) h[i] = map[i] || "normal";
  return h;
}

export function createList(initial = [10, 20, 40]) {
  return snapshot(initial);
}

export function generateSteps(op, list, { value, position }) {
  const items = snapshot(list);
  const n = items.length;
  const val = value;
  const pos = position;

  switch (op) {
    case "insertEnd":
      return insertEnd(items, val);
    case "insertBegin":
      return insertBegin(items, val);
    case "insertAt":
      return insertAt(items, val, pos);
    case "deleteValue":
      return deleteValue(items, val);
    case "deleteBegin":
      return deleteBegin(items);
    case "deleteEnd":
      return deleteEnd(items);
    case "deleteAt":
      return deleteAt(items, pos);
    case "search":
      return search(items, val);
    case "get":
      return getAt(items, pos);
    case "update":
      return updateAt(items, pos, val);
    case "traverse":
      return traverse(items);
    case "size":
      return sizeOf(items);
    case "isEmpty":
      return isEmpty(items);
    case "clear":
      return clearList(items);
    default:
      return [step({ action: "Unknown operation", nodes: items })];
  }
}

function insertEnd(items, val) {
  const steps = [];
  const n = items.length;
  steps.push(
    step({
      action: "Start: Insert at End",
      condition: `value = ${val}`,
      result: "Preparing new node",
      next: "Create node",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "Create new node",
      condition: `newNode.value = ${val}`,
      result: "Node allocated",
      next: "Check if list is empty",
      nodes: snapshot(items),
      ghost: { value: val, at: n, kind: "inserting" },
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "CONDITION CHECK: Is the list empty?",
      condition: `size == 0  →  ${n} == 0`,
      result: n === 0 ? "✓ TRUE — new node becomes the only element" : "✗ FALSE — append after last node",
      next: n === 0 ? "Place at index 0" : "Append at index " + n,
      nodes: snapshot(items),
      ghost: { value: val, at: n, kind: "checking" },
      highlight: nodeStates(n, n ? { [n - 1]: "current" } : {}),
      line: 2,
    })
  );
  const nextItems = [...items, val];
  steps.push(
    step({
      action: `Append at index ${n}`,
      condition: `new size = ${n} + 1`,
      result: "✓ Inserted",
      next: "Update size",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n + 1, { [n]: "inserting" }),
      line: 3,
    })
  );
  steps.push(
    step({
      action: "Increment list size",
      condition: `size: ${n} → ${n + 1}`,
      result: "✓ SUCCESS",
      next: "Done",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n + 1, { [n]: "success" }),
      line: 4,
      success: true,
      feedback: {
        ok: true,
        title: "Insert Successful",
        text: `Element ${val} was appended at index ${n}. List size increased from ${n} to ${n + 1}.`,
      },
    })
  );
  return { steps, nextList: nextItems };
}

function insertBegin(items, val) {
  const steps = [];
  const n = items.length;
  steps.push(
    step({
      action: "Start: Insert at Beginning",
      condition: `value = ${val}`,
      result: "Preparing",
      next: "Create node",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "Create new node",
      condition: `newNode.value = ${val}`,
      result: "Node allocated",
      next: "Shift existing elements right",
      nodes: snapshot(items),
      ghost: { value: val, at: 0, kind: "inserting" },
      highlight: nodeStates(n),
      line: 1,
    })
  );
  if (n > 0) {
    steps.push(
      step({
        action: "Shift elements one index to the right",
        condition: `for i = ${n - 1} down to 0: list[i+1] = list[i]`,
        result: "Making room at index 0",
        next: "Place new element at index 0",
        nodes: snapshot(items),
        highlight: Object.fromEntries(items.map((_, i) => [i, "checking"])),
        ghost: { value: val, at: 0, kind: "inserting" },
        line: 2,
      })
    );
  }
  const nextItems = [val, ...items];
  steps.push(
    step({
      action: "Place new element at index 0",
      condition: `list[0] = ${val}`,
      result: "✓ Inserted at beginning",
      next: "Update size",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n + 1, { 0: "inserting" }),
      line: 3,
    })
  );
  steps.push(
    step({
      action: "Increment list size",
      condition: `size: ${n} → ${n + 1}`,
      result: "✓ SUCCESS",
      next: "Done",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n + 1, { 0: "success" }),
      line: 4,
      success: true,
      feedback: {
        ok: true,
        title: "Insert Successful",
        text: `Element ${val} was inserted at the beginning. Existing elements shifted right. Size ${n} → ${n + 1}.`,
      },
    })
  );
  return { steps, nextList: nextItems };
}

function insertAt(items, val, pos) {
  const steps = [];
  const n = items.length;
  steps.push(
    step({
      action: "Start: Insert at Position",
      condition: `value = ${val}, position = ${pos}`,
      result: "Begin validation",
      next: "Check position validity",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  const valid = Number.isInteger(pos) && pos >= 0 && pos <= n;
  steps.push(
    step({
      action: "CONDITION CHECK: Is position valid?",
      condition: `0 ≤ ${pos} ≤ size(${n})`,
      result: valid ? "✓ TRUE — position is valid" : "✗ FALSE — invalid position",
      next: valid ? "Traverse to target" : "Abort",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  if (!valid) {
    steps.push(
      step({
        action: "Abort insert",
        condition: `Position ${pos} is outside [0, ${n}]`,
        result: "✕ Invalid Position",
        next: "Done",
        nodes: snapshot(items),
        highlight: nodeStates(n, Object.fromEntries(items.map((_, i) => [i, "error"]))),
        line: 2,
        success: false,
        feedback: {
          ok: false,
          title: "Invalid Position",
          text: `Position ${pos} cannot be used. Valid insert positions are 0 through ${n} (current size).`,
        },
      })
    );
    return { steps, nextList: items };
  }
  for (let i = 0; i < pos; i++) {
    steps.push(
      step({
        action: `Traverse — visiting index ${i}`,
        condition: `Have we reached target position ${pos}?  ${i} == ${pos}`,
        result: "✗ FALSE — continue",
        next: "Move to next index",
        nodes: snapshot(items),
        highlight: nodeStates(n, { [i]: "current" }),
        pointer: i,
        line: 3,
      })
    );
  }
  steps.push(
    step({
      action: `Reached target index ${pos}`,
      condition: `index == ${pos}`,
      result: "✓ TRUE",
      next: "Shift suffix right",
      nodes: snapshot(items),
      highlight: nodeStates(n, pos < n ? { [pos]: "checking" } : {}),
      pointer: pos,
      ghost: { value: val, at: pos, kind: "inserting" },
      line: 3,
    })
  );
  if (pos < n) {
    steps.push(
      step({
        action: "Shift elements from position to the right",
        condition: `for i = ${n - 1} down to ${pos}: list[i+1] = list[i]`,
        result: "Room created",
        next: "Insert new element",
        nodes: snapshot(items),
        highlight: Object.fromEntries(items.map((_, i) => [i, i >= pos ? "checking" : "normal"])),
        ghost: { value: val, at: pos, kind: "inserting" },
        line: 4,
      })
    );
  }
  const nextItems = [...items.slice(0, pos), val, ...items.slice(pos)];
  steps.push(
    step({
      action: `Insert ${val} at index ${pos}`,
      condition: `list[${pos}] = ${val}`,
      result: "Node linked into sequence",
      next: "Update size",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n + 1, { [pos]: "inserting" }),
      line: 5,
    })
  );
  steps.push(
    step({
      action: "Increment list size",
      condition: `size: ${n} → ${n + 1}`,
      result: "✓ SUCCESS",
      next: "Done",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n + 1, { [pos]: "success" }),
      line: 6,
      success: true,
      feedback: {
        ok: true,
        title: "Insert Successful",
        text: `Element ${val} was inserted at position ${pos}. Elements after that index were shifted, and size grew from ${n} to ${n + 1}.`,
      },
    })
  );
  return { steps, nextList: nextItems };
}

function deleteValue(items, val) {
  const steps = [];
  const n = items.length;
  steps.push(
    step({
      action: "Start: Delete Element by value",
      condition: `target = ${val}`,
      result: "Begin",
      next: "Check empty",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "CONDITION CHECK: Is the list empty?",
      condition: `size == 0  →  ${n} == 0`,
      result: n === 0 ? "✓ TRUE" : "✗ FALSE",
      next: n === 0 ? "Abort" : "Traverse from index 0",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  if (n === 0) {
    steps.push(
      step({
        action: "Cannot delete from empty list",
        condition: "size = 0",
        result: "✕ Empty list",
        next: "Done",
        nodes: [],
        line: 1,
        success: false,
        feedback: {
          ok: false,
          title: "Empty List",
          text: "There is nothing to delete. Create or insert elements first.",
        },
      })
    );
    return { steps, nextList: items };
  }
  let found = -1;
  for (let i = 0; i < n; i++) {
    const match = items[i] === val;
    steps.push(
      step({
        action: `Compare list[${i}] with ${val}`,
        condition: `${items[i]} == ${val}`,
        result: match ? "✓ FOUND" : "✗ not equal — continue",
        next: match ? "Delete this node" : "Next index",
        nodes: snapshot(items),
        highlight: nodeStates(n, { [i]: match ? "found" : "checking" }),
        pointer: i,
        line: 3,
      })
    );
    if (match) {
      found = i;
      break;
    }
  }
  if (found < 0) {
    steps.push(
      step({
        action: "Traversal finished",
        condition: "No remaining nodes",
        result: "✕ Element not found",
        next: "Done",
        nodes: snapshot(items),
        highlight: nodeStates(n),
        line: 6,
        success: false,
        feedback: {
          ok: false,
          title: "Not Found",
          text: `Value ${val} is not present in the list. No element was removed.`,
        },
      })
    );
    return { steps, nextList: items };
  }
  steps.push(
    step({
      action: `Mark index ${found} for deletion`,
      condition: `list[${found}] = ${val}`,
      result: "DELETING",
      next: "Shift left",
      nodes: snapshot(items),
      highlight: nodeStates(n, { [found]: "deleting" }),
      line: 4,
    })
  );
  const nextItems = [...items.slice(0, found), ...items.slice(found + 1)];
  steps.push(
    step({
      action: "Shift following elements left",
      condition: `for i = ${found} to ${n - 2}: list[i] = list[i+1]`,
      result: "Gap closed",
      next: "Decrement size",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n - 1),
      line: 4,
    })
  );
  steps.push(
    step({
      action: "Decrement size",
      condition: `size: ${n} → ${n - 1}`,
      result: "✓ SUCCESS",
      next: "Done",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n - 1),
      line: 5,
      success: true,
      feedback: {
        ok: true,
        title: "Delete Successful",
        text: `Element ${val} at index ${found} was removed. Following elements shifted left. Size ${n} → ${n - 1}.`,
      },
    })
  );
  return { steps, nextList: nextItems };
}

function deleteBegin(items) {
  const n = items.length;
  const steps = [];
  steps.push(
    step({
      action: "Start: Delete from Beginning",
      condition: `size = ${n}`,
      result: "Begin",
      next: "Empty check",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "CONDITION CHECK: Is the list empty?",
      condition: `size == 0 → ${n} == 0`,
      result: n === 0 ? "✓ TRUE" : "✗ FALSE — first node exists",
      next: n === 0 ? "Abort" : "Select index 0",
      nodes: snapshot(items),
      highlight: nodeStates(n, n ? { 0: "current" } : {}),
      line: 1,
    })
  );
  if (n === 0) {
    steps.push(
      step({
        action: "Abort",
        condition: "empty",
        result: "✕ Delete from empty list",
        next: "Done",
        nodes: [],
        line: 1,
        success: false,
        feedback: {
          ok: false,
          title: "Empty List",
          text: "Cannot delete from an empty list.",
        },
      })
    );
    return { steps, nextList: items };
  }
  steps.push(
    step({
      action: "Is this the first node?",
      condition: "index == 0",
      result: "✓ TRUE — mark for deletion",
      next: "Remove and shift",
      nodes: snapshot(items),
      highlight: nodeStates(n, { 0: "deleting" }),
      line: 3,
    })
  );
  const removed = items[0];
  const nextItems = items.slice(1);
  steps.push(
    step({
      action: "Shift remaining elements left",
      condition: "list[i] = list[i+1] for all i",
      result: `Removed ${removed}`,
      next: "Decrement size",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n - 1),
      line: 4,
    })
  );
  steps.push(
    step({
      action: "Decrement size",
      condition: `size: ${n} → ${n - 1}`,
      result: "✓ SUCCESS",
      next: "Done",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n - 1),
      line: 5,
      success: true,
      feedback: {
        ok: true,
        title: "Delete Successful",
        text: `First element ${removed} was removed. Remaining nodes shifted left. Size ${n} → ${n - 1}.`,
      },
    })
  );
  return { steps, nextList: nextItems };
}

function deleteEnd(items) {
  const n = items.length;
  const steps = [];
  steps.push(
    step({
      action: "Start: Delete from End",
      condition: `size = ${n}`,
      result: "Begin",
      next: "Empty check",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "CONDITION CHECK: Is the list empty?",
      condition: `size == 0 → ${n} == 0`,
      result: n === 0 ? "✓ TRUE" : "✗ FALSE",
      next: n === 0 ? "Abort" : "Locate last index",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  if (n === 0) {
    steps.push(
      step({
        action: "Abort",
        condition: "empty",
        result: "✕ Delete from empty list",
        next: "Done",
        nodes: [],
        line: 1,
        success: false,
        feedback: {
          ok: false,
          title: "Empty List",
          text: "Cannot delete from an empty list.",
        },
      })
    );
    return { steps, nextList: items };
  }
  steps.push(
    step({
      action: "Is this the last node?",
      condition: `index == size - 1  →  ${n - 1}`,
      result: "✓ TRUE",
      next: "Remove last element",
      nodes: snapshot(items),
      highlight: nodeStates(n, { [n - 1]: "deleting" }),
      pointer: n - 1,
      line: 2,
    })
  );
  const removed = items[n - 1];
  const nextItems = items.slice(0, n - 1);
  steps.push(
    step({
      action: "Remove last element (no shifting needed)",
      condition: `size: ${n} → ${n - 1}`,
      result: "✓ SUCCESS",
      next: "Done",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n - 1),
      line: 4,
      success: true,
      feedback: {
        ok: true,
        title: "Delete Successful",
        text: `Last element ${removed} was removed. Size decreased from ${n} to ${n - 1}. Time O(1) for array-backed list.`,
      },
    })
  );
  return { steps, nextList: nextItems };
}

function deleteAt(items, pos) {
  const n = items.length;
  const steps = [];
  steps.push(
    step({
      action: "Start: Delete at Position",
      condition: `position = ${pos}, size = ${n}`,
      result: "Begin",
      next: "Validate",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "CONDITION CHECK: Is the list empty?",
      condition: `size == 0 → ${n} == 0`,
      result: n === 0 ? "✓ TRUE" : "✗ FALSE",
      next: n === 0 ? "Abort" : "Validate position",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  if (n === 0) {
    steps.push(
      step({
        action: "Abort",
        result: "✕ Empty list",
        condition: "size = 0",
        next: "Done",
        nodes: [],
        line: 1,
        success: false,
        feedback: { ok: false, title: "Empty List", text: "Cannot delete from an empty list." },
      })
    );
    return { steps, nextList: items };
  }
  const valid = Number.isInteger(pos) && pos >= 0 && pos < n;
  steps.push(
    step({
      action: "CONDITION CHECK: Is position valid?",
      condition: `0 ≤ ${pos} < ${n}`,
      result: valid ? "✓ TRUE" : "✗ FALSE",
      next: valid ? "Traverse" : "Abort",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 2,
    })
  );
  if (!valid) {
    steps.push(
      step({
        action: "Abort",
        condition: `Position ${pos} out of range`,
        result: "✕ Invalid Position",
        next: "Done",
        nodes: snapshot(items),
        highlight: nodeStates(n, Object.fromEntries(items.map((_, i) => [i, "error"]))),
        line: 2,
        success: false,
        feedback: {
          ok: false,
          title: "Invalid Position",
          text: `Position ${pos} cannot be accessed because the list contains ${n} element(s) (valid indices 0…${n - 1}).`,
        },
      })
    );
    return { steps, nextList: items };
  }
  for (let i = 0; i < pos; i++) {
    steps.push(
      step({
        action: `Moving toward position ${pos}`,
        condition: `current index ${i} == ${pos}?`,
        result: "✗ FALSE",
        next: "Next",
        nodes: snapshot(items),
        highlight: nodeStates(n, { [i]: "current" }),
        pointer: i,
        line: 3,
      })
    );
  }
  steps.push(
    step({
      action: `Reached position ${pos}`,
      condition: `index == ${pos}`,
      result: "✓ TRUE — delete this node",
      next: "Remove",
      nodes: snapshot(items),
      highlight: nodeStates(n, { [pos]: "deleting" }),
      pointer: pos,
      line: 4,
    })
  );
  const removed = items[pos];
  const nextItems = [...items.slice(0, pos), ...items.slice(pos + 1)];
  steps.push(
    step({
      action: "Shift following elements left",
      condition: `size: ${n} → ${n - 1}`,
      result: "✓ SUCCESS",
      next: "Done",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n - 1),
      line: 6,
      success: true,
      feedback: {
        ok: true,
        title: "Delete Successful",
        text: `Element ${removed} at position ${pos} was removed. Suffix shifted left. Size ${n} → ${n - 1}.`,
      },
    })
  );
  return { steps, nextList: nextItems };
}

function search(items, val) {
  const n = items.length;
  const steps = [];
  steps.push(
    step({
      action: "Start: Search",
      condition: `target = ${val}`,
      result: "Begin scan",
      next: "Empty check",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "CONDITION CHECK: Is the list empty?",
      condition: `size == 0 → ${n} == 0`,
      result: n === 0 ? "✓ TRUE — not found" : "✗ FALSE",
      next: n === 0 ? "Done" : "Scan from 0",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  if (n === 0) {
    steps.push(
      step({
        action: "Search on empty list",
        condition: "no elements",
        result: "✕ Not found",
        next: "Done",
        nodes: [],
        line: 1,
        success: false,
        feedback: { ok: false, title: "Not Found", text: "The list is empty, so the value cannot exist." },
      })
    );
    return { steps, nextList: items };
  }
  for (let i = 0; i < n; i++) {
    const match = items[i] === val;
    steps.push(
      step({
        action: `Visit index ${i}`,
        condition: `list[${i}] == ${val}  →  ${items[i]} == ${val}`,
        result: match ? "✓ FOUND" : "✗ continue",
        next: match ? "Return index" : i === n - 1 ? "End of list" : "Next",
        nodes: snapshot(items),
        highlight: nodeStates(n, { [i]: match ? "found" : "checking" }),
        pointer: i,
        line: 3,
      })
    );
    if (match) {
      steps.push(
        step({
          action: `Return index ${i}`,
          condition: `found at ${i}`,
          result: "✓ SUCCESS",
          next: "Done",
          nodes: snapshot(items),
          highlight: nodeStates(n, { [i]: "success" }),
          pointer: i,
          line: 3,
          success: true,
          feedback: {
            ok: true,
            title: "Element Found",
            text: `Value ${val} occurs at position ${i}. Sequential search examined ${i + 1} node(s).`,
          },
        })
      );
      return { steps, nextList: items };
    }
  }
  steps.push(
    step({
      action: "Has traversal reached the end?",
      condition: "i == size",
      result: "✓ TRUE — element missing",
      next: "Done",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 5,
      success: false,
      feedback: {
        ok: false,
        title: "Not Found",
        text: `Value ${val} is not in the list after scanning all ${n} element(s).`,
      },
    })
  );
  return { steps, nextList: items };
}

function getAt(items, pos) {
  const n = items.length;
  const steps = [];
  const valid = Number.isInteger(pos) && pos >= 0 && pos < n;
  steps.push(
    step({
      action: "Start: Get by Position",
      condition: `position = ${pos}, size = ${n}`,
      result: "Validate",
      next: "Check bounds",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "CONDITION CHECK: Is position valid?",
      condition: `0 ≤ ${pos} < ${n}`,
      result: valid ? "✓ TRUE" : "✗ FALSE",
      next: valid ? "Access index" : "Abort",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  if (!valid) {
    steps.push(
      step({
        action: "Abort",
        condition: "out of range",
        result: "✕ Invalid Position",
        next: "Done",
        nodes: snapshot(items),
        highlight: nodeStates(n, Object.fromEntries(items.map((_, i) => [i, "error"]))),
        line: 1,
        success: false,
        feedback: {
          ok: false,
          title: "Invalid Position",
          text: `Position ${pos} cannot be accessed. Valid indices: ${n ? `0…${n - 1}` : "none (empty list)"}.`,
        },
      })
    );
    return { steps, nextList: items };
  }
  steps.push(
    step({
      action: `Direct index access list[${pos}]`,
      condition: `array-backed list → O(1)`,
      result: `value = ${items[pos]}`,
      next: "Return",
      nodes: snapshot(items),
      highlight: nodeStates(n, { [pos]: "found" }),
      pointer: pos,
      line: 3,
    })
  );
  steps.push(
    step({
      action: "Return element",
      condition: `list[${pos}]`,
      result: "✓ SUCCESS",
      next: "Done",
      nodes: snapshot(items),
      highlight: nodeStates(n, { [pos]: "success" }),
      line: 3,
      success: true,
      feedback: {
        ok: true,
        title: "Get Successful",
        text: `Element at position ${pos} is ${items[pos]}.`,
      },
    })
  );
  return { steps, nextList: items };
}

function updateAt(items, pos, val) {
  const n = items.length;
  const steps = [];
  const valid = Number.isInteger(pos) && pos >= 0 && pos < n;
  steps.push(
    step({
      action: "Start: Update Element",
      condition: `position = ${pos}, newValue = ${val}`,
      result: "Validate",
      next: "Check bounds",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "CONDITION CHECK: Is position valid?",
      condition: `0 ≤ ${pos} < ${n}`,
      result: valid ? "✓ TRUE" : "✗ FALSE",
      next: valid ? "Overwrite" : "Abort",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  if (!valid) {
    steps.push(
      step({
        action: "Abort",
        condition: "out of range",
        result: "✕ Invalid Position",
        next: "Done",
        nodes: snapshot(items),
        highlight: nodeStates(n),
        line: 1,
        success: false,
        feedback: {
          ok: false,
          title: "Invalid Position",
          text: `Cannot update index ${pos}. List size is ${n}.`,
        },
      })
    );
    return { steps, nextList: items };
  }
  steps.push(
    step({
      action: `Locate index ${pos}`,
      condition: `old value = ${items[pos]}`,
      result: "Ready to replace",
      next: "Write new value",
      nodes: snapshot(items),
      highlight: nodeStates(n, { [pos]: "checking" }),
      pointer: pos,
      line: 2,
    })
  );
  const nextItems = snapshot(items);
  nextItems[pos] = val;
  steps.push(
    step({
      action: `list[${pos}] = ${val}`,
      condition: `${items[pos]} → ${val}`,
      result: "✓ SUCCESS",
      next: "Done",
      nodes: snapshot(nextItems),
      highlight: nodeStates(n, { [pos]: "success" }),
      line: 3,
      success: true,
      feedback: {
        ok: true,
        title: "Update Successful",
        text: `Position ${pos} changed from ${items[pos]} to ${val}. Size unchanged.`,
      },
    })
  );
  return { steps, nextList: nextItems };
}

function traverse(items) {
  const n = items.length;
  const steps = [];
  steps.push(
    step({
      action: "Start: Traverse",
      condition: `size = ${n}`,
      result: "Begin",
      next: "Empty check",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "CONDITION CHECK: Is the list empty?",
      condition: `size == 0 → ${n} == 0`,
      result: n === 0 ? "✓ TRUE" : "✗ FALSE",
      next: n === 0 ? "Done" : "Start at index 0",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  if (n === 0) {
    steps.push(
      step({
        action: "Nothing to visit",
        condition: "empty",
        result: "Traversal complete",
        next: "Done",
        nodes: [],
        line: 1,
        success: true,
        feedback: { ok: true, title: "Empty Traversal", text: "The list has no elements to visit." },
      })
    );
    return { steps, nextList: items };
  }
  const visited = [];
  for (let i = 0; i < n; i++) {
    visited.push(items[i]);
    const h = {};
    for (let j = 0; j < i; j++) h[j] = "success";
    h[i] = "current";
    steps.push(
      step({
        action: `Visit node at index ${i}`,
        condition: `Has traversal reached the end? ${i} == ${n} ? FALSE`,
        result: `Record ${items[i]}  ·  visited: ${visited.join(" → ")}`,
        next: i === n - 1 ? "End" : "Move to next",
        nodes: snapshot(items),
        highlight: nodeStates(n, h),
        pointer: i,
        line: 3,
      })
    );
  }
  steps.push(
    step({
      action: "Has traversal reached the end?",
      condition: "i == size",
      result: "✓ TRUE",
      next: "Done",
      nodes: snapshot(items),
      highlight: nodeStates(n, Object.fromEntries(items.map((_, i) => [i, "success"]))),
      line: 5,
      success: true,
      feedback: {
        ok: true,
        title: "Traversal Complete",
        text: `Visited ${n} element(s) in order: ${items.join(" → ")}.`,
      },
    })
  );
  return { steps, nextList: items };
}

function sizeOf(items) {
  const n = items.length;
  const steps = [
    step({
      action: "Start: Check Size",
      condition: "Read maintained counter",
      result: "O(1) access",
      next: "Return size",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    }),
    step({
      action: "Return size",
      condition: `size = ${n}`,
      result: "✓ SUCCESS",
      next: "Done",
      nodes: snapshot(items),
      highlight: nodeStates(n, Object.fromEntries(items.map((_, i) => [i, "success"]))),
      line: 1,
      success: true,
      feedback: {
        ok: true,
        title: "List Size",
        text: `The list currently contains ${n} element(s).`,
      },
    }),
  ];
  return { steps, nextList: items };
}

function isEmpty(items) {
  const n = items.length;
  const empty = n === 0;
  const steps = [
    step({
      action: "Start: Is Empty?",
      condition: "Compare size with 0",
      result: "Checking",
      next: "Evaluate",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    }),
    step({
      action: "CONDITION CHECK: size == 0?",
      condition: `${n} == 0`,
      result: empty ? "✓ TRUE — list is empty" : "✗ FALSE — list has elements",
      next: "Done",
      nodes: snapshot(items),
      highlight: nodeStates(n, empty ? {} : Object.fromEntries(items.map((_, i) => [i, "success"]))),
      line: 2,
      success: true,
      feedback: {
        ok: true,
        title: empty ? "List is Empty" : "List is Not Empty",
        text: empty ? "size == 0. No elements stored." : `size == ${n}. The list contains data.`,
      },
    }),
  ];
  return { steps, nextList: items };
}

function clearList(items) {
  const n = items.length;
  const steps = [];
  steps.push(
    step({
      action: "Start: Clear List",
      condition: `size = ${n}`,
      result: "Begin",
      next: "Empty check",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  steps.push(
    step({
      action: "CONDITION CHECK: Already empty?",
      condition: `size == 0 → ${n} == 0`,
      result: n === 0 ? "✓ TRUE" : "✗ FALSE — remove remaining nodes",
      next: n === 0 ? "Done" : "Delete all",
      nodes: snapshot(items),
      highlight: nodeStates(n),
      line: 1,
    })
  );
  if (n === 0) {
    steps.push(
      step({
        action: "Nothing to clear",
        condition: "empty",
        result: "List already empty",
        next: "Done",
        nodes: [],
        line: 1,
        success: true,
        feedback: { ok: true, title: "Already Empty", text: "Clear on an empty list leaves size at 0." },
      })
    );
    return { steps, nextList: items };
  }
  steps.push(
    step({
      action: "Mark all nodes for deletion",
      condition: "remove each remaining element",
      result: "DELETING",
      next: "Reset size",
      nodes: snapshot(items),
      highlight: nodeStates(n, Object.fromEntries(items.map((_, i) => [i, "deleting"]))),
      line: 2,
    })
  );
  steps.push(
    step({
      action: "Set size to 0",
      condition: `size: ${n} → 0`,
      result: "✓ SUCCESS",
      next: "Done",
      nodes: [],
      highlight: {},
      line: 3,
      success: true,
      feedback: {
        ok: true,
        title: "List Cleared",
        text: `All ${n} element(s) were removed. The list is now empty.`,
      },
    })
  );
  return { steps, nextList: [] };
}

export function parseValue(raw) {
  if (raw === "" || raw == null) return { ok: false, error: "Please enter a value." };
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    return { ok: false, error: "Value must be an integer." };
  }
  return { ok: true, value: n };
}

export function parsePosition(raw) {
  if (raw === "" || raw == null) return { ok: false, error: "Please enter a position (index)." };
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    return { ok: false, error: "Position must be an integer index." };
  }
  return { ok: true, value: n };
}
