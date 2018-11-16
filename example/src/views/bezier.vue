<script>
import Tween from '../../../../src/index'
import BezierPlugin from '../../../../src/plugin/BezierPlugin'
Tween.plugins.push(BezierPlugin)
export default {
  name: 'bezier',
  render () {
    return <div style={{ 'position': 'relative', 'height': '300px' }}>
      <Tween
        animation={{
          bezier: {
            type: 'thru',
            autoRotate: true,
            vars: [{ x: 200, y: 200 }, { x: 400, y: 0 }, { x: 600, y: 200 }, { x: 800, y: 0 }]
          },
          duration: 5000
        }}
        styles={{ width: '100px' }}
      >
        <div>执行动效</div>
      </Tween>
      <div
        style={{
          width: '5px',
          height: '5px',
          background: '#000',
          position: 'absolute',
          top: 0,
          transform: 'translate(200px,200px)'
        }}
      />
      <div
        style={{
          width: '5px',
          height: '5px',
          background: '#000',
          position: 'absolute',
          top: 0,
          transform: 'translate(400px,0px)'
        }}
      />
      <div
        style={{
          width: '5px',
          height: '5px',
          background: '#000',
          position: 'absolute',
          top: 0,
          transform: 'translate(600px,200px)'
        }}
      />
      <div
        style={{
          width: '5px',
          height: '5px',
          background: '#000',
          position: 'absolute',
          top: 0,
          transform: 'translate(800px,0px)'
        }}
      />
    </div>
  }
}
</script>
