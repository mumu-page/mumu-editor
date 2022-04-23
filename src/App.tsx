import React, { useEffect } from 'react';
import { Provider } from "react-redux";
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import { store } from './store'
import 'antd/dist/antd.css'
import { returnConfig } from './store/edit';

function App() {
  const element = useRoutes(routes)

  useEffect(() => {
    window.addEventListener('message', (e) => {
      // 不接受消息源来自于当前窗口的消息
      if (e.source === window || e.data === 'loaded') {
        return
      }
      if (e.data.type === 'returnConfig') {
        return store.dispatch(returnConfig({
          targetConfig: e.data.data,
          save: e.data.data.save
        }));
      }
      return store.dispatch(e.data?.type?.(e.data.data));
    });
  }, [])

  return (
    <Provider store={store}>
      <div className='mm-light'>
        {element}
      </div>
    </Provider>
  );
}

export default App;
