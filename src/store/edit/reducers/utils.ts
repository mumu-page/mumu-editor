import { Component, EditState } from "@/store/edit/state";
import { REMOTE_COMPONENT_LOADER_NAME } from "@/constants";
import { Schema } from "form-render";
import { get } from "lodash";

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