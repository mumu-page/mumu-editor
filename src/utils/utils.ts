import {cloneDeep} from "lodash";
import {PageConfig} from "@/store/edit/state";

export const clone = (obj: any) => {
  return cloneDeep(obj);
}

export const postMsgToChild = (msg: any) => {
  window.frames[0] && window.frames[0].postMessage(msg, '*');
}

export function deepCopy(value: any) {
  return JSON.parse(JSON.stringify(value))
}

export const mergeConfig = (origin: PageConfig, target: PageConfig) => {
  if (!origin.components || !origin.components.length) return target;
  return {
    ...(origin || {}),
    ...(target || {}),
    userSelectComponents: target.userSelectComponents.map((co: { name: any; props: any; }) => {
      const originCo = origin.components.filter((oco: { name: any; }) => oco.name === co.name)[0];
      if (originCo) {
        return {
          ...co,
          props: {
            ...originCo.data || {},
            ...co.props,
          },
          schema: originCo.schema
        }
      }
      return co;
    }),
    components: target.components.map((co: { name: any; props: any; }) => {
      const originCo = origin.components.filter((oco: { name: any; }) => oco.name === co.name)[0];
      if (originCo) {
        return {
          ...co,
          props: {
            ...originCo.data || {},
            ...co.props,
          },
          schema: originCo.schema
        }
      }
      return co;
    }),
    page: {
      ...target.page,
      props: {
        ...(origin.page && origin.page.props || {}),
        ...(target.page && target.page.props || {}),
      },
      schema: (origin.page && origin.page.schema) || (target.page && target.page.schema) || {},
    }
  };
}
