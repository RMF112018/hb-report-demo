"use client"

import type * as React from "react"
import { MessageSquare, ListTodo, Camera, Copy, Share2 } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface MessagingContextMenuProps {
  children: React.ReactNode
  onCreateTask: (text: string, elementInfo: string) => void
  onCreateMessage: (text: string, elementInfo: string) => void
  onCaptureScreenshot: () => void
}

/**
 * MessagingContextMenu provides context-aware interactions for creating tasks and messages
 * directly from any element on the page.
 */
export function MessagingContextMenu({
  children,
  onCreateTask,
  onCreateMessage,
  onCaptureScreenshot,
}: MessagingContextMenuProps) {
  // Get information about the right-clicked element
  const getElementInfo = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const tagName = target.tagName.toLowerCase()
    const id = target.id ? `#${target.id}` : ""
    const className =
      target.className && typeof target.className === "string" ? `.${target.className.split(" ")[0]}` : ""
    const text = target.textContent?.trim().substring(0, 30) || ""

    return {
      selector: `${tagName}${id}${className}`,
      text: text ? `"${text}${text.length > 30 ? "..." : ""}"` : "",
      fullText: target.textContent?.trim() || "",
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={(e) => {
            const info = getElementInfo(e as unknown as React.MouseEvent)
            onCreateTask(`Review ${info.text || "selected item"}`, `Element: ${info.selector}`)
          }}
          className="flex items-center"
        >
          <ListTodo className="mr-2 h-4 w-4" />
          Create Task from Selection
        </ContextMenuItem>

        <ContextMenuItem
          onClick={(e) => {
            const info = getElementInfo(e as unknown as React.MouseEvent)
            onCreateMessage(`Let's discuss ${info.text || "this"}`, `Referencing: ${info.selector}`)
          }}
          className="flex items-center"
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Discuss in Messages
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onCaptureScreenshot} className="flex items-center">
          <Camera className="mr-2 h-4 w-4" />
          Capture Screenshot
        </ContextMenuItem>

        <ContextMenuSub>
          <ContextMenuSubTrigger className="flex items-center">
            <Share2 className="mr-2 h-4 w-4" />
            Share...
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Via Message
            </ContextMenuItem>
            <ContextMenuItem className="flex items-center">
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  )
}
