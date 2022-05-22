import { Component, EditState } from "@/store/edit/state";
import { PayloadAction } from "@reduxjs/toolkit";
import { set } from "lodash";
import { getComponentById, handleCurrentComponent } from "./utils";
import { COMPONENT_ELEMENT_ITEM_ID_PREFIX, GLOBAL_COMPONENT_TYPE_NAME, REMOTE_COMPONENT_LOADER_NAME } from "@/constants";
import { message } from "antd";
import { deepCopy, uuid } from "@/utils/utils";
import { history } from "@/utils/history";

function addComponent(state: EditState, action: PayloadAction<any>) {
  const { data, currentId, dragId, type } = action.payload
  state.currentId = dragId
  let newComponent: Component
  if (data.type === GLOBAL_COMPONENT_TYPE_NAME) {
    newComponent = {
      schema: data.schema,
      name: REMOTE_COMPONENT_LOADER_NAME,
      id: dragId,
      props: data.props,
      config: data
    }
  } else {
    newComponent = {
      name: data.name,
      props: data.props,
      id: dragId,
      schema: data.schema,
    }
  }
  const { index = 0, isChild, layer = [] } = getComponentById(state.pageConfig.userSelectComponents, currentId) || {}

  if (isChild) {
    let path = layer.toString().replace(/,/, '.children.')
    set(state.pageConfig.userSelectComponents, path, newComponent)
    return
  }
  if (state.pageConfig.userSelectComponents.length) {
    state.pageConfig.userSelectComponents.splice(type === 'top' ? index : index + 1, 0, newComponent)
  } else {
    state.pageConfig.userSelectComponents = [newComponent]
  }
  history.push({
    ...state.pageConfig,
    actionType: '新增组件',
  })
}

function changeProps(state: EditState, action: PayloadAction<any>) {
  const { type } = action.payload
  if (type === '__page') {

  } else {
    if (!(typeof state.currentId === 'number' && state.currentId >= 0)) return
    state.pageConfig.userSelectComponents[state.currentId]['props'] = action.payload
  }
  history.push({
    ...state.pageConfig,
    actionType: '更新属性',
  })
}

function deleteComponent(state: EditState, action: PayloadAction<any>) {
  const { currentId, nextId } = action.payload
  // 暂时不让全部删除
  if (state.pageConfig.userSelectComponents.length === 1) {
    message.info(`这是最后一个啦，不能再删啦～`).then()
    return
  }
  const { index } = getComponentById(state.pageConfig.userSelectComponents, currentId) || {}
  if (!index) return
  state.pageConfig.userSelectComponents.splice(index, 1);
  state.currentId = nextId
  history.push({
    ...state.pageConfig,
    actionType: '删除组件',
  })
}

function sortComponent(state: EditState, action: PayloadAction<any>) {
  const { currentId, nextId } = action.payload
  const { index } = getComponentById(state.pageConfig.userSelectComponents, currentId) || {}
  const { index: next } = getComponentById(state.pageConfig.userSelectComponents, nextId) || {}
  if (!index || !next) return
  const tem = state.pageConfig.userSelectComponents[next]
  state.pageConfig.userSelectComponents.splice(next, 1, state.pageConfig.userSelectComponents[index])
  state.pageConfig.userSelectComponents.splice(index, 1, tem)
  state.currentId = nextId
  history.push({
    ...state.pageConfig,
    actionType: '移动组件',
  })
}

function copyComponent(state: EditState, action: PayloadAction<any>) {
  const { currentId, nextId } = action.payload
  const { index } = getComponentById(state.pageConfig.userSelectComponents, currentId) || {}
  if (!index) return
  const newComponent = deepCopy(state.pageConfig.userSelectComponents[index])
  newComponent.id = `${COMPONENT_ELEMENT_ITEM_ID_PREFIX}${uuid()}`
  state.pageConfig.userSelectComponents.splice(index, 0, newComponent)
  state.currentId = nextId
  history.push({
    ...state.pageConfig,
    actionType: '复制组件',
  })
}

function setCurrentComponent(state: EditState, action: PayloadAction<any>) {
  const { currentId } = action.payload
  state.currentId = currentId
  const { index, isChild, layer = [] } = getComponentById(state.pageConfig.userSelectComponents, currentId) || {}
  handleCurrentComponent({ state, layer, isChild, index })
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

