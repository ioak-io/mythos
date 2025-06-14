// import 'react-app-polyfill/ie9';
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';

import React from 'react';
import ReactDOM from 'react-dom';
import './basicui-styles/index.scss';
import App from './components/App';
import { UsecaseProvider } from './components/Page/UsecasePage/usecaseContext';
// import './index.scss';
// import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <UsecaseProvider>
      <App />
    </UsecaseProvider>
  ,document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
