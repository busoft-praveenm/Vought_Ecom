'use client';

import * as React from 'react';
import {
  AppRouterCacheProvider,
} from '@mui/material-nextjs/v15-appRouter';

import {
  CssBaseline,
  ThemeProvider,
} from '@mui/material';

import theme from '@/theme/theme';

export default function MuiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}