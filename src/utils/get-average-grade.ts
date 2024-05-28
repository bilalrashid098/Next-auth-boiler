export function calculateAverageGrade(grades: any) {
  if (grades.length === 0) return 0;

  const total = grades.reduce((sum: any, entry: any) => sum + entry.grade, 0);
  const average = total / grades.length;

  return average;
}
