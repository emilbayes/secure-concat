# `secure-concat`

[![Build Status](https://travis-ci.org/emilbayes/secure-concat.svg?branch=master)](https://travis-ci.org/emilbayes/secure-concat)

> Yet another `concat-stream`, but cleans its internal state after use

## Usage

```js
var concat = require('secure-concat')

var ch1 = Buffer.from('hello')
var ch2 = Buffer.from(' ')
var ch3 = Buffer.from('world')

var s = concat({limit: 11}, function (err, slab) {
  assert(slab.toString(), 'hello world')
  assert(ch1.equals(Buffer.from([0, 0, 0, 0, 0])))
  assert(ch2.equals(Buffer.from([0])))
  assert(ch3.equals(Buffer.from([0, 0, 0, 0, 0])))
})

s.write(ch1)
s.write(ch2)
s.end(ch3)
```

## API

### `var stream = concat([opts], cb)`

Takes optional `opts` and `cb(err, buf)`, and returns a `WritableStream`.
You can limit how many bytes the stream will accept before causing an error with
`opts.limit`, which defaults to `Infinity`. You can disable cleaning of internal
state with `opts.cleanup`, which defaults to true. Cleanup consists of `.fill(0)`
of the received `Buffer`s in case of an error, and after the `Buffer`s have been
`concat`ed together.

## Install

```sh
npm install secure-concat
```

## License

[ISC](LICENSE.md)
