import Ast1 from './ast1';
import Ast0 from './ast0';

const spawnArr = (numObjects = 100) => {
  let ret = [];
  for (let i = 0; i < numObjects; i++) {
    let newAst0 = new Ast0();
    ret.push(newAst0);
    let newAst1 = new Ast1();
    ret.push(newAst1);
  }
  return ret;
};

export { spawnArr };
