import {Component, EditState} from "@/store/edit/state";
import {PayloadAction} from "@reduxjs/toolkit";
import {uniqueId} from "lodash";
import {handleCurrentComponent} from "@/store/edit/reducers/utils";
import {COMPONENT_ELEMENT_ITEM_ID_PREFIX, GLOBAL_COMPONENT_TYPE_NAME, REMOTE_COMPONENT_LOADER_NAME} from "@/constants";
import {message} from "antd";
import {deepCopy} from "@/utils/utils";
import {history} from "@/utils/history";

/** 历史记录包括： 新增、组件点击、组件属性改变、组件顺序、组件复制、删除 */

function addComponent(state: EditState, action: PayloadAction<any>) {
  const {data, index} = action.payload
  state.currentIndex = index ? index + 1 : index
  let newComponent: Component
  if (data.type === GLOBAL_COMPONENT_TYPE_NAME) {
    // 远程组件的props和data从组件包中动态获取，不在这里设置
    newComponent = {
      schema: {},
      name: REMOTE_COMPONENT_LOADER_NAME,
      id: `${COMPONENT_ELEMENT_ITEM_ID_PREFIX}${uniqueId()}`,
      props: data.data,
      config: data
    }
  } else {
    newComponent = {
      name: data.name,
      props: data.data,
      id: `${COMPONENT_ELEMENT_ITEM_ID_PREFIX}${uniqueId()}`,
      schema: {},
    }
  }
  if (state.pageConfig.userSelectComponents.length) {
    state.pageConfig.userSelectComponents.splice(index, 0, newComponent)
  } else {
    state.pageConfig.userSelectComponents = [newComponent]
  }
  history.push({
    ...state.pageConfig,
    actionType: '新增组件',
  })
}

function changeProps(state: EditState, action: PayloadAction<any>) {
  const {type} = action.payload
  if (type === '__page') {

  } else {
    if (!(typeof state.currentIndex === 'number' && state.currentIndex >= 0)) return
    state.pageConfig.userSelectComponents[state.currentIndex]['props'] = action.payload
  }
  history.push({
    ...state.pageConfig,
    actionType: '更新属性',
  })
}

function deleteComponent(state: EditState, action: PayloadAction<any>) {
  const index = action.payload
  // 暂时不让全部删除
  if (state.pageConfig.userSelectComponents.length === 1) {
    message.info(`这是最后一个啦，不能再删啦～`).then()
    return
  }
  state.pageConfig.userSelectComponents.splice(index, 1);
  state.currentIndex = index - 1 < 0 ? 0 : index - 1
  history.push({
    ...state.pageConfig,
    actionType: '删除组件',
  })
}

function sortComponent(state: EditState, action: PayloadAction<any>) {
  const {index, next} = action.payload
  const tem = state.pageConfig.userSelectComponents[next]
  state.pageConfig.userSelectComponents.splice(next, 1, state.pageConfig.userSelectComponents[index])
  state.pageConfig.userSelectComponents.splice(index, 1, tem)
  state.currentIndex = next
  history.push({
    ...state.pageConfig,
    actionType: '移动组件',
  })
}

function copyComponent(state: EditState, action: PayloadAction<any>) {
  const {index} = action.payload
  const newComponent = deepCopy(state.pageConfig.userSelectComponents[index])
  newComponent.id = `${COMPONENT_ELEMENT_ITEM_ID_PREFIX}${uniqueId()}`
  state.pageConfig.userSelectComponents.splice(index, 0, newComponent)
  state.currentIndex = index + 1
  history.push({
    ...state.pageConfig,
    actionType: '复制组件',
  })
}

function setCurrentComponent(state: EditState, action: PayloadAction<any>) {
  const {currentIndex} = action.payload
  state.currentIndex = currentIndex
  handleCurrentComponent(state, currentIndex)
  history.push({
    ...state.pageConfig,
    actionType: '选中组件',
  })
}

const reducers = {
  addComponent,
  changeProps,
  deleteComponent,
  sortComponent,
  copyComponent,
  setCurrentComponent,
}

export default reducers

