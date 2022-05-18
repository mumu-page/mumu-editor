import { Component, EditState } from "@/store/edit/state";
import { REMOTE_COMPONENT_LOADER_NAME } from "@/constants";
import { Schema } from "form-render";

export function handleCurrentComponent(state: EditState, currentIndex: number) {
  // 页面修改
  if (currentIndex === -1) {
    state.editConfig = {
      ...state.editConfig,
      currentComponent: {
        currentComponentSchema: state.pageConfig.page?.schema,
        component: undefined,
        type: '__page',
      }
    }
    return
  }
  // 组件修改
  let selectComponent = state.pageConfig.userSelectComponents[currentIndex];
  if (!selectComponent) return
  let currentComponentSchema: Schema = {}
  // 远程组件
  if (selectComponent.name === REMOTE_COMPONENT_LOADER_NAME) {
    const _component = state.pageConfig.remoteComponents?.filter((c: any) => `${c.name}` === `${selectComponent?.config?.name}`)?.[0]
    currentComponentSchema = _component?.schema || {};
  } else {
    const _component = state.pageConfig.components.filter((c: any) => c.name === selectComponent.name)?.[0]
    currentComponentSchema = _component?.schema;
  }
  // 当前修改项，用于 form-render
  state.editConfig = {
    ...state.editConfig,
    currentComponent: {
      currentComponentSchema,
      component: selectComponent,
    }
  }
}

