<template>
  <div class="index">
      首页
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存轮播图照片路径
      banners: [],
      // 搜索框的数据
      options: [
        {
          title: "攻略",
          placeholder: "搜索城市"
        },
        {
          title: "酒店",
          placeholder: "请输入城市搜索酒店"
        },
        {
          title: "机票",
          placeholder: ""
        }
      ],
      // 存索引
      current: 0
    };
  },
  mounted() {
    // this.$axios({
    //   url: "hello"
    // }).then(res => {
    //   console.log(res);
    //   const { data } = res.data;
    //   this.banners = data;
    // });
    this.$store.dispatch('route/postRoute').then(() =>{

    })
    
  },
  methods: {
    handleClick(index) {
      this.current = index;
      if(this.current === 2){
        this.$router.push('/air')
      }
    }
  }
};
</script>

<style scoped lang="less">
.carousel {
  min-width: 1000px;
}
.banner {
  height: 700px;
}

.banner-content {
  z-index: 9;
  width: 1000px;
  position: absolute;
  left: 50%;
  top: 45%;
  margin-left: -500px;
  border-top: 1px transparent solid;

  .search-bar {
    width: 552px;
    margin: 0 auto;
  }

  .search-tab {
    .active {
      i {
        color: #333;
      }
      &::after {
        background: #eee;
      }
    }

    span {
      width: 82px;
      height: 36px;
      display: block;
      position: relative;
      margin-right: 8px;
      cursor: pointer;

      i {
        position: absolute;
        z-index: 2;
        display: block;
        width: 100%;
        height: 100%;
        line-height: 30px;
        text-align: center;
        color: #fff;
      }

      &:after {
        position: absolute;
        left: 0;
        top: 0;
        display: block;
        content: "";
        width: 100%;
        height: 100%;
        border: 1px rgba(255, 255, 255, 0.2) solid;
        border-bottom: none;
        transform: scale(1.1, 1.3) perspective(0.7em) rotateX(2.2deg);
        transform-origin: bottom left;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 1px 2px 0 0;
        box-sizing: border-box;
      }
    }
  }

  .search-input {
    width: 550px;
    height: 46px;
    background: #fff;
    border-radius: 0 4px 4px 4px;
    border: 1px rgba(255, 255, 255, 0.2) solid;
    border-top: none;
    box-sizing: unset;

    input {
      flex: 1;
      height: 20px;
      padding: 13px 15px;
      outline: none;
      border: 0;
      font-size: 16px;
    }

    .el-icon-search {
      cursor: pointer;
      font-size: 22px;
      padding: 0 10px;
      font-weight: bold;
    }
  }
}
</style>