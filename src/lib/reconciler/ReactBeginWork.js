import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from './ReactWorkTags'
import {
  updateHostComponent,
  updateHostTextComponent,
} from './ReactFiberReconciler'

function beginWork(fiber) {
  const tag = fiber.tag
  switch (tag) {
    case HostComponent: {
      updateHostComponent(fiber)
      break
    }
    case FunctionComponent:
      break
    case ClassComponent:
      break
    case HostText: {
      updateHostTextComponent(fiber)
      break
    }
    case Fragment:
      break
  }
}

export default beginWork
