import {List} from 'antd'
import React, {memo, useEffect, useState} from 'react'
import style from './index.module.less'
import {history, HistoryItem} from "@/utils/history";
import {PageConfig} from "@/store/edit/state";

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

  const onClick = (item: PageConfig & HistoryItem, index: number) => {
    console.log(index, item)
    history.setCurrentValue(index)
  }

  return <div className={style.history}>
    <List
      size="small"
      dataSource={data}
      renderItem={(item, index) => <List.Item
        className={style.item}
        onClick={() => onClick(item, index)}
        actions={[<>{item.createTime}</>]}>{item.actionType}</List.Item>}
    />
  </div>
}

export default memo(History)