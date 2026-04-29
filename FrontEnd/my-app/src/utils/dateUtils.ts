/**
 * Returns the semester label (Spring / Summer / Fall) for a given date.
 */
export function getSemesterLabel(date: Date = new Date()): string {
    const month = date.getMonth() + 1;
    const year  = date.getFullYear();
    if (month >= 1 && month <= 5) return `Spring ${year}`;
    if (month >= 6 && month <= 8) return `Summer ${year}`;
    return `Fall ${year}`;
}

/**
 * Converts a Date or ISO date string to the "YYYY-MM-DD" format
 * required by HTML <input type="date">.
 */
export function toInputDate(d: string | Date | undefined): string {
    if (!d) return "";
    return new Date(d).toISOString().split("T")[0];
}
