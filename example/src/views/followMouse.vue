<script>
import Tween from '../../../../src/index.js'
export default {
  data () {
    return {
      animation: {}
    }
  },
  mounted () {
    window.addEventListener('mousedown', this.mouseMove)
  },
  beforeDestroy () {
    window.removeEventListener('mousedown', this.mouseMove)
  },
  methods: {
    mouseMove (e) {
      const x = e.clientX
      this.animation = {
        x,
        duration: 1000,
        ease: 'easeOutQuad'
      }
    }
  },
  render () {
    return <Tween animation={this.animation}
      moment={17}
      styles={{ height: 100 }}
    >
      <div>执行动效</div>
    </Tween>
  }
}
</script>
