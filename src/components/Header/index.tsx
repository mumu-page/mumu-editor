import React from 'react'
import logo from '../../assets/image/logo2.svg';
import { Link } from 'react-router-dom'
import classNames from 'classnames';
import style from './index.module.less'
import { Button, Divider, Radio, RadioChangeEvent, Space, Typography } from 'antd';

interface MenuItem {
  key: string;
  isBtn?: boolean,
  label?: string | React.ReactNode
  icon?: React.ReactNode
  onClick?: (menu: MenuItem) => void
  className?: string
  type?: "link" | "text" | "ghost" | "default" | "primary" | "dashed" | undefined
  style?: Record<string, any>,
  children?: MenuItem[]
}

interface HeaderProps {
  className?: string
  pageTitle?: React.ReactNode
  menus?: MenuItem[]
  onClick?: (menu: MenuItem) => void
}

function Header(props: HeaderProps) {
  const onClick = (menu: MenuItem) => {
    menu?.onClick?.(menu)
    props?.onClick?.(menu)
  }

  const onChange = (e: RadioChangeEvent) => {
    // console.log(e.target.value)
  }

  const renderMenuItem = (menus: MenuItem[] | undefined) => {
    const defaultMenus: MenuItem[] = [
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
    ]
    const render = (menus: MenuItem[]) => {
      return Array.isArray(menus) && menus.map(item => {
        if (item.children?.length) {
          return <Space
            split={<Divider type="vertical" />}
            key={item.key}
            className={style.menuItem}
            style={{
              display: 'flex',
              ...(item.style || {})
            }}>
            {item.children.map(child => {
              return <Typography.Link
                key={child.key}
                style={child.style}
                className={classNames(child.className)}
                onClick={() => onClick(child)}>{child.label}</Typography.Link>
            })}
          </Space>
        }
        return item.isBtn ? <Button
          type={item.type}
          key={item?.key}
          style={item.style || { marginLeft: 10 }}
          icon={item.icon}
          className={classNames(item.className, style.menuItem)}
          onClick={() => onClick(item)}>{item.label}</Button> :
          <div
            key={item?.key}
            style={item.style || { marginLeft: 10 }}
            className={classNames(item.className, style.menuItem)}
          >{item.label}</div>
      })
    }
    if (Array.isArray(menus)) return render(menus)
    return render(defaultMenus)
  }

  return (
    <div className={classNames(style.header, props.className)}>
      <div className={style["header-menu"]}>
        <div className={style["left"]}>
          <div className={style["logo"]}>
            <Link to="/">
              <img className={style["logo-container"]} src={logo} alt="" height={60} />
            </Link>
          </div>
          {props.pageTitle}
        </div>
        <div className={style.menu}>
          {renderMenuItem(props.menus)}
        </div>
      </div>
    </div>
  )
}

export default Header