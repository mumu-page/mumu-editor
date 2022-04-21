export const clone = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
}

export const postMsgToChild = (msg: any) => {
  window.frames[0] && window.frames[0].postMessage(msg, '*');
}

export function deepCopy(value: any) {
  return JSON.parse(JSON.stringify(value))
}

export const mergeConfig = (origin: { components: any[]; page: { props: any; schema: any; }; }, target: { userSelectComponents: any[]; components: any[]; page: { props: any; schema: any; }; }) => {
  if (!origin.components || !origin.components.length) return target;
  const mergeResult = {
    ...(origin || {}),
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
  return mergeResult;
}
