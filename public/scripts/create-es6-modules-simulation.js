const fs = require('fs')
const path = require('path')

const webpackOutputLines = fs.readFileSync(path.join(__dirname, '../dist/webpack-output.txt'), 'utf-8').split('\n')

const builtLibraries = webpackOutputLines.filter(l => l.includes('built')).map(l =>
  (l.match('lodash-es/([a-zA-Z_.]+)') || [null, null])[1]).filter(l => !!l).filter(l => l.endsWith('.js'))

const writeFileAsync = (name, content) =>
  new Promise((resolve, reject) => fs.writeFile(name, content, (err) => err ? reject(err) : resolve()))
const readFileAsync = (name) =>
  new Promise((resolve, reject) => fs.readFile(name, 'utf-8',
    (err, content) => err ? reject(err) : resolve(content)))

builtLibraries.forEach(bl => readFileAsync(path.join(__dirname, '../node_modules/lodash-es', bl)).then(content =>
  writeFileAsync(path.join(__dirname, '../dist/simulation', bl),
    content
      .replace(/export {.*;/g, '')
      .replace(/export default/g, '')
      .replace(/export/g, '')
      .replace(/import .*;/g, ''))))

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
  <script>
    console.time('benchmark')
  </script>

  ${
    builtLibraries.map(bl => `<script src="simulation/${bl}"></script>`).join('\n')
  }
  <script>
    $('#output').textContent = 'It works perfectly!'
    console.timeEnd('benchmark')
  </script>
</body>
</html>
`)
