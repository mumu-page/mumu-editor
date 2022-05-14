import {PayloadAction} from "@reduxjs/toolkit";
import {EditState} from "../state";
import {returnConfig} from "./returnConfig";
import component from "./component";
import {setCurrentComponent} from "@/store/edit";
import {handleCurrentComponent} from "@/store/edit/reducers/utils";

function reset(state: EditState) {
  state.pageConfig.userSelectComponents = []
  state.currentIndex = -1
}

function setDragStart(state: EditState, action: PayloadAction<any>) {
  state.uiConfig.dragStart = action.payload
}

function onRemoteComponentLoad(state: EditState, action: PayloadAction<any>) {
  state.containerElementId = action.payload.containerElementId
  state.pageConfig.remoteComponents?.push(action.payload)
}

/**
 * 来自子页面模板的组件列表加载，如果是初始页面则设置给父页面
 * @param state
 * @param action
 */
function onLoad(state: EditState, action: PayloadAction<any>) {
  state.containerElementId = `#${action.payload.containerElementId}`
  // 判断父页面是否已经拿到数据
  if(state.pageConfig.userSelectComponents.length) return
  if(state.pageConfig.components.length) return
  state.pageConfig.userSelectComponents = action.payload.components
  state.pageConfig.components = action.payload.components
}

const reducers = {
  returnConfig,
  setDragStart,
  reset,
  onRemoteComponentLoad,
  onLoad,
  ...component
}

export default reducers