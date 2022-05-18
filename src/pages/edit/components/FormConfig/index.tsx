import React, { memo, useEffect, useState } from 'react'
import FormRender, { useForm } from 'form-render';
import { useStore } from 'react-redux';
import { RootStore, useEditState } from '@/store';
import { changeProps } from '@/store/edit';
import Title from '@/components/Title';
import Collapse from '@/components/Collapse';
import classNames from "classnames";
import { SettingOutlined } from "@ant-design/icons";
import { Button, Empty } from "antd";
import { CurrentComponent } from '@/store/edit/state';
import style from "./index.module.less";

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
    form.setValues(component?.props)
  }, [component?.props])

  return (
    <>
      <div className={classNames({ [style["form-menu"]]: true, [style.hide]: hide, [style.affix]: isAffix })}>
        <Title
          title={'属性配置'}
          isAffix={isAffix}
          onClose={() => setHide(true)}
          onFixed={() => setAffix(!isAffix)}
        />
        {!currentComponentSchema && <div className={style.empty}><Empty /></div>}
        <Collapse options={[
          {
            key: '1',
            title: '字段属性',
            node: <FormRender
              labelWidth={90}
              displayType={'row'}
              className={style.formRender}
              onMount={onMount}
              form={form} removeHiddenData
              schema={currentComponentSchema || {}}
              onValuesChange={onValuesChange}
            />
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