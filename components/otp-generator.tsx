"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, RotateCw, Eye, EyeOff } from "lucide-react"

// Simple HMAC-SHA1 implementation for OTP generation
async function generateHMACSHA1(secret: string, counter: number): Promise<string> {
  // Convert base32 secret to bytes
  const decodedSecret = base32Decode(secret)

  // Convert counter to 8-byte big-endian
  const buffer = new ArrayBuffer(8)
  const view = new DataView(buffer)
  view.setUint32(0, 0, false)
  view.setUint32(4, counter, false)

  // Generate HMAC-SHA1
  const key = await crypto.subtle.importKey("raw", decodedSecret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])

  const signature = await crypto.subtle.sign("HMAC", key, buffer)
  const signatureArray = new Uint8Array(signature)

  // Dynamic truncation (RFC 4226)
  const offset = signatureArray[19] & 0xf
  const p = new DataView(signatureArray.buffer, offset, 4)
  const code = (p.getUint32(0, false) & 0x7fffffff) % 1000000

  return String(code).padStart(6, "0")
}

function base32Decode(str: string): Uint8Array {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  const bits: number[] = []

  for (const char of str) {
    const val = base32chars.indexOf(char.toUpperCase())
    if (val === -1) throw new Error("Invalid base32 character")
    bits.push(...val.toString(2).padStart(5, "0").split("").map(Number))
  }

  const bytes: number[] = []
  for (let i = 0; i < bits.length; i += 8) {
    bytes.push(Number.parseInt(bits.slice(i, i + 8).join(""), 2))
  }

  return new Uint8Array(bytes.slice(0, Math.floor(bits.length / 8)))
}

function generateSecret(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
  let secret = ""
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return secret
}

export function OTPGenerator() {
  const [secret, setSecret] = useState("")
  const [otp, setOtp] = useState("")
  const [inputOtp, setInputOtp] = useState("")
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [showSecret, setShowSecret] = useState(false)
  const [copied, setCopied] = useState(false)

  // Initialize secret on mount
  useEffect(() => {
    setSecret(generateSecret())
  }, [])

  // Generate OTP and manage timer
  useEffect(() => {
    if (!secret) return

    const generateNewOtp = async () => {
      const counter = Math.floor(Date.now() / 30000)
      const newOtp = await generateHMACSHA1(secret, counter)
      setOtp(newOtp)
      setIsValid(null)
      setInputOtp("")
    }

    generateNewOtp()

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateNewOtp()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [secret])

  const handleVerify = async () => {
    const counter = Math.floor(Date.now() / 30000)
    const currentOtp = await generateHMACSHA1(secret, counter)
    setIsValid(inputOtp === currentOtp)
  }

  const handleNewSecret = () => {
    setSecret(generateSecret())
    setIsValid(null)
    setInputOtp("")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="text-center space-y-2 mb-6">
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full">
            <div className="text-3xl">🔐</div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground">OTP Generator</h1>
        <p className="text-sm text-muted-foreground">Time-based One-Time Password using HMAC-SHA1</p>
      </div>

      <Card className="shadow-xl border-0">
        <CardContent className="space-y-6 pt-6">
          {/* Secret Key Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Secret Key (Base32)</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={secret}
                  readOnly
                  className="w-full px-3 py-2 bg-muted rounded-md font-mono text-sm border border-input"
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(secret)}>
                <Copy size={16} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Store this securely. It's used to generate OTPs.</p>
          </div>

          {/* OTP Display Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Current OTP</label>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-md border-2 border-blue-200 dark:border-blue-900">
              <div className="font-mono text-4xl font-bold text-blue-600 dark:text-blue-300 text-center tracking-widest">
                {otp || "------"}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Expires in: {timeLeft}s</span>
                <div className="w-16 bg-muted rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-1000"
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Verification Section */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Verify OTP</label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={inputOtp}
              onChange={(e) => {
                setInputOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                setIsValid(null)
              }}
              maxLength={6}
              className="w-full px-3 py-2 bg-background border border-input rounded-md font-mono text-lg text-center tracking-widest"
            />
            <Button
              onClick={handleVerify}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Verify Code
            </Button>

            {isValid !== null && (
              <div
                className={`p-3 rounded-md text-sm font-medium text-center ${
                  isValid
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
                }`}
              >
                {isValid ? "✓ Code is valid!" : "✗ Code is invalid"}
              </div>
            )}
          </div>

          {/* Generate New Secret Button */}
          <Button onClick={handleNewSecret} variant="outline" className="w-full bg-transparent">
            <RotateCw size={16} className="mr-2" />
            Generate New Secret
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
