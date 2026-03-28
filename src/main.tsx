import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { cssTransition, ToastContainer } from 'react-toastify';

import packageJson from 'package.json';
import { RecoilRoot } from 'recoil';
import { ErrorBoundary, Message } from 'tilty-ui';

import Router from '@/router';

import '@/scripts/axios';
import 'tilty-ui/dist/theme/global.less';
import 'tilty-ui/dist/theme/index.less';
import 'tilty-ui/dist/style.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/global.less';

// Instant show/hide — no slide animation overhead
const NoAnimation = cssTransition({
  enter: 'Toastify--no-animation',
  exit: 'Toastify--no-animation',
  collapseDuration: 0,
});

declare global {
  interface Window {
    clientAccessToken: string;
    buildVersion: string;
  }
}

window.buildVersion = `${packageJson.version}-OpenSource`;

const root = document.getElementById('app');

document.addEventListener('DOMContentLoaded', () => {
  root &&
    ReactDOM.createRoot(root).render(
      <RecoilRoot>
        <ErrorBoundary>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            limit={3}
            transition={NoAnimation}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Message />
        </ErrorBoundary>
      </RecoilRoot>,
    );
});
