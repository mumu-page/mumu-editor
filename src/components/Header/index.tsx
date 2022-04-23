import React from 'react'
import logo from '../../assets/image/logo.svg';
import { Link } from 'react-router-dom'
import classNames from 'classnames';
import style from './index.module.less'
import { Button, Radio } from 'antd';

interface MenuItem {
  key: string;
  label: string | React.ReactNode
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
  handleSelect?: (menu: MenuItem) => void
}

function Header(props: HeaderProps) {
  const handleSelect = (menu: MenuItem) => {
    menu?.onClick?.(menu)
    props?.handleSelect?.(menu)
  }

  const handleSizeChange = () => {

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
          return <Radio.Group key={item.key} className={style.menu} onChange={handleSizeChange}>
            {item.children.map(child => {
              return <Radio.Button
                value="large"
                type="primary"
                key={child?.key}
                style={child.style}
                className={classNames(child.className, style.menuItem)}
                onClick={() => handleSelect(child)}>{child.label}
              </Radio.Button>
            })}
          </Radio.Group>
        }
        return <Button
          type={item.type}
          key={item?.key}
          style={item.style || { marginLeft: 10 }}
          className={classNames(item.className, style.menuItem)}
          onClick={() => handleSelect(item)}>{item.label}</Button>
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
        <div>
          {renderMenuItem(props.menus)}
        </div>
      </div>
    </div>
  )
}

export default Header