import test from "node:test";
import assert from "node:assert/strict";

import {
  addAssignment,
  clearAssignmentsForDate,
  countAssignments,
  countAssignmentsForProfile,
  createMonthMatrix,
  removeAssignment,
  removeAssignmentsForProfile,
} from "../src/calendarLogic.mjs";

test("creates a 6-week month matrix", () => {
  const matrix = createMonthMatrix(new Date(2026, 3, 1), {});

  assert.equal(matrix.length, 6);
  assert.equal(matrix[0].length, 7);
  assert.equal(matrix[0][0].key, "2026-03-29");
});

test("adds assignments to the selected day", () => {
  const result = addAssignment({}, "2026-04-10", { id: "a1", title: "Essay" });

  assert.equal(result["2026-04-10"].length, 1);
  assert.equal(result["2026-04-10"][0].title, "Essay");
});

test("removes one assignment without clearing the whole date", () => {
  const result = removeAssignment(
    {
      "2026-04-10": [
        { id: "a1", title: "Essay" },
        { id: "a2", title: "Quiz" },
      ],
    },
    "2026-04-10",
    "a1"
  );

  assert.deepEqual(result["2026-04-10"], [{ id: "a2", title: "Quiz" }]);
});

test("clears all assignments for a date", () => {
  const result = clearAssignmentsForDate(
    {
      "2026-04-10": [{ id: "a1", title: "Essay" }],
      "2026-04-11": [{ id: "a2", title: "Lab" }],
    },
    "2026-04-10"
  );

  assert.equal(result["2026-04-10"], undefined);
  assert.equal(result["2026-04-11"].length, 1);
});

test("counts assignments across all days", () => {
  const total = countAssignments({
    "2026-04-10": [{ id: "a1" }, { id: "a2" }],
    "2026-04-11": [{ id: "a3" }],
  });

  assert.equal(total, 3);
});

test("counts assignments for a single profile", () => {
  const total = countAssignmentsForProfile(
    {
      "2026-04-10": [
        { id: "a1", profileId: "p1" },
        { id: "a2", profileId: "p2" },
      ],
      "2026-04-11": [{ id: "a3", profileId: "p1" }],
    },
    "p1"
  );

  assert.equal(total, 2);
});

test("removes all assignments for a deleted profile", () => {
  const result = removeAssignmentsForProfile(
    {
      "2026-04-10": [
        { id: "a1", profileId: "p1" },
        { id: "a2", profileId: "p2" },
      ],
      "2026-04-11": [{ id: "a3", profileId: "p1" }],
    },
    "p1"
  );

  assert.deepEqual(result, {
    "2026-04-10": [{ id: "a2", profileId: "p2" }],
  });
});
