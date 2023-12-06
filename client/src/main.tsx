import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import App2 from './App2.tsx'
import { store } from './app/store.ts'
import { Provider } from 'react-redux'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App2 />
    </Provider>
  </React.StrictMode>
);
