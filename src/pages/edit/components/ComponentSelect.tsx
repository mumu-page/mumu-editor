import { AppstoreOutlined, MailOutlined } from '@ant-design/icons'
import { Menu, Image } from 'antd'
import React, { useState } from 'react'
import style from './index.module.less'

function ComponentSelect() {
  const [selectedKeys] = useState([])
  const [canSelects] = useState([]) // editState.pageConfig.components
  const selectMenu = () => { }
  const setDragStart = (e: any, flag: any, item?: any) => { }
  return (
    <div className={style["select-menu"]}>
      <h2 className={style["title"]}>添加组件</h2>
      <div className={style["component-preview"]}>
        <div className={style["left-menu"]}>
          <Menu
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
          </a-sub-menu> */}
          </Menu>
        </div>
        <div className={style["list-view"]}>
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
