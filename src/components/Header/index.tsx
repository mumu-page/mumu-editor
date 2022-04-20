import React from 'react'
import logo from '../../assets/image/logo.svg';
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import { SelectInfo } from 'rc-menu/lib/interface';
import classNames from 'classnames';
import 'antd/lib/menu/style/css'
import style from './index.module.less'
import { ItemType } from 'antd/lib/menu/hooks/useItems';

interface HeaderProps {
  className?: string
  pageTitle?: React.ReactNode
  menus?: ItemType[]
}

function Header(props: HeaderProps) {
  const handleSelect = (path: SelectInfo) => {

  }

  return (
    <div className={classNames(style.header, props.className)}>
      <div className={style["header-menu"]}>
        <div className={style["left"]}>
          <div className={style["logo"]}>
            <Link to="/">
              <img src={logo} alt="" height={60} style={{ transform: 'scale(2.2) translate(15px, 0)' }} />
            </Link>
          </div>
          {props.pageTitle}
        </div>
        <Menu selectable={false}
          className={style["el-menu-demo"]}
          mode="horizontal"
          onSelect={(path) => handleSelect(path)}
          style={{ borderBottom: 0, width: 170 }}
          items={props.menus || [
            {
              key: 'item1',
              label: <a href="https://github.com/mumu-page/mumu-editor" target="_blank" rel="noreferrer">
                Github
              </a>
            },
            {
              key: 'item2',
              label: <Link to="/dashboard">
                工作台
              </Link>
            }
          ]}
        />
      </div>
    </div>
  )
}

export default Header