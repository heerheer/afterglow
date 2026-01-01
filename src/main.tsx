import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import './i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a query client instance
const queryClient = new QueryClient()

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
