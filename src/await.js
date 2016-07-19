'use strict';

import {defer} from 'stc-helper';

/**
 * waiting class
 * @type {}
 */
export default class Await {
  /**
   * constructor
   * @param  {} args []
   * @return {}         []
   */
  constructor(){
    this.queue = {};
  }
  /**
   * run
   * @param  {String}   key []
   * @param  {Function} fn  []
   * @return {Promise}       []
   */
  run(key, fn){
    if(!(key in this.queue)){
      this.queue[key] = {value: undefined, arr: []};
      let item = this.queue[key];
      return Promise.resolve(fn()).then(data => {
        item.arr.forEach(deferred => deferred.resolve(data));
        item.arr = [];
        item.value = data;
        return data;
      }).catch(err => {
        item.arr.forEach(deferred => deferred.reject(err));
        item.arr = [];
        item.value = err;
        item.error = true;
        return Promise.reject(err);
      });
    }else{
      let item = this.queue[key];
      let deferred = defer();
      if(item.value !== undefined){
        if(item.error){
          deferred.reject(item.value);
        }else{
          deferred.resolve(item.value);
        }
      }else{
        item.arr.push(deferred);
      }
      return deferred.promise;
    }
  }
}