import {Component, EditState, RemoteComponent} from "@/store/edit/state";
import {REMOTE_COMPONENT_LOADER_NAME} from "@/constants";
export function handleCurrentComponent(state: EditState, currentIndex: number) {
  console.log('currentIndex', currentIndex)
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
      if (component.name === REMOTE_COMPONENT_LOADER_NAME) {
        if (state.pageConfig.remoteComponents?.length) {
          currentComponentSchema = state.pageConfig.remoteComponents.filter((c: any) => `${c.name}` === `${component.config.name}`)?.[0];
        }
      }
      console.log('currentComponentSchema', Object.values(currentComponentSchema).forEach(item => console.log(item)))
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