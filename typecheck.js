// Run this script to check our files for type errors
// using our existing tsconfig.json settings
//
// Usage: node typecheck.js
//

const fs = require('fs')
const stripJsonComments = require('strip-json-comments')
const tsConfig = JSON.parse(stripJsonComments(fs.readFileSync('./tsconfig.json', 'utf8')))
const { exec } = require('child_process')
const chalk = require('chalk')

const filesToCheck = 'src/*.ts{,x}' // <--- YOU PROBABLY WANT TO CHANGE

const options = {
  ...tsConfig.compilerOptions,

  // Overrides:
  incremental: false,
}

let optionsString = ''

Object.keys(options).forEach(key => {
  const value = options[key]
  const option = '--' + key
  const type = typeof value

  if (type === 'boolean') {
    if (value) {
      optionsString += option + ' '
    }
  } else if (type === 'string') {
    optionsString += option + ' ' + value + ' '
  } else if (type === 'object') {
    if (Array.isArray(value)) {
      optionsString += option + ' ' + value.join(',') + ' '
    }
  } else {
    console.log('\nMissing support for compilerOption:')
    console.log({ [key]: { type, value } })
  }
})

console.log('💅  Typechecking files...')
exec(`tsc ${filesToCheck} ${optionsString}`, (err, stdout) => {
  const results = stdout
    .split('\n')

    // Filter out excludes
    .filter(line => !tsConfig.exclude.some(exclude => line.startsWith(exclude)))

    // Highlight filenames
    .map(line => line.replace(/^(\w|-|\/|\.)+tsx?/, filename => chalk.bold.cyan(filename)))

    // Remove empty lines
    .filter(line => line)

  if (err && results.length) {
    console.log(results.join('\n'))
  } else {
    console.log('✅  Typecheck passed without errors.')
  }
})
