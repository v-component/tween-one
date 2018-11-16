<script>
import Tween from '../../../../src/index.js'
export default {
  data () {
    return {
      paused: true,
      reverse: false,
      reverseDelay: 0
    }
  },
  methods: {
    onPlay () {
      this.paused = false
      this.reverse = false
      this.moment = null
    },
    onPause () {
      this.paused = true
      this.moment = null
    },
    onReverse () {
      this.reverse = true
      this.reverseDelay = 0
      this.paused = false
      this.moment = null
    },
    onReverseDelay () {
      this.reverse = true
      this.reverseDelay = 1000
      this.paused = false
      this.moment = null
    },
    onRestart () {
      this.moment = null
      this.paused = false
      this.reverse = false
    },
    onMoment () {
      this.moment = 500
      this.$nextTick(() => {
        // this.moment = null
      })
    }
  },
  render () {
    return <div>
      <div style={{ height: '200px' }}>
        <Tween animation={[{ translateX: '500px', duration: 1000 }, { y: 100 }, { x: 100 }]}
          paused={this.paused}
          reverse={this.reverse}
          reverseDelay={this.reverseDelay}
          moment={this.moment}
          styles={{ opacity: 1, width: 100, transform: 'translate(50px,30px)' }}
        >
          <div>执行动效</div>
        </Tween>
      </div>
      <button onClick={this.onPlay}>play</button>
      <button onClick={this.onPause}>pause</button>
      <button onClick={this.onReverse}>reverse</button>
      <button onClick={this.onReverseDelay}>reverse Delay 1000</button>
      <button onClick={this.onRestart}>restart</button>
      <button onClick={this.onMoment}>moment to 500</button>
    </div>
  }
}
</script>
