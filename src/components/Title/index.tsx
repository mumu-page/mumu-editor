import Iconfont from '@/components/IconFont'
import classNames from 'classnames'
import React from 'react'
import style from './index.module.less'

interface TitleProps {
  title: string
  onClose?: () => void
  onFixed?: () => void
}

function Title(props: TitleProps) {
  const {title, onClose, onFixed} = props

  return (
    <div className={style["title"]}>
      <p>{title}</p>
      <div className={style['action']}>
        <div onClick={onFixed}>
          <Iconfont
            className={classNames(style['action-item'], style['action-item-guding'])}
            type='icon-guding'/>
        </div>
        <div onClick={onClose}>
          <Iconfont
            className={classNames(style['action-item'], style['action-item-close'])}
            type='icon-close'/>
        </div>
      </div>
    </div>
  )
}

export default Title