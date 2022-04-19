import React from 'react';
import { Provider } from "react-redux";
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import { store } from '@/store'

function App() {
  const element = useRoutes(routes)
  return (
    <Provider store={store}>
      {element}
    </Provider>
  );
}

export default App;
