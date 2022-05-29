import React, { memo, useEffect, useState } from 'react'
import FormRender, { useForm } from 'form-render';
import Title from '@/components/Title';
import MMCollapse from '@/components/Collapse';
import classNames from "classnames";
import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Typography } from "antd";
import { Component, CurrentComponent } from '@/store/edit/state';
import imageInput from './mapping/imageInput';
import style from "./index.module.less";
import { postMsgToChild } from '@/utils/utils';
import { CHANGE_PROPS, SET_CURRENTCOMPONENT } from '@/constants';
import { useEditState } from '@/store';
import { merge, isEqual } from 'lodash';

interface FormConfigProps {
  currentComponent: CurrentComponent
}

const maxHeightStyle = { maxHeight: 'calc(100vh - 48px - 50px - 30px)' }

function FormConfig(props: FormConfigProps) {
  const { currentComponent = {} } = props
  const form = useForm();
  const [isAffix, setAffix] = useState(false)
  const [hide, setHide] = useState(false)
  const edit = useEditState()
  const { component, currentComponentSchema, type, layer = [] } = currentComponent;

  const onValuesChange = (_changedValues: any, formData: any) => {
    postMsgToChild({
      type: CHANGE_PROPS, data: {
        type,
        props: formData
      }
    })
  }

  const onMount = () => {
    if (component?.props.home) {
      form.setValues(edit.pageConfig.page)
    } else {
      form.setValues(component?.props)
    }
  }

  useEffect(() => {
    if (component?.props.home) {
      form.setValues(edit.pageConfig.page)
    }
  }, [component?.props.home])

  useEffect(() => {
    if (!component?.props) return
    form.setValues(component?.props)
  }, [component?.props])

  const watch = {
    'children': (val: any) => {
      // 排除初次加载长度是1的情况
      if (!val || val?.length === 1 || val?.length === 6) return
      if (isEqual(val, component?.props.children)) return
      postMsgToChild({
        type: CHANGE_PROPS, data: {
          type,
          props: { ...component?.props, children: merge(val, component?.props.children) }
        }
      })
    },
  };

  const onClick = (item: (Component & { index: number })) => {
    postMsgToChild({ type: SET_CURRENTCOMPONENT, data: { currentId: item.id } })
  }

  return (
    <>
      <div className={classNames({ [style["form-menu"]]: true, [style.hide]: hide, [style.affix]: isAffix })}>
        <Title
          title={'属性配置'}
          isAffix={isAffix}
          onClose={() => setHide(true)}
          onFixed={() => setAffix(!isAffix)}
        />
        <div className={style.breadcrumb}>
          {
            layer.length ? <Breadcrumb>
              {layer.map(item => <Breadcrumb.Item>
                <Typography.Link onClick={() => onClick(item)}>{item.props.home ? <HomeOutlined /> : item.description}</Typography.Link>
              </Breadcrumb.Item>)}
            </Breadcrumb> : <Breadcrumb>正在进行页面修改</Breadcrumb>
          }
        </div>
        <MMCollapse
          className={style.scroll}
          customStyle={maxHeightStyle}
          options={[
            {
              key: '1',
              title: layer.length ? '组件属性' : '页面属性',
              node: currentComponentSchema && Object.keys(currentComponentSchema).length ?
                <FormRender
                  watch={watch}
                  labelWidth={90}
                  displayType={'row'}
                  className={style.formRender}
                  onMount={onMount}
                  form={form} removeHiddenData
                  schema={currentComponentSchema || {}}
                  onValuesChange={onValuesChange}
                  mapping={{ image: 'imageInput' }}
                  widgets={{ imageInput }}
                /> : null
            },
          ]} />
      </div>
      {hide && <Button
        size={'large'}
        onClick={() => setHide(false)}
        className={style['setting-icon']}
        icon={<SettingOutlined />} />}
    </>
  )
}

export default memo(FormConfig)