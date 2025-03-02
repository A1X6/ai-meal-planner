/**
 * Formats a date string for display
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "April 15, 2023")
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
