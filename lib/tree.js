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
  var _obj = copyObj(obj);
  var indexes = this.indexes;
  var startId = typeof _obj.id !== 'undefined' ? _obj.id : this.cnt;
  var self = this;

  var index = {id: startId, node: _obj};
  var children = obj.children;

  // 索引key,当找不到id属性时使用自增长id
  indexes[startId + ''] = index;
  this.cnt++;

  if(children && children.length) walk(children, index);

  function walk(objs, parent) {
    var children = [];
    objs.forEach(function(obj, i) {
      var _obj = copyObj(obj);
      var index = {};
      var _children = obj.children;

      index.id = _obj.id || self.cnt;
      index.node = _obj;

      if(parent) index.parent = parent.id;

      indexes[( _obj.id || self.cnt ) + ''] = index;
      children.push(_obj.id || self.cnt);
      self.cnt++;

      if(_children && _children.length) walk(_children, index);
    });
    parent.children = children;

    children.forEach(function(id, i) {
      var index = indexes[id+''];
      if(i > 0) index.prev = children[i-1];
      if(i < children.length-1) index.next = children[i+1];
    });
  }

  function copyObj(obj) {
    var _obj = {};
    Object.keys(obj).filter(function(key) {
      return key !== 'children';
    }).map(function(key) {
      return _obj[key] = obj[key];
    })
    return _obj;
  }

  return index;
};

/**
 * Get all parents by current id
 *
 * result will be reversed so that it starts from root node
 * 
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
proto.getAllParentNode = function(id) {
  var self = this;
  var _parentsNode = [];
  var _currentIndex = this.indexes[id + ''];
  var _parentId = _currentIndex.parent;

  function getParent(pid) {
    var index = self.indexes[pid + ''];
    _parentsNode.push(index.node);

    getParent(index.parent);
  }

  getParent(_parentId);

  return _parentsNode.reverse();
}

/**
 * Only get direct children's node
 * 
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
proto.getChildrenNode = function(id) {
  var self = this;
  var index = self.indexes[id + ''];

  var hasChildren = index.children && index.children.length ? true : false;

  return hasChildren 
    ? index.children.map(function(cid) {
      return self.getIndex(cid).node;
    })
    : [];
}



module.exports = Tree;