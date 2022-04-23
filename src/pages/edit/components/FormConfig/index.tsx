import React from 'react'
import FormRender, { useForm, Error } from 'form-render';
import style from "./index.module.less";
import { useStore } from 'react-redux';
import { RootStore } from '@/store';
import { changeProps } from '@/store/edit';
import Title from '@/components/Title';

interface FormConfigProps {
}

function FormConfig(props: FormConfigProps) {
  const form = useForm();
  const { getState, dispatch } = useStore<RootStore>();
  const state = getState()
  const editState = state.edit
  const currentComponent = editState.editConfig.currentComponent
  const { component, currentComponentSchema, type } = currentComponent;
  const globalProps = component?.props;

  const onFinish = (formData: any, errors: Error[]) => {
    console.log('formData:', formData, 'errors', errors);
  };

  const onValuesChange = (_changedValues: any, formData: any) => {
    dispatch(changeProps({ ...formData, type }))
  }

  const onMount = () => {
    form.setValues(globalProps)
  }

  return (
    <div className={style["form-menu"]}>
      <Title title='属性配置' />
      <FormRender onMount={onMount} form={form} schema={currentComponentSchema.schema} onValuesChange={onValuesChange} onFinish={onFinish} />
    </div>
  )
}

export default FormConfig