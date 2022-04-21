import React from 'react';
import { Provider } from "react-redux";
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import store from './store'
import 'antd/dist/antd.css'

function App() {
  const element = useRoutes(routes)
  return (
    <Provider store={store}>
      {element}
    </Provider>
  );
}

export default App;
