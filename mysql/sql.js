var user = {
  insert: 'INSERT INTO user_info(user_name, user_gender) VALUES(?,?)',
  update: 'UPDATE user SET user_name=?, user_gender=? WHERE user_id=?',
  delete: 'DELETE FROM user_info WHERE user_id=?',
  queryById: 'SELECT * FROM user_info WHERE user_id=?',
  queryAll: 'SELECT * FROM user_info'
};
module.exports = user;