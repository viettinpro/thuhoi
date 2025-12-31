import { GOOGLE_SHEET_CONFIG } from './constants';
import { Staff } from './types';

export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return '0';
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export const formatDateToVietnamese = (dateString: string): { day: string, month: string, year: string, full: string } => {
  if (!dateString) return { day: '...', month: '...', year: '...', full: '...' };
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return { day: '...', month: '...', year: '...', full: '...' };

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  return {
    day,
    month,
    year,
    full: `ngày ${day} tháng ${month} năm ${year}`
  };
};

// Helper to parse a number from a string that might contain commas or dots
const parseLocaleNumber = (stringNumber: string): number => {
  if (!stringNumber) return 0;
  // Remove quotes if any, remove dots and commas to get raw number
  // Assumptions: Input might be "1.000.000" or "1,000,000" or raw 1000000
  // We strictly treat it as integer extraction
  const clean = stringNumber.replace(/["']/g, '').replace(/[.,]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

// CSV Parser that respects quoted strings
const parseCSVRow = (row: string): string[] => {
  const result = [];
  let current = '';
  let inQuote = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    if (char === '"') {
      inQuote = !inQuote;
    } else if (char === ',' && !inQuote) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

interface FoundCustomerData {
  customerName: string;
  monthlyPayment: number;
  penaltyFee: number;
  overdueDays: number;
}

export const findCustomerByContractCode = async (contractCode: string): Promise<FoundCustomerData | null> => {
  if (!contractCode) return null;
  const searchCode = contractCode.trim().toLowerCase();

  for (const sheetName of GOOGLE_SHEET_CONFIG.sheetNames) {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_CONFIG.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
      const response = await fetch(url);
      if (!response.ok) continue;
      
      const csvText = await response.text();
      const rows = csvText.split('\n');

      // Iterate through rows
      for (const row of rows) {
        const cols = parseCSVRow(row);
        
        // Map Columns (0-based index)
        // C: Name -> Index 2
        // E: Contract Code -> Index 4
        // I: Monthly Payment -> Index 8
        // J: Penalty Fee -> Index 9
        // N: Overdue Days -> Index 13

        if (cols.length > 4) {
          const rowContractCode = cols[4]?.replace(/^"|"$/g, '').trim().toLowerCase();
          
          if (rowContractCode === searchCode) {
            // Found match
            return {
              customerName: cols[2]?.replace(/^"|"$/g, '') || '',
              monthlyPayment: parseLocaleNumber(cols[8]),
              penaltyFee: parseLocaleNumber(cols[9]),
              overdueDays: parseLocaleNumber(cols[13])
            };
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch sheet ${sheetName}`, error);
      // Continue to next sheet
    }
  }

  return null;
};

export const fetchStaffList = async (): Promise<Staff[]> => {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_CONFIG.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(GOOGLE_SHEET_CONFIG.staffSheetName)}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Failed to fetch staff sheet");
            return [];
        }
        
        const csvText = await response.text();
        const rows = csvText.split('\n');
        
        const staffList: Staff[] = [];
        
        // Start from index 1 to skip header (assuming row 0 is header)
        for (let i = 1; i < rows.length; i++) {
            const cols = parseCSVRow(rows[i]);
            // Column O is index 14, P is index 15
            if (cols.length > 15) {
                const name = cols[14]?.replace(/^"|"$/g, '').trim();
                const phone = cols[15]?.replace(/^"|"$/g, '').trim();
                
                // Basic validation
                if (name && name.toLowerCase() !== 'tên nhân viên' && phone) {
                     staffList.push({
                        id: `staff-${i}`,
                        name,
                        phone
                    });
                }
            }
        }
        return staffList;
    } catch (e) {
        console.error("Error fetching staff list", e);
        return [];
    }
};