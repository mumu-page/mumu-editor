import React from 'react'
import logo from '../../assets/image/logo.svg';
import { Link } from 'react-router-dom'
import classNames from 'classnames';
import style from './index.module.less'

interface MenuItem {
  key: string;
  label: string | React.ReactNode
  onClick?: (menu: MenuItem) => void
  className?: string
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
      return <div className={style.menu}>
        {Array.isArray(menus) && menus.map(item => {
          return <div key={item?.key} className={classNames(item.className, style.menuItem)} onClick={() => handleSelect(item)}>{item.label}</div>
        })}
      </div>
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
              <img src={logo} alt="" height={60} style={{ transform: 'scale(2.2) translate(15px, 0)' }} />
            </Link>
          </div>
          {props.pageTitle}
        </div>
        {renderMenuItem(props.menus)}
      </div>
    </div>
  )
}

export default Header