const Router = require('koa-router')
const api = new Router()

const method = require('../methods')

const apiHandle = async (ctx) => {
  const methodWithExt = ctx.params[0].match(/(.*).(png|webp)/)
  if (methodWithExt) ctx.props.ext = methodWithExt[2]
  const raw = methodWithExt ? methodWithExt[1] : ctx.params[0]
  console.log('RAW PARAM:', ctx.params[0])
  const name = raw.split('/').pop()
  ctx.result = await method(name, ctx.props)

}

api.post('/*', apiHandle)

module.exports = api
