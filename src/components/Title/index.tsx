import Iconfont from '@/components/IconFont'
import {PushpinFilled, PushpinOutlined} from '@ant-design/icons'
import React, {memo} from 'react'
import style from './index.module.less'

interface TitleProps {
  title: string
  isAffix: boolean
  onClose: () => void
  onFixed: () => void
}

function Title(props: TitleProps) {
  const {title, isAffix, onClose, onFixed} = props

  const getAffixICON = () => {
    return isAffix ?
      <PushpinFilled className={style['action-item-guding']}/> :
      <PushpinOutlined className={style['action-item-guding']}/>
  }

  return (
    <div className={style["title"]}>
      <p>{title}</p>
      <div className={style['action']}>
        <span onClick={onFixed} className={style['action-item']}>{getAffixICON()}</span>
        <span onClick={onClose} className={style['action-item']}>
          <Iconfont className={style['action-item-close']} type='icon-close'/>
        </span>
      </div>
    </div>
  )
}

export default memo(Title)

