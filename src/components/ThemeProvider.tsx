"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props} attribute="class" forcedTheme="light" defaultTheme="light" enableSystem={false}>
      {children}
    </NextThemesProvider>
  )
}
