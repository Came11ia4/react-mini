import { Placement, isFn, isStrOrNum, isUndefined } from '../shared/utils'
import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from './ReactWorkTags'

function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode?.type,
    key: vnode?.key,
    props: vnode?.props,

    stateNode: null,
    child: null,
    sibling: null,
    return: returnFiber,

    flags: Placement,
    index: 0,
    alernate: null,
    memorizedState: null,
  }
  const type = fiber.type
  if (isStrOrNum(type)) {
    fiber.tag = HostComponent
  } else if (isFn(type)) {
    fiber.tag = type.prototype.isReactComponent
      ? ClassComponent
      : FunctionComponent
  } else if (isUndefined(type)) {
    fiber.tag = HostText
    // 文本节点的props没有children属性所以需要手动添加一个
    fiber.props = { children: vnode }
  } else {
    fiber.tag = Fragment
  }
  return fiber
}

export default createFiber
