import {clone, mergeConfig} from "@/utils/utils";
import {PayloadAction} from "@reduxjs/toolkit";
import {Component, EditState, RemoteComponent} from "../state";
import {history} from "@/utils/history";
import dayjs from "dayjs";

interface ReturnConfigPayload {
  targetConfig: any
  pageData?: any
  releaseStatus?: any
  commonComponents?: any
}

/**
 * 更新配置
 * @param state
 * @param action
 */
export function returnConfig(state: EditState, action: PayloadAction<ReturnConfigPayload>) {
  const {targetConfig, pageData, releaseStatus, commonComponents} = action.payload
  // 保存页面初始值
  if (!state.defaultConfig && !releaseStatus) {
    state.defaultConfig = JSON.parse(JSON.stringify(targetConfig))
  }
  // 如果有用户操作，则重置发布状态
  if (
    !releaseStatus &&
    (JSON.stringify(targetConfig.userSelectComponents) !== JSON.stringify(state.pageConfig.userSelectComponents) ||
      JSON.stringify(targetConfig.page) !== JSON.stringify(state.pageConfig.page))
  ) {
    state.uiConfig = {
      ...state.uiConfig,
      releaseStatus: {
        'test': [0, 0, 0],
        'pre-release': [0, 0, 0],
        'master': [0, 0, 0]
      }
    }
  }
  // 页面级别的配置，比如 title 之类的
  targetConfig.page = targetConfig.page || {schema: {}, props: {}};
  // merge 页面配置信息
  state.pageConfig = {
    remoteComponents: [],
    ...state.pageConfig,
    ...mergeConfig(state.defaultConfig, targetConfig)
  }
  // 确定当前修改的是哪个组件
  const currentIndex = targetConfig.currentIndex || 0;
  state.currentIndex = currentIndex
  // 如果 currentIndex = -1 表示是编辑页面配置，比如 title
  // 此时不需要对组件进行修改
  if (currentIndex === -1) {
    state.editConfig = {
      ...state.editConfig,
      currentComponent: {
        currentComponentSchema: state.pageConfig.page,
        component: state.pageConfig.page,
        type: '__page',
      }
    }
  } else {
    // 组件修改
    let component = state.pageConfig.userSelectComponents[currentIndex];
    if (component) {
      let currentComponentSchema: RemoteComponent | Component | undefined = state.pageConfig.components.filter((c: any) => c.name === component.name)?.[0];
      // 远程组件
      if (component.name === 'mumu-remote-component-loader') {
        if (state.pageConfig.remoteComponents?.length) {
          currentComponentSchema = state.pageConfig.remoteComponents.filter((c: any) => `${c.name}` === `${component.config.name}`)?.[0];
        }
      }
      // 当前修改项，用于 form-render
      state.editConfig = {
        ...state.editConfig,
        currentComponent: {
          currentComponentSchema,
          component,
        }
      }
    }
  }

  // 项目初始化时为空项目，所以不需要进行编辑记录
  // 父子页面通信也会经过这里，所以只需要关注 新增、组件点击、组件属性改变、组件顺序、组件复制、删除
  if (history.actionType) {
    history.push({
      ...state.pageConfig,
      actionType: history.actionType,
      createTime: dayjs().format('YYYY-MM-DD hh:mm:ss')
    })
  }
  state.uiConfig = {
    ...state.uiConfig,
    pageData: pageData || state.uiConfig.pageData,  // 设置页面信息
    releaseStatus: releaseStatus || state.uiConfig.releaseStatus,  // 设置页面发布状态
    commonComponents: commonComponents || state.uiConfig.commonComponents,  // 设置远程组件列表
  }

  // 设置当前选择组件
  state.editConfig = {
    ...state.editConfig,
    currentIndex
  }
}