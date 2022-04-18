import React from 'react'
import logo from '../../assets/image/logo.svg';
import { Link } from 'react-router-dom'
import { Menu } from 'antd'
import { SelectInfo } from 'rc-menu/lib/interface';
import 'antd/lib/menu/style/css'
import style from './index.module.less'
import classNames from 'classnames';

interface HeaderProps {
    className?: string
}

function Header(props: HeaderProps) {
    const handleSelect = (path: SelectInfo) => {

    }

    return (
        <div className={classNames(style.header, props.className)}>
            <div className={style["header-menu"]}>
                <div className={style["left"]}>
                    <div className={style["logo"]}>
                        <Link to="/courses">
                            <img src={logo} alt="" height={60} style={{ transform: 'scale(2.2) translate(15px, 0)' }} />
                        </Link>
                    </div>
                </div>
                <Menu selectable={false}
                    className={style["el-menu-demo"]}
                    mode="horizontal"
                    onSelect={(path) => handleSelect(path)}
                    style={{ borderBottom: 0 }}
                >
                    <Menu.Item>
                        <a href="https://github.com/mumu-page/mumu-editor" target="_blank" rel="noreferrer">
                            Github
                        </a>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/dashboard">
                            工作台
                        </Link>
                    </Menu.Item>
                </Menu>
            </div>
        </div >
    )
}

export default Header