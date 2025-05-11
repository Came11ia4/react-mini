import {
  ClassComponent,
  Fragment,
  FunctionComponent,
  HostComponent,
  HostText,
} from './ReactWorkTags'
import {
  updateFunctionComponent,
  updateHostComponent,
  updateHostTextComponent,
  updateClassComponent,
} from './ReactFiberReconciler'

function beginWork(fiber) {
  const tag = fiber.tag
  switch (tag) {
    case HostComponent: {
      updateHostComponent(fiber)
      break
    }
    case FunctionComponent: {
      updateFunctionComponent(fiber)
      break
    }
    case ClassComponent: {
      updateClassComponent(fiber)
      break
    }
    case HostText: {
      updateHostTextComponent(fiber)
      break
    }
    case Fragment:
      break
  }
}

export default beginWork
