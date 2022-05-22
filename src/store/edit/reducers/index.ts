import { PayloadAction } from "@reduxjs/toolkit";
import { Component, CurrentComponent, EditState } from "../state";
import { returnConfig } from "./returnConfig";
import { CHANGE_PROPS, COMPONENT_ELEMENT_ITEM_ID_PREFIX, ON_GRID_ADD_ROW, ON_GRID_DROP, ON_GRID_LAYOUT_CHANGE } from "@/constants";
import { postMsgToChild, uuid } from "@/utils/utils";
import { history } from "@/utils/history";

function reset(state: EditState) {
  state.pageConfig.userSelectComponents = []
  state.currentId = null
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
function onLoad(state: EditState, action: PayloadAction<{ components: Component[], currentId: string }>) {
  // 判断父页面是否已经拿到数据
  // if (state.pageConfig.userSelectComponents.length || state.pageConfig.components.length) return
  state.pageConfig.userSelectComponents = action.payload.components
  state.pageConfig.components = action.payload.components
  state.currentId = action.payload.currentId
}

function setConfig(state: EditState, action: PayloadAction<{ components: Component[], currentId: string, currentComponent: CurrentComponent }>) {
  state.pageConfig.userSelectComponents = action.payload.components
  state.currentId = action.payload.currentId
  state.editConfig.currentComponent = action.payload.currentComponent
}

function onEvent(state: EditState, action: PayloadAction<any>) {
  const { id, type, data } = action.payload
  if (type === ON_GRID_ADD_ROW) {
    if (!(typeof state.currentId === 'number' && state.currentId >= 0)) return
    const _rowCount = state.pageConfig.userSelectComponents[state.currentId].props.rowCount
    if (typeof _rowCount !== 'number') return
    const _nextRowCount = _rowCount + 1
    state.pageConfig.userSelectComponents[state.currentId].props.rowCount = _nextRowCount
    if (state.editConfig.currentComponent.component?.props) {
      state.editConfig.currentComponent.component.props.rowCount = _nextRowCount
    }
  }
  if (type === ON_GRID_DROP) {
    const { index, dragData } = data
    const findComponent = state.pageConfig.userSelectComponents.filter(item => item.id === id)?.[0]
    if (!findComponent) return
    const { rowCount, colCount } = findComponent.props || {}
    const children: Component[] = Array.isArray(findComponent.children) ? findComponent.children : []
    if (!children.length) {
      Array(+rowCount * +colCount).fill(1).forEach(() => {
        children.push({
          name: 'grid-placeholder',
          id: `${COMPONENT_ELEMENT_ITEM_ID_PREFIX}${uuid()}`,
          props: {},
          schema: {},
        })
      })
    }
    try {
      const _dragData = JSON.parse(dragData)
      _dragData.id = `${COMPONENT_ELEMENT_ITEM_ID_PREFIX}${uuid()}`
      children[index] = _dragData
      findComponent.children = children
    } catch (error) {
      console.log(error);
    }
  }
  if (type === ON_GRID_LAYOUT_CHANGE) {
    const { layout, index } = data
    if (typeof index !== 'number') return
    state.pageConfig.userSelectComponents[index].props.layout = layout
  }
}

function changeProps(state: EditState, action: PayloadAction<any>) {
  const { type } = action.payload
  if (type === '__page') {

  } else {
    if (!(typeof state.currentId === 'number' && state.currentId >= 0)) return
    state.pageConfig.userSelectComponents[state.currentId]['props'] = action.payload
  }
  postMsgToChild({ type: CHANGE_PROPS, data: { type, props: action.payload } })
  history.push({
    ...state.pageConfig,
    actionType: '更新属性',
  })
}

const reducers = {
  returnConfig,
  setDragStart,
  reset,
  onRemoteComponentLoad,
  onLoad,
  onEvent,
  setConfig,
  changeProps,
}

export default reducers