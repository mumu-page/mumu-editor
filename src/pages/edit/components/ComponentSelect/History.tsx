import {List} from 'antd'
import React, {memo, useState} from 'react'
import style from './index.module.less'
import {history} from "@/utils/history";

function History() {
  const data = history.getStack()

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