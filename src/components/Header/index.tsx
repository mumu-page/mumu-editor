import React from 'react'
import logo from '../../assets/image/logo.svg';
import {Link} from 'react-router-dom'
import {Menu} from 'antd'
import {SelectInfo} from 'rc-menu/lib/interface';
import classNames from 'classnames';
import 'antd/lib/menu/style/css'
import style from './index.module.less'

interface HeaderProps {
    className?: string
    pageTitle?: React.ReactNode
    menu?: React.ReactNode
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
                            <img src={logo} alt="" height={60} style={{transform: 'scale(2.2) translate(15px, 0)'}}/>
                        </Link>
                    </div>
                    {props.pageTitle}
                </div>
                <Menu selectable={false}
                      className={style["el-menu-demo"]}
                      mode="horizontal"
                      onSelect={(path) => handleSelect(path)}
                      style={{borderBottom: 0, width: 170}}
                >
                    {props.menu ? props.menu : <>
                        <Menu.Item key={'item1'}>
                            <a href="https://github.com/mumu-page/mumu-editor" target="_blank" rel="noreferrer">
                                Github
                            </a>
                        </Menu.Item>
                        <Menu.Item key={'item2'}>
                            <Link to="/dashboard">
                                工作台
                            </Link>
                        </Menu.Item>
                    </>}

                </Menu>
            </div>
        </div>
    )
}

export default Header