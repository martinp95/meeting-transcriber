# Security Policy

## Supported Versions

The following versions of Meeting Transcriber AI are currently supported with security updates:

| Version | Supported         |
| ------- | ------------------|
| 1.1     | ✅                |
| <1.1    | ❌                |

## Reporting a Vulnerability

We take security issues seriously. If you discover a security vulnerability in Meeting Transcriber AI, please follow responsible disclosure practices and do NOT create a public GitHub issue.

### How to Report

1. **Email us directly** at the maintainer's GitHub email with the subject line "Security Issue - Meeting Transcriber AI"
2. **Include the following information:**
   - A clear description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact
   - Any suggested fixes (optional)
   - Your contact information for follow-up

3. **Allow reasonable time** (typically 90 days) for us to develop and release a security patch before public disclosure

### What to Expect

- We will provide regular updates on the status of the vulnerability
- Once a fix is ready, we will credit you in the release notes (unless you prefer anonymity)
- We will coordinate the timing of the public disclosure

## Security Considerations

### API Key Management
- **Never** commit your Gemini API key to version control
- Use `.env` or `.env.local` files (included in `.gitignore`)
- Rotate your API keys regularly
- Consider using separate keys for development and production

### Data Privacy
- All transcription is processed through Google Gemini API
- Audio/video files are sent to Google Gemini servers for transcription
- Local history is stored only in your browser's local storage
- No data is stored on our servers
- Review Google's privacy policy for Gemini AI: https://ai.google.dev/privacy

### Local Deployment
- When using Docker, ensure proper network isolation
- Keep your system and dependencies up to date
- Use HTTPS in production environments
- Restrict access to the application based on your security needs

### File Handling
- Supports common media formats: MP3, WAV, MP4, MOV, MKV
- Files are processed locally before being sent to Gemini API
- Temporary files are handled securely
- No files are persisted on the server after processing

## Dependencies

We regularly monitor and update our dependencies to address known vulnerabilities. You can:

1. **Check for vulnerabilities:**
   ```bash
   npm audit
   ```

2. **Update dependencies:**
   ```bash
   npm update
   npm audit fix
   ```

3. **Review dependencies:**
   - Check [node_modules](package.json) in package.json
   - Monitor GitHub security alerts for this repository

## Security Best Practices

When using Meeting Transcriber AI:

✅ **Do:**
- Keep your API key confidential
- Use environment variables for sensitive data
- Run security scans regularly
- Keep the application updated
- Use HTTPS in production
- Review transcriptions for sensitive information before export

❌ **Don't:**
- Commit API keys to version control
- Share your API key with others
- Use production API keys in development
- Process extremely sensitive data without careful consideration
- Run the application with unnecessary privileges

## Security Updates

- Critical security updates will be released as soon as possible
- Important updates will be included in regular releases
- Subscribe to GitHub releases to stay informed: [Releases](https://github.com/martinp95/meeting-transcriber/releases)

## Third-Party Services

This application uses:
- **Google Gemini AI** for transcription - Review their [Terms of Service](https://ai.google.dev/terms)
- **Browser APIs** for local storage and media playback

## Acknowledgments

We appreciate the security research community and thank everyone who helps keep Meeting Transcriber AI secure.

---

For general questions about security, please refer to this policy. For specific vulnerabilities, please follow the responsible disclosure process outlined above.
