import createFiber from '../reconciler/ReactFiber'
import scheduleUpdateOnFiber from '../reconciler/ReactFiberWorkLoop'

/**
 *
 * @param {*} element vnode 节点
 * @param {*} returnFiber 容器的 DOM 节点
 */
function updateContainer(element, container) {
  const fiber = createFiber(element, {
    type: container.nodeName.toLowerCase(),
    stateNode: container,
  })
  
  scheduleUpdateOnFiber(fiber)
}

class ReactDOMRoot {
  constructor(container) {
    this._internalRoot = container
  }
  /**
   *
   * @param {*} children 传入一个vnode
   */
  render(children) {
    console.log(children)
    updateContainer(children, this._internalRoot)
  }
}

const ReactDOM = {
  /**
   *
   * @param {*} container 传入一个根节点
   * @returns 返回一个带有 render 方法的对象
   */
  createRoot(container) {
    return new ReactDOMRoot(container)
  },
}

export default ReactDOM
