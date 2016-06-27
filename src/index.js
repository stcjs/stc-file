'use strict';

import path from 'path';
import fs from 'fs';
import {isStream, isBuffer, promisify, isString, defer} from 'stc-helper';
import Dependence from './dependence.js';
import Await from './await.js';

/**
 * ast default handle
 */
let defaultAstHandle = {
  parse: () => {},
  stringify: () => {}
};

/**
 * virtual file for stc
 */
export default class {
  /**
   * constructor
   */
  constructor(options = {}){
    if(typeof options === 'string'){
      options = {path: options};
    }
    
    this.cwd = options.cwd || process.cwd();
    this.base = options.base || this.cwd;
    this.astHandle = options.astHandle || defaultAstHandle;
    
    this._path = options.path;
    
    if(!this._path){
      throw new Error('path must be set');
    }
    // file content
    this._content = null;
    // file stat
    this._stat = options.stat;
    // file extname
    this._extname = '';
    // file other props
    this._props = {};
    // file content ast
    this._ast = null;
    
    // path history, filepath will be changed in workflow
    this.pathHistory = [this._path];
    // file depedence
    this.dependence = new Dependence();
    // await instance
    this.await = new Await();
    // run promise
    this._promises = {};
  }
  /**
   * get path
   */
  get path(){
    return this._path;
  }
  /**
   * set path
   */
  set path(filepath){
    if(filepath === this._path){
      return this;
    }
    this._path = filepath;
    this.pathHistory.push(filepath);
    return this;
  }
  /**
   * is path
   */
  isPath(filePath){
    return this.pathHistory.indexOf(filePath) > -1;
  }
  /**
   * pipe to stream
   */
  pipe(stream, opt = {
    end: true
  }){
    let content = this.content;
    if(isStream(content)){
      return content.pipe(stream, opt);
    }
    if(isBuffer(content)){
      if(opt.end){
        stream.end(content);
      }else{
        stream.write(content);
      }
      return stream;
    }
    if(opt.end){
      stream.end();
    }
    return stream;
  }
  /**
   * get path extname
   */
  get extname(){
    return path.extname(this.path).slice(1);
  }
  /**
   * set path extname
   */
  set extname(extname){
    if(extname[0] === '.'){
      extname = extname.slice(1);
    }
    let preExt = this.extname;
    if(extname === preExt){
      return this;
    }
    let path = this.path.substr(0, this.path.length - preExt.length) + extname;
    this.path = path;
    return this;
  }
  /**
   * get file stat
   */
  get stat(){
    if(this._stat){
      return this._stat;
    }
    try{
      this._stat = fs.statSync(this.path);
    }catch(e){}
    return this._stat;
  }
  /**
   * set file stat
   */
  set stat(stat){
    this._stat = stat;
  }
  /**
   * is file
   */
  isFile(){
    let stat = this.stat;
    return stat && stat.isFile();
  }
  /**
   * is directory
   */
  isDirectory(){
    let stat = this.stat;
    return stat && stat.isDirectory();
  }
  /**
   * get file content
   */
  async getContent(encoding = null, notFoundDefaultValue){
    if(this.prop('contentGetted')){
      if(this._content === null){
        this._content = this.astHandle.stringify(this._ast, this);
      }
      return this._content;
    }
    
    if(this.isFile()){
      let fn = promisify(fs.readFile, fs);
      this._content = await fn(this.path, encoding);
      this.prop('contentGetted', true);
    }
    else if(notFoundDefaultValue !== undefined){
      this._content = notFoundDefaultValue;
      this.prop('contentGetted', true);
      return this._content;  
    }
    else{
      throw new Error('must be a file when get content');
    }
    return this._content;
  }
  /**
   * set file content
   */
  setContent(content){
    if(!isStream(content) && !isBuffer(content) && !isString(content)){
      throw new Error('content data type is not valid');
    }
    if(content === this._content){
      return this;
    }
    this._content = content;
    this._ast = null;
    this.prop('contentGetted', true);
    return this;
  }
  /**
   * has ast
   */
  hasAst(){
    return !!this._ast;
  }
  /**
   * get file content ast
   */
  async getAst(){
    if(this._ast !== null){
      return this._ast;
    }
    let content = await this.getContent('utf8');
    this._ast = this.astHandle.parse(content, this);
    return this._ast;
  }
  /**
   * set file content ast
   */
  setAst(ast){
    if(ast === this._ast){
      return this;
    }
    this._ast = ast;
    this._content = null;
    this.prop('contentGetted', true);
    return this;
  }
  
  // get or set prop
  prop(name, value){
    if(value === undefined){
      return this._props[name];
    }
    this._props[name] = value;
    return this;
  }
  /**
   * get or set promise
   */
  promise(key, value, deferred){
    if(!(key in this._promises)){
      this._promises[key] = {};
    }
    let item = this._promises[key];
    // set deferred
    if(deferred === 'set'){
      if(item.deferred){
        return;
      }
      let deferred = defer();
      item.deferred = deferred;
      item.value = deferred.promise;
      return;
    }
    // resolve deferred
    if(deferred === 'update'){
      if(!item.deferred){
        return;
      }
      item.deferred.resolve(value);
      item.deferred = null;
      item.value = value;
    }
    if(value === undefined){
      return item.value;
    }
    item.value = value;
  }
  /**
   * run async function
   */
  run(key, callback){
    if(this._promises[key]){
      return this._promises[key].value;
    }
    let data = this.await.run(key, callback);
    this._promises[key] = {value: data};
    return data;
  }
}