import { Image, Tooltip } from 'antd'
import React, { memo, useState } from 'react'
import IconFont from "@/components/IconFont";
import style from './index.module.less'
import classNames from 'classnames';
import Title from '@/components/Title';
import { useEditState } from '@/store';
import Collapse from '@/components/Collapse';
import uniqueid from "lodash.uniqueid";
import { clone } from '@/utils/utils';

interface LeftMenu {
  key: string;
  title: string;
  icon: string;
  onClick?: (title: string) => void
}

function ComponentSelect() {
  const [selectedKeys] = useState([])
  const [current, setCurrent] = useState('组件')
  const selectMenu = () => { }
  const editState = useEditState()
  const setDragStart = (e: any, flag: any, item?: any) => { }
  const handleMenuChange = (title: string) => {
    setCurrent(title)
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
        _components.push({ placeholder: true, key: uniqueid() })
      }
    }
    return <div className={style["components"]}>
      {_components.map(item => {
        if (item.placeholder) return <div
          className={style["mumu-item"]}
          key={item.key}
        />
        return <div
          onDragStart={(e) => setDragStart(e, true, item)}
          onDragEnd={(e) => setDragStart(e, false)}
          draggable
          className={style["mumu-item"]}
          key={item.name}
        >
          <Image
            rootClassName={classNames(style["preview-item"], 'mumu-image')}
            src={item.snapshot}
            preview={{ mask: <div className="mumu-title">{item.description}</div> }}
          />
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
                className={classNames({ [style['item']]: true, [style['active']]: current === item.title })}>
                <Tooltip placement="right" title={item.title}>
                  <IconFont type={item.icon} />
                </Tooltip>
              </div>
            })
          }
          {/* <Menu
            style={{ width: 120 }}
            mode="inline"
            selectedKeys={selectedKeys}
            onSelect={selectMenu}
            defaultOpenKeys={['common']}
          >
            <Menu.Item
              // v-if="editState.pageConfig.components?.length"
              key="template"
            >
              <MailOutlined />
              模板组件
            </Menu.Item>
            {/* <a-sub-menu key="common">
            <template #title>
              <span>
                <AppstoreOutlined />
                <span>系统组件</span>
              </span>
            </template>
            <Menu.Item
                :key="item.name"
                v-for="item in editState.uiConfig.commonComponents"
            >
              {{item.description}}
            </Menu.Item>
          </a-sub-menu> 
          </Menu> */}
        </div>
        <div className={style["list-view"]}>
          <Title title={current} />
          <Collapse options={[
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
          ]} />
        </div >
      </div >
    </div >
  )
}

export default (ComponentSelect) 
