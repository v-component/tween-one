<script>
import Tween from '../../../../src/index.js'
const p1 = 'M0,100 L25,100 C34,20 40,0 100,0'
const p = 'M0,100 C5,120 25,130 25,100 C30,60 40,75 58,90 C69,98.5 83,99.5 100,100'
const t = Tween.easing.path(p)
const t1 = Tween.easing.path(p1)
const anim = [
  {
    repeatDelay: 1000,
    duration: 1000,
    scaleX: 0,
    scaleY: 2,
    repeat: -1,
    yoyo: true,
    ease: t
  },
  {
    repeatDelay: 1000,
    duration: 1000,
    y: 0,
    appearTo: 0,
    repeat: -1,
    yoyo: true,
    ease: t1
  }
]
export default {
  render () {
    return <div style={{ height: '300px' }}>
      <Tween
        animation={anim}
        styles={{
          position: 'absolute',
          opacity: 1,
          height: 50,
          width: 50,
          transform: 'translate(150px,150px)',
          background: '#000',
          transformOrigin: 'center bottom'
        }}
      />
      <div style={{ width: '100px', height: '100px', background: '#fff000', position: 'absolute' }} />
      <svg style={{ position: 'absolute' }}>
        <path fill="none" stroke="#000" d={p} />
        <path d={p1} fill="none" stroke="#000" />
      </svg>
    </div>
  }
}
</script>
