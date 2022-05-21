import { Component, EditState } from "@/store/edit/state";
import { REMOTE_COMPONENT_LOADER_NAME } from "@/constants";
import { Schema } from "form-render";
import { get } from "lodash";

export function handleCurrentComponent({
  state,
  layer = [],
  index,
  isChild = false
}: {
  state: EditState,
  layer?: number[],
  index: number,
  isChild?: boolean | undefined
}) {
  // 没有组件选中，进行页面修改
  if (!isChild && index === -1) {
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
  // 选中的组件
  let selectComponent: Component
  if (isChild) {
    let path = layer.toString().replace(/,/, '.children.')
    selectComponent = get(state.pageConfig.userSelectComponents, path);
  } else {
    selectComponent = state.pageConfig.userSelectComponents[index]
  }
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

export function getComponentById(userSelectComponents: Component[], id: string, isChild = false, parentIndex = -1, layer: number[] = []): {
  element: Component,
  index: number,
  isChild: boolean,
  parentIndex?: number,
  layer?: number[],
} | { index: -1, element: undefined, isChild: undefined, parentIndex: undefined, layer: undefined } {
  for (let index = 0; index < userSelectComponents.length; index++) {
    const element = userSelectComponents[index];
    if (element.children) {
      const ret = getComponentById(element.children, id, true, index, [...layer, index])
      // 在子项中找到了就返回就行
      if (ret.index !== -1) return ret
    }
    if (element.id === id) {
      return { element, index, isChild, parentIndex, layer: [...layer, index] }
    }

  }
  return { index: -1, element: undefined, isChild: undefined, parentIndex: undefined, layer: undefined }
}