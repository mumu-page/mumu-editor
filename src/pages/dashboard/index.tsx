import React from 'react'
import Header from '../../components/Header'
import List from "./components/List";
import style from './index.module.less'

export default function Dashboard() {

  return (
    <div>
      <Header className={style["edit-menu"]} />
      <List />
    </div>
  )
}
