<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{text1}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{text2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
export default {
  props: ['text1', 'text2']
}
</script>