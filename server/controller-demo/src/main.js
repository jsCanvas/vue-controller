import Vue from 'vue'
import request, { postRequest , postDown } from '@/utils/request'
import { hasBtnAuth, btnPermission } from '@/utils/button-auth'
import utils from '@/utils/index'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import Paginator from './components/paginator/index'
import inputNum from './components/inputnum/index'

// import '@/utils/logMask'
import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'viewerjs/src/index.css'

import '@/styles/index.scss'
import '@/permission'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import App from './App'
import store from './store'
import router from './router'
import commonVue from './common'


Vue.use(ElementUI, { locale, size: 'small' })
Vue.use(Paginator)
Vue.use(inputNum)
Vue.use(commonVue)
Vue.config.productionTip = false
Vue.prototype.$ajax = request;
Vue.prototype.$postRequest = postRequest;
Vue.prototype.$postDown = postDown;
Vue.prototype.$hasBtnAuth = hasBtnAuth;
Vue.prototype.$btnPermission = btnPermission;
Vue.prototype.utils = utils;
Vue.prototype.dispatch = new Vue();
window.utils = utils;

new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
