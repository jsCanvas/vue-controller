var wEmintName = [];

function getNames(name, list) {
    if (/\:$/.test(name)) {
        return wEmintName.filter(n => n.search(name) == 0)
    }
    return [name]
}

/*
    派发事件 支持多级定义
    name1:name2:name3
    this.$mon('name1:name2:name3' fn)

    触发事件支持 多级触发
    this.$memit('name')  // 触发单个 事件
    this.$memit('name1:')  // 触发 name1: 开头的所有 定义的事件
    this.$memit('name1:name2:')  // 触发 name1:name2: 开头的所有 定义的事件
    name 以 ：结尾的 ,为触发 多级事件

    删除事件支持 多级触发
    this.$moff('name')  // 删除单个 事件
    this.$moff('name1:')  // 删除 name1: 开头的所有 定义的事件
    this.$moff('name1:name2:')  // 删除 name1:name2: 开头的所有 定义的事件
    name 以 ：结尾的 ,为触发 多级事件
 */
export default {
    data: function () {
        return {
            onEimeName: []
        }
    },
    methods: {
        $mon(name, fn) {
            this.onEimeName.push(name)
            wEmintName.push(name)
            this.dispatch.$on(name, fn)
        },
        $monce(name, fn) {
            this.onEimeName.push(name)
            wEmintName.push(name)
            this.dispatch.$once(name, fn)
        },
        $moff(name) {
            var index;
            var _this = this;
            getNames(name).forEach(name => {

                _this.dispatch.$off(name);
                index = wEmintName.indexOf(name)
                if (index >= 0) {
                    wEmintName.splice(index, 1)
                }
                index = _this.onEimeName.indexOf(name)
                if (index >= 0) {
                    _this.onEimeName.splice(index, 1)
                }
            })
        },
        $memit(name, data) {
            var _this = this;
            getNames(name).forEach(name => {
                _this.dispatch.$emit(name, data)
            })

        }
    },
    // destroyed(){
    //     //dispatch
    //     // console.log(this)
    // },
    beforeDestroy() {
        // this.dispatch.
        var index;
        this.onEimeName.forEach(name => {
            this.dispatch.$off(name);
            index = wEmintName.indexOf(name)
            if (index >= 0) {
                wEmintName.splice(index, 1)
            }
        })
        // console.log(this.onEimeName)
        // console.log(wEmintName)
    }
}
