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
        <span onClick={onFixed} className={style['action-item']}>
          <Iconfont
            className={style['action-item-guding']}
            type='icon-guding'/>
        </span>
        <span onClick={onClose} className={style['action-item']}>
          <Iconfont
            className={style['action-item-close']}
            type='icon-close'/>
        </span>
      </div>
    </div>
  )
}

export default Title