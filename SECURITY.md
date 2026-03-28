# Security Policy

## Security Measures

### Input Validation
- HTML tag stripping to prevent XSS
- Script injection pattern detection
- Maximum transcript length: 1000 characters
- Image MIME type validation (JPEG, PNG, WebP only)
- Image size limit: 4MB

### API Security
- Gemini API key stored server-side in Cloud Functions
- Rate limiting: 5 requests per minute per client
- Request debouncing: 1 second minimum between calls
- AbortController for request cancellation

### Firebase Security
- Firestore security rules enforce user-level access
- Storage rules validate file types and sizes
- Authentication required for data persistence
- Audit trail: No updates/deletes on emergency reports

### Content Security Policy
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
img-src 'self' data: blob: https:;
connect-src 'self' https://*.googleapis.com https://*.firebaseio.com;
frame-ancestors 'none';
```

### Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Reporting Vulnerabilities

If you discover a security vulnerability, please email security@resqbridge.example.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours.

## Known Limitations

1. **Client-side rate limiting**: Can be bypassed by clearing browser storage
2. **No authentication**: Currently anonymous usage (Firebase Auth integration planned)
3. **No request signing**: API calls not cryptographically signed
4. **Browser-based validation**: Can be bypassed with direct API calls

## Roadmap

- [ ] Implement Firebase Authentication
- [ ] Add request signing with HMAC
- [ ] Server-side rate limiting with Cloud Functions
- [ ] Implement CAPTCHA for abuse prevention
- [ ] Add IP-based rate limiting
- [ ] Encrypt sensitive data at rest
