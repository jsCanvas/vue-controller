<template>
    <div>
        <el-drawer
            title="添加API"
            :before-close="handleClose"
            :visible.sync="dialog"
            direction="ltr"
            custom-class="demo-drawer"
            ref="drawer"
            size="70%"
            >
            <div class="demo-drawer__content">
                <el-form :model="form">
                <el-form-item label="url地址" :label-width="formLabelWidth">
                    <el-input v-model="form.url" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="说明" :label-width="formLabelWidth">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="模块" :label-width="formLabelWidth">
                    <el-input v-model="form.model" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="请求方式" :label-width="formLabelWidth">
                    <el-input v-model="form.type" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="入参" :label-width="formLabelWidth">
                    <el-input v-model="form.params" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="wiki" :label-width="formLabelWidth">
                    <el-input v-model="form.wiki" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="mock数据" :label-width="formLabelWidth">
                    <el-input v-model="form.res" autocomplete="off"></el-input>
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
    ApiDialog:Boolean,
  },
  watch:{
      ApiDialog(val){
         this.dialog = val;
      }
  },
  data() {
    return {
      // 表单数据
      dialog: false,
      loading: false,
      form: {
        name: '',
        url:'',
        name:'',
        model:'',
        type:'',
        params:"{uuid:{value:10,text:'必传'}}",
        wiki:'',
        res:'{code: 0,data: {}}',
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
            this.$store.dispatch('api/addApi',this.form).then(() =>{
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