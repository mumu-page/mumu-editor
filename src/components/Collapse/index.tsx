import React from 'react'
import { Collapse as Collapse1 } from 'antd'
import style from "./index.module.less";
import classNames from 'classnames';

const Panel = Collapse1.Panel

interface Option {
  title: string
  key: string | number
  node: React.ReactNode
}

interface CollapseProps {
  options: Option[]
  className?: string
}

function Collapse(props: CollapseProps) {
  const { options = [], className = "" } = props
  
  return (
    <Collapse1
      bordered
      defaultActiveKey={['1']}
      className={`${style.collapse} ${className}`}
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