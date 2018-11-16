import PropTypes from 'vc-util/es/vue-types'
import { initDefaultProps } from 'vc-util/es/propsutil'
import BaseMixin from 'vc-util/es/BaseMixin'
import { cloneElement } from 'vc-util/es/vnode'
import TweenOne from './TweenOne'

import {
  dataToArray,
  getChildrenFromProps,
  mergeChildren,
  transformArguments,
  findChildInChildrenByKey
} from './util'

function noop () {
}

const defaultProps = {
  component: PropTypes.any,
  componentProps: PropTypes.object,
  children: PropTypes.any,
  style: PropTypes.object,
  appear: PropTypes.bool,
  enter: PropTypes.any,
  leave: PropTypes.any,
  animatingClassName: PropTypes.array,
  onEnd: PropTypes.func,
  resetStyle: PropTypes.bool,
  exclusive: PropTypes.bool
}

export default {
  name: 'TweenOneGroup',
  mixin: [BaseMixin],
  props: initDefaultProps(defaultProps, {
    component: 'div',
    componentProps: {},
    appear: true,
    animatingClassName: ['tween-one-entering', 'tween-one-leaving'],
    enter: { x: 50, opacity: 0, type: 'from' },
    leave: { x: -50, opacity: 0 },
    onEnd: noop,
    resetStyle: true,
    exclusive: false
  }),
  data () {
    const children = getChildrenFromProps(this)
    return {
      isTweenOneGroup: true,
      keysToEnter: [],
      keysToLeave: [],
      saveTweenTag: {},
      onEnterBool: false,
      animQueue: [],
      isTween: {},
      currentChildren: children,
      children
    }
  },
  mounted () {
    this.onEnterBool = true
  },
  watch: {
    exclusive: function (val) {
      const nextChildren = getChildrenFromProps(this)
      if (Object.keys(this.isTween).length && !val) {
        this.animQueue.push(nextChildren)
        return
      }
      this.changeChildren(nextChildren, this.currentChildren)
    }
  },
  methods: {
    onchange (animation, key, type, obj) {
      const length = dataToArray(animation).length
      const tag = obj.target
      const classIsSvg = typeof tag.className === 'object' && 'baseVal' in tag.className
      const isEnter = type === 'enter' || type === 'appear'
      if (obj.mode === 'onStart') {
        if (classIsSvg) {
          tag.className.baseVal = this.setClassName(tag.className.baseVal, isEnter)
        } else {
          tag.className = this.setClassName(tag.className, isEnter)
        }
      } else if (obj.index === length - 1 && obj.mode === 'onComplete') {
        delete this.isTween[key]
        if (classIsSvg) {
          tag.className.baseVal = tag.className.baseVal
            .replace(this.$props.animatingClassName[isEnter ? 0 : 1], '').trim()
        } else {
          tag.className = tag.className
            .replace(this.$props.animatingClassName[isEnter ? 0 : 1], '').trim()
        }
        if (type === 'enter') {
          this.keysToEnter.splice(this.keysToEnter.indexOf(key), 1)
          if (!this.keysToEnter.length) {
            this.reAnimQueue()
          }
        } else if (type === 'leave') {
          this.keysToLeave.splice(this.keysToLeave.indexOf(key), 1)
          this.currentChildren = this.currentChildren.filter(child => key !== child.key)
          if (!this.keysToLeave.length) {
            const currentChildrenKeys = this.currentChildren.map(item => item.key)
            Object.keys(this.saveTweenTag).forEach($key => {
              if (currentChildrenKeys.indexOf($key) === -1) {
                delete this.saveTweenTag[$key]
              }
            })
            this.setState({
              children: this.currentChildren
            }, this.reAnimQueue)
          }
        }
        const _obj = { key, type }
        this.$props.onEnd(_obj)
      }
    },
    setClassName (name, isEnter) {
      let className = name.replace(this.$props.animatingClassName[isEnter ? 1 : 0], '').trim()
      if (className.indexOf(this.$props.animatingClassName[isEnter ? 0 : 1]) === -1) {
        className = `${className} ${this.$props.animatingClassName[isEnter ? 0 : 1]}`.trim()
      }
      return className
    },
    getTweenChild (child, props = {}) {
      const key = child.key
      this.saveTweenTag[key] = cloneElement(TweenOne, {
        props: {
          ...props,
          component: null
        },
        key,
        children: [child]
      })
      return this.saveTweenTag[key]
    },
    getCoverAnimation (child, i, type) {
      let animation
      animation = type === 'leave' ? this.$props.leave : this.$props.enter
      if (type === 'appear') {
        const appear = transformArguments(this.$props.appear, child.key, i)
        animation = (appear && this.$props.enter) || null
      }
      const animate = transformArguments(animation, child.key, i)
      const onChange = this.onChange.bind(this, animate, child.key, type)
      const props = {
        key: child.key,
        animation: animate,
        onChange,
        resetStyle: this.$props.resetStyle
      }
      if (
        this.keysToEnter.concat(this.keysToLeave).indexOf(child.key) >= 0 ||
        (!this.onEnterBool && animation)
      ) {
        if (!this.saveTweenTag[child.key]) {
          this.isTween[child.key] = type
        }
      }
      const children = this.getTweenChild(child, props)
      return children
    },
    getChildrenToRender (children) {
      return children.map((child, i) => {
        if (!child || !child.key) {
          return child
        }
        const key = child.key

        if (this.keysToLeave.indexOf(key) >= 0) {
          return this.getCoverAnimation(child, i, 'leave')
        } else if (((this.keysToEnter.indexOf(key) >= 0) ||
          (this.isTween[key] && this.keysToLeave.indexOf(key) === -1)) &&
          !(this.isTween[key] === 'enter' && this.saveTweenTag[key])) {
          /**
          * 1. 在 key 在 enter 里。
          * 2. 出场未结束，触发进场, this.isTween[key] 为 leave, key 在 enter 里。
          * 3. 状态为 enter 且 tweenTag 里有值时，不执行重载动画属性，直接调用 tweenTag 里的。
          */
          return this.getCoverAnimation(child, i, 'enter')
        } else if (!this.onEnterBool) {
          return this.getCoverAnimation(child, i, 'appear')
        }
        return this.saveTweenTag[key]
      })
    },
    reAnimQueue () {
      if (!Object.keys(this.isTween).length && this.animQueue.length) {
        this.changeChildren(this.animQueue[this.animQueue.length - 1], this.children)
        this.animQueue = []
      }
    },
    changeChildren (nextChildren, currentChildren) {
      const newChildren = mergeChildren(currentChildren, nextChildren)
      this.keysToEnter = []
      this.keysToLeave = []
      nextChildren.forEach((c) => {
        if (!c) {
          return
        }
        const key = c.key
        const hasPrev = findChildInChildrenByKey(currentChildren, key)
        // 如果当前 key 已存在 saveTweenTag 里，，刷新 child;
        if (this.saveTweenTag[key]) {
          this.saveTweenTag[key] = cloneElement(this.saveTweenTag[key], {
            children: [c]
          })
        }
        if (!hasPrev && key) {
          this.keysToEnter.push(key)
        }
      })

      currentChildren.forEach((c) => {
        if (!c) {
          return
        }
        const key = c.key
        const hasNext = findChildInChildrenByKey(nextChildren, key)
        if (!hasNext && key) {
          this.keysToLeave.push(key)
          delete this.saveTweenTag[key]
        }
      })
      this.currentChildren = newChildren
      this.setState({
        children: newChildren
      })
    }
  },
  render (createElement) {
    const childrenToRender = this.getChildrenToRender(this.children)
    if (!this.$props.component) {
      return childrenToRender[0] || null
    }
    const componentProps = { ...this.$props }
    const propKeys = [
      'component',
      'componentProps',
      'appear',
      'enter',
      'leave',
      'animatingClassName',
      'onEnd',
      'exclusive',
      'resetStyle'
    ]
    propKeys.forEach(key => delete componentProps[key])
    return createElement(this.$props.component, {
      ...componentProps,
      ...this.props.$componentProps,
      children: childrenToRender
    })
  }

}
