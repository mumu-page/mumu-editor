import Iconfont from '@/components/IconFont'
import {PushpinFilled, PushpinOutlined} from '@ant-design/icons'
import React, {useEffect, useState, forwardRef, useImperativeHandle, Ref, Dispatch} from 'react'
import style from './index.module.less'

interface TitleProps {
  title: string
  onChange?: (isAffix: boolean, hide: boolean) => void
}

export interface TitleRef {
  isAffix: boolean
  hide: boolean
  setHide: Dispatch<React.SetStateAction<boolean>>
  setAffix: Dispatch<React.SetStateAction<boolean>>
}

function Title(props: TitleProps, ref: Ref<TitleRef>) {
  const {title, onChange} = props
  const [isAffix, setAffix] = useState(false)
  const [hide, setHide] = useState(false)
  const onClose = () => {
    if (hide) return
    setHide(true)
  }
  const onFixed = () => {
    setAffix(!isAffix)
  }

  useImperativeHandle(ref, () => ({
    isAffix,
    hide,
    setAffix,
    setHide
  }), [isAffix, hide])

  useEffect(() => {
    onChange?.(isAffix, hide)
  }, [isAffix, hide])

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

export default forwardRef(Title)