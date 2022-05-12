import React, {useEffect} from 'react';
import { Provider } from "react-redux";
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import { store, actions } from './store'
import { returnConfig } from './store/edit';
import {RETURN_CONFIG} from "@/constants";

function App() {
  const element = useRoutes(routes)

  useEffect(() => {
    window.addEventListener('message', (e) => {
      // 不接受消息源来自于当前窗口的消息
      if (e.source === window || e.data === 'loaded') {
        return
      }
      if (e.data.type === RETURN_CONFIG) {
        return store.dispatch(returnConfig({
          targetConfig: e.data.data
        }));
      }
      if ((actions as any)[e.data.type]) {
        return store.dispatch((actions as any)[e.data?.type]?.(e.data.data));
      }
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