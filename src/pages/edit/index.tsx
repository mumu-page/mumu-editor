import React, {memo, useEffect} from 'react'
import {Header, Shape, Tool} from '@/components'
import {Input, message, Slider, Spin, Typography} from "antd";
import {
  SettingOutlined,
  UndoOutlined,
  RedoOutlined,
  SaveOutlined,
  EyeOutlined,
  DashboardOutlined,
  ClearOutlined
} from "@ant-design/icons";
import {component, project} from "@/api";
import {Link, useSearchParams} from "react-router-dom";
import style from './index.module.less'
import ComponentSelect from './components/ComponentSelect';
import {useStore} from 'react-redux';
import {RootStore} from '@/store';
import {useEditor} from './hooks';
import {clone, postMsgToChild} from '@/utils/utils';
import {reset, returnConfig} from '@/store/edit';
import FormConfig from './components/FormConfig';
import {history} from '@/utils/history';
import {
  CHANGE_INDEX,
  COPY_COMPONENT,
  DELETE_COMPONENT,
  GET_CONFIG,
  RESET,
  SET_CONFIG,
  SORT_COMPONENT
} from '@/constants';
import IconFont from '@/components/IconFont';

function Edit() {
  const {getState, dispatch} = useStore<RootStore>();
  const {edit: editState} = getState()
  const {
    editorState,
    eventInit,
    setFrameLoaded,
    setUrl,
    setSpinning,
    computedShapeAndToolStyle,
    staticData
  } = useEditor();
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
  const clearConfig = () => {
    dispatch(reset())
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
      postMsgToChild({type: CHANGE_INDEX, data: index});
    });
    setSpinning(false)
    // 初始化页面
    postMsgToChild({type: GET_CONFIG});
    postMsgToChild({type: SET_CONFIG, data: clone(editState.pageConfig)})
    postMsgToChild({type: CHANGE_INDEX, data: editState.editConfig.currentIndex})
  }

  const changeIndex = (type: 'up' | 'down') => {
    history.actionType = '移动组件'
    postMsgToChild({type: SORT_COMPONENT, data: {op: type === 'up' ? -1 : 1, index: staticData.current.current}});
    computedShapeAndToolStyle()
  }

  const copyComponent = () => {
    history.actionType = '复制组件'
    postMsgToChild({type: COPY_COMPONENT, data: staticData.current.current});
    staticData.current.current = staticData.current.current + 1
    computedShapeAndToolStyle()
  }

  const deleteComponent = () => {
    history.actionType = '删除组件'
    postMsgToChild({type: DELETE_COMPONENT, data: staticData.current.current});
    staticData.current.current = staticData.current.current -1 < 0 ? 0 : staticData.current.current - 1
    computedShapeAndToolStyle()
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
            <Typography.Title
              style={{margin: 0}}
              editable={{
                maxLength: 12,
                autoSize: {maxRows: 1},
                onChange: changeProjectName
              }}
              level={5}
              onClick={getPageSchema}>
              {editState.pageConfig.config.projectName}
            </Typography.Title>
          </div>
        </>}
        menus={[
          {
            key: 'input',
            isBtn: false,
            style: {marginRight: 110, width: 200},
            label: <Slider
              max={1920}
              min={750}
              tipFormatter={value => `${value}px`}
              defaultValue={750}
              marks={{
              750: <IconFont type='icon-shouji'/>,
              1300: <IconFont type='icon-iPad'/>,
              1920: <IconFont type='icon-PCtaishiji'/>,
            }}/>,
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
              {
                key: 'clearConfig',
                label: <><ClearOutlined/></>,
                onClick: clearConfig
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
            label: <Link to="/dashboard"><DashboardOutlined/></Link>,
          }
        ]}
      />

      <div className={style['edit-container']}>
        <div className={style["component-container"]}>
          <ComponentSelect/>
        </div>
        <div className={style["editor-view"]}>
          <div className={style["main-container"]}>
            <div className={style["preview-container"]} id={'preview-container'}>
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