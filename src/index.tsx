// import "./tracer";
import App from './views/App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import store from './store';
import AppScript from './appScript/index';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const { REACT_APP_ENV_NAME } = process.env;
const isProd = REACT_APP_ENV_NAME === 'production';

// replace console.* for disable log on production
if (isProd) {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.warn = () => {};
}

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      {isProd && <AppScript />}
    </BrowserRouter>
  </Provider>
);
