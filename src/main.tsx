import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import WorkplaceQuiz from './App';



// --- 4. 挂载 React 应用 ---
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WorkplaceQuiz />
  </React.StrictMode>
);