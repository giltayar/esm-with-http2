const fs = require('fs')
const path = require('path')

const webpackOutputLines = fs.readFileSync(path.join(__dirname, '../dist/webpack-output.txt'), 'utf-8').split('\n')

const builtLibraries = webpackOutputLines.filter(l => l.includes('built')).map(l =>
  (l.match('lodash-es/([a-zA-Z_.]+)') || [null, null])[1]).filter(l => !!l)

const writeFileAsync = (name, content) =>
  new Promise((resolve, reject) => fs.writeFile(name, content, (err) => err ? reject(err) : resolve))

const randomNumber = Math.floor(Math.random() * 10000)

builtLibraries.forEach(bl => writeFileAsync(path.join(__dirname, '../dist/simulation', bl), `
var ${bl.split('.')[0]}${randomNumber} = ${Math.random()}
function foo () {
  for (var x = 0; x < Math.random(); ++x) {
    doSomething();
  }
}
`.repeat(50)))

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
