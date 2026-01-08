import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import store from './store/store.js'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary.jsx'
import { ThemeProvider } from './Components/index.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 2500,
              success: {
                duration: 2000,
              },
              error: {
                duration: 3000,
              },
              loading: {
                duration: Infinity,
              },
            }}
          />
          <App />
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
