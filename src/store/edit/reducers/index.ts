import { PayloadAction } from "@reduxjs/toolkit";
import { Component, EditState } from "../state";
import { returnConfig } from "./returnConfig";
import component from "./component";
import { handleCurrentComponent } from "@/store/edit/reducers/utils";
import { COMPONENT_ELEMENT_ITEM_ID_PREFIX, ON_GRID_ADD_ROW, ON_GRID_DROP } from "@/constants";
import { uniqueId } from "lodash";

function reset(state: EditState) {
  state.pageConfig.userSelectComponents = []
  state.currentIndex = -1
}

function setDragStart(state: EditState, action: PayloadAction<any>) {
  state.uiConfig.dragStart = action.payload
}

function onRemoteComponentLoad(state: EditState, action: PayloadAction<any>) {
  state.pageConfig.remoteComponents?.push(action.payload)
}

/**
 * 来自子页面模板的组件列表加载，如果是初始页面则设置给父页面
 * @param state
 * @param action
 */
function onLoad(state: EditState, action: PayloadAction<any>) {
  // 判断父页面是否已经拿到数据
  if (state.pageConfig.userSelectComponents.length || state.pageConfig.components.length) return
  state.pageConfig.userSelectComponents = action.payload.components
  state.pageConfig.components = action.payload.components
  state.currentIndex = 0
  handleCurrentComponent(state, 0)
}

function onEvent(state: EditState, action: PayloadAction<any>) {
  const { id, type, data } = action.payload
  if (type === ON_GRID_ADD_ROW) {
    if (!(typeof state.currentIndex === 'number' && state.currentIndex >= 0)) return
    const _rowCount = state.pageConfig.userSelectComponents[state.currentIndex].props.rowCount
    if (typeof _rowCount !== 'number') return
    const _nextRowCount = _rowCount + 1
    state.pageConfig.userSelectComponents[state.currentIndex].props.rowCount = _nextRowCount
    if (state.editConfig.currentComponent.component?.props) {
      state.editConfig.currentComponent.component.props.rowCount = _nextRowCount
    }
  }
  if (type === ON_GRID_DROP) {
    console.log({ id, type, data });
    const { index, dragData } = data
    const findComponent = state.pageConfig.userSelectComponents.filter(item => item.id === id)?.[0]
    if (!findComponent) return
    const { rowCount, colCount } = findComponent.props || {}
    const children: Component[] = Array.isArray(findComponent.children) ? findComponent.children : []
    if (!children.length) {
      Array(+rowCount * +colCount).fill(1).forEach(() => {
        children.push({
          name: 'grid-placeholder',
          id: `${COMPONENT_ELEMENT_ITEM_ID_PREFIX}${uniqueId()}`,
          props: {},
          schema: {},
        })
      })
    }
    try {
      const _dragData = JSON.parse(dragData)
      _dragData.id = `${COMPONENT_ELEMENT_ITEM_ID_PREFIX}${uniqueId()}`
      children[index] = _dragData
      findComponent.children = children
    } catch (error) {
      console.log(error);
    }
  }
}

const reducers = {
  returnConfig,
  setDragStart,
  reset,
  onRemoteComponentLoad,
  onLoad,
  onEvent,
  ...component
}

export default reducers