import { Placement } from "../shared/utils";

export function placedIndex(
  newFiber,
  lastPlacedIndex,
  newIndex,
  shouldTrackSideEffects
) {
  newFiber.index = newIndex;

  if (!shouldTrackSideEffects) {
    return lastPlacedIndex;
  }

  const current = newFiber.alternate;
  if (current) {
    const oldIndex = current.index;
    if (oldIndex < lastPlacedIndex) {
      // 如果老的fiber节点的index小于当前lastPlacedIndex，说明老的fiber节点需要移动
      newFiber.flags |= Placement;
      return lastPlacedIndex;
    } else {
      // 如果老的fiber节点的index大于等于当前lastPlacedIndex，说明老的fiber节点不需要移动
      return oldIndex;
    }
  } else {
    // 初次渲染
    newFiber.flags |= Placement;
    return lastPlacedIndex;
  }
}
/**
 * 将新fiber插入到fiber链表里面
 * @param {*} prevFiber 上一个fiber对象
 * @param {*} newFiber 新的fiber对象
 * @param {*} returnFiber 父fiber节点
 */
export function updatePreviousFiber(prevFiber, newFiber, returnFiber) {
  prevFiber !== null
    ? (prevFiber.sibling = newFiber)
    : (returnFiber.child = newFiber);
  return newFiber;
}
/**
 * 判断两个是否可以复用
 * @param {*} a vnode 新的节点
 * @param {*} b 旧的fiber节点
 * @returns
 */
export function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}
/**
 * @param {*} returnFiber 父节点
 * @param {*} childToDelete 需要删除的节点
 */
export function deleteChild(returnFiber, childToDelete) {
  const deletions = returnFiber.deletions;
  deletions
    ? returnFiber.deletions.push(childToDelete)
    : (returnFiber.deletions = [childToDelete]);
}
/**
 * @param {*} returnFiber 父节点
 * @param {*} currentFirstChild 需要删除的第一个子节点
 */
export function deleteRemainingChildren(returnFiber, currentFirstChild) {
  let childToDelete = currentFirstChild;
  while (childToDelete) {
    deleteChild(returnFiber, childToDelete);
    childToDelete = childToDelete.sibling;
  }
}

/**
 * 将所有旧节点存放在一个map结构里面
 * @param {*} oldFiber 旧节点
 */
export function mapRemainingChildren(oldFiber) {
  const existingChildren = new Map();
  let existingChild = oldFiber;

  while (existingChild) {
    existingChildren.set(
      existingChild.key || existingChild.index,
      existingChild
    );
    existingChild = existingChild.sibling;
  }

  return existingChildren;
}
