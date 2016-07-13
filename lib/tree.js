/**
 * tree.js
 * @authors yanjixiong 
 * @date    2016-07-13 18:09:49
 */

'use strict';

var Tree = require('js-tree');

var proto = Tree.prototype;

/**
 * Enable using obj's id to build indexes
 * 
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
proto.build = function(obj) {
  var indexes = this.indexes;
  var startId = obj.id || this.cnt;
  var self = this;

  var index = {id: startId, node: obj};

  // 索引key,当找不到id属性时使用自增长id
  indexes[( obj.id || this.cnt ) + ''] = index;
  this.cnt++;

  if(obj.children && obj.children.length) walk(obj.children, index);

  function walk(objs, parent) {
    var children = [];
    objs.forEach(function(obj, i) {
      var index = {};
      index.id = obj.id || self.cnt;
      index.node = obj;

      if(parent) index.parent = parent.id;

      indexes[( obj.id || self.cnt ) + ''] = index;
      children.push(obj.id || self.cnt);
      self.cnt++;

      if(obj.children && obj.children.length) walk(obj.children, index);
    });
    parent.children = children;

    children.forEach(function(id, i) {
      var index = indexes[id+''];
      if(i > 0) index.prev = children[i-1];
      if(i < children.length-1) index.next = children[i+1];
    });
  }

  return index;
};



module.exports = Tree;