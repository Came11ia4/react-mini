import { updateNode } from '../shared/utils'
import { reconcilerChildren } from './ReactChildFiber'
export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type)
    updateNode(wip.stateNode, {}, wip.props)

    reconcilerChildren(wip, wip.props.children)
  }
}

export function updateHostTextComponent(wip) {
  wip.stateNode = document.createTextNode(wip.props.children)
}
