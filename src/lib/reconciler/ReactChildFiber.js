import { Update, isArray, isStrOrNum } from '../shared/utils'
import createFiber from './ReactFiber'
import {
  deleteChild,
  placedIndex,
  sameNode,
  updatePreviousFiber,
  mapRemainingChildren,
  deleteRemainingChildren,
} from './ReactChildFiberAssisant'

/**
 *
 * @param {*} returnFiber
 * @param {*} children 子节点的 vnode 数组
 */
export function reconcilerChildren(returnFiber, children) {
  if (isStrOrNum(children)) return

  // 新的 vnode 节点
  const newChildren = isArray(children) ? children : [children]
  let prevFiber = null // 上一个 fiber 对象
  let oldFiber = returnFiber.alternate?.child // 上一个fiber对应的旧的子节点
  let i = 0 // children 数组的索引
  let lastPlacedIndex = 0 // 上一次 DOM 节点插入的最远位置
  let shouldTrackSideEffects = !!returnFiber.alternate // 是否要追踪父节点的副作用
  let nextOldFiber = null // 存储当前的旧fiber 或 存储下一个旧fiber

  /**
   * diff 核心思路：
   * 1. 从左到右进行第一轮遍历
   * 同层比较 新vnode 和 旧fiber 是否可以复用，可以复用继续
   * 不能复用则跳出循环
   * 2. 检查newChildren是否遍历完成，存在两种情况
   * 由于第一轮遍历不能复用而中途退出
   * newChildren遍历完，还有多余的旧fiber，删除多余的旧fiber
   * 3. 初次渲染，当旧节点遍历完，还有剩余的新节点时，也属于初次渲染
   * 4. 新旧节点都有剩余情况
   * 5. 删除多余的旧节点
   */

  // 第一轮遍历，复用节点
  for (; oldFiber && i < newChildren.length; i++) {
    const newChildVNode = newChildren[i]
    if (newChildVNode === null) continue

    if (oldFiber.index > i) {
      nextOldFiber = oldFiber
      oldFiber = null
    } else {
      nextOldFiber = oldFiber.sibling
    }

    const same = sameNode(newChildVNode, oldFiber)
    // 不能复用
    if (!same) {
      // 记录当前的索引
      if (oldFiber === null) {
        oldFiber = nextOldFiber
      }
      break
    }
    // 可以复用
    const newFiber = createFiber(newChildVNode, returnFiber)
    Object.assign(newFiber, {
      stateNode: oldFiber.stateNode,
      alternate: oldFiber,
      flag: Update,
    })

    lastPlacedIndex = placedIndex(
      newFiber,
      lastPlacedIndex,
      i,
      shouldTrackSideEffects
    )
    // 将新fiber插入fiber链表
    prevFiber = updatePreviousFiber(prevFiber, newFiber, returnFiber)
    oldFiber = nextOldFiber
  }

  // 从上面 if 出来有两种情况
  // oldFiber 为 null 初次渲染
  // i === newChildren.length 为全部遍历完了
  if (i === newChildren.length) {
    // 删除多余的节点
    deleteRemainingChildren(returnFiber, oldFiber)
    return
  }

  // 初次渲染
  if (!oldFiber) {
    // 将 fiber 节点连接起来
    for (; i < newChildren.length; i++) {
      const newChildVnode = newChildren[i]
      if (newChildVnode === null) continue
      
      const newFiber = createFiber(newChildVnode, returnFiber)
      // 更新 lastPlacedIndex
      lastPlacedIndex = placedIndex(
        newFiber,
        lastPlacedIndex,
        i,
        shouldTrackSideEffects
      )
      // 将 fiber 加入到 fiber 链表里面
      prevFiber = updatePreviousFiber(prevFiber, newFiber, returnFiber)
    }
  }

  // 处理新旧节点都有剩余
  const existigChildren = mapRemainingChildren(oldFiber)
  for (; i < newChildren.length; i++) {
    const newChild = newChildren[i]
    if (newChild === null) continue
    const newFiber = createFiber(newChild, returnFiber)
    const matchedChild = existigChildren.get(newFiber.key || newFiber.index)

    if (matchedChild) {
      // 有可复用的节点
      Object.assign(newFiber, {
        stateNode: matchedChild.stateNode,
        alternate: matchedChild,
        flags: Update,
      })

      existigChildren.delete(newFiber.key || newFiber.index)
    }

    lastPlacedIndex = placedIndex(
      newFiber,
      lastPlacedIndex,
      i,
      shouldTrackSideEffects
    )

    prevFiber = updatePreviousFiber(prevFiber, newFiber, returnFiber)
  }

  // 删除多余的节点
  if (shouldTrackSideEffects) {
    existigChildren.forEach((child) => {
      deleteChild(returnFiber, child)
    })
  }
}
