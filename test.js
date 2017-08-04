var test = require('tape')
var concat = require('.')

test('Mixed test', function (assert) {
  var ch1 = Buffer.from('hello')
  var ch2 = Buffer.from(' ')
  var ch3 = Buffer.from('world')

  var s = concat({limit: 11}, function (err, slab) {
    assert.error(err)
    assert.equal(slab.length, 11)
    assert.equal(slab.toString(), 'hello world')
    assert.ok(ch1.equals(Buffer.alloc(ch1.length)))
    assert.ok(ch2.equals(Buffer.alloc(ch2.length)))
    assert.ok(ch3.equals(Buffer.alloc(ch3.length)))
    assert.end()
  })

  s.write(ch1)
  s.write(ch2)
  s.end(ch3)
})

test('Limit error', function (assert) {
  var s = concat({limit: 1}, function (err, slab) {
    assert.ok(err)
    assert.end()
  })

  s.write(Buffer.from('  '))
})

test('No cleanup', function (assert) {
  var ch = Buffer.from('hello')
  var s = concat({cleanup: false}, function (err, slab) {
    assert.error(err)
    assert.ok(slab.equals(ch))
    assert.equals(ch.toString(), 'hello')
    assert.end()
  })

  s.end(ch)
})

test('Empty buffer', function (assert) {
  var s = concat(function (err, slab) {
    assert.error(err)
    assert.ok(slab.equals(Buffer.alloc(0)))
    assert.end()
  })

  s.end()
})
