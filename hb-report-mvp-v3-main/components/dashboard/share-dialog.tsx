"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Share, Copy, Mail, Link, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareDialogProps {
  currentView: string
  filters: {
    project: string
    phase: string
    department: string
    metricType: string
  }
}

export function ShareDialog({ currentView, filters }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [includeFilters, setIncludeFilters] = useState(true)
  const [allowEditing, setAllowEditing] = useState(false)
  const [expiresIn, setExpiresIn] = useState("7days")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [message, setMessage] = useState("")
  const { toast } = useToast()

  const generateShareUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname
    const params = new URLSearchParams()

    params.set("tab", currentView)

    if (includeFilters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "all") {
          params.set(key, value)
        }
      })
    }

    params.set("shared", "true")
    params.set("expires", expiresIn)
    params.set("editable", allowEditing.toString())

    const url = `${baseUrl}?${params.toString()}`
    setShareUrl(url)
    return url
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "Share link has been copied to your clipboard.",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      })
    }
  }

  const sendEmail = () => {
    const url = generateShareUrl()
    const subject = `Dashboard Share: ${currentView} View`
    const body = `${message}\n\nView the dashboard: ${url}`

    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    toast({
      title: "Email client opened",
      description: "Your email client should open with the share link.",
    })
  }

  const handleShare = () => {
    const url = generateShareUrl()

    if (navigator.share) {
      navigator.share({
        title: "Construction Dashboard",
        text: "Check out this construction project dashboard",
        url: url,
      })
    } else {
      copyToClipboard(url)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Dashboard</DialogTitle>
          <DialogDescription>Share this dashboard view with team members and stakeholders</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current View Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{currentView}</Badge>
              <span className="text-sm text-gray-600">view</span>
            </div>
            {Object.entries(filters).some(([_, value]) => value !== "all") && (
              <div className="text-xs text-gray-500">
                Active filters:{" "}
                {Object.entries(filters)
                  .filter(([_, value]) => value !== "all")
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(", ")}
              </div>
            )}
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-filters" className="text-sm">
                Include current filters
              </Label>
              <Switch id="include-filters" checked={includeFilters} onCheckedChange={setIncludeFilters} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="allow-editing" className="text-sm">
                Allow recipients to edit
              </Label>
              <Switch id="allow-editing" checked={allowEditing} onCheckedChange={setAllowEditing} />
            </div>
          </div>

          {/* Share Link */}
          <div className="space-y-2">
            <Label className="text-sm">Share Link</Label>
            <div className="flex gap-2">
              <Input value={shareUrl || "Click 'Generate Link' to create"} readOnly className="text-xs" />
              <Button variant="outline" size="sm" onClick={() => generateShareUrl()}>
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(shareUrl)} disabled={!shareUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Email Share */}
          <div className="space-y-2">
            <Label className="text-sm">Send via Email</Label>
            <Input
              placeholder="recipient@company.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <Textarea
              placeholder="Add a message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
            />
            <Button variant="outline" className="w-full gap-2" onClick={sendEmail} disabled={!recipientEmail}>
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
          </div>

          {/* Quick Share */}
          <div className="pt-2 border-t">
            <Button className="w-full gap-2" onClick={handleShare}>
              <Users className="h-4 w-4" />
              Share Dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
