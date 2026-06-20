import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { store } from '@/store';
import { router } from './router';
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
