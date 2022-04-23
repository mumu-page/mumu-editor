import { AppstoreOutlined, MailOutlined } from '@ant-design/icons'
import { Menu, Image, Button, Tooltip } from 'antd'
import React, { useState } from 'react'
import Iconfont from "@/assets/iconfont";
import style from './index.module.less'
import classNames from 'classnames';
import Title from '@/components/Title';

interface LeftMenu {
  key: string;
  title: string;
  icon: string;
  onClick?: (title: string) => void
}

function ComponentSelect() {
  const [selectedKeys] = useState([])
  const [canSelects] = useState([]) // editState.pageConfig.components
  const [current, setCurrent] = useState('组件')
  const selectMenu = () => { }
  const setDragStart = (e: any, flag: any, item?: any) => { }

  const handleMenuChange = (title: string) => {
    setCurrent(title)
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
                  <Iconfont type={item.icon} />
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
          {canSelects.map(item => {
            return <div
              onDragStart={(e) => setDragStart(e, true, item)}
              onDragEnd={(e) => setDragStart(e, false)}
              draggable
              className={style["co-item"]}
            // key={item.id}
            // v-for="(item, index) in canSelects.length ? canSelects : editState.pageConfig.components"
            >
              {/* <Image
                className="preview-item"
                src={item.snapshot}
              /> */}
              {/* <div className="co-title">{{ item.description }}</div> */}
            </div>
          })}
        </div >
      </div >
    </div >
  )
}

export default ComponentSelect 
