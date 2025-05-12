import beginWork from "./ReactBeginWork";
import completeWork from "./ReactFiberCompleteWork";
import commitWorker from "./ReactFiberCommitWork";
import schedulerCallback from "../scheduler/Scheduler";

let wip = null;
let wipRoot = null;

// function scheduleUpdateOnFiber(fiber) {
//   wip = fiber
//   wipRoot = fiber

//   requestIdleCallback(workLoop)
// }

/**
 * 进行fiber节点的调度工作
 * @param {*} fiber
 */
function scheduleUpdateOnFiber(fiber) {
  wip = fiber;
  wipRoot = fiber;
  schedulerCallback(workLoop);
}

/**
 * 判断是否还有剩余事件处理下一个fiber节点
 * @param {*} time
 */
// function workLoop(deadline) {
//   while(wip && deadline.timeRemaining() > 0) {
//     performUnitofWork()
//   }

//   if(!wip) {
//     commitRoot()
//   }
// }

function workLoop(time) {
  while (wip) {
    if (time < 0) return false;
    performUnitOfWork();
  }

  if (!wip && wipRoot) {
    commitRoot();
  }
}

/**
 * 处理一个 fiber 节点
 * 1. 处理当前的 fiber 节点
 * 2. 通过深度遍历 生成子 fiber 节点
 * 3. 提交副作用
 * 4. 进行渲染
 */
function performUnitOfWork() {
  beginWork(wip);

  if (wip.child) {
    wip = wip.child;
    return;
  }
  completeWork(wip);

  let next = wip;
  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
    completeWork(next);
  }
  wip = null;
}

function commitRoot() {
  commitWorker(wipRoot);
  wipRoot = null;
}

export default scheduleUpdateOnFiber;
