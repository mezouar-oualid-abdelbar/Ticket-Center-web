export function assignment({ title, priority, leader, selectedTechs }) {
  if (!title.trim()) return "Title is required.";
  if (!priority) return "Priority must be selected.";
  if (!leader) return "A leader must be assigned.";
  //   if (!selectedTechs || selectedTechs.length === 0)
  // return "At least one technician must be assigned.";

  return null;
}
