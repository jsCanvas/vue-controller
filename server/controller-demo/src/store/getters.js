const getters = {
	sidebar: state => state.app.sidebar,
	device: state => state.app.device,
	user: state => state.user.user,
	menu: state => state.user.menu,
	common: state => state.common,
	recordData: state => state.common.recordData,
	/**
	 * @getter
     * 规则 api路径最后两段驼峰
     * 例如接口 /member/list   type：get
     * memberList
	 * 
	 * => state.模块.getter
     */      
}
export default getters
