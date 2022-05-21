import React, { memo, useEffect, useState } from 'react'
import FormRender, { useForm } from 'form-render';
import { useStore } from 'react-redux';
import { RootStore } from '@/store';
import { changeProps } from '@/store/edit';
import Title from '@/components/Title';
import MMCollapse from '@/components/Collapse';
import classNames from "classnames";
import { SettingOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { CurrentComponent } from '@/store/edit/state';
import style from "./index.module.less";
import imageInput from './mapping/imageInput';

interface FormConfigProps {
  currentComponent: CurrentComponent
}

function FormConfig(props: FormConfigProps) {
  const { currentComponent } = props
  const form = useForm();
  const [isAffix, setAffix] = useState(false)
  const [hide, setHide] = useState(false)
  const { dispatch } = useStore<RootStore>();
  const { component, currentComponentSchema, type } = currentComponent;

  const onValuesChange = (_changedValues: any, formData: any) => {
    dispatch(changeProps({ ...formData, type }))
  }

  const onMount = () => {
    form.setValues(component?.props)
  }

  useEffect(() => {
    if (!component?.props) return
    form.setValues(component?.props)
  }, [component?.props])

  const watch = {
    '#': (val: any) => {
      if (Object.keys(val).length) dispatch(changeProps({ ...JSON.parse(JSON.stringify(val)), type }))
    },
  };

  return (
    <>
      <div className={classNames({ [style["form-menu"]]: true, [style.hide]: hide, [style.affix]: isAffix })}>
        <Title
          title={'属性配置'}
          isAffix={isAffix}
          onClose={() => setHide(true)}
          onFixed={() => setAffix(!isAffix)}
        />
        <MMCollapse
          className={style.scroll}
          options={[
            {
              key: '1',
              title: '组件属性',
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