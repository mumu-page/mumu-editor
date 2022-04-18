import React, {useState} from 'react'
import Header from '../../components/Header'
import style from './index.module.less'
import {Button, Input, Menu, Spin} from "antd";
import {SettingOutlined, UndoOutlined, RedoOutlined, SaveOutlined} from "@ant-design/icons";
import {EyeOutlined} from "@ant-design/icons/lib";
import {project} from "@/api";
import {Link} from "react-router-dom";

export default function Edit() {
    // const [value, setValue] = useState('')
    // const onSearch = () => {};

    const getPageSchema = () => {
    }
    const changeProjectName = () => {
    }
    const rollback = () => {
        // historyState.undo()
        // commit('setIsSave', false)
        // // console.log('historyState undo', historyState)
        // postMsgToChild({type: 'setConfig', data: clone(historyState.currentValue || '{}')})
    }
    const next = () => {
        // historyState.redo()
        // commit('setIsSave', false)
        // // console.log('historyState undo', historyState)
        // postMsgToChild({type: 'setConfig', data: clone(historyState.currentValue || '{}')})
    }
    const saveConfig = () => {
        // project.save({
        //     id: router.query.id,
        //     pageConfig: toRaw(editState.pageConfig)
        // }).then(res => {
        //     message.success(res.message)
        // })
    }
    const setPreview = () => {
        // window.open(`http://localhost:8081/?isPreview=true&pageId=${router.query.id}&env=development`)
    }
    const setRelease = () => {
        // project.release({id: router.query.id}).then(res => {
        //     if(res.success) {
        //         message.success('发布成功！')
        //     } else {
        //         message.error('发布失败！')
        //     }
        //
        // })
    }
    return (
        <div>
            <Header
                className={style['edit-menu']}
                pageTitle={<div className={style["page-title"]}>
                    <SettingOutlined onClick={getPageSchema} style={{"marginRight": "10px", "cursor": "pointer"}}/>
                    <Input
                        className={style["title-content"]}
                        value="editState.pageConfig.config.projectName"
                        onInput={changeProjectName}
                    />
                </div>}
                menu={<>
                    <Menu.Item onClick={rollback}>
                        <UndoOutlined/>
                        撤销
                    </Menu.Item>
                    <Menu.Item onClick={next}>
                        <RedoOutlined/>
                        前进
                    </Menu.Item>
                    <Menu.Item onClick={() => saveConfig()}>
                        <SaveOutlined/>
                        保存
                    </Menu.Item>
                    <Menu.Item onClick={() => setPreview()}>
                        <EyeOutlined/>
                        预览
                    </Menu.Item>
                    <Menu.Item onClick={() => setRelease()}>
                        <Button type="primary">发布</Button>
                    </Menu.Item>
                    <Menu.Item className={style.dash}>
                        <div className={style.line}/>
                    </Menu.Item>
                    <Menu.Item>
                        <Link to="/dashboard">
                            工作台
                        </Link>
                    </Menu.Item>
                </>}
            />
        </div>
    )
}
