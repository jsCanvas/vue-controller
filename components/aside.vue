<template>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu v-for="(item,index) in menu" :key="index" :index="index+1+''">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.meta.title}}</span>
        </template>
        <el-submenu v-for="(sub,dex) in item.children" :key="dex" :index="(index+1)+'-'+(dex+1)">
          <template slot="title">{{sub.meta.title}}</template>
          <el-menu-item v-for="(minsub,ind) in sub.children" :key="ind" :index="(index+1)+'-'+(dex+1)+'-'+(ind+1)">{{minsub.meta.title}}</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
</template>

<script>
  export default {
    computed:{
        menu(){
            return this.$store.state.route.route;
        }
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>