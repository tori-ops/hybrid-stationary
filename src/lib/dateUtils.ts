/**
 * Parse a date string in YYYY-MM-DD format and return it without timezone shifts
 * @param dateString - Date in YYYY-MM-DD format (from HTML input type="date")
 * @returns Formatted date string or the original string if invalid
 */
export function formatWeddingDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    // Parse YYYY-MM-DD without timezone interpretation
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    
    const weddingDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return weddingDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Parse a date string in YYYY-MM-DD format for short display (M/D/YYYY)
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Formatted date string (M/D/YYYY) or the original string if invalid
 */
export function formatWeddingDateShort(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    
    const weddingDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return weddingDate.toLocaleDateString('en-US', { 
      month: 'numeric', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch (error) {
    return dateString;
  }
}
