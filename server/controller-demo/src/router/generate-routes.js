import routerFun from './router-map'

var routerMap = routerFun();

function navPermission (children, data) {
    return children.map(function(childrenItem, childrenIndex){
        var isReset = false;
        data.forEach(function(dataItem, dataIdex){
            if(dataItem.code == childrenItem.name){
                isReset = true;
                childrenItem.hidden = false;
                childrenItem.name = dataItem.code;
                childrenItem.meta.title = dataItem.name;
                childrenItem.meta.name = dataItem.code;
                childrenItem.meta.hidden = false;
                childrenItem.meta.permission = true;
                childrenItem.meta.buttons = dataItem.buttonList;

                if(childrenItem.children && childrenItem.children.length){
                    if(childrenItem.children && dataItem.children.length){
                        childrenItem.children = navPermission(childrenItem.children,dataItem.children || []);
                    }
                }
            }
        })

        if(!isReset){
            childrenItem.meta.name = childrenItem.name;
            childrenItem.meta.hidden = false;
        }
        return childrenItem;
    })
}

function routerSort(data){
    var tempMap = [];

    for(var i = 0; i< data.length; i++){
        var tempObj = data[i],
            currentObj = {};

        routerMap = routerMap.filter(function(item, index){
            if(item.name == tempObj.code){
                currentObj = item;
                return false;
            }else{
                return true;
            }
        })

        if(JSON.stringify(currentObj) != "{}"){
            routerMap.splice(i,0, currentObj);
        }
        
    }
    console.log("+++++++++++++++++= routerMap:",routerMap);
    return routerMap;
}

function createRouterMap (data) {

    routerMap.map(function(item, index){
        var isHidden = false;
        data.forEach(function(forItem, forIndex){
            if(item.name == forItem.code){
                isHidden = true;
                item.hidden = false;
                item.name = forItem.code;
                item.meta.title = forItem.name;
                item.meta.name = forItem.code;
                item.meta.hidden = false;
                item.meta.permission = true;
                item.meta.buttons = forItem.buttonList;

                if(item.children && item.children.length){
                    item.children = navPermission(item.children,forItem.children || []);
                }
            }
        })

        if(isHidden){
            item.meta.hidden = false;
            item.meta.name = item.name;
        }
        return item;
    })
    routerSort(data);

    console.log("+++++++++++++ routerMap:",routerMap);
    return routerMap;
}
export default createRouterMap;