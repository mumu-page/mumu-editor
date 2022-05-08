import React, {useState} from 'react'
import FormRender, {useForm, Error} from 'form-render';
import style from "./index.module.less";
import {useStore} from 'react-redux';
import {RootStore} from '@/store';
import {changeProps} from '@/store/edit';
import Title from '@/components/Title';
import Collapse from '@/components/Collapse';
import classNames from "classnames";
import {SettingOutlined} from "@ant-design/icons";
import {Button} from "antd";

interface FormConfigProps {
}

function FormConfig(props: FormConfigProps) {
  const form = useForm();
  const [isAffix, setAffix] = useState(false)
  const [hide, setHide] = useState(false)
  const {getState, dispatch} = useStore<RootStore>();
  const state = getState()
  const editState = state.edit
  const currentComponent = editState.editConfig.currentComponent
  const {component, currentComponentSchema, type} = currentComponent;
  const globalProps = component?.props;

  const onFinish = (formData: any, errors: Error[]) => {
    console.log('formData:', formData, 'errors', errors);
  };

  const onValuesChange = (_changedValues: any, formData: any) => {
    dispatch(changeProps({...formData, type}))
  }

  const onMount = () => {
    form.setValues(globalProps)
  }

  return (
    <>
      <div className={classNames({[style["form-menu"]]: true, [style.hide]: hide, [style.affix]: isAffix})}>
        <Title
          onClose={() => {
            setHide(true)
          }}
          onFixed={() => {
            setAffix(!isAffix)
          }}
          title='属性配置'/>
        <Collapse options={[
          {
            key: '1',
            title: '字段属性',
            node: <FormRender
              labelWidth={90}
              displayType={'row'}
              className={style['form-render']}
              onMount={onMount}
              form={form} removeHiddenData
              schema={currentComponentSchema.schema}
              onValuesChange={onValuesChange}
              onFinish={onFinish}/>
          },
        ]}/>
      </div>
      {hide && <Button
        size={'large'}
        onClick={() => {
          setHide(false)
        }}
        className={style['setting-icon']}
        icon={<SettingOutlined/>}/>}
    </>
  )
}

export default FormConfig