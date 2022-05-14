import {mergeConfig} from "@/utils/utils";
import {PayloadAction} from "@reduxjs/toolkit";
import {EditState} from "../state";

interface ReturnConfigPayload {
  targetConfig: any
  pageData?: any
  releaseStatus?: any
  commonComponents?: any
}

/**
 * 更新配置, 向子页面通知再回来更新太慢了！！！
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