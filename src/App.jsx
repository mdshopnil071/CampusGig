import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SavedGigsProvider } from './context/SavedGigsContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <NotificationProvider>
            <SavedGigsProvider>
              <AppRoutes />
            </SavedGigsProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

