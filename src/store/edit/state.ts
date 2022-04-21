export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    saveState: "saved" | "dirty" | "saving";
}

export interface PageConfig {
    userSelectComponents: any[]
    components: any[]
    config: Record<string, any>
    page: Record<string, any>
}

export interface EditConfig {
    componentConfig: Record<string, any>
    currentIndex: null | number | string
    currentComponent: any
}

export interface UIConfig {
    commonComponents: any[] // 远程组件列表
    showEdit: boolean
    releaseStatus: string
    showRelease: boolean
    pageData: Record<string, any> // 页面数据
    dragStart: boolean
}

export interface EditState {
    pageConfig: PageConfig;
    editConfig: EditConfig
    uiConfig: UIConfig
    defaultConfig: any
    isSave: boolean
}

export const initialEditState: EditState = {
    pageConfig: {
        userSelectComponents: [],
        components: [],
        config: {}, // 模板信息
        page: {}, // 页面样式&全局配置
    },

    editConfig: {
        componentConfig: {},
        currentIndex: null,
        currentComponent: null,
    },

    uiConfig: {
        commonComponents: [], // 远程组件列表
        showEdit: true,
        releaseStatus: '',
        showRelease: false,
        pageData: {}, // 页面数据
        dragStart: false,
    },

    defaultConfig: null,
    isSave: true,
}

