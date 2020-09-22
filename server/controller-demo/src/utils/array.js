export const intersectionWith = (list1 = [], list2 = [], id = 'id') => {
  const list2Map = {};
  list2.forEach(item => {
    const mapKey = item[id] || item;
    list2Map[mapKey] = item;
  });
  return list1.filter(item => {
    const mapKey = item[id] || item;
    return (item[id] || item) === list2Map[mapKey];
  });
};