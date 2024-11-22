"use client"

import React from 'react'
import { NextUiProvider } from "@nextui-org/react"
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ApolloProvider } from '@apollo/client';
import { graphqlClient } from '@/graphql/gql.setup';

const Provider = ({ children }: { children: React.ReactNode }) => {
    return (
        <ApolloProvider client={graphqlClient}>

        <NextUiProvider>
            <NextThemesProvider attribute="class" defaultTheme='dark'>

                {children}
            </NextThemesProvider>
        </NextUiProvider>
        </ApolloProvider>
    )
}

export default Provider