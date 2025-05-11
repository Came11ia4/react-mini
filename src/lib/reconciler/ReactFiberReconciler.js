import { renderWithHooks } from '../react/ReactHooks'
import { updateNode } from '../shared/utils'
import { reconcilerChildren } from './ReactChildFiber'
/**
 * 传入原生 DOM 节点
 * @param {*} wip
 */
export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
    updateNode(wip.stateNode, {}, wip.props)
  }
  reconcilerChildren(wip, wip.props.children)

}
/**
 * 传入函数组件
 * @param {*} wip
 */
export function updateFunctionComponent(wip) {
  // 初始化hooks状态
  renderWithHooks(wip)
  const { type, props } = wip
  const children = type(props)
  reconcilerChildren(wip, children)
}
/**
 * 传入类组件
 * @param {*} wip
 */
export function updateClassComponent(wip) {
  const { props, type } = wip
  const instance = new type(props)
  const children = instance.render()
  // const children = type.prototype.render(props)
  reconcilerChildren(wip, children)
}
/**
 * 传入文本节点
 * @param {*} wip
 */
export function updateHostTextComponent(wip) {
  wip.stateNode = document.createTextNode(wip.props.children)
}
