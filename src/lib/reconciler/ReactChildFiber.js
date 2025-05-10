import { isArray, isStr } from '../shared/utils'
import createFiber from './ReactFiber'

/**
 *
 * @param {*} returnFiber
 * @param {*} children 子节点的 vnode 数组
 */
export function reconcilerChildren(returnFiber, children) {
  if (isStr(children)) return

  const newChildren = isArray(children)
    ? children
    : [...children]
  let prevFiber = null // 上一个 fiber 对象
  let oldFiber = returnFiber.alternate?.child //
  let i = 0 // children 数组的索引
  let lastPlacedIndex = null // 上一次 DOM 节点插入的最远位置
  let shouldTrackSideEffects = !!returnFiber.alternate

  // 第一轮遍历，复用节点
  for (; oldFiber && i < newChildren.length; i++) {}

  // 从上面 if 出来有两种情况
  // oldFiber 为 null 初次渲染
  // i === newChildren.length 为更新
  if(i === newChildren.length) {}
  // 初次渲染
  if (!oldFiber) {
    // 将 fiber 节点连接起来
    for (; i < newChildren.length; i++) {
      const newChildVnode = newChildren[i]

      const newFibe = createFiber(newChildVnode, returnFiber)
      // 更新 lastPlacedIndex
      lastPlacedIndex = placedIndex(
        newFibe,
        lastPlacedIndex,
        i,
        shouldTrackSideEffects
      )
      // 将 fiber 加入到 fiber 链表里面
      if (prevFiber === null) {
        returnFiber.child = newFibe
      } else {
        prevFiber.sibling = newFibe
      }
      prevFiber = newFibe
    }
  }
}

function placedIndex(
  newFiber,
  lastPlacedIndex,
  newIndex,
  shouldTrackSideEffects
) {
  newFiber.index = newIndex

  if (!shouldTrackSideEffects) {
    return lastPlacedIndex
  }
}
