"use client"

import React from 'react'
import { NextUiProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from "next-themes";

const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <NextUiProvider>
            <NextThemesProvider attribute="class" defaultTheme='dark'>

                {children}
            </NextThemesProvider>
        </NextUiProvider>
    )
}

export default Provider