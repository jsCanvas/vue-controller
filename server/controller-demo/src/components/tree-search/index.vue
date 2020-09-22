<template>
  <div class="tree-search">
    <div class="tree-search__input">
      <el-input
        :placeholder="placeholder"
        v-model="filterText">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleClickSearch"
        ></el-button>
      </el-input>
    </div>
    <el-tree
      class="filter-tree"
      ref="tree"
      :data="data"
      :node-key="nodeKey"
      :props="props"
      :highlight-current="highlightCurrent"
      :default-expand-all="defaultExpandAll"
      :show-checkbox="showCheckbox"
      :default-checked-keys="defaultCheckedKeys"
      :current-node-key="currentNodeKey"
      :accordion="accordion"
      :filter-node-method="filterNode"
      @check="handleCheck">
    </el-tree>
  </div>
</template>

<script>
export default {
  name: 'TreeSearch',
  props: {
    placeholder: {
      type: String,
      default: '输入关键字进行过滤'
    },
    data: {
      type: Array
    },
    props: Object,
    nodeKey: {
      type: String,
      default: 'id',
    },
    highlightCurrent: {
      type: Boolean,
      default: true,
    },
    defaultExpandAll: Boolean,
    showCheckbox: {
      type: Boolean,
      default: true,
    },
    defaultCheckedKeys: Array,
    currentNodeKey: [String, Number],
    accordion: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return { filterText };
  },
  methods: {
    handleClickSearch() {
      this.$refs.tree.filter(this.filterText);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleCheck(a, b) {
      this.$emit('check', a, b);
    }
  },

  data() {
    return {
      filterText: '',
    };
  }
};
</script>

<style lang="scss" scoped>
.tree-search__input {
  margin-bottom: 16px;
}
</style>