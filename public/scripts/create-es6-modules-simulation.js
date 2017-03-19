const fs = require('fs')
const path = require('path')

const webpackOutputLines = fs.readFileSync(path.join(__dirname, '../dist/webpack-output.txt'), 'utf-8').split('\n')

const builtLibraries = webpackOutputLines.filter(l => l.includes('built')).map(l =>
  (l.match('lodash-es/([a-zA-Z_.]+)') || [null, null])[1]).filter(l => !!l)

const writeFileAsync = (name, content) =>
  new Promise((resolve, reject) => fs.writeFile(name, content, (err) => err ? reject(err) : resolve))

const randomNumber = () => Math.floor(Math.random() * 10000)

builtLibraries.forEach(bl => writeFileAsync(path.join(__dirname, '../dist/simulation', bl), `
/**
 * This method is like _.zip except that it accepts an array of grouped
 * elements and creates an array regrouping the elements to their pre-zip
 * configuration.
 *
 * @static
 * @memberOf _
 * @since 1.2.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * var zipped = _.zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 *
 * _.unzip(zipped);
 * // => [['a', 'b'], [1, 2], [true, false]]
 */
function unzip${randomNumber()}(array) {
  if (!(array && array.length)) {
    return [];
  }
  var length = 0;
  array = arrayFilter(array, function(group) {
    if (isArrayLikeObject(group)) {
      length = nativeMax(group.length, length);
      return true;
    }
  });
  return baseTimes(length, function(index) {
    return arrayMap(array, baseProperty(index));
  });
}`.repeat(2)))

fs.writeFileSync(path.join(__dirname, '../dist/es6-modules-simulation.html'), `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <script>
    const $ = document.querySelector.bind(document)
  </script>
  <h1 id="output">It doesn't work...</h1>
  <div><a href="../es6-modules.html">es6 modules</a></div>
  <div><a href="../webpack-modules.html">webpack modules</a></div>
  <div><a href="es6-modules-simulation.html">es6 modules simulation</a></div>

  ${
    builtLibraries.map(bl => `<script src="simulation/${bl}"></script>`).join('\n')
  }
  <script>
    $('#output').textContent = 'It works perfectly!'
  </script>
</body>
</html>
`)
