const debug = require('debug')

const log = debug('@sequencemedia/number-parser')

log('`number-parser` is awake')

const {
  env: {
    NODE_ENV = 'development'
  }
} = process

function env () {
  log({ NODE_ENV })

  return (
    NODE_ENV === 'production'
  )
}

const presets = [
  [
    '@babel/env',
    {
      targets: {
        node: 'current'
      },
      useBuiltIns: 'usage',
      corejs: 3
    }
  ]
]

module.exports = (api) => {
  if (api) api.cache.using(env)

  return {
    presets
  }
}
