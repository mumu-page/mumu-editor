import {EditState} from "@/store/edit/state";
import {REMOTE_COMPONENT_LOADER_NAME} from "@/constants";

export function handleCurrentComponent(state: EditState, currentIndex: number) {
  if (currentIndex === -1) {
    state.editConfig = {
      ...state.editConfig,
      currentComponent: {
        currentComponentSchema: state.pageConfig.page.schema,
        component: undefined,
        type: '__page',
      }
    }
  } else {
    // 组件修改
    let component = state.pageConfig.userSelectComponents[currentIndex];
    if (component) {
      const _component = state.pageConfig.components.filter((c: any) => c.name === component.name)?.[0]
      let currentComponentSchema = _component.schema;
      // 远程组件
      if (component.name === REMOTE_COMPONENT_LOADER_NAME) {
        if (state.pageConfig.remoteComponents?.length) {
          const _component = state.pageConfig.remoteComponents.filter((c: any) => `${c.name}` === `${component?.config?.name}`)?.[0]
          currentComponentSchema = _component.schema;
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
}