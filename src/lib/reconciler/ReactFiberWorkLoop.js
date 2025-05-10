import beginWork from "./ReactBeginWork"
import completeWork from "./ReactFiberCompleteWork"
import commitWorker from "./ReactFiberCommitWork"

let wip = null
let wipRoot = null

function scheduleUpdateOnFiber(fiber) {
  wip = fiber
  wipRoot = fiber

  requestIdleCallback(workLoop)
}

/**
 * 判断是否还有剩余事件处理下一个fiber节点
 * @param {*} deadline 
 */
function workLoop(deadline) {
  while(wip && deadline.timeRemaining() > 0) {
    performUnitofWork()
  }

  if(!wip) {
    commitRoot()
  }
}

/**
 * 处理一个 fiber 节点
 * 1. 处理当前的 fiber 节点 
 * 2. 通过深度遍历 生成子 fiber 节点
 * 3. 提交副作用
 * 4. 进行渲染
 */
function performUnitofWork() {
  beginWork(wip)

  if(wip.child) {
    wip = wip.child
    return
  }
  completeWork(wip)

  let next = wip
  while(next) {
    if(next.sibling) {
      wip = next.sibling
      return
    }
    next = next.return
    completeWork(next)
  }
  wip = null
}

function commitRoot() {
  commitWorker(wipRoot)
  wip = null;
}

export default scheduleUpdateOnFiber