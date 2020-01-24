//  Updates iOS Version
//  ===================
//
//  This script extends `npm version` functionality to also
//  update the version number in Info.plist for the App Store.
//
//  It runs after package.json version has been updates, but before git commit.
//
//  See https://docs.npmjs.com/cli/version for more info.
//
//
//  ### Install
//
//  Add to package.json scripts {
//    "version": "node ./version.ts",
//  }
//
//  ### Usage
//
//  "npm version [major|minor|patch]"
//

const { version } = require('./package.json')
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

const plistPath = require('path').join(__dirname, './ios/GoenkaNative/Info.plist')

;(async () => {
  // Write new version number to Info.plist
  await exec(`/usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString ${version}" ${plistPath}`)
  console.log(`ios: Updated Info.plist to ${version}`)

  // Add the changed files to git's index before it commits
  await exec('git add .')
})()
