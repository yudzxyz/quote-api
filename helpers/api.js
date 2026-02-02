module.exports = async (ctx, next) => {
  ctx.props = Object.assign({}, ctx.props || {}, ctx.query || {}, ctx.request.body || {})

  try {
    await next()

    // Pastikan ctx.result ada, jika tidak kembalikan 404
    if (!ctx.result) {
      ctx.status = 404
      ctx.body = {
        ok: false,
        error: {
          code: 404,
          message: 'Not Found'
        }
      }
      return
    }

    if (ctx.result.error) {
      ctx.status = 400
      ctx.body = {
        ok: false,
        error: {
          code: 400,
          message: ctx.result.error
        }
      }
    } else {
      if (ctx.result.ext) {
        if (ctx.result.ext === 'webp') ctx.response.set('content-type', 'image/webp')
        if (ctx.result.ext === 'png') ctx.response.set('content-type', 'image/png') 
        ctx.response.set('quote-type', ctx.result.type)
        ctx.response.set('quote-width', ctx.result.width)
        ctx.response.set('quote-height', ctx.result.height)
        ctx.body = ctx.result.image
      } else {
        ctx.body = {
          ok: true,
          result: ctx.result
        }
      }
    }
  } catch (error) {
    console.error(error)
    ctx.status = error.statusCode || error.status || 500
    ctx.body = {
      ok: false,
      error: {
        code: ctx.status,
        message: error.message,
        description: error.description
      }
    }
  }
}