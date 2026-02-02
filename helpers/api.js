module.exports = async (ctx, next) => {
  ctx.props = {
    ...(ctx.query || {}),
    ...(ctx.request.body || {})
  }

  try {
    await next()

    // Jika route sudah set body sendiri, jangan diganggu
    if (typeof ctx.body !== 'undefined') return

    // Jika route tidak set ctx.result
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

    // Jika route mengembalikan error
    if (ctx.result.error) {
      ctx.status = 400
      ctx.body = {
        ok: false,
        error: {
          code: 400,
          message: ctx.result.error
        }
      }
      return
    }

    // Jika response berupa image/binary
    if (ctx.result.ext) {
      const mimeMap = {
        webp: 'image/webp',
        png: 'image/png'
      }

      if (mimeMap[ctx.result.ext]) {
        ctx.set('content-type', mimeMap[ctx.result.ext])
      }

      ctx.set('quote-type', ctx.result.type)
      ctx.set('quote-width', ctx.result.width)
      ctx.set('quote-height', ctx.result.height)

      ctx.body = ctx.result.image
      return
    }

    // Default JSON response
    ctx.body = {
      ok: true,
      result: ctx.result
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
