import { createTheme } from '@mui/material';

const commonStyles = {
  typography: {
    h4: {
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '1.1rem',
      },
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            padding: '16px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease-in-out',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonStyles,
  palette: {
    mode: 'light',
    primary: {
      main: '#FFD700',
      dark: '#FFC000',
    },
    background: {
      default: '#f5f7fa',
      paper: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: '#2D3748',
      secondary: '#4A5568',
    },
    calendar: {
      cellBg: '#f1f5f9',
      cellHoverBg: '#e2e8f0',
      successOverlay: 'rgba(0, 200, 83, 0.2)',
      failureOverlay: 'rgba(255, 72, 66, 0.2)',
    }
  }
});

export const darkTheme = createTheme({
  ...commonStyles,
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700',
      dark: '#FFC000',
    },
    background: {
      default: '#1a1c1e',
      paper: 'rgba(45, 55, 72, 0.9)',
    },
    text: {
      primary: '#E2E8F0',
      secondary: '#CBD5E0',
    },
    calendar: {
      cellBg: '#2d3748',
      cellHoverBg: '#3a4758',
      successOverlay: 'rgba(0, 200, 83, 0.3)',
      failureOverlay: 'rgba(255, 72, 66, 0.3)',
    }
  }
});

declare module '@mui/material/styles' {
  interface Palette {
    calendar: {
      cellBg: string;
      cellHoverBg: string;
      successOverlay: string;
      failureOverlay: string;
    };
  }
  interface PaletteOptions {
    calendar: {
      cellBg: string;
      cellHoverBg: string;
      successOverlay: string;
      failureOverlay: string;
    };
  }
}
