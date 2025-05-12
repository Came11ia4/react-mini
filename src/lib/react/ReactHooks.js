/**
 * hook 其实是一个对象，里面存储了一些数据
 * { memorizedState: xxx, next: xxx}
 *
 */

import scheduleUpdateOnFiber from "../reconciler/ReactFiberWorkLoop";

let currentHook = null;
let workInProgressHook = null;
let currentRenderFiber = null;

/**
 * 该方法的作用主要就是返回一个 hook 对象
 * 并且让workInProgressHook指向 hook链表 最后一个hook
 */
function updateWorkInProgressHook() {
  let hook = null;
  const current = currentRenderFiber.alternate;
  if (current) {
    // 非初次渲染
    currentRenderFiber.memorizedState = current.memorizedState;
    console.log("rerender", workInProgressHook, currentRenderFiber);
    if (workInProgressHook) {
      workInProgressHook = hook = workInProgressHook.next;
      currentHook = currentHook.next;
    } else {
      workInProgressHook = hook = currentRenderFiber.memorizedState;
      currentHook = current.memorizedState;
    }
    console.log("[]", workInProgressHook, currentRenderFiber);
  } else {
    // 初次渲染
    hook = {
      memorizedState: null,
      next: null,
    };
    // 将新hook插入到hook链表末尾
    if (workInProgressHook) {
      // 已存在hook链表
      workInProgressHook = workInProgressHook.next = hook;
    } else {
      // 还没有hook链表
      workInProgressHook = currentRenderFiber.memorizedState = hook;
    }
  }
  return hook;
}

/**
 * 根据传入的reducer计算出最新状态，然后处理一下fiber
 * @param {*} fiber
 * @param {*} hook
 * @param {*} reducer 如果没有传入，说明时useState，
 * @param {*} action 传入的状态就是最终状态，不需要计算
 */
function dispatchReducerAction(fiber, hook, reducer, action) {
  hook.memorizedState = reducer ? reducer(hook.memorizedState) : action;
  // 计算完成后 该fiber节点就会变成旧fiber
  console.log(hook.memorizedState);
  fiber.alternate = { ...fiber };
  // 设置兄弟节点状态为null
  // 1. 更新隔离机制,确保本次更新仅处理当前fiber节点和其子节点，避免触发兄弟节点的更新流程
  // 2. 协调过程控制,确保新旧节点的diff正确对比
  fiber.sibling = null;
  scheduleUpdateOnFiber(fiber);
}

/**
 * 初始化 hooks 状态
 * @param {*} wip fiberRoot
 */
export function renderWithHooks(wip) {
  currentRenderFiber = wip;
  currentRenderFiber.memorizedState = null;
  workInProgressHook = null;
  currentRenderFiber.updateQueue = [];
}

export function useState(initialState) {
  return useReducer(null, initialState);
}

export function useReducer(reducer, initialState) {
  const hook = updateWorkInProgressHook();
  // 初次渲染
  if (!currentRenderFiber.alternate) {
    hook.memorizedState = initialState;
  }

  const dispatch = dispatchReducerAction.bind(
    null,
    currentRenderFiber,
    hook,
    reducer
  );

  return [hook.memorizedState, dispatch];
}
