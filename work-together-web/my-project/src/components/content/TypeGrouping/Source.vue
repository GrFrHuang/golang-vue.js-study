<template>
  <types :type="type"></types>
</template>
<script>
  import types from './Types'
  export default {
    components: {
      types
    },
    data () {
      return {
        type:12
      }
    }
  }
</script>
