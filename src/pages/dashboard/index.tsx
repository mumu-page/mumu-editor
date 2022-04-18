import React from 'react'
import Header from '../../components/Header'
import style from './index.module.less'

export default function Dashboard() {
    return (
        <div>
            <Header className={style["edit-menu"]}></Header>
            {/* <List />
            <a-spin /> */}
        </div>
    )
}
