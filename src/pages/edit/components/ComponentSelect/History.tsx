import {List} from 'antd'
import React, {memo, useEffect, useState} from 'react'
import style from './index.module.less'
import {history} from "@/utils/history";

function History() {
  const [data, setData] = useState(history.getStack())

  useEffect(() => {
    history.onUpdate('setData', (h) => {
      setData(h.getStack())
    })
    return () => {
      history.offUpdate('setData')
    }
  }, [])
  return <div className={style.history}>
    <List
      size="small"
      dataSource={data}
      renderItem={item => <List.Item
        actions={[<>{item.createTime}</>]}>{item.actionType}</List.Item>}
    />
  </div>
}

export default memo(History)