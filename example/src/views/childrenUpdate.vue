<script>
import Tween from '../../../../src/index.js'
export default {
  data () {
    return {
      tweenData: { translateX: 100, duration: 3000 },
      childTweenData: { translateY: 200, duration: 1000 }
    }
  },
  mounted () {
    setTimeout(() => {
      this.tweenData = { opacity: 0.5, marginTop: 100, duration: 1000 }
    }, 1000)
    setTimeout(() => {
      this.childTweenData = [
        { translateY: 100 },
        { rotateY: 180, duration: 1000 },
        { rotateY: 0, duration: 1000 },
        { delay: -800, translateY: 0 }
      ]
    }, 2000)
  },
  render () {
    return <Tween animation={this.tweenData}
      style={{ height: '300px', width: '60px', textAlign: 'center' }}
    >
      <div>大面包</div>
      <Tween animation={this.childTweenData} key="tween">小馒头</Tween>
    </Tween>
  }
}
</script>
