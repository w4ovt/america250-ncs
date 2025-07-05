import { z } from 'zod';

// PIN validation schema
export const pinSchema = z.string()
  .length(4, 'PIN must be exactly 4 digits')
  .regex(/^\d{4}$/, 'PIN must contain only digits')
  .refine((pin) => pin !== '0000' && pin !== '1234', 'PIN cannot be a common sequence');

// Callsign validation schema
export const callsignSchema = z.string()
  .min(3, 'Callsign must be at least 3 characters')
  .max(10, 'Callsign must be at most 10 characters')
  .regex(/^[A-Z0-9\/]+$/, 'Callsign must contain only letters, numbers, and forward slashes')
  .transform((val) => val.toUpperCase());

// Name validation schema
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods')
  .transform((val) => val.trim());

// State validation schema
export const stateSchema = z.string()
  .length(2, 'State must be exactly 2 characters')
  .regex(/^[A-Z]{2}$/, 'State must be uppercase letters only')
  .transform((val) => val.toUpperCase());

// Filename validation schema
export const filenameSchema = z.string()
  .min(1, 'Filename cannot be empty')
  .max(255, 'Filename too long')
  .regex(/^[a-zA-Z0-9\-_\.\s]+$/, 'Filename contains invalid characters')
  .refine(
    (filename) => filename.toLowerCase().endsWith('.adi'),
    'File must be an ADI file (.adi extension)'
  );

// ADI content validation schema
export const adiContentSchema = z.string()
  .min(10, 'ADI content too short')
  .max(10 * 1024 * 1024, 'ADI file too large (10MB max)')
  .refine(
    (content) => content.includes('<call:') || content.includes('<CALL:'),
    'Invalid ADI format: missing call field'
  );

// Volunteer data validation schema
export const volunteerSchema = z.object({
  volunteerId: z.number().int().positive('Invalid volunteer ID'),
  name: nameSchema,
  callsign: callsignSchema,
  state: stateSchema
});

// Upload request validation schema
export const uploadRequestSchema = z.object({
  filename: filenameSchema,
  fileContent: adiContentSchema,
  volunteerData: volunteerSchema
});

// Admin PIN creation schema
export const adminPinCreateSchema = z.object({
  pin: pinSchema,
  role: z.enum(['admin', 'volunteer'], {
    errorMap: () => ({ message: 'Role must be either admin or volunteer' })
  })
});

// Activation creation schema
export const activationCreateSchema = z.object({
  volunteerId: z.number().int().positive('Invalid volunteer ID'),
  callsign: callsignSchema,
  name: nameSchema,
  state: stateSchema
});

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate and sanitize PIN input
 */
export function validatePin(pin: unknown): { isValid: boolean; pin?: string; error?: string } {
  try {
    const validatedPin = pinSchema.parse(pin);
    return { isValid: true, pin: validatedPin };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || 'Invalid PIN' };
    }
    return { isValid: false, error: 'PIN validation failed' };
  }
}

/**
 * Validate and sanitize callsign input
 */
export function validateCallsign(callsign: unknown): { isValid: boolean; callsign?: string; error?: string } {
  try {
    const validatedCallsign = callsignSchema.parse(callsign);
    return { isValid: true, callsign: validatedCallsign };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || 'Invalid callsign' };
    }
    return { isValid: false, error: 'Callsign validation failed' };
  }
}

/**
 * Validate volunteer data
 */
export function validateVolunteerData(data: unknown): { 
  isValid: boolean; 
  data?: z.infer<typeof volunteerSchema>; 
  error?: string 
} {
  try {
    const validatedData = volunteerSchema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || 'Invalid volunteer data' };
    }
    return { isValid: false, error: 'Volunteer data validation failed' };
  }
}

/**
 * Validate upload request
 */
export function validateUploadRequest(data: unknown): { 
  isValid: boolean; 
  data?: z.infer<typeof uploadRequestSchema>; 
  error?: string 
} {
  try {
    const validatedData = uploadRequestSchema.parse(data);
    return { isValid: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message || 'Invalid upload data' };
    }
    return { isValid: false, error: 'Upload request validation failed' };
  }
}

/**
 * Enhanced ADI file validation with detailed error reporting
 */
export function validateAdiFileContent(content: string): {
  isValid: boolean;
  recordCount: number;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic content validation
  if (!content || content.trim().length === 0) {
    errors.push('ADI file is empty');
    return { isValid: false, recordCount: 0, errors, warnings };
  }
  
  // Handle RTF files (common with N3FJP exports)
  let processedContent = content;
  if (content.includes('{\\rtf1')) {
    // Strip RTF markup and extract ADIF content
    processedContent = content
      .replace(/{\\rtf1[^}]*}/g, '') // Remove RTF header
      .replace(/\\[a-z0-9-]+/g, '') // Remove RTF commands
      .replace(/[{}]/g, '') // Remove RTF braces
      .replace(/\\'/g, "'") // Fix escaped apostrophes
      .replace(/\\"/g, '"') // Fix escaped quotes
      .replace(/\\\\/g, '\\') // Fix escaped backslashes
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n'); // Normalize line endings
    
    warnings.push('RTF formatting detected and removed');
  }
  
  // Check file size
  if (processedContent.length > 10 * 1024 * 1024) {
    errors.push('ADI file is too large (maximum 10MB)');
  }
  
  // Parse QSO records - be very permissive about format
  const records = processedContent.split(/<eor>/i).filter(record => record.trim().length > 0);
  let recordCount = 0;
  
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    if (!record) continue;
    
    // Skip header/comment records - but be permissive about what constitutes a QSO record
    if (!record.match(/<call:/i) && !record.match(/<CALL:/i)) {
      continue;
    }
    
    recordCount++;
    
    // Only check for the absolute minimum required fields that QRZ needs
    // Be very permissive about field format and capitalization
    
    // Check for some form of call field (case insensitive, flexible format)
    if (!record.match(/<call:/i) && !record.match(/<CALL:/i)) {
      errors.push(`Record ${recordCount}: Missing CALL field`);
    }
    
    // Check for some form of date field (case insensitive, flexible format)
    if (!record.match(/<qso_date:/i) && !record.match(/<QSO_DATE:/i) && !record.match(/<date:/i) && !record.match(/<DATE:/i)) {
      warnings.push(`Record ${recordCount}: Missing date field (recommended)`);
    }
    
    // Check for some form of time field (case insensitive, flexible format)
    if (!record.match(/<time_on:/i) && !record.match(/<TIME_ON:/i) && !record.match(/<time:/i) && !record.match(/<TIME:/i)) {
      warnings.push(`Record ${recordCount}: Missing time field (recommended)`);
    }
    
    // Optional fields - just warnings
    if (!record.match(/<mode:/i) && !record.match(/<MODE:/i)) {
      warnings.push(`Record ${recordCount}: Missing MODE field (recommended)`);
    }
    
    if (!record.match(/<freq:/i) && !record.match(/<FREQ:/i) && !record.match(/<frequency:/i) && !record.match(/<FREQUENCY:/i)) {
      warnings.push(`Record ${recordCount}: Missing frequency field (recommended)`);
    }
  }
  
  if (recordCount === 0) {
    errors.push('No valid QSO records found in ADI file');
  }
  
  return {
    isValid: errors.length === 0,
    recordCount,
    errors,
    warnings
  };
} 