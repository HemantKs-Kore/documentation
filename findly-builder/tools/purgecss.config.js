const sourceDir = 'dist/apps/searchassist';

module.exports = {
  content: [`${sourceDir}/index.html`, `${sourceDir}/*.js`],
  css: [`${sourceDir}/*.css`],
  output: sourceDir,
  safelist: {
    standard: [/red1$/],
    deep: [/^cm-s-neo/],
    greedy: [/noUi-/],
  },
};
