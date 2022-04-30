import React, { memo, useEffect } from 'react'
import { Header, Shape } from '@/components'
import { Input, message, Spin } from "antd";
import { SettingOutlined, UndoOutlined, RedoOutlined, SaveOutlined, CopyOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { EyeOutlined } from "@ant-design/icons/lib";
import { component, project } from "@/api";
import { Link, useSearchParams } from "react-router-dom";
import style from './index.module.less'
import classNames from 'classnames';
import ComponentSelect from './components/ComponentSelect';
import { useStore } from 'react-redux';
import { RootStore } from '@/store';
import { useEditor } from './hooks';
import { clone, postMsgToChild } from '@/utils/utils';
import { addComponent, returnConfig, setDragStart, setIsSave } from '@/store/edit';
import FormConfig from './components/FormConfig';
import { historyState } from '@/utils/history';
import { CHANGE_INDEX, COPY_COMPONENT, DELETE_COMPONENT, GET_CONFIG, SET_CONFIG, SORT_COMPONENT } from '@/constants';
import IconFont from '@/components/IconFont';

function Edit() {
  const { getState, dispatch } = useStore<RootStore>();
  const { edit: editState } = getState()
  const { editorState, eventInit, init, getIndex, setFrameLoaded, setUrl, setSpinning } = useEditor();
  const [params] = useSearchParams()

  const getPageSchema = () => {
  }
  const changeProjectName = () => {
  }
  const rollback = () => {
    historyState.undo()
    // commit('setIsSave', false)
    // console.log('historyState undo', historyState)
    postMsgToChild({ type: SET_CONFIG, data: clone(historyState.currentValue || '{}') })
  }
  const next = () => {
    historyState.redo()
    // commit('setIsSave', false)
    // console.log('historyState undo', historyState)
    postMsgToChild({ type: SET_CONFIG, data: clone(historyState.currentValue || '{}') })
  }
  const saveConfig = () => {
    project.save({
      id: params.get('id'),
      pageConfig: editState.pageConfig
    }).then(res => {
      message.success(res.message)
    })
  }
  const setPreview = () => {
    // window.open(`http://localhost:8081/?isPreview=true&pageId=${router.query.id}&env=development`)
  }
  const setRelease = () => {
    project.release({ id: params.get('id') }).then(res => {
      if (res.success) {
        message.success('发布成功！')
      } else {
        message.error('发布失败！')
      }
    })
  }

  const deleteComponent = (index?: undefined | number) => {
    postMsgToChild({ type: DELETE_COMPONENT, data: index !== undefined ? index : editorState.current });
    dispatch(setIsSave(true))
  }

  // const onClose = (flag: boolean | ((prevState: boolean) => boolean)) => {
  // }

  const initConfig = () => {
    setFrameLoaded(true)
    eventInit((index) => {
      postMsgToChild({ type: 'changeIndex', data: index });
    });
    // if (typeof editState?.editConfig?.currentIndex === 'number') {
    //   init(editState.editConfig.currentIndex);
    // }
    setSpinning(false)
    // 初始化页面
    postMsgToChild({ type: GET_CONFIG });
    // if (editState.pageConfig.components.length) {
    //   // 编辑
    //   let data = JSON.parse(JSON.stringify(editState.pageConfig))
    //   postMsgToChild({type: 'setConfig', data})
    // }
    postMsgToChild({ type: CHANGE_INDEX, data: editState.editConfig.currentIndex })
    dispatch(setIsSave(true))
  }

  // const dragover_handler = (ev: { preventDefault: () => void; }) => {
  //   ev.preventDefault();
  // }

  // const drop_handler = (ev: { preventDefault?: any; dataTransfer?: any; layerY?: any; }) => {
  //   ev.preventDefault();
  //   const data = ev.dataTransfer.getData("text/plain");
  //   const { layerY } = ev;
  //   const index = getIndex(layerY);
  //   dispatch(addComponent({ data: JSON.parse(data), index }))
  //   dispatch(setDragStart({
  //     v: false
  //   }))
  //   dispatch(setIsSave(true))
  // }

  const changeIndex = (op: number) => {
    console.log(op);
    postMsgToChild({ type: SORT_COMPONENT, data: { op, index: editorState.current } });
    dispatch(setIsSave(true))
  }

  const copyComponent = () => {
    postMsgToChild({ type: COPY_COMPONENT, data: editorState.current });
    dispatch(setIsSave(true))
  }

  useEffect(() => {
    Promise.all([
      project.query({ id: params.get('id') }),
      component.query({})
    ]).then(([result, componentRes]) => {
      const targetConfig = result[0].pageConfig;
      setUrl(`http://localhost:3000/mumu-editor/build/index.html?isEdit=true`)
      console.log('result', result)
      dispatch(returnConfig({
        targetConfig,
        pageData: result[0],
        releaseStatus: result[0].releaseInfo,
        commonComponents: componentRes?.[0]?.config,
      }));
    });
  }, [])

  console.log('activeStyle', editorState.hoverStyle)
  console.log('activeStyle', editorState.activeStyle)

  return (
    <div>
      <Header
        className={style['edit-menu']}
        pageTitle={<>
          <div className={style["page-title"]}>
            <SettingOutlined onClick={getPageSchema} style={{ "marginRight": "10px", "cursor": "pointer" }} />
            <Input
              className={style["title-content"]}
              value={editState.pageConfig.config.projectName}
              onInput={changeProjectName}
            />
          </div>
        </>}
        menus={[
          {
            key: 'lp-simulator-pane',
            style: { marginRight: 20 },
            children: [
              {
                key: 'pc',
                label: <IconFont type='icon-PCtaishiji' />,
              },
              {
                key: 'iPad',
                label: <IconFont type='icon-iPad' />,
              },
              {
                key: 'shouji',
                label: <IconFont type='icon-shouji' />,
              },
            ]
          },
          {
            key: 'input',
            isBtn: false,
            style: { marginRight: 110, width: 120 },
            label: <Input style={{}} addonAfter="px" />,
          },
          {
            key: 'radio',
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
                label: <><SaveOutlined /> 保存</>,
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
          {/*<div className={style.flag}/>*/}
          <div className={style["main-container"]}>
            <div className={style["preview-container"]}>
              <Spin spinning={editorState.spinning} />
              <iframe
                title='模板页面'
                cross-origin="true"
                onLoad={initConfig}
                id="frame"
                frameBorder="0"
                className={style["pre-view"]}
                src={editorState.url}
                style={{
                  // height: editorState.containerHeight + 'px'
                  height: '100%'
                }}
              />
              {/* <div
                onDrop={drop_handler}
                onDragOver={dragover_handler}
                style={{ display: editState.uiConfig.dragStart ? 'block' : 'none' }}
                className={style["drag-hover"]}
              /> */}
                <Shape {...editorState.activeStyle} />
            </div>

            
            {/* <div style={editorState.hoverStyle} className={style["se-view-hover-tip"]}></div>
            <div style={editorState.activeStyle} className={style["se-view-active-tip"]}></div> */}
            <div
              style={{
                display: !!editorState.toolStyle?.top ? 'block' : 'none',
                top: editorState.toolStyle?.top
              }}
              className={style["se-view-tools"]}
              id="se-view-tools"
            >
              <div className={classNames(style['sev-tools-move'], (editorState.isTop || editorState.isBottom) && style['sev-tools-move-single'])}>
                {!editorState.isTop && <ArrowUpOutlined onClick={() => changeIndex(-1)} className={style["fd-iconfont"]} />}
                {!editorState.isBottom && <ArrowDownOutlined onClick={() => changeIndex(1)} className={style["fd-iconfont"]} />}
              </div>
              <div className={style["sev-tools-copy"]}>
                <CopyOutlined onClick={copyComponent} className={style["fd-iconfont"]} />
              </div>
              <div className={style["sev-tools-copy"]}>
                <DeleteOutlined onClick={() => deleteComponent()} className={style["fd-iconfont"]} />
              </div>
            </div >
          </div >
          {/*<div className={style.flag}/>*/}
        </div >

        <div className={style["form-container-main"]}>
          <FormConfig />
        </div >
      </div >
    </div >
  )
}

export default memo(Edit)