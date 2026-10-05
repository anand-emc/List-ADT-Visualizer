export const OPERATION_GROUPS = [
  {
    id: "insert",
    label: "Insert",
    ops: [
      { id: "insertEnd", label: "Insert at End", needsValue: true, needsPos: false },
      { id: "insertBegin", label: "Insert at Beginning", needsValue: true, needsPos: false },
      { id: "insertAt", label: "Insert at Position", needsValue: true, needsPos: true },
    ],
  },
  {
    id: "delete",
    label: "Delete",
    ops: [
      { id: "deleteValue", label: "Delete Element", needsValue: true, needsPos: false },
      { id: "deleteBegin", label: "Delete from Beginning", needsValue: false, needsPos: false },
      { id: "deleteEnd", label: "Delete from End", needsValue: false, needsPos: false },
      { id: "deleteAt", label: "Delete at Position", needsValue: false, needsPos: true },
    ],
  },
  {
    id: "query",
    label: "Query",
    ops: [
      { id: "search", label: "Search Element", needsValue: true, needsPos: false },
      { id: "get", label: "Get by Position", needsValue: false, needsPos: true },
      { id: "update", label: "Update Element", needsValue: true, needsPos: true },
      { id: "traverse", label: "Traverse List", needsValue: false, needsPos: false },
      { id: "size", label: "Check Size", needsValue: false, needsPos: false },
      { id: "isEmpty", label: "Is Empty?", needsValue: false, needsPos: false },
      { id: "clear", label: "Clear List", needsValue: false, needsPos: false },
    ],
  },
];

export const ALL_OPS = OPERATION_GROUPS.flatMap((g) => g.ops);

export const PSEUDOCODE = {
  insertEnd: [
    "INSERT AT END (value)",
    "1. Create a new node with value",
    "2. If list is empty, new node becomes head",
    "3. Else append after the last element",
    "4. Increment list size",
    "5. Return updated list",
  ],
  insertBegin: [
    "INSERT AT BEGINNING (value)",
    "1. Create a new node with value",
    "2. Shift existing elements one index right",
    "3. Place new node at index 0",
    "4. Increment list size",
    "5. Return updated list",
  ],
  insertAt: [
    "INSERT AT POSITION (value, pos)",
    "1. Check whether position is valid (0 ≤ pos ≤ size)",
    "2. If invalid, abort with error",
    "3. Traverse / locate the target index",
    "4. Shift elements from pos to the right",
    "5. Insert the new element at pos",
    "6. Increment list size",
    "7. Display updated list",
  ],
  deleteValue: [
    "DELETE ELEMENT (value)",
    "1. If list is empty, abort",
    "2. Traverse from index 0",
    "3. Compare each element with value",
    "4. If found, shift following elements left",
    "5. Decrement size",
    "6. If not found, report failure",
  ],
  deleteBegin: [
    "DELETE FROM BEGINNING",
    "1. If list is empty, abort",
    "2. Mark index 0 as current",
    "3. Remove the first element",
    "4. Shift remaining elements left",
    "5. Decrement size",
  ],
  deleteEnd: [
    "DELETE FROM END",
    "1. If list is empty, abort",
    "2. Locate last index (size - 1)",
    "3. Remove the last element",
    "4. Decrement size",
  ],
  deleteAt: [
    "DELETE AT POSITION (pos)",
    "1. Check list is not empty",
    "2. Validate 0 ≤ pos < size",
    "3. Traverse to target position",
    "4. Remove the element",
    "5. Shift following elements left",
    "6. Decrement size",
  ],
  search: [
    "SEARCH (value)",
    "1. If list is empty, not found",
    "2. For i from 0 to size - 1",
    "3.   If list[i] equals value, return i",
    "4.   Else continue to next",
    "5. If loop ends, element not in list",
  ],
  get: [
    "GET BY POSITION (pos)",
    "1. Validate 0 ≤ pos < size",
    "2. Traverse to index pos",
    "3. Return list[pos]",
  ],
  update: [
    "UPDATE (pos, newValue)",
    "1. Validate 0 ≤ pos < size",
    "2. Traverse to index pos",
    "3. Replace list[pos] with newValue",
    "4. Return updated list",
  ],
  traverse: [
    "TRAVERSE",
    "1. If list is empty, nothing to visit",
    "2. Start at index 0",
    "3. Visit current node, record value",
    "4. Move to next index",
    "5. Repeat until end of list",
  ],
  size: [
    "SIZE",
    "1. Return the stored length of the list",
    "2. Time: O(1) with maintained counter",
  ],
  isEmpty: [
    "IS EMPTY",
    "1. Check whether size equals 0",
    "2. Return TRUE if empty, else FALSE",
  ],
  clear: [
    "CLEAR LIST",
    "1. If already empty, nothing to do",
    "2. Remove each remaining element",
    "3. Set size to 0",
  ],
};

export const COMPLEXITY = {
  insertEnd: { time: "O(1)", space: "O(1)", note: "Array with known size; append at the end." },
  insertBegin: { time: "O(n)", space: "O(1)", note: "All existing elements must shift right." },
  insertAt: { time: "O(n)", space: "O(1)", note: "Shift of the suffix after the insert index." },
  deleteValue: { time: "O(n)", space: "O(1)", note: "Linear search then shift of the suffix." },
  deleteBegin: { time: "O(n)", space: "O(1)", note: "Every remaining element shifts left." },
  deleteEnd: { time: "O(1)", space: "O(1)", note: "Remove last index; no shifting required." },
  deleteAt: { time: "O(n)", space: "O(1)", note: "Suffix after pos must shift left." },
  search: { time: "O(n)", space: "O(1)", note: "Sequential scan of the ordered collection." },
  get: { time: "O(1)", space: "O(1)", note: "Direct index access in an array-backed list." },
  update: { time: "O(1)", space: "O(1)", note: "Direct index write after validity check." },
  traverse: { time: "O(n)", space: "O(1)", note: "Visit every element exactly once." },
  size: { time: "O(1)", space: "O(1)", note: "Size is maintained as a counter." },
  isEmpty: { time: "O(1)", space: "O(1)", note: "Equivalent to size == 0." },
  clear: { time: "O(n)", space: "O(1)", note: "Each slot is released; size reset to 0." },
};

export const OP_LABELS = Object.fromEntries(ALL_OPS.map((o) => [o.id, o.label]));
