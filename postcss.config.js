const IN_PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
  plugins: [
    IN_PRODUCTION && require('@fullhuman/postcss-purgecss')({
      content: [
          `./public/**/*.html`,
        `./src/**/*.vue`,
        `./node_modules/element-ui/packages/container/src/*.vue`,
        `./node_modules/element-ui/packages/main/src/*.vue`,
        `./node_modules/element-ui/packages/popconfirm/src/*.vue`,
        `./node_modules/element-ui/packages/table/src/*.vue`,
        `./node_modules/element-ui/packages/table-column/src/*.vue`,
        `./node_modules/element-ui/packages/menu/src/*.vue`,
        `./node_modules/element-ui/packages/menu-item/src/*.vue`,
        `./node_modules/element-ui/packages/button/src/*.vue`,
        `./node_modules/element-ui/packages/alert/src/*.vue`,
        `./node_modules/element-ui/packages/input/src/*.vue`,
        `./node_modules/element-ui/packages/form/src/*.vue`,
        `./node_modules/element-ui/packages/form-item/src/*.vue`,
        `./node_modules/element-ui/packages/card/src/*.vue`,
      ],
      defaultExtractor (content) {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
      },
      whitelist: [],
      whitelistPatterns: [ /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/ ],
    })
  ],
}
