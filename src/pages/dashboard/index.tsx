import React, {useState} from 'react'
import Header from '../../components/Header'
import {Spin} from "antd";
import List from "./components/List";
import style from './index.module.less'

export default function Dashboard() {
    // const [value, setValue] = useState('')
    // const onSearch = () => {};

    return (
        <div>
            <Header className={style["edit-menu"]}/>
            <List />
        </div>
    )
}
