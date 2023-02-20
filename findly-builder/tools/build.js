const shell = require('shelljs');
var concat = require('concat-files');

const scriptsArr = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/popper.js/dist/umd/popper.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js',
  'apps/searchassist/src/app/helpers/lib/assets/highlight.js/highlight.min.js',
  'apps/searchassist/src/assets/js/bootstrap-slider.js',
  'apps/searchassist/src/assets/js/appcues.js',
  'node_modules/mixpanel-browser/dist/mixpanel-jslib-snippet.min.js',
];

function minifyScript(sourcePath) {
  if (
    shell.exec(
      `uglifyjs ${sourcePath} --module --compress --mangle --warn --output ${sourcePath}`
    )
  ) {
    shell.echo(`${sourcePath} minification success`);
    shell.exit(1);
  }
}

function bundleScripts(scriptArr, bundleName) {
  const sourcePath = `./apps/searchassist/src/assets/js/${bundleName}.min.js`;
  concat(scriptArr, sourcePath, function (err) {
    if (err) throw err;
    console.log(`Bundle ${bundleName}.min.js created`);
    minifyScript(sourcePath);
  });
}

bundleScripts(scriptsArr, 'scripts');
