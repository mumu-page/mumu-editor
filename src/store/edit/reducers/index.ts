import {clone, postMsgToChild} from "@/utils/utils";
import {PayloadAction} from "@reduxjs/toolkit";
import {EditState} from "../state";
import {returnConfig} from "./returnConfig";
import {RESET, ADD_COMPONENT, CHANGE_PROPS} from "@/constants";

function setIsSave(state: EditState, action: PayloadAction<boolean>) {
  state.isSave = action.payload;
}

function reset(state: EditState) {
  state.pageConfig.userSelectComponents = []
  state.currentIndex = -1
  postMsgToChild({
    type: RESET, data: clone({
      userSelectComponents: [], currentIndex: -1, page: state.pageConfig.page
    })
  });
}

function addComponent(state: EditState, action: PayloadAction<any>) {
  const {data, index} = action.payload
  postMsgToChild({type: ADD_COMPONENT, data: JSON.parse(JSON.stringify({data, index}))});
}

function changeProps(state: EditState, action: PayloadAction<any>) {
  postMsgToChild({type: CHANGE_PROPS, data: action.payload});
}

function setDragStart(state: EditState, action: PayloadAction<any>) {
  state.uiConfig.dragStart = action.payload
}

const reducers = {
  returnConfig,
  setIsSave,
  addComponent,
  setDragStart,
  changeProps,
  reset
}

export default reducers