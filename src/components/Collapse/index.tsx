import React from 'react'
import { Collapse, Empty } from 'antd'
import style from "./index.module.less";
import classNames from 'classnames';

const Panel = Collapse.Panel

interface Option {
  title: string
  key: string | number
  node: React.ReactNode
}

interface CollapseProps {
  options: Option[]
  className?: string
}

function MMCollapse(props: CollapseProps) {
  const { options = [], className = "" } = props

  const getPanel = (node: React.ReactNode) => {
    if (!node) return <div className={style.empty}><Empty /></div>
    return node
  }

  return (
    <Collapse
      bordered
      defaultActiveKey={['1']}
      className={`${style.collapse} ${className}`}
    >
      {
        options.map(item => {
          return <Panel className={classNames(style["panel"], 'mumu-panel')} header={item.title} key={item.key}>
            {getPanel(item.node)}
          </Panel>
        })
      }
    </Collapse>
  )
}

MMCollapse.Panel = Panel

export default MMCollapse