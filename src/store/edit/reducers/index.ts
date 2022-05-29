import { PayloadAction } from "@reduxjs/toolkit";
import { Component, CurrentComponent, EditState, PageConfig } from "../state";
import { returnConfig } from "./returnConfig";
import { history, HistoryItem } from "@/utils/history";

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
  if (state.pageConfig.userSelectComponents.length || state.pageConfig.components.length) return
  state.pageConfig.userSelectComponents = action.payload.components
  state.pageConfig.components = action.payload.components
  state.currentId = action.payload.currentId
  history.push({
    ...state.pageConfig,
    actionType: '初始化',
  })
}

function setConfig(state: EditState, action: PayloadAction<{
  components: Component[],
  currentId: string,
  currentComponent: CurrentComponent,
  history: PageConfig & HistoryItem
}>) {
  if (!state.isLoad) return
  state.pageConfig.userSelectComponents = action.payload.components
  state.currentId = action.payload.currentId
  state.editConfig.currentComponent = action.payload.currentComponent
  history.push(action.payload.history)
}

function onEvent(state: EditState, action: PayloadAction<any>) {

}

function changePage(state: EditState, action: PayloadAction<any>) {
  state.pageConfig.page.projectName = action.payload.projectName
}

const reducers = {
  returnConfig,
  setDragStart,
  reset,
  onRemoteComponentLoad,
  onLoad,
  onEvent,
  setConfig,
  changePage
}

export default reducers