import ObjectSelector from './object-selector';

const spawnArr = (numObjects = 100) => {
  let ret = [];
  for (let i = 0; i < numObjects; i++) {
    ret.push(new ObjectSelector(0));
    ret.push(new ObjectSelector(1));
  }
  return ret;
};

export { spawnArr };
