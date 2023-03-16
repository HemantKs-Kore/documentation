const puppeteer = require('puppeteer');
const util = require('util');
const fs = require('fs');
const distDir = 'dist/apps/searchassist/';
const cssmin = require('cssmin');

async function login(page) {
  await page.goto('https://searchassist-qa.kore.ai/home/');
  await page.type('[name=emailPhone]', 'hemant.ajax@gmail.com');
  await page.click('.continueBtn');

  await page.type('#sign_in_creds_pass', 'Hemant@2023');
  await page.click('.btn-primary');

  await page.waitForNavigation();
}

function updateHtml(criticalCssStr) {
  fs.readFile(distDir + 'index.html', 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    var result = data.replace(/\<\/style>/g, criticalCssStr + '</style>');

    fs.writeFile(distDir + 'index.html', result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await login(page); // Call the login function

  await page.coverage.startCSSCoverage();
  await page.goto('http://localhost:4200/'); // Change this
  const css_coverage = await page.coverage.stopCSSCoverage();
  // console.log(util.inspect(css_coverage, { showHidden: false, depth: null }));
  await browser.close();

  let final_css_bytes = '';
  let final_unused_css_bytes = '';
  let total_bytes = 0;
  let used_bytes = 0;
  let unused_bytes = 0;
  let filename;

  for (const entry of css_coverage) {
    if (!filename && entry.url.includes('.css')) {
      filename = entry.url.split('/').pop();
    }

    // final_css_bytes = '';
    // final_unused_css_bytes = '';
    total_bytes += entry.text.length;

    // Handle unused css
    if (!entry.ranges.length) {
      final_unused_css_bytes += entry.text;
    } else {
      entry.ranges.forEach((current, index) => {
        const next = entry.ranges[index + 1];
        if (next) {
          unused_bytes += next.start - current.end - 1;
          final_unused_css_bytes +=
            entry.text.slice(current.end, next.start) + '\n';
        }

        // Handle used css
        used_bytes += current.end - current.start - 1;
        final_css_bytes += entry.text.slice(current.start, current.end) + '\n';
      });
    }

    // Handle used css
    // for (const range of entry.ranges) {
    //   used_bytes += range.end - range.start - 1;
    //   final_css_bytes += entry.text.slice(range.start, range.end) + '\n';
    // }
  }

  // console.log('HERE', filename);
  // if (filename.includes('.css')) {
  //   // update critical css
  //   console.log(cssmin(final_css_bytes));
  //   updateHtml(cssmin(final_css_bytes));
  // }

  fs.writeFile('tools/' + filename, cssmin(final_unused_css_bytes), (error) => {
    if (error) {
      console.log('Error creating file unused', error);
    } else {
      console.log('File saved unused');
    }
  });
})();
