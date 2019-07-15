//handel.js
/*
    数据增删改查模块封装
    req.query 解析GET请求中的参数 包含在路由中每个查询字符串参数属性的对象，如果没有则为{}
    req.params 包含映射到指定的路线“参数”属性的对象,如果有route/user/：name，那么“name”属性可作为req.params.name
    req.body通常用来解析POST请求中的数据
     +req.query.id 可以将id转为整数
 */
// 引入mysql
const mySql = require('mysql');
// 引入mysql配置信息
const mySqlInfo = require('./sql-info')
// 引入连接池
const poll = require('./poll')
// 引入sql模块
const sql = require('./sql')
// 使用连接池，提升性能
var pool = mySql.createPool(poll({}, mySqlInfo));
var userData = {
  add: function (req, res, next) {
    pool.getConnection(function (err, connection) {
      var param = req.query || req.params;
      connection.query(sql.insert, [param.name, param.age], function (err, result) {
        if (result) {
          result = 'add'
        }
        res.json({
          status: 0,
          result
        })
        // 释放连接 
        connection.release();
      });
    });
  },
  delete: function (req, res, next) {
    pool.getConnection(function (err, connection) {
      var id = +req.query.id;
      connection.query(sql.delete, id, function (err, result) {
        if (result.affectedRows > 0) {
          result = 'delete';
        } else {
          result = undefined;
        }
        res.json({
          status: 0,
          result: result
        })
        connection.release();
      });
    });
  },
  update: function (req, res, next) {
    var param = req.body;
    if (param.name == null || param.age == null || param.id == null) {
      json(res, undefined);
      return;
    }
    pool.getConnection(function (err, connection) {
      connection.query(sql.update, [param.name, param.gender, +param.id], function (err, result) {
        if (result.affectedRows > 0) {
          result = 'update'
        } else {
          result = undefined;
        }
        res.json({
          status: 0,
          result: result
        })
        connection.release();
      });
    });
  },
  queryById: function (req, res, next) {
    var id = +req.query.id;
    pool.getConnection(function (err, connection) {
      connection.query(sql.queryById, id, function (err, result) {
        if (result != '') {
          var _result = result;
          result = {
            result: 'select',
            data: _result
          }
        } else {
          result = undefined;
        }
        res.json({
          status: 0,
          result: result
        })
        connection.release();
      });
    });
  },
  queryAll: function (req, res, next) {
    pool.getConnection(function (err, connection) {
      connection.query(sql.queryAll, function (err, result) {
        if (err) throw err
        const data = result.filter(el => el.user_gender === '男')
        const _result = []
        data.forEach(el => {
          connection.query('select * from user_info where user_name=?', [el.user_name], (err, data) => {
            if (err) throw err
            _result.push(data[0])
          })
        })
        setTimeout(function () {
          res.json({
            status: 01,
            data: _result
          })
          connection.release();
        }, 100);
      });
    });
  }
};
module.exports = userData;