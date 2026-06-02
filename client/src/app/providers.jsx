import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/hooks/useTheme';
import { Toaster } from 'react-hot-toast';

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--color-card)',
              color: 'var(--color-foreground)',
              border: '1px solid var(--color-border)',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: 'var(--color-success)',
                secondary: 'var(--color-card)',
              },
            },
            error: {
              iconTheme: {
                primary: 'var(--color-destructive)',
                secondary: 'var(--color-card)',
              },
            },
          }}
        />
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
