<template>
  <Tween
    :animation="[
      { height: 300, backgroundColor: 'hsla(360,50%,50%,0.5)' },
      { color: 'white' },
      { borderColor: 'red' }
    ]"
    :styles="{border: '1px solid #000'}"
  >
    <div>执行动效</div>
  </Tween>
</template>

<script>
import Tween from '../../../../src/index.js'
export default {
  components: { Tween }
}
</script>
