<template>
    <div>
        <el-drawer
            title="添加页面"
            :before-close="handleClose"
            :visible.sync="dialog"
            direction="ltr"
            custom-class="demo-drawer"
            ref="drawer"
            size="70%"
            >
            <div class="demo-drawer__content">
                <el-form :model="form">
                <el-form-item label="页面path" :label-width="formLabelWidth">
                    <el-input v-model="form.path" aria-placeholder="二级路径不加 / " autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="页面名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="模块" :label-width="formLabelWidth">
                    <el-input v-model="form.model" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="模块名称" :label-width="formLabelWidth">
                    <el-input v-model="form.modelname" autocomplete="off"></el-input>
                </el-form-item>
                <!-- <el-form-item label="模块" :label-width="formLabelWidth">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item> -->
                </el-form>
                <div class="demo-drawer__footer">
                <el-button @click="cancelForm">取 消</el-button>
                <el-button type="primary" @click="$refs.drawer.closeDrawer()" :loading="loading">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
                </div>
            </div>
            </el-drawer>
    </div>
</template>


<script>
export default {
  props:{
    PageDialog:Boolean,
  },
  watch:{
      PageDialog(val){
         this.dialog = val;
      }
  },
  data() {
    return {
      // 表单数据
      dialog: false,
      loading: false,
      form: {
        model:'member',
        path:'',
        name:'',
        modelname:'用户管理',
      },
      formLabelWidth: '80px',
      timer: null,
      // 表单规则
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
      handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.loading = true;
          this.timer = setTimeout(() => {
            done();
            // 动画关闭需要一定的时间
            this.$store.dispatch('api/addPage',this.form).then(() =>{
            })
            setTimeout(() => {
              this.loading = false;
              this.$emit('close');
            }, 400);
          }, 2000);
        })
        .catch(_ => {
            this.$emit('close');
        });
    },
    cancelForm() {
      this.loading = false;
    //   this.dialog = false;
      this.$emit('close');
      clearTimeout(this.timer);
    }
  }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
.demo-drawer{
    padding: 16px;
}
.demo-drawer__content{
    padding: 16px;
}
</style>