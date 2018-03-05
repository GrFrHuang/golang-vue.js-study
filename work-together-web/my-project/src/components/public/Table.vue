<template>
  <table class="table table-bordered table-hover">
    <thead>
    <slot name="cols">
      <tr>
        <th>1</th>
        <th>2</th>
        <th>3</th>
      </tr>
    </slot>

    </thead>
    <tbody>
    <slot name="first-raw"></slot>
    <slot name="item" v-for="item in items" :item="item"></slot>
    </tbody>
  </table>
</template>
<script type="text/ecmascript-6">
  export default{
    props: ['items'],
    data(){
      return {}
    },
    methods: {},
    mounted: function () {
    },
  }
</script>
<style lang="less" rel="stylesheet/less">

</style>
