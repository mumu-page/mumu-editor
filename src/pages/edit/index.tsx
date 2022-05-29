import React, { memo, useEffect } from 'react'
import { Header } from '@/components'
import { message, Slider, Spin, Typography } from "antd";
import {
  RedoOutlined,
  SaveOutlined,
  EyeOutlined,
  ClearOutlined,
  RollbackOutlined,
  LeftCircleOutlined
} from "@ant-design/icons";
import { component, project } from "@/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import ComponentSelect from './components/ComponentSelect';
import { useDiapatch, useEditState } from '@/store';
import { useEditor } from './hooks';
import { changePage, reset, returnConfig } from '@/store/edit';
import FormConfig from './components/FormConfig';
import { history } from '@/utils/history';
import IconFont from '@/components/IconFont';
import style from './index.module.less'
import { postMsgToChild } from '@/utils/utils';
import { SET_IFRAME_COMPONENTS } from '@/constants';


let fn: (() => void) | null = function () { }

function Edit() {
  const dispatch = useDiapatch();
  const editState = useEditState()
  const { editorState, setFrameLoaded, setUrl, setSpinning } = useEditor();
  const [params] = useSearchParams()
  const navigate = useNavigate();

  const getPageSchema = () => {
  }
  const changeProjectName = (projectName: string) => {
    dispatch(changePage({ projectName }))
  }
  const rollback = () => {
    history.undo()
  }
  const next = () => {
    history.redo()
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
    window.open(`/mumu-editor/build/index.html?isPreview=true&pageId=${params.get('id')}&env=production`)
  }
  const setRelease = () => {
    project.release({ id: params.get('id') }).then(res => {
      if (res?.success) {
        message.success('发布成功').then()
      } else {
        message.error('发布失败').then()
      }
    })
  }

  const onIframeLoaded = () => {
    setFrameLoaded(true)
    setSpinning(false)
    setTimeout(() => {
      fn?.()
    })
  }

  useEffect(() => {
    Promise.all([
      project.query({ id: params.get('id') }),
      component.query({})
    ]).then(([result, componentRes]) => {
      const targetConfig = result[0].pageConfig || {};
      setUrl(`/mumu-editor/build/index.html?isEdit=true`)
      dispatch(returnConfig({
        isLoad: true,
        targetConfig,
        pageData: result[0],
        // releaseStatus: {}, // result[0].releaseInfo,
        commonComponents: componentRes?.map((item: { description: any; config: any; }) => ({
          groupName: item?.description,
          components: item?.config
        }))
      }));
      fn = () => postMsgToChild({
        type: SET_IFRAME_COMPONENTS,
        data: { components: targetConfig.userSelectComponents, projectName: targetConfig.page?.projectName }
      })
      history.push({
        ...targetConfig,
        actionType: '初始化',
      })
    });
    return () => {
      fn = null
    }
  }, [])

  return (
    <div>
      <Header
        className={style.editMenu}
        pageTitle={<>
          <div className={style.pageTitle}>
            <Typography.Title
              style={{ margin: 0 }}
              editable={{
                maxLength: 12,
                autoSize: { maxRows: 1 },
                onChange: changeProjectName
              }}
              level={5}
              onClick={getPageSchema}>
              {editState.pageConfig.page.projectName}
            </Typography.Title>
          </div>
        </>}
        menus={[
          {
            key: 'input',
            isBtn: false,
            style: { marginRight: 110, width: 200 },
            label: <Slider
              max={1920}
              min={750}
              tipFormatter={value => `${value}px`}
              defaultValue={750}
              marks={{
                750: <IconFont type='icon-shouji' />,
                1300: <IconFont type='icon-iPad' />,
                1920: <IconFont type='icon-PCtaishiji' />,
              }} />,
          },
          {
            key: 'radio',
            style: { marginRight: 15 },
            children: [
              {
                key: 'rollback',
                label: <><RollbackOutlined /></>,
                onClick: rollback
              },
              {
                key: 'next',
                label: <><RedoOutlined /></>,
                onClick: next
              },
              {
                key: 'saveConfig',
                label: <><SaveOutlined /></>,
                onClick: saveConfig
              },
              {
                key: 'clearConfig',
                label: <><ClearOutlined /></>,
                onClick: clearConfig
              },
            ]
          },
          {
            key: 'dashboard', isBtn: true,
            icon: <LeftCircleOutlined />,
            label: '返回',
            onClick: () => {
              navigate('/dashboard')
            }
          },
          {
            key: 'setPreview',
            isBtn: true,
            icon: <EyeOutlined />,
            label: '预览',
            onClick: setPreview,
          },
          {
            key: 'setRelease', isBtn: true,
            icon: <IconFont type='icon-publish1' />,
            label: '发布',
            onClick: setRelease,
            type: 'primary'
          }
        ]}
      />
      <div className={style.editContainer}>
        <div className={style["component-container"]}>
          <ComponentSelect
            components={editState.pageConfig.components}
            commonComponents={editState.uiConfig.commonComponents} />
        </div>
        <div className={style["editor-view"]}>
          <div className={style["main-container"]}>
            <div className={style["preview-container"]} id={'preview-container'}>
              <Spin spinning={editorState.spinning} wrapperClassName={style.loading}>
                <iframe
                  title='模板页面'
                  cross-origin="true"
                  onLoad={onIframeLoaded}
                  id="frame"
                  className={style.preView}
                  frameBorder={0}
                  src={editorState.url}
                />
              </Spin>
            </div>
          </div>
        </div>
        <div className={style["form-container-main"]}>
          <FormConfig currentComponent={editState.editConfig.currentComponent} />
        </div>
      </div>
    </div>
  )
}

export default memo(Edit)