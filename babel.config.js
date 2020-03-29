const prodPlugins = []
if(process.env.NODE_ENV === 'production') {
  prodPlugins.push("transform-remove-console")
}

module.exports = {
  "presets": [
    "@vue/app"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    //发布阶段的插件"transform-remove-console"
    ...prodPlugins
  ]
}