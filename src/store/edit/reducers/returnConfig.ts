import { mergeConfig } from "@/utils/utils";
import { PayloadAction } from "@reduxjs/toolkit";
import { EditState } from "../state";

interface ReturnConfigPlayload {
  targetConfig: any
  pageData?: any
  releaseStatus?: any
  commonComponents?: any
  save?: boolean
}

/**
 * 
 * @param param0 
 * @param param1 
 */
export function returnConfig(state: EditState, action: PayloadAction<ReturnConfigPlayload>) {
  const { targetConfig, pageData, releaseStatus, commonComponents, save = true, } = action.payload
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
  targetConfig.page = targetConfig.page || { schema: {}, props: {} };
  // merge 页面配置信息
  state.pageConfig = {
    ...state.pageConfig,
    ...mergeConfig(state.defaultConfig, targetConfig)
  }
  // 确定当前修改的是哪个组件
  const currentIndex = targetConfig.currentIndex || 0;
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
      let currentComponentSchema = state.pageConfig.components.filter((c) => c.name === component.name)[0];
      // 远程组件
      if (component && component.name === 'mumu-remote-components-loader') {
        if (state.pageConfig.remoteComponents && state.pageConfig.remoteComponents.length) {
          currentComponentSchema = state.pageConfig.remoteComponents.filter((c: { name: any; version: any; }) => `${c.name}_${c.version}` === component.config.name)[0];
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
  // 父子页面通信也会经过这里，所以只需要关注 拖拽、组件点击、组件属性改变、组件顺序、组件复制、删除
  // 上述方案通过[isSave]控制
  if (save && state.currentIndex !== null && state.isSave) {
    if (state.pageConfig.userSelectComponents.length) {
      // historyState.push(state.pageConfig)
      // console.log('historyState 22222', historyState)
    }
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