module.exports = {
  presets: [
    ['@vue/app',{
       useBuiltIns: 'entry',
       targets: {
        chrome: '65',
       },
    }],
    ['@vue/babel-preset-jsx',{
        "injectH": false
    }]
  ]
}
