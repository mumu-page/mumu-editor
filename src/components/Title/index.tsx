import Iconfont from '@/assets/iconfont'
import classNames from 'classnames'
import React from 'react'
import style from './index.module.less'

interface TitleProps {
  title: string
}

function Title(props: TitleProps) {
  const {title} = props

  return (
    <h2 className={style["title"]}>
      <p>{title}</p>
      <div className={style['action']}>
        <Iconfont className={classNames(style['action-item'], style['action-item-guding'])} type='icon-guding' />
        <Iconfont className={classNames(style['action-item'], style['action-item-close'])} type='icon-close' />
      </div>
    </h2>
  )
}

export default Title