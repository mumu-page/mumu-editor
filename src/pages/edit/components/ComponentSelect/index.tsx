import { Image, Tooltip } from 'antd'
import React, { memo, useState } from 'react'
import IconFont from "@/components/IconFont";
import classNames from 'classnames';
import Title from '@/components/Title';
import MMCollapse from '@/components/Collapse';
import { clone, uuid } from '@/utils/utils';
import History from './History';
import style from './index.module.less'
import { CommonComponents, Component, RemoteComponent } from '@/store/edit/state';
import { restComponentsId } from './functions';

interface LeftMenu {
  key: string;
  title: Current;
  icon: string;
  onClick?: (title: string) => void
}

type Current = '组件' | '历史记录'

interface ComponentSelectProps {
  components: Component[]
  commonComponents: CommonComponents[]
}

function ComponentSelect(props: ComponentSelectProps) {
  const { components, commonComponents } = props
  const [current, setCurrent] = useState<Current>('组件')
  const [isAffix, setAffix] = useState(false)
  const [hide, setHide] = useState(false)
  const [update, setUpdate] = useState(false)

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, item?: any) => {
    if (item) {
      e.dataTransfer.setData("text/plain", JSON.stringify(item))
    }
  }
  const handleMenuChange = (_title: Current) => {
    setCurrent(_title)
    setHide(false)
  }

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

  const renderComponents = (components: Component[] | RemoteComponent[]) => {
    if (!components.length) return null
    const _components = restComponentsId(clone(components) as any[]) as any[]
    if (_components.length % 3 !== 0) {
      const len = _components.length % 3
      for (let index = 0; index < (3 - len); index++) {
        _components.push({ placeholder: true, id: uuid() })
      }
    }
    return <div className={style["components"]}>
      {_components.map(item => {
        if (item.placeholder) return <div
          className={classNames(style["mumu-item"], style.flag)}
          key={item.id}
          data-id={item.id}
        />
        return <div
          onDragStart={(e) => onDragStart(e, item)}
          onDragEnd={() => setUpdate(!update)}
          draggable
          className={style["mumu-item"]}
          key={item.name}
          data-id={item.id}
        >
          <Image
            rootClassName={classNames(style["preview-item"], 'mumu-image')}
            src={item.snapshot}
            preview={{ mask: <div className="mumu-title">预览</div> }}
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
                  <IconFont type={item.icon} />
                </Tooltip>
              </div>
            })
          }
        </div>
        <div className={classNames({ [style["list-view"]]: true, [style.hide]: hide, [style.affix]: isAffix })}>
          <Title
            title={current}
            isAffix={isAffix}
            onClose={() => setHide(true)}
            onFixed={() => setAffix(!isAffix)}
          />
          <div className={style.scroll}>
            {current === '组件' && <MMCollapse options={[
              {
                key: '1',
                title: '当前模板组件',
                node: renderComponents(components)
              },
              ...commonComponents.map(item => {
                return {
                  key: item.groupName || '',
                  title: item.groupName || '',
                  node: renderComponents(item.components || [])
                }
              })
            ]} />}
            {current === '历史记录' && <History />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(ComponentSelect)