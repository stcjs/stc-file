'use strict';

import path from 'path';
import fs from 'fs';
import {isStream, isBuffer} from 'stc-helper';

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
    this.path = options.path;
    
    if(!this.path){
      throw new Error('path must be set');
    }
    
    this._tokens = null;
    this._content = '';
    this._stat = options.stat;
    this._extname = '';
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
    if(this._extname){
      return this._extname;
    }
    this._extname = path.extname(this.path);
    return this._extname;
  }
  /**
   * set path extname
   */
  set extname(extname){
    this._extname = extname;
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
   * get file tokens
   */
  get tokens(){
    return this._tokens;
  }
  /**
   * set file tokens
   */
  set tokens(tokens){
    this._tokens = tokens;
  }
  /**
   * get file content
   */
  get content(){
    if(this._content){
      return this._content;
    }
    if(this.isFile()){
      let buffer = fs.readFileSync(this.path);
      this._content = buffer;
    }
    return this._content;
  }
  /**
   * set file content
   */
  set content(content){
    this._content = content;
  }
}