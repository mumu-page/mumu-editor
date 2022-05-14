import {PayloadAction} from "@reduxjs/toolkit";
import {EditState} from "../state";
import {returnConfig} from "./returnConfig";
import component from "./component";

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

function onLoad(state: EditState, action: PayloadAction<any>) {
  state.containerElementId = `#${action.payload.containerElementId}`
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