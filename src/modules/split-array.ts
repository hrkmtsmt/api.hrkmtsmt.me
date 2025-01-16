import { produce, Draft } from 'immer';

export const splitArray = <T extends any[]>(array: T, limit: number): T[] => {
  return array.reduce<T[]>((acc, cur) => {
    const latest = acc.at(-1);

    if (!latest) {
      return produce(acc, (draft) => {
        draft.push([cur] as Draft<T>);
      });
    }

    if (latest.length === limit) {
      return produce(acc, (draft) => {
        draft.push([cur] as Draft<T>);
      });
    }

    return produce(acc, (draft) => {
      draft[draft.length - 1]?.push(cur);
    });
  }, []);
};
