import './style/app.css';

import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';
import { App } from 'antd'; // Import App component

const IdurarOs = lazy(() => import('./apps/IdurarOs'));

export default function RoutApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<PageLoader />}>
          <App> {/* Wrap the entire application with App component */}
            <IdurarOs />
          </App>
        </Suspense>
      </Provider>
    </BrowserRouter>
  );
}
