import React, { memo, useEffect } from 'react'
import { Header } from '@/components'
import { message, Slider, Spin, Typography } from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  SaveOutlined,
  EyeOutlined,
  DashboardOutlined,
  ClearOutlined
} from "@ant-design/icons";
import { component, project } from "@/api";
import { Link, useSearchParams } from "react-router-dom";
import ComponentSelect from './components/ComponentSelect';
import { useDiapatch, useEditState } from '@/store';
import { useEditor } from './hooks';
import { reset, returnConfig, setCurrentComponent } from '@/store/edit';
import FormConfig from './components/FormConfig';
import { history } from '@/utils/history';
import IconFont from '@/components/IconFont';
import style from './index.module.less'

function Edit() {
  const dispatch = useDiapatch();
  const editState = useEditState()
  const { editorState, setFrameLoaded, setUrl, setSpinning } = useEditor();
  const [params] = useSearchParams()

  const getPageSchema = () => {
  }
  const changeProjectName = () => {
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
    window.open(`/mumu-editor/build/index.html?isPreview=true&pageId=${params.get('id')}&env=development`)
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
    history.push({
      ...editState.pageConfig,
      actionType: '初始化',
    })
    dispatch(setCurrentComponent({ currentIndex: 0 }))
    setSpinning(false)
  }

  useEffect(() => {
    Promise.all([
      project.query({ id: params.get('id') }),
      component.query({})
    ]).then(([result, componentRes]) => {
      const targetConfig = result[0].pageConfig || {};
      setUrl(`/mumu-editor/build/index.html?isEdit=true`)
      dispatch(returnConfig({
        targetConfig: {
          ...targetConfig,
          page: targetConfig.config // 兼容
        },
        pageData: result[0],
        // releaseStatus: {}, // result[0].releaseInfo,
        commonComponents: componentRes?.map((item: { description: any; config: any; }) => ({
          groupName: item?.description,
          components: item?.config
        }))
      }));
    });
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
            children: [
              {
                key: 'rollback',
                label: <><UndoOutlined /></>,
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
            key: 'setPreview',
            label: <><EyeOutlined /></>,
            onClick: setPreview,
          },
          {
            key: 'setRelease',
            label: <><IconFont type='icon-publish1' /></>,
            onClick: setRelease,
            type: 'primary'
          },
          {
            key: 'dashboard',
            label: <Link to="/dashboard"><DashboardOutlined /></Link>,
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