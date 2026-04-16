export function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createMonthMatrix(viewDate, assignmentsByDate = {}) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const start = new Date(firstOfMonth);
  start.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  const weeks = [];

  for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
    const week = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = new Date(start);
      date.setDate(start.getDate() + weekIndex * 7 + dayIndex);
      const key = toDateKey(date);

      week.push({
        key,
        date,
        dayNumber: date.getDate(),
        inMonth: date.getMonth() === month,
        assignments: assignmentsByDate[key] ?? [],
      });
    }

    weeks.push(week);
  }

  return weeks;
}

export function addAssignment(assignmentsByDate, dateKey, assignment) {
  const nextDayAssignments = [...(assignmentsByDate[dateKey] ?? []), assignment];

  return {
    ...assignmentsByDate,
    [dateKey]: nextDayAssignments,
  };
}

export function removeAssignment(assignmentsByDate, dateKey, assignmentId) {
  const nextDayAssignments = (assignmentsByDate[dateKey] ?? []).filter(
    (assignment) => assignment.id !== assignmentId
  );

  if (nextDayAssignments.length === 0) {
    const { [dateKey]: _removed, ...rest } = assignmentsByDate;
    return rest;
  }

  return {
    ...assignmentsByDate,
    [dateKey]: nextDayAssignments,
  };
}

export function clearAssignmentsForDate(assignmentsByDate, dateKey) {
  const { [dateKey]: _removed, ...rest } = assignmentsByDate;
  return rest;
}

export function countAssignments(assignmentsByDate) {
  return Object.values(assignmentsByDate).reduce(
    (total, dayAssignments) => total + dayAssignments.length,
    0
  );
}

export function countAssignmentsForProfile(assignmentsByDate, profileId) {
  return Object.values(assignmentsByDate).reduce(
    (total, dayAssignments) =>
      total + dayAssignments.filter((assignment) => assignment.profileId === profileId).length,
    0
  );
}

export function removeAssignmentsForProfile(assignmentsByDate, profileId) {
  const nextAssignmentsByDate = {};

  for (const [dateKey, dayAssignments] of Object.entries(assignmentsByDate)) {
    const filteredAssignments = dayAssignments.filter(
      (assignment) => assignment.profileId !== profileId
    );

    if (filteredAssignments.length > 0) {
      nextAssignmentsByDate[dateKey] = filteredAssignments;
    }
  }

  return nextAssignmentsByDate;
}
