/**
 * dependence class
 */
export default class {
  /**
   * constructor
   */
  constructor(){
    this.dependencies = [];
  }
  /**
   * get dependencies
   */
  get(){
    return this.dependencies;
  }
  /**
   * set dependencies
   */
  set(dependencies){
    if(!Array.isArray(dependencies)){
      dependencies = [dependencies];
    }
    this.dependencies = dependencies;
    return this;
  }
  /**
   * add dependence
   */
  add(files){
    if(!Array.isArray(files)){
      files = [files];
    }
    files.forEach(item => {
      if(this.dependencies.indexOf(item) === -1){
        this.dependencies.push(item);
      }
    });
    return this;
  }
  /**
   * remove dependence
   */
  remove(files){
    if(!Array.isArray(files)){
      files = [files];
    }
    files.forEach(item => {
      let index = this.dependencies.indexOf(item);
      if(index > -1){
        this.dependencies.splice(index, 1);
      }
    });
    return this;
  }
  /**
   * has dependence
   */
  has(file, flag = true){
    if(this.dependencies.indexOf(file) > -1){
      return true;
    }
    if(!flag){
      return false;
    }
    return this.dependencies.some(item => {
      return item.has(file, flag);
    });
  }
}