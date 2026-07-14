"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-black" />
        ),
        info: (
          <InfoIcon className="size-4 text-black" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-white" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          error: "!bg-red-500 !text-white !border-red-600 !shadow-lg",
          success: "!bg-green-500 !text-black !border-green-600 !shadow-lg",
          info: "!bg-yellow-200 !text-black !border-yellow-300 !shadow-lg",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
