import React, {memo, useEffect} from 'react'
import {Header, Shape, Tool} from '@/components'
import {Input, message, Spin} from "antd";
import {
  SettingOutlined,
  UndoOutlined,
  RedoOutlined,
  SaveOutlined,
  EyeOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import {component, project} from "@/api";
import {Link, useSearchParams} from "react-router-dom";
import style from './index.module.less'
import ComponentSelect from './components/ComponentSelect';
import {useStore} from 'react-redux';
import {RootStore} from '@/store';
import {useEditor} from './hooks';
import {clone, postMsgToChild} from '@/utils/utils';
import {returnConfig} from '@/store/edit';
import FormConfig from './components/FormConfig';
import {history} from '@/utils/history';
import {CHANGE_INDEX, COPY_COMPONENT, DELETE_COMPONENT, GET_CONFIG, SET_CONFIG, SORT_COMPONENT} from '@/constants';
import IconFont from '@/components/IconFont';

function Edit() {
  const {getState, dispatch} = useStore<RootStore>();
  const {edit: editState} = getState()
  const {editorState, eventInit, setFrameLoaded, setUrl, setSpinning, current} = useEditor();
  const [params] = useSearchParams()

  const getPageSchema = () => {
  }
  const changeProjectName = () => {
  }
  const rollback = () => {
    history.undo()
    postMsgToChild({type: SET_CONFIG, data: clone(history.currentValue || '{}')})
  }
  const next = () => {
    history.redo()
    postMsgToChild({type: SET_CONFIG, data: clone(history.currentValue || '{}')})
  }
  const saveConfig = () => {
    project.save({
      id: params.get('id'),
      pageConfig: editState.pageConfig
    }).then(res => {
      message.success(res.message).then()
    })
  }
  const setPreview = () => {
    window.open(`/mumu-editor/build/index.html?isPreview=true&pageId=${params.get('id')}&env=development`)
  }
  const setRelease = () => {
    project.release({id: params.get('id')}).then(res => {
      if (res?.success) {
        message.success('发布成功').then()
      } else {
        message.error('发布失败').then()
      }
    })
  }

  const initConfig = () => {
    setFrameLoaded(true)
    eventInit((index) => {
      postMsgToChild({type: 'changeIndex', data: index});
    });
    // if (typeof editState?.editConfig?.currentIndex === 'number') {
    //   init(editState.editConfig.currentIndex);
    // }
    setSpinning(false)
    // 初始化页面
    postMsgToChild({type: GET_CONFIG});
    if (editState.pageConfig.components.length) {
      // 编辑
      let data = JSON.parse(JSON.stringify(editState.pageConfig))
      postMsgToChild({type: 'setConfig', data})
    }
    postMsgToChild({type: CHANGE_INDEX, data: editState.editConfig.currentIndex})
  }

  const changeIndex = (_type: 'up' | 'down') => {
    history.actionType = '移动组件'
    postMsgToChild({type: SORT_COMPONENT, data: {op: current, index: editorState.current}});
  }

  const copyComponent = () => {
    history.actionType = '复制组件'
    postMsgToChild({type: COPY_COMPONENT, data: current});
  }

  const deleteComponent = (index?: undefined | number) => {
    history.actionType = '删除组件'
    postMsgToChild({type: DELETE_COMPONENT, data: index !== undefined ? index : editorState.current});
  }

  useEffect(() => {
    Promise.all([
      project.query({id: params.get('id')}),
      component.query({})
    ]).then(([result, componentRes]) => {
      const targetConfig = result[0].pageConfig;
      setUrl(`/mumu-editor/build/index.html?isEdit=true`)
      dispatch(returnConfig({
        targetConfig,
        pageData: result[0],
        releaseStatus: result[0].releaseInfo,
        commonComponents: componentRes?.[0]?.config,
      }));
    });
  }, [])

  return (
    <div>
      <Header
        className={style['edit-menu']}
        pageTitle={<>
          <div className={style["page-title"]}>
            <SettingOutlined onClick={getPageSchema} style={{"marginRight": "10px", "cursor": "pointer"}}/>
            <Input
              className={style["title-content"]}
              value={editState.pageConfig.config.projectName}
              onInput={changeProjectName}/>
          </div>
        </>}
        menus={[
          {
            key: 'lp-simulator-pane',
            style: {marginRight: 20},
            children: [
              {
                key: 'pc',
                label: <IconFont type='icon-PCtaishiji'/>,
              },
              {
                key: 'iPad',
                label: <IconFont type='icon-iPad'/>,
              },
              {
                key: 'shouji',
                label: <IconFont type='icon-shouji'/>,
              },
            ]
          },
          {
            key: 'input',
            isBtn: false,
            style: {marginRight: 110, width: 120},
            label: <Input style={{}} addonAfter="px"/>,
          },
          {
            key: 'radio',
            children: [
              {
                key: 'rollback',
                label: <><UndoOutlined/></>,
                onClick: rollback
              },
              {
                key: 'next',
                label: <><RedoOutlined/></>,
                onClick: next
              },
              {
                key: 'saveConfig',
                label: <><SaveOutlined/></>,
                onClick: saveConfig
              },
            ]
          },
          {
            key: 'setPreview',
            label: <><EyeOutlined/></>,
            onClick: setPreview,
          },
          {
            key: 'setRelease',
            label: <><IconFont type='icon-publish1'/></>,
            onClick: setRelease,
            type: 'primary'
          },
          {
            key: 'dashboard',
            label: <Link to="/dashboard"><DashboardOutlined /></Link>,
          }
        ]}
      />

      <div className={style['edit-container']}>
        <div className={style["component-container"]}>
          <ComponentSelect/>
        </div>
        <div className={style["editor-view"]}>
          <div className={style["main-container"]}>
            <div className={style["preview-container"]}>
              <Spin spinning={editorState.spinning} wrapperClassName={style.loading}>
                <iframe
                  title='模板页面'
                  cross-origin="true"
                  onLoad={initConfig}
                  id="frame"
                  frameBorder={0}
                  className={style["pre-view"]}
                  src={editorState.url}
                />
              </Spin>
              <Shape tool={
                <Tool
                  isTop={editorState.isTop}
                  isBottom={editorState.isBottom}
                  height={editorState.toolStyle.height}
                  onMove={(type) => changeIndex(type)}
                  onCopy={() => copyComponent()}
                  onDel={() => deleteComponent()}
                />
              }/>
            </div>
          </div>
        </div>
        <div className={style["form-container-main"]}>
          <FormConfig/>
        </div>
      </div>
    </div>
  )
}

export default memo(Edit)