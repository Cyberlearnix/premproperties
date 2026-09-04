import validator from 'validator';

/**
 * Input validation and sanitization utilities
 */

/**
 * Validate and sanitize email
 */
export function validateEmail(email: string): { isValid: boolean; sanitized: string; error?: string } {
    const trimmed = email.trim();

    if (!trimmed) {
        return { isValid: false, sanitized: '', error: 'Email is required' };
    }

    if (!validator.isEmail(trimmed)) {
        return { isValid: false, sanitized: trimmed, error: 'Invalid email format' };
    }

    return { isValid: true, sanitized: validator.normalizeEmail(trimmed) || trimmed };
}

/**
 * Validate and sanitize phone number
 */
export function validatePhone(phone: string): { isValid: boolean; sanitized: string; error?: string } {
    const trimmed = phone.trim();

    if (!trimmed) {
        return { isValid: false, sanitized: '', error: 'Phone number is required' };
    }

    // Remove all non-digit characters except +
    const sanitized = trimmed.replace(/[^\d+]/g, '');

    if (sanitized.length < 10) {
        return { isValid: false, sanitized, error: 'Phone number must be at least 10 digits' };
    }

    return { isValid: true, sanitized };
}

/**
 * Sanitize text input (remove HTML, scripts, etc.)
 */
export function sanitizeText(text: string, maxLength: number = 1000): string {
    if (!text) return '';

    // Trim and limit length
    let sanitized = text.trim().substring(0, maxLength);

    // Remove HTML tags
    sanitized = validator.stripLow(sanitized);

    // Escape HTML entities
    sanitized = validator.escape(sanitized);

    return sanitized;
}

/**
 * Validate name (only letters, spaces, hyphens)
 */
export function validateName(name: string): { isValid: boolean; sanitized: string; error?: string } {
    const trimmed = name.trim();

    if (!trimmed) {
        return { isValid: false, sanitized: '', error: 'Name is required' };
    }

    if (trimmed.length < 2) {
        return { isValid: false, sanitized: trimmed, error: 'Name must be at least 2 characters' };
    }

    if (trimmed.length > 100) {
        return { isValid: false, sanitized: trimmed, error: 'Name must be less than 100 characters' };
    }

    // Allow letters, spaces, hyphens, apostrophes
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
        return { isValid: false, sanitized: trimmed, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }

    return { isValid: true, sanitized: trimmed };
}

/**
 * Validate message/textarea content
 */
export function validateMessage(message: string, minLength: number = 10, maxLength: number = 5000): { isValid: boolean; sanitized: string; error?: string } {
    const trimmed = message.trim();

    if (!trimmed) {
        return { isValid: false, sanitized: '', error: 'Message is required' };
    }

    if (trimmed.length < minLength) {
        return { isValid: false, sanitized: trimmed, error: `Message must be at least ${minLength} characters` };
    }

    if (trimmed.length > maxLength) {
        return { isValid: false, sanitized: trimmed, error: `Message must be less than ${maxLength} characters` };
    }

    // Sanitize but preserve newlines
    const sanitized = validator.escape(trimmed);

    return { isValid: true, sanitized };
}

/**
 * Rate limiting helper - simple in-memory implementation
 * For production, use Redis or a proper rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, maxRequests: number = 5, windowMs: number = 60000): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);

    // Periodically evict expired entries so the map doesn't grow unbounded
    if (rateLimitMap.size > 10000) {
        rateLimitMap.forEach((value, key) => {
            if (now > value.resetTime) rateLimitMap.delete(key);
        });
    }

    if (!record || now > record.resetTime) {
        // New window
        rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
        return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
    }

    if (record.count >= maxRequests) {
        // Rate limit exceeded
        return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
    }

    // Increment count
    record.count++;
    rateLimitMap.set(identifier, record);

    return { allowed: true, remaining: maxRequests - record.count, resetIn: record.resetTime - now };
}
