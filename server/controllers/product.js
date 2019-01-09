const DB = require('../utils/db.js')

module.exports = {
  list: async ctx => {
    ctx.state.data = await DB.query('SELECT * FROM product;')
  },
  detail: async ctx => {
    const id = +ctx.params.id;
    if(!isNaN(id)){
      ctx.state.data = (await DB.query('SELECT * FROM product WHERE product.id =?', [id]))[0]
    }else{
      ctx.state.data = {}
    }
  }
}