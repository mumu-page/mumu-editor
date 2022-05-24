import { Schema } from "form-render";

export interface RemoteComponent {
  config: Record<string, any>
  js: string
  css: string
  schema: Schema
  props: Record<string, any>
  name: string
  version: string
  id: string
}

export interface Component {
  id: string
  name: string
  description?: string
  snapshot?: string
  props: Record<string, any>
  schema: Schema
  config?: RemoteComponent
  children?: Component[]
}

export interface PageConfig {
  remoteComponents?: RemoteComponent[];
  userSelectComponents: Component[]
  components: Component[]
  page: {
    projectName: string
    schema: Schema
    props: Record<string, any>
  }
}

export interface CurrentComponent {
  component?: Component;
  currentComponentSchema?: Schema;
  type?: string;
  layer?: (Component & { index: number })[]
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

export interface CommonComponents {
  groupName?: string // 远程组件分组名称
  components?: RemoteComponent[] // 远程组件列表
}

export interface UIConfig {
  commonComponents: CommonComponents[]
  showEdit: boolean
  releaseStatus: ReleaseStatus
  showRelease: boolean
  pageData: Record<string, any> // 页面数据
  dragStart: boolean
}

export interface EditState {
  currentId: string | null;
  pageConfig: PageConfig;
  editConfig: EditConfig
  uiConfig: UIConfig
  defaultConfig: any
}

export const initialEditState: EditState = {
  currentId: null,
  pageConfig: {
    remoteComponents: [],
    userSelectComponents: [],
    components: [],
    page: {
      projectName: '模板页面',
      schema: {},
      props: {},
    }, // 页面样式&全局配置
  },

  editConfig: {
    componentConfig: {},
    currentIndex: null,
    currentComponent: {
      component: undefined,
      type: undefined,
      currentComponentSchema: {}
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
}

