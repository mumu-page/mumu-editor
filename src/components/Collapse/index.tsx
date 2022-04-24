import React from 'react'
import { Collapse as Collapse1 } from 'antd'
import style from "./index.module.less";
import classNames from 'classnames';

const Panel = Collapse1.Panel as any

interface Option {
  title: string
  key: string | number
  node: React.ReactNode
}

interface CollapseProps {
  options: Option[]
}

function Collapse(props: CollapseProps) {
  const { options = [] } = props
  
  return (
    <Collapse1
      bordered
      defaultActiveKey={['1']}
      className={style["collapse"]}
    >
      {
        options.map(item => {
          return <Panel className={classNames(style["panel"], 'mumu-panel')} header={item.title} key={item.key}>
            {item.node}
          </Panel>
        })
      }
    </Collapse1>
  )
}

Collapse.Panel = Panel

export default Collapse