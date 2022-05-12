import React, {useEffect} from "react";
import style from './index.module.less'
import {ArrowDownOutlined, ArrowUpOutlined, CopyOutlined, DeleteOutlined} from "@ant-design/icons";
import {Button} from "antd";
import classNames from "classnames";

interface ElementStyle {
  onMove: (type: 'up' | 'down') => void
  onCopy: () => void
  onDel: () => void
  isTop: boolean
  isBottom: boolean
  height: number
}

let tool: HTMLElement | null

export function hideTool() {
  if(!tool) return
  tool.style.display = 'none'
}

export function showTool() {
  if(!tool) return
  tool.style.display = 'flex'
}

function Tool(props: ElementStyle) {
  const {onMove, onDel, onCopy, isTop, isBottom, height} = props
  let top = null

  if (isTop) {
    top = height + 2
  }
  if (isTop && isBottom) {
    top = 2
  }

  const initEle = () => {
    tool = document.getElementById('tool')
  }

  useEffect(() => {
    initEle()
  }, [])

  return <div
    id={'tool'}
    style={top ? {top} : {}}
    className={classNames({
      [style.tool]: true,
      [style.isTop]: isTop,
      [style.isBottom]: isBottom,
    })}>
    {!isTop && <Button
      type="primary"
      size={'small'}
      className={style.moveUp}
      icon={<ArrowUpOutlined/>}
      onClick={() => onMove('up')}
    />}
    {!isBottom && <Button
      type="primary"
      className={style.moveDown}
      size={'small'}
      icon={<ArrowDownOutlined/>}
      onClick={() => onMove('down')}
    />}
    <Button
      className={style.copy}
      type="primary"
      size={'small'}
      icon={<CopyOutlined/>}
      onClick={() => onCopy()}
    />
    <Button
      className={style.delete}
      type="primary"
      danger
      size={'small'}
      icon={<DeleteOutlined/>}
      onClick={() => onDel()}
    />
  </div>
}

export default Tool;