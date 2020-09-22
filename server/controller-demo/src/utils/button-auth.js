import store from '../store'

function btnAuth(buttons, btnName) {

    return buttons.some(item => {
        return item.buttonCode === btnName
    })
}

function findChildrenButtton(item, codeName){
    let hasAuth = false,
        btn = [];

    var ret = item.some(function(childrenItem, childrenIndex){
        if(childrenItem.name == codeName){
            if(childrenItem.meta.buttons && childrenItem.meta.buttons.length){
                btn = childrenItem.meta.buttons;
            }
            return true;
        }else if(childrenItem.children){
            var retObj = findChildrenButtton(childrenItem.children, codeName);

            if(retObj.ret){
                btn = retObj.btn;
                return true;
            }
        }
    })

    return {
        ret: ret,
        btn: btn
    };
}

function currentBtnPermission(codeName){
    var menu = store.getters.menu,
        btn = [];

    var ret = menu.some(function(item, index){
        if(item.name == codeName){
            if(item.meta.buttons && item.meta.buttons.length){
                btn = item.meta.buttons;
            }else{
                btn = [];
            }
            return true;
        }else if(item.children){
            var retObj = findChildrenButtton(item.children, codeName);
            if(retObj.ret){
                btn = retObj.btn;
                return true;
            }
        }
    });

    return {
        ret: ret,
        btn: btn
    }
}

export function hasBtnAuth(currentRoute, btnName) {
    let hasAuth = false,
        codeName = btnName.split('$')[0],
        menu = store.getters.menu;

    if(currentRoute.meta.buttons && currentRoute.meta.buttons.length){
        hasAuth = btnAuth(currentRoute.meta.buttons || [], codeName)
    }else{
        var retObj = currentBtnPermission(codeName);

        if(retObj.ret){
            hasAuth = btnAuth(retObj.btn || [], btnName);
        }
    }
    return hasAuth
}

export function btnPermission(currentRoute, btnName){
    let hasAuth = false,
        codeName = btnName,
        menu = store.getters.menu;

    if(currentRoute.meta.buttons){
        hasAuth = btnAuth(currentRoute.meta.buttons || [], codeName)
    }
    
    return hasAuth
}
