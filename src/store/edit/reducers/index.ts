import { postMsgToChild } from "@/utils/utils";
import { PayloadAction } from "@reduxjs/toolkit";
import { EditState } from "../state";
import { returnConfig } from "./returnConfig";

function setIsSave(state: EditState, action: PayloadAction<boolean>) {
  state.isSave = action.payload;
}

function addComponent(state: EditState, action: PayloadAction<any>) {
  const { data, index } = action.payload
  postMsgToChild({ type: 'addComponent', data: JSON.parse(JSON.stringify({ data, index })) });
}

function changeProps(state: EditState, action: PayloadAction<any>) {
  postMsgToChild({type: 'changeProps', data: action.payload});
}

function setDragStart(state: EditState, action: PayloadAction<any>) {
  const {ev, v, data} = action.payload
  state.uiConfig.dragStart = v;
  if (data) {
    ev.dataTransfer.setData("text/plain", JSON.stringify(data));
  }
}

const reducers = {
  returnConfig,
  setIsSave,
  addComponent,
  setDragStart,
  changeProps
}

export default reducers