import { Schema } from "form-render";

export interface RemoteComponent {
  config: Record<string, any>
  js: string
  css: string
  schema: Record<string, any>
  name: string
  version: string
}

export interface PageConfig {
  remoteComponents: RemoteComponent[];
  userSelectComponents: any[]
  components: any[]
  config: Record<string, any>
  page: any
}

export interface CurrentComponentSchema {
  schema: Schema
}

export interface CurrentComponent {
  component: any;
  currentComponentSchema: CurrentComponentSchema;
  type?: any;
}

export interface EditConfig {
  componentConfig: Record<string, any>
  currentIndex: null | number | string
  currentComponent: CurrentComponent
}

export interface ReleaseStatus {
  test: [number, number, number]
  'pre-release': [number, number, number]
  master: [number, number, number]
}

export interface UIConfig {
  commonComponents: any[] // 远程组件列表
  showEdit: boolean
  releaseStatus: ReleaseStatus
  showRelease: boolean
  pageData: Record<string, any> // 页面数据
  dragStart: boolean
}

export interface EditState {
  currentIndex: number | null;
  pageConfig: PageConfig;
  editConfig: EditConfig
  uiConfig: UIConfig
  defaultConfig: any
  isSave: boolean
}

export const initialEditState: EditState = {
  currentIndex: null,
  pageConfig: {
    remoteComponents: [],
    userSelectComponents: [],
    components: [],
    config: {}, // 模板信息
    page: {}, // 页面样式&全局配置
  },

  editConfig: {
    componentConfig: {},
    currentIndex: null,
    currentComponent: {
      component: null,
      type: null,
      currentComponentSchema: { schema: {} }
    },
  },

  uiConfig: {
    commonComponents: [], // 远程组件列表
    showEdit: true,
    releaseStatus: {
      'test': [0, 0, 0],
      'pre-release': [0, 0, 0],
      'master': [0, 0, 0]
    },
    showRelease: false,
    pageData: {}, // 页面数据
    dragStart: false,
  },

  defaultConfig: null,
  isSave: true,
}

