var to2 = require('to2')
var assert = require('nanoassert')

module.exports = function (opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = null
  }

  opts = opts || {}
  if (opts.limit == null) opts.limit = Infinity
  if (opts.cleanup == null) opts.cleanup = true

  assert(typeof opts.limit === 'number', 'opts.limit must be number')
  assert(opts.limit > 0, 'opts.limit must be greater than 0')
  assert(typeof opts.cleanup === 'boolean', 'opts.cleanup must be boolean')
  assert(typeof cb === 'function', 'cb must be function')

  var chunks = []
  var size = 0

  var stream = to2(function (chunk, enc, done) {
    chunks.push(chunk)
    size += chunk.length

    if (size > opts.limit) return this.destroy(new Error('Limit exceeded'))

    done()
  })

  stream.on('error', function (err) {
    clean(err)
  })

  stream.on('finish', function () {
    clean(null, Buffer.concat(chunks, size))
  })

  return stream

  function clean (err, res) {
    if (opts.cleanup) chunks.forEach(function (ch) {
      ch.fill(0)
    })

    cb(err, res)
    cb = chunks = size = null
  }
}
