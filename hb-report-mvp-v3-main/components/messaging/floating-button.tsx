"use client"

import * as React from "react"
import { MessageSquare, List } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import MessagingPanel from "./messaging-panel"
import { MessagingContextMenu } from "./context-menu"

/**
 * @typedef {Object} FloatingButtonProps
 * @property {string} [className] - Optional additional CSS classes for the button.
 */

/**
 * FloatingButton component provides omnipresent access to a messaging and task management system.
 * It opens a draggable/resizable panel on desktop and a full-screen modal on mobile.
 * It also provides context-aware interactions through right-click menus.
 *
 * @param {FloatingButtonProps} props - The component props.
 * @returns {JSX.Element} The floating button and its associated interactive UI.
 */
export default function FloatingButton({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [newTask, setNewTask] = React.useState<{ title: string; description: string } | null>(null)
  const [newMessage, setNewMessage] = React.useState<{ text: string; context: string } | null>(null)
  const [notificationCount, setNotificationCount] = React.useState(3)
  const isDesktop = useMediaQuery("(min-width: 640px)") // Tailwind's sm breakpoint

  const dialogContentClass = cn(
    "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
    {
      "max-w-lg": isDesktop, // Standard modal size for desktop
      "w-full h-full max-w-none max-h-none rounded-none": !isDesktop, // Full screen for mobile
    },
    className,
  )

  const handleCreateTask = (text: string, elementInfo: string) => {
    setNewTask({
      title: text,
      description: `Created from page element: ${elementInfo}`,
    })
    setIsOpen(true)
  }

  const handleCreateMessage = (text: string, context: string) => {
    setNewMessage({
      text,
      context,
    })
    setIsOpen(true)
  }

  const handleCaptureScreenshot = () => {
    // In a real implementation, this would capture a screenshot
    // For now, we'll just open the messaging panel
    setIsOpen(true)
  }

  const clearNewContent = () => {
    setNewTask(null)
    setNewMessage(null)
  }

  return (
    <MessagingContextMenu
      onCreateTask={handleCreateTask}
      onCreateMessage={handleCreateMessage}
      onCaptureScreenshot={handleCaptureScreenshot}
    >
      <>
        {/* Floating Button - visible on all screen sizes */}
        <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start space-y-2">
          {" "}
          {/* Changed right-4 to left-4 and items-end to items-start */}
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg relative"
            aria-label="Open Messaging and Tasks"
          >
            <MessageSquare className="h-6 w-6 text-white" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white border-2 border-background">
                {notificationCount}
              </Badge>
            )}
          </Button>
          <div className="bg-card rounded-lg shadow-lg p-2 text-xs text-muted-foreground animate-fade-in">
            <p>Right-click anywhere to create tasks or messages!</p>
          </div>
        </div>

        {isDesktop ? (
          // Desktop: Render the draggable/resizable MessagingPanel
          <MessagingPanel
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            newTask={newTask}
            newMessage={newMessage}
            clearNewContent={clearNewContent}
          />
        ) : (
          // Mobile: Render a full-screen Dialog
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className={dialogContentClass}>
              <DialogHeader>
                <DialogTitle>Messaging & Task Management</DialogTitle>
                <DialogDescription>Collaborate with your team and manage project tasks efficiently.</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="messages" className="flex flex-col flex-grow overflow-hidden">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="messages">
                    <MessageSquare className="mr-2 h-4 w-4" /> Messages
                  </TabsTrigger>
                  <TabsTrigger value="tasks">
                    <List className="mr-2 h-4 w-4" /> Tasks
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="messages" className="mt-4 flex-grow overflow-auto p-2">
                  <div className="flex items-center justify-center h-full text-muted-foreground text-center">
                    <p>Select a component to view relevant messages.</p>
                  </div>
                </TabsContent>
                <TabsContent value="tasks" className="mt-4 flex-grow overflow-auto p-2">
                  <div className="flex items-center justify-center h-full text-muted-foreground text-center">
                    <p>Select a component to view relevant tasks.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </>
    </MessagingContextMenu>
  )
}
