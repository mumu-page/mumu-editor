import {Image, Tooltip} from 'antd'
import React, {memo, useRef, useState} from 'react'
import IconFont from "@/components/IconFont";
import style from './index.module.less'
import classNames from 'classnames';
import Title, {TitleRef} from '@/components/Title';
import {useEditState} from '@/store';
import Collapse from '@/components/Collapse';
import uniqueid from "lodash.uniqueid";
import {clone} from '@/utils/utils';
import History from './History'

interface LeftMenu {
  key: string;
  title: Current;
  icon: string;
  onClick?: (title: string) => void
}

type Current = '组件' | '历史记录'

function ComponentSelect() {
  const [current, setCurrent] = useState<Current>('组件')
  const title = useRef<TitleRef>(null)
  const {isAffix, hide, setHide} = title.current || {}

  const editState = useEditState()
  const setDragStart = (e: any, item?: any) => {
    if (item) {
      e.dataTransfer.setData("text/plain", JSON.stringify(item))
    }
  }
  const handleMenuChange = (title: Current) => {
    setCurrent(title)
    setHide?.(false)
  }
  // console.log('editState', editState)

  const leftMenus: LeftMenu[] = [
    {
      key: '组件',
      title: '组件',
      icon: 'icon-component1',
    },
    {
      key: '历史记录',
      title: '历史记录',
      icon: 'icon-lishi',
    },
  ]

  const renderComponents = (components: any[]) => {
    const _components = clone(components) as any[]
    if (_components.length % 3 !== 0) {
      const len = _components.length % 3
      for (let index = 0; index < (3 - len); index++) {
        _components.push({placeholder: true, key: uniqueid()})
      }
    }
    return <div className={style["components"]}>
      {_components.map(item => {
        if (item.placeholder) return <div
          className={classNames(style["mumu-item"], style.flag)}
          key={item.key}
        />
        return <div
          onDragStart={(e) => setDragStart(e, item)}
          draggable
          className={style["mumu-item"]}
          key={item.name}
        >
          <Image
            rootClassName={classNames(style["preview-item"], 'mumu-image')}
            src={item.snapshot}
            preview={{mask: <div className="mumu-title">预览</div>}}
          />
          <div className={style['item-name']}>{item.description}</div>
        </div>
      })}
    </div>
  }

  return (
    <div className={style["select-menu"]}>
      <div className={style["component-preview"]}>
        <div className={style["left-menu"]}>
          {
            leftMenus.map(item => {
              return <div
                key={item.key}
                onClick={() => {
                  handleMenuChange(item.title)
                  item?.onClick?.(item.title)
                }}
                className={classNames({
                  [style['item']]: true,
                  [style['active']]: current === item.title
                })}>
                <Tooltip placement="right" title={item.title}>
                  <IconFont type={item.icon}/>
                </Tooltip>
              </div>
            })
          }
        </div>
        <div className={classNames({[style["list-view"]]: true, [style.hide]: hide, [style.affix]: isAffix})}>
          <Title
            ref={title}
            title={current}/>
          {current === '组件' && <Collapse options={[
            {
              key: '1',
              title: '模板组件',
              node: renderComponents(editState.pageConfig.components)
            },
            {
              key: '2',
              title: '系统组件',
              node: renderComponents(editState.uiConfig.commonComponents)
            }
          ]}/>}
          {current === '历史记录' && <History/>}
        </div>
      </div>
    </div>
  )
}

export default (ComponentSelect)
