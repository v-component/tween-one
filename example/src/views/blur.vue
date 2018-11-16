<script>
import Tween from '../../../../src/index'
export default {
  render () {
    return <div>
      <div>
        filter 里的滤镜，&apos;grayScale&apos;, &apos;sepia&apos;, &apos;hueRotate&apos;,
        &apos;invert&apos;, &apos;brightness&apos;, &apos;contrast&apos;, &apos;blur&apos;
      </div>
      <Tween animation={{ blur: '10px', sepia: '100%', duration: 2000 }}
        styles={{ filter: 'blur(30px)' }}
      >
        <img
          width="500px"
          src="https://t.alipayobjects.com/images/T1CFtgXb0jXXXXXXXX.jpg"
          alt="img"
        />
      </Tween>
    </div>
  }
}
</script>
