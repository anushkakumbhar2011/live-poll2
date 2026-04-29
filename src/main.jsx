import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log('[MAIN] Starting application...');

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('[MAIN] CRITICAL: Root element not found!');
  document.body.innerHTML = `
    <div style="padding: 40px; background: #fee; border: 2px solid #c33; border-radius: 8px; margin: 20px; font-family: sans-serif;">
      <h1 style="color: #c33;">⚠️ Critical Error</h1>
      <p>Root element #root not found in HTML.</p>
    </div>
  `;
} else {
  console.log('[MAIN] Root element found, creating React root...');
  
  try {
    const root = createRoot(rootElement);
    console.log('[MAIN] React root created, rendering app...');
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
    console.log('[MAIN] App rendered successfully');
  } catch (error) {
    console.error('[MAIN] Failed to render:', error);
    rootElement.innerHTML = `
      <div style="padding: 40px; background: #fee; border: 2px solid #c33; border-radius: 8px; margin: 20px; font-family: sans-serif;">
        <h1 style="color: #c33;">⚠️ Render Error</h1>
        <p><strong>Error:</strong> ${error.message}</p>
        <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error.stack}</pre>
      </div>
    `;
  }
}
