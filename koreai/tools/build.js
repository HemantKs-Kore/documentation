// const shell = require('shelljs');

// function buildRangy() {
//   if (
//     shell.exec(
//       `uglifyjs node_modules/rangy/lib/rangy-core.js --module --compress --mangle --warn --output apps/searchassist/src/assets/js/rangy.min.js`
//     )
//   ) {
//     shell.echo('Rangy build success');
//     shell.exit(1);
//   }
// }

// buildRangy();

var concat = require('concat-files');
concat(
  ['node_modules/rangy/lib/rangy-core.js'],
  './apps/searchassist/src/assets/js/rangy.min.js',
  function (err) {
    if (err) throw err;
    console.log('done');
    // buildRangy();
  }
);
