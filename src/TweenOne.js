import PropTypes from 'vc-util/es/vue-types'
import { initDefaultProps } from 'vc-util/es/propsutil'

import { dataToArray, objectEqual } from './util'
import Tween from './Tween'
import ticker from './ticker'

function noop () {
}

const perFrame = Math.round(1000 / 60)
const objectOrArray = PropTypes.oneOfType([PropTypes.object, PropTypes.array])

const defaultProps = {
  component: PropTypes.any,
  componentProps: PropTypes.any,
  animation: objectOrArray,
  children: PropTypes.any,
  styles: PropTypes.object,
  paused: PropTypes.bool,
  reverse: PropTypes.bool,
  reverseDelay: PropTypes.number,
  yoyo: PropTypes.bool,
  repeat: PropTypes.number,
  moment: PropTypes.number,
  attr: PropTypes.string,
  onChange: PropTypes.func,
  resetStyle: PropTypes.bool,
  forcedJudg: PropTypes.object
}

export default {
  name: 'TweenOne',
  props: initDefaultProps(defaultProps, {
    component: 'div',
    componentProps: {},
    reverseDelay: 0,
    repeat: 0,
    attr: 'style',
    onChange: noop
  }),
  data () {
    // this.setForcedJudg(this.$props)
    return {
      rafID: -1,
      updateAnim: false,
      forced: {},
      preProps: {},
      pausedProp: true,
      reverseProp: false,
      isTweenOne: true
    }
  },
  created () {
    this.preProps = { ...this.$props }
    this.pausedProp = this.preProps.paused
    this.reverseProp = this.preProps.reverse
  },
  watch: {
    '$props': {
      handler: function (nextProps) {
        // 动画处理
        const newAnimation = nextProps.animation
        const currentAnimation = this.preProps.animation
        const equal = objectEqual(currentAnimation, newAnimation)
        if (!equal) {
          if (nextProps.resetStyle && this.tween) {
            this.tween.resetDefaultStyle()
          }
          this.updateAnim = true
        }

        // 跳帧事件 moment;
        const nextMoment = nextProps.moment
        if (typeof nextMoment === 'number' && nextMoment !== this.preProps.moment) {
          if (this.tween && !this.updateAnim) {
            this.startMoment = nextMoment
            this.startFrame = ticker.frame
            if (nextProps.paused) {
              this.raf()
            }
            if (this.tween.progressTime >= this.tween.totalTime) {
              this.play()
            }
          } else {
            this.updateAnim = true
          }
        }

        // 暂停倒放
        if (this.pausedProp !== nextProps.paused || this.reverseProp !== nextProps.reverse) {
          this.pausedProp = nextProps.paused
          this.reverseProp = nextProps.reverse
          if (this.pausedProp) {
            this.cancelRequestAnimationFrame()
          } else if (this.reverseProp && nextProps.reverseDelay) {
            this.cancelRequestAnimationFrame()
            ticker.timeout(this.restart, nextProps.reverseDelay)
          } else {
            // 在 form 状态下，暂停时拉 moment 时，start 有值恢复播放，在 delay 的时间没有处理。。
            if (this.tween) {
              this.tween.resetAnimData()
              this.tween.resetDefaultStyle()
            }
            if (!this.updateAnim) {
              this.restart()
            }
          }
        }

        const styleEqual = objectEqual(this.preProps.style, nextProps.style)
        if (!styleEqual) {
          // 在动画时更改了 style, 作为更改开始数值。
          if (this.tween) {
            this.tween.reStart(nextProps.style)
            if (this.pausedProp) {
              this.raf()
            }
          }
        }
        this.preProps = Object.freeze({ ...nextProps })
        // this.setForcedJudg(nextProps)
      },
      deep: true
    }
  },
  mounted () {
    this.dom = this.$el
    if (this.dom && this.dom.nodeName !== '#text') {
      this.start()
    }
  },
  updated () {
    this.$nextTick(() => {
      if (!this.dom) {
        this.dom = this.$el
      }
      // 样式更新了后再执行动画；
      if (this.updateAnim && this.dom && this.dom.nodeName !== '#text') {
        if (this.tween) {
          this.cancelRequestAnimationFrame()
        }
        this.start()
      }
    })
  },
  beforeDestroy () {
    this.cancelRequestAnimationFrame()
  },
  methods: {
    /**
   * @method setForcedJudg
   * @param props
   * QueueAnim 套在组件下面后导至子级变化。
   * <QueueAnim component={Menu} >
   *   <SubMenu key="a" title="导航">
   *     <Item />
   *   </SubMenu>
   * </QueueAnim>
   * rc-Menu 里是以 isXXX 来判断是 rc-Menu 的子级;
   * 如: 用 isSubMenu 来处理 hover 事件
   * 地址: https://github.com/react-component/menu/blob/master/src/MenuMixin.js#L172
   * 暂时方案: 在组件里添加判断用的值。
   */
    setForcedJudg (props) {
      Object.keys(this.forced).forEach(key => {
        delete this[key]
        delete this.forced[key]
      })
      if (props.forcedJudg) {
        Object.keys(props.forcedJudg).forEach(key => {
          if (!this[key]) {
            this[key] = props.forcedJudg[key]
            this.forced[key] = 1
          }
        })
      }
    },
    setDefalut (props) {
      this._moment = props.moment || 0
      this.startMoment = props.moment || 0
      this.startFrame = ticker.frame
    },
    restart () {
      if (!this.tween) {
        return
      }
      this.startMoment = this._moment
      this.startFrame = ticker.frame
      this.tween.reverse = this.reverseProp
      this.tween.reverseStartTime = this.startMoment
      this.raf()
      this.play()
    },
    start () {
      this.updateAnim = false
      const props = this.$props
      if (props.animation && Object.keys(props.animation).length) {
        this.setDefalut(props)
        this.tween = new Tween(this.dom, dataToArray(props.animation),
          { attr: props.attr })
        this.tween.reverse = this.reverseProp
        // 预先注册 raf, 初始动画数值。
        this.raf()
        // 开始动画
        this.play()
      }
    },
    play () {
      this.cancelRequestAnimationFrame()
      if (this.pausedProp) {
        return
      }
      this.rafID = ticker.add(this.raf)
    },
    frame () {
      const { yoyo } = this.$props
      let { repeat } = this.$props
      const totalTime = repeat === -1 ? Number.MAX_VALUE : this.tween.totalTime * (repeat + 1)
      repeat = repeat >= 0 ? repeat : Number.MAX_VALUE
      let moment = (ticker.frame - this.startFrame) * perFrame + this.startMoment
      if (this.reverseProp) {
        moment = (this.startMoment || 0) - (ticker.frame - this.startFrame) * perFrame
      }
      moment = moment > totalTime ? totalTime : moment
      moment = moment <= 0 ? 0 : moment
      let repeatNum = Math.floor(moment / this.tween.totalTime) || 0
      repeatNum = repeatNum > repeat ? repeat : repeatNum
      let tweenMoment = moment - this.tween.totalTime * repeatNum
      tweenMoment = tweenMoment < perFrame && !this.reverseProp &&
      totalTime >= perFrame ? 0 : tweenMoment
      if (repeat && moment && moment - this.tween.totalTime * repeatNum < perFrame) {
      // 在重置样式之前补 complete；
        this.tween.frame(this.tween.totalTime * repeatNum)
      }
      if (
        (moment < this._moment && !this.reverseProp) ||
        (repeat !== 0 && repeatNum && tweenMoment <= perFrame)
      ) {
      // 在 form 状态下，暂停时拉 moment 时，start 有值，，往返方向播放时，在 delay 的时间没有处理。。
      // 与上面的处理一样，删除 start ，重新走一遍 start。。
        this.tween.resetAnimData()
        this.tween.resetDefaultStyle()
      }
      const yoyoReverse = yoyo && repeatNum % 2
      if (yoyoReverse) {
        tweenMoment = this.tween.totalTime - tweenMoment
      }
      this.tween.onChange = (e) => {
        const cb = {
          ...e,
          timelineMode: ''
        }

        if (
          (this._moment === this.startMoment &&
          (!this.reverseProp && !e.index && e.mode === 'onStart')) ||
          this.reverseProp
        ) {
          cb.timelineMode = 'onTimelineStart'
        } else if (
          (moment >= totalTime && !this.reverseProp) ||
          (!moment && this.reverseProp)
        ) {
          cb.timelineMode = 'onTimelineComplete'
        } else if (repeatNum !== this.timelineRepeatNum) {
          cb.timelineMode = 'onTimelineRepeat'
        } else {
          cb.timelineMode = 'onTimelineUpdate'
        }
        this.timelineRepeatNum = repeatNum
        this.$props.onChange(cb)
      }
      this._moment = moment
      this.tween.frame(tweenMoment)
    },
    raf () {
      const tween = this.tween
      this.frame()
      if (tween !== this.tween) {
      // 在 onComplete 时更换动画时，raf 没结束，所以需要强制退出，避逸两个时间的冲突。
        return null
      }
      const { repeat } = this.$props
      const totalTime = repeat === -1 ? Number.MAX_VALUE : this.tween.totalTime * (repeat + 1)
      if (
        (this._moment >= totalTime && !this.reverseProp) ||
        this.pausedProp ||
        (this.reverseProp && this._moment === 0)
      ) {
        return this.cancelRequestAnimationFrame()
      }
      return null
    },
    cancelRequestAnimationFrame () {
      ticker.clear(this.rafID)
      this.rafID = -1
    }
  },
  render (createElement) {
    const props = { ...this.$props }
    const propkeys = [
      'animation',
      'component',
      'componentProps',
      'reverseDelay',
      'attr',
      'paused',
      'reverse',
      'repeat',
      'yoyo',
      'moment',
      'resetStyle',
      'forcedJudg'
    ]
    propkeys.forEach(key => delete props[key])
    props.style = { ...this.$props.styles }
    Object.keys(props.style).forEach(p => {
      if (p.match(/filter/i)) {
        ['Webkit', 'Moz', 'Ms', 'ms'].forEach(prefix => {
          props.style[`${prefix}Filter`] = props.styles[p]
        })
      }
      const value = props.style[p]
      if (/(width|height|margin|padding|)/i.test(p) && typeof value === 'number') {
        props.style[p] = `${value}px`
      }
    })
    // component 为空时调用子级的。。
    if (!this.$props.component) {
      const children = this.$slots.default
      if (!children) {
        return children
      }
      const childrenProps = children[0].data || {}
      const { style, staticClass } = childrenProps
      const newStyle = { ...style, ...props.style }
      const newClassName = props.class ? `${props.class} ${staticClass}` : staticClass
      return createElement(children[0], { style: newStyle, class: newClassName })
    }
    return createElement(this.$props.component, { ...props, ...this.$props.componentProps }, this.$slots.default)
  }
}
