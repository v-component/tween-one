<script>
import Tween from '../../../../src/index'

export default {
  data () {
    return {
      show: false
    }
  },
  methods: {
    Div () {
      const { show } = this
      return show ? <div></div> : null
    }
  },
  mounted () {
    setTimeout(() => {
      this.show = true
    }, 1000)
  },
  render () {
    return <Tween
      animation={{ x: 300 }}
      component='div'
      componentProps={{ show: this.show }}
    >
        test
    </Tween>
  }
}
</script>
