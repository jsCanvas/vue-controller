export function loading (loadingAttrName = 'loading') {
  return function(target, key, descriptor) {
    const method = descriptor.value;
    descriptor.value = function(...args) {
      this[loadingAttrName] = true;
      return method.apply(this, args)
        .then(data => {
          this[loadingAttrName] = false;
          return data;
        })
        .catch(err => {
          this[loadingAttrName] = false;
          throw err;
        });
    }
  }
}