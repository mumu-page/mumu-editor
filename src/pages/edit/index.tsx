/* eslint-disable jsx-a11y/iframe-has-title */
import React, { memo, useEffect, useState } from 'react'
import Header from '../../components/Header'
import { Button, Drawer, Form, Input, Menu, message, Spin } from "antd";
import { SettingOutlined, UndoOutlined, RedoOutlined, SaveOutlined, LinkOutlined, CopyOutlined, DeleteOutlined, DoubleLeftOutlined, DoubleRightOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons/lib";
import { component, project } from "@/api";
import { Link, useParams, useSearchParams } from "react-router-dom";
import style from './index.module.less'
import classNames from 'classnames';
import ComponentSelect from './components/ComponentSelect';
import { useStore } from 'react-redux';
import { RootStore } from '@/store';
import { useEditor } from './hooks';
import { postMsgToChild } from '@/utils/utils';
import { addComponent, returnConfig, setDragStart, setIsSave } from '@/store/edit';
import FormConfig from './components/FormConfig';

function Edit() {
  const [spinning, setSpinning] = useState(true)
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  const [data, setData] = useState({})
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [showUrl, setShowUrl] = useState('')
  const [containerHeight, setContainerHeight] = useState()
  const { getState, dispatch } = useStore<RootStore>();
  const { edit: editState, user } = getState()
  const { editorState, eventInit, init, getIndex, setFixedStyle } = useEditor();

  const [params] = useSearchParams()

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
    project.release({ id: 'router.query.id' }).then(res => {
      if (res.success) {
        message.success('发布成功！')
      } else {
        message.error('发布失败！')
      }
    })
  }

  const deleteComponent = (index?: undefined | number) => {
    postMsgToChild({ type: 'deleteComponent', data: index !== undefined ? index : editorState.current });
    dispatch(setIsSave(true))
  }

  const onClose = (flag: boolean | ((prevState: boolean) => boolean)) => {
    setVisible(flag)
  }

  const initConfig = () => {
    eventInit((index) => {
      setCurrent(index)
      postMsgToChild({ type: 'changeIndex', data: current });
    });
    if (typeof editState?.editConfig?.currentIndex === 'number') {
      init(editState.editConfig.currentIndex);
    }
    setSpinning(false)
    // 初始化页面
    postMsgToChild({ type: 'getConfig' });
    // if (editState.pageConfig.components.length) {
    //   // 编辑
    //   let data = JSON.parse(JSON.stringify(editState.pageConfig))
    //   postMsgToChild({type: 'setConfig', data})
    // }
    postMsgToChild({ type: 'changeIndex', data: editState.editConfig.currentIndex })
    dispatch(setIsSave(true))
  }

  const dragover_handler = (ev: { preventDefault: () => void; }) => {
    ev.preventDefault();
  }

  const drop_handler = (ev: { preventDefault?: any; dataTransfer?: any; layerY?: any; }) => {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text/plain");
    const { layerY } = ev;
    const index = getIndex(layerY);
    dispatch(addComponent({ data: JSON.parse(data), index }))
    dispatch(setDragStart({
      v: false
    }))
    dispatch(setIsSave(true))
  }

  const changeIndex = (op: number) => {
    console.log(op);
    postMsgToChild({ type: 'sortComponent', data: { op, index: editorState.current } });
    dispatch(setIsSave(true))
  }

  const copyComponent = () => {
    postMsgToChild({ type: 'copyComponent', data: editorState.current });
    dispatch(setIsSave(true))
  }

  useEffect(() => {
    setVisible(true)
  }, [editState.editConfig.currentIndex,]);

  useEffect(() => {
    // if (typeof editState?.editConfig?.currentIndex === 'number') {
    //   init(editState.editConfig.currentIndex);
    // }
    setFixedStyle(editState.editConfig.currentIndex);
  }, [editState.pageConfig.userSelectComponents, editState.editConfig.currentIndex, init, setFixedStyle]);

  useEffect(() => {
    Promise.all([
      project.query({ id: params.get('id') }),
      component.query({})
    ]).then(([result, { result: componentRes }]) => {
      setData(result[0])
      const targetConfig = result[0].pageConfig;
      setName(result[0].name)
      setUrl(`http://localhost:3000/mumu-editor/build/index.html?isEdit=true`)
      setShowUrl(`http://localhost:3000/mumu-editor/build/index.html`)
      dispatch(returnConfig({
        targetConfig,
        pageData: data,
        releaseStatus: result[0].releaseInfo,
        commonComponents: componentRes,
      }));
    });
  }, [])

  return (
    <div>
      <Header
        className={style['edit-menu']}
        pageTitle={<div className={style["page-title"]}>
          <SettingOutlined onClick={getPageSchema} style={{ "marginRight": "10px", "cursor": "pointer" }} />
          <Input
            className={style["title-content"]}
            value={editState.pageConfig.config.projectName}
            onInput={changeProjectName}
          />
        </div>}
        menus={[
          {
            key: 'radio',
            label: <><UndoOutlined /> 撤销</>,
            onClick: rollback,
            children: [
              {
                key: 'rollback',
                label: <><UndoOutlined /> 撤销</>,
                onClick: rollback
              },
              {
                key: 'next',
                label: <><RedoOutlined /> 前进</>,
                onClick: next
              },
              {
                key: 'saveConfig',
                label: <><EyeOutlined /> 保存</>,
                onClick: saveConfig
              },
            ]
          },
          {
            key: 'setPreview',
            label: <><EyeOutlined /> 预览</>,
            onClick: setPreview,
          },
          {
            key: 'setRelease',
            label: '发布',
            onClick: setRelease,
            type: 'primary'
          },
          {
            key: 'dashboard',
            label: <Link to="/dashboard">工作台</Link>,
          }
        ]}
      />

      <div className={style['edit-container']}>
        <div className={style["component-container"]}>
          <ComponentSelect />
        </div>
        <div className={style["editor-view"]}>
          <div className={style["se-page-path-container"]}>
            <div className={style["se-page-path"]}>
              <div className={style["se-pp-url"]}>
                <span>{showUrl}</span>
              </div>
              <div className={style["se-pp-share"]}>
                <LinkOutlined />
              </div>
            </div>
          </div>
          <div className={style["main-container"]}>
            <div className={style["preview-container"]}>
              <Spin spinning={spinning}>
                <iframe
                  cross-origin="true"
                  onLoad={initConfig}
                  id="frame"
                  frameBorder="0"
                  className={style["pre-view"]}
                  src={url}
                  style={{
                    height: containerHeight + 'px'
                  }}
                />
                {editState.uiConfig.dragStart && <div
                  onDrop={drop_handler}
                  onDragOver={dragover_handler}
                  className={style["drag-hover"]}
                />}
              </Spin>
            </div>
            <div style={editorState.hoverStyle} className={style["se-view-hover-tip"]}></div>
            <div style={editorState.activeStyle} className={style["se-view-active-tip"]}></div>
            <div
              style={{
                display: !!editorState.toolStyle?.top ? 'block' : 'none',
                top: editorState.toolStyle?.top
              }}
              className={style["se-view-tools"]}
              id="se-view-tools"
            >
              <div className={classNames(style['sev-tools-move'], (editorState.isTop || editorState.isBottom) && style['sev-tools-move-single'])}>
                {!editorState.isTop && <ArrowUpOutlined onClick={() => changeIndex(-1)} className="fd-iconfont" />}
                {!editorState.isBottom && <ArrowDownOutlined onClick={() => changeIndex(1)} className="fd-iconfont" />}
              </div>
              <div className={style["sev-tools-copy"]}>
                <CopyOutlined onClick={copyComponent} className={style["fd-iconfont"]} />
              </div>
              <div className={style["sev-tools-copy"]}>
                <DeleteOutlined onClick={() => deleteComponent()} className={style["fd-iconfont"]} />
              </div>
            </div >
          </div >
        </div >

        <div
          // style={{
          //   position: 'relative',
          //   width: visible ? '350px' : ''
          // }}
          className={style["form-container-main"]}
        >
          <FormConfig />
          {/* <Drawer
            // mask={false}
            title="Basic Drawer"
            placement="right"
            closable={false}
            visible={visible}
            getContainer={false}
            contentWrapperStyle={{ position: 'absolute' }}
            onClose={() => onClose(false)}
            width={350}
            handler={<>
              {!visible && <DoubleLeftOutlined onClick={() => onClose(true)} className={style["draw-op"]} />}
              {visible && <DoubleRightOutlined onClick={() => onClose(false)} className={style["draw-op"]} />}
            </>}
          >
            <FormConfig />
          </Drawer> */}
        </div >
      </div >
    </div >
  )
}

export default memo(Edit)