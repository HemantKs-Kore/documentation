const puppeteer = require('puppeteer');
const util = require('util');
const fs = require('fs');
const distDir = 'dist/apps/searchassist/';
const cssmin = require('cssmin');

function updateHtml(criticalCssStr) {
  fs.readFile(distDir + 'index.html', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    var result = data.replace(/\<\/style>/g, criticalCssStr + '</style>');

    fs.writeFile(distDir + 'index.html', result, 'utf8', function (err) {
      if (err) return console.log(err);
      console.log(`Critical css updated in ${distDir}index.html`);
    });
  });
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let pageUrl = 'http://127.0.0.1:8080/';
  await page.coverage.startCSSCoverage();

  await page.goto(pageUrl);
  const css_coverage = await page.coverage.stopCSSCoverage();
  // console.log(util.inspect(css_coverage, { showHidden: false, depth: null }));
  await browser.close();

  let filename;
  let final_css_bytes = '';

  for (const entry of css_coverage) {
    let final_unused_css_bytes = '';

    if (!entry.url.includes('.css')) {
      continue;
    }

    if (entry.url.includes(filename)) {
      continue;
    }

    filename = entry.url.split('/').pop();

    // Handle unused css
    if (!entry.ranges.length) {
      final_unused_css_bytes += entry.text;
    } else {
      entry.ranges.forEach((current, index) => {
        const next = entry.ranges[index + 1];

        if (index === 0) {
          final_unused_css_bytes += entry.text.slice(0, current.start) + '\n';
        }

        if (next) {
          final_unused_css_bytes +=
            entry.text.slice(current.end, next.start) + '\n';
        } else {
          final_unused_css_bytes += entry.text.slice(
            current.end,
            entry.text.length
          );
        }

        // Handle used css
        final_css_bytes += entry.text.slice(current.start, current.end) + '\n';
      });
    }

    fs.writeFileSync(distDir + filename, cssmin(final_unused_css_bytes));
    console.log(`Unused css saved in ${distDir + filename}`);
  }

  updateHtml(cssmin(final_css_bytes));
})();
