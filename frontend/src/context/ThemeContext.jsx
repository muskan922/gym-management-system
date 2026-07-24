import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('gym-theme-mode');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('gym-theme-mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#2563EB',
            light: '#60A5FA',
            dark: '#1D4ED8',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#4F46E5',
            light: '#818CF8',
            dark: '#3730A3',
            contrastText: '#FFFFFF',
          },
          success: {
            main: '#22C55E',
            light: '#86EFAC',
            dark: '#15803D',
          },
          warning: {
            main: '#F59E0B',
            light: '#FDE047',
            dark: '#B45309',
          },
          error: {
            main: '#EF4444',
            light: '#FCA5A5',
            dark: '#B91C1C',
          },
          background: {
            default: mode === 'light' ? '#F8FAFC' : '#0B0F19',
            paper: mode === 'light' ? '#FFFFFF' : '#111827',
          },
          text: {
            primary: mode === 'light' ? '#0F172A' : '#F8FAFC',
            secondary: mode === 'light' ? '#64748B' : '#94A3B8',
          },
          divider: mode === 'light' ? '#F1F5F9' : '#1E293B',
          action: {
            hover: mode === 'light' ? 'rgba(37, 99, 235, 0.04)' : 'rgba(96, 165, 250, 0.04)',
            selected: mode === 'light' ? 'rgba(37, 99, 235, 0.08)' : 'rgba(96, 165, 250, 0.08)',
          },
        },
        typography: {
          fontFamily: '"Inter", "Outfit", "Roboto", "Helvetica", Arial, sans-serif',
          h1: { fontWeight: 800, letterSpacing: '-0.025em' },
          h2: { fontWeight: 700, letterSpacing: '-0.02em' },
          h3: { fontWeight: 700, letterSpacing: '-0.015em' },
          h4: { fontWeight: 700, letterSpacing: '-0.015em' },
          h5: { fontWeight: 700, letterSpacing: '-0.01em' },
          h6: { fontWeight: 600, letterSpacing: '-0.01em' },
          subtitle1: { fontWeight: 500, letterSpacing: '-0.005em' },
          subtitle2: { fontWeight: 500, letterSpacing: '-0.005em' },
          body1: { letterSpacing: '-0.005em' },
          body2: { letterSpacing: '-0.005em' },
          button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0px' },
        },
        shape: {
          borderRadius: 18,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: 'background-color 0.3s ease, color 0.3s ease',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                padding: '10px 24px',
                fontWeight: 600,
                boxShadow: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              },
              containedSecondary: {
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
                },
              },
              outlined: {
                borderWidth: '1.5px',
                borderColor: mode === 'light' ? '#E2E8F0' : '#1E293B',
                '&:hover': {
                  borderWidth: '1.5px',
                  backgroundColor: mode === 'light' ? '#F8FAFC' : '#1F2937',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 18,
                border: '1px solid',
                borderColor: mode === 'light' ? '#F1F5F9' : '#1E293B',
                backgroundImage: 'none',
                boxShadow: mode === 'light'
                  ? '0 1px 3px rgba(0,0,0,0.01), 0 10px 20px -2px rgba(15, 23, 42, 0.04)'
                  : '0 1px 3px rgba(0,0,0,0.1), 0 10px 20px -2px rgba(0, 0, 0, 0.4)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 18,
                backgroundImage: 'none',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  transition: 'all 0.2s',
                  '& fieldset': {
                    borderWidth: '1.5px',
                    borderColor: mode === 'light' ? '#E2E8F0' : '#1E293B',
                  },
                  '&:hover fieldset': {
                    borderColor: '#2563EB',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: '2px',
                    borderColor: '#2563EB',
                  },
                },
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: 20,
                backdropFilter: 'blur(20px)',
                backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(17, 24, 39, 0.95)',
                border: '1px solid',
                borderColor: mode === 'light' ? '#F1F5F9' : '#1E293B',
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

