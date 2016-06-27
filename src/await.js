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
      this.queue[key] = [];
      return Promise.resolve(fn()).then(data => {
        process.nextTick(() => {
          this.queue[key].forEach(deferred => deferred.resolve(data));
          delete this.queue[key];
        });
        return data;
      }).catch(err => {
        process.nextTick(() => {
          this.queue[key].forEach(deferred => deferred.reject(err));
          delete this.queue[key];
        });
        return Promise.reject(err);
      });
    }else{
      let deferred = defer();
      this.queue[key].push(deferred);
      return deferred.promise;
    }
  }
}