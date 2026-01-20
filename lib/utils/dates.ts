/**
 * Converts an ISO date string to datetime-local format (YYYY-MM-DDTHH:mm)
 */
export function formatDateTimeLocal(isoString: string): string {
  const date = new Date(isoString);
  
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Formats a Date object as a datetime-local input value (YYYY-MM-DDTHH:mm in local time)
 */
export function formatDateTimeLocalInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Converts a datetime-local string to ISO format
 * datetime-local format: "YYYY-MM-DDTHH:mm" (timezone-naive)
 * This function parses it as local time and converts to ISO (UTC)
 */
export function parseDateTimeLocal(dateTimeLocal: string): string {
  // datetime-local format: "YYYY-MM-DDTHH:mm"
  // Parse as local time explicitly to avoid timezone interpretation issues
  const [datePart, timePart] = dateTimeLocal.split('T');
  if (!datePart || !timePart) {
    throw new Error("Invalid date string format. Expected YYYY-MM-DDTHH:mm");
  }
  
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  // Create date in local timezone (month is 0-indexed)
  const date = new Date(year, month - 1, day, hours, minutes);
  
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  return date.toISOString();
}

const eventDateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatEventDateTime(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return "";
  }
  return eventDateTimeFormatter.format(date);
}

/**
 * Parses a datetime-local string to a Date object.
 * Returns the Date or throws an error if invalid.
 * Used by Server Actions for consistent date parsing.
 */
export function parseDateTimeLocalToDate(dateTimeLocal: string): Date {
  const isoString = parseDateTimeLocal(dateTimeLocal);
  const date = new Date(isoString);
  
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date/time format");
  }
  
  return date;
}
