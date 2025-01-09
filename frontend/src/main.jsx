import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../redux/store.js';

import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/themes/lara-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';

import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </Provider>
  ,
)
