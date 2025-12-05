# TOTP Authentication System

A modern, client-side Time-based One-Time Password (TOTP) generator implementing RFC 6238 standards. Generate secure 6-digit authentication codes with automatic 30-second refresh cycles—no server required.

## Features

- ✅ **RFC 6238 Compliant** - Full TOTP algorithm implementation using HMAC-SHA1
- ✅ **Client-Side Cryptography** - All operations performed locally using Web Crypto API
- ✅ **Real-Time Refresh** - Automatic OTP regeneration every 30 seconds with visual countdown
- ✅ **Easy Secret Management** - Generate, view, and copy Base32-encoded secrets
- ✅ **Instant Verification** - Verify OTP codes with immediate success/failure feedback
- ✅ **Responsive Design** - Works seamlessly on mobile, tablet, and desktop devices
- ✅ **Dark Mode Support** - Automatic theme detection with manual toggle option
- ✅ **Accessibility First** - Built with Radix UI components following WCAG 2.1 AA standards

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm

### Installation

```bash
# Clone or navigate to the project directory
cd "OTP crypto"

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **View Secret Key** - A random Base32 secret is generated automatically
2. **Copy Secret** - Click the copy button to save the secret to clipboard
3. **View OTP** - Current 6-digit code displays with countdown timer
4. **Verify Code** - Enter the OTP and click "Verify Code" to test
5. **Generate New Secret** - Click to create a new random secret anytime

## Technology Stack

- **Framework**: Next.js 16.0.3
- **Runtime**: React 19
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Cryptography**: Web Crypto API

## Project Structure

```
├── app/
│   ├── page.tsx          # Main page component
│   ├── layout.tsx        # Root layout with theme provider
│   └── globals.css       # Global styles
├── components/
│   ├── otp-generator.tsx # Main OTP generator component
│   ├── theme-provider.tsx
│   └── ui/               # Radix UI component library
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## How It Works

The application generates Time-based One-Time Passwords using:

1. **Base32 Secret Decoding** - Converts the secret to bytes
2. **Time Counter** - Calculates counter from Unix timestamp / 30 seconds
3. **HMAC-SHA1 Computation** - Generates hash using secret and counter
4. **Dynamic Truncation** - Extracts 6-digit code from hash (RFC 4226)
5. **Modulo Operation** - Ensures 6-digit format with zero-padding

The result is a 6-digit code that changes every 30 seconds and is verifiable using any standard authenticator app.

## Security Considerations

- Secrets are stored in component state (volatile memory only)
- No data is transmitted over the network
- All cryptographic operations use the Web Crypto API
- Compatible with industry-standard authenticator applications
- **Note**: For production authentication, integrate with backend verification

## Browser Support

- Chrome/Chromium 120+
- Firefox 121+
- Safari 17+
- Edge 120+

All modern browsers with Web Crypto API support.

## Development

### Build for Production

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Create production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Standards & References

- [RFC 6238: Time-Based One-Time-Password (TOTP) Algorithm](https://tools.ietf.org/html/rfc6238)
- [RFC 4226: HMAC-Based One-Time Password (HOTP) Algorithm](https://tools.ietf.org/html/rfc4226)
- [RFC 3548: The Base32 Data Encodings](https://tools.ietf.org/html/rfc3548)

## Use Cases

- Two-Factor Authentication (2FA)
- Educational reference for TOTP implementation
- Integration with authentication systems
- Backup code generation
- Learning cryptographic principles

## License

MIT License - feel free to use and modify for your projects.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Radix UI](https://www.radix-ui.com/)

---

**Built with security and usability in mind.** For questions or contributions, feel free to reach out.
