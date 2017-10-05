var fs = require('fs');
var parse = require('csv-parse');
var transform = require('stream-transform');

var ejs = require('ejs');

var input = fs.createReadStream('./data.csv');

var template = null;
// Create the parser
var parser = parse({delimiter: ','});
var transformer = transform(function(record, callback){
  var value = null
  if (template == null) {
    template = record
  } else {
    value = {}
    for (var i in template) {
      if (record[i].toLowerCase() == 'x') { 
        value[template[i]] = true;
      } else if (record[i] != '') { 
        if (!isNaN(record[i])) {
          value[template[i]] = +record[i];
        } else {
          value[template[i]] = record[i];
        }
      }
    }
  }
  callback(null, value);
}, {parallel: 10});

output = []
input.pipe(parser).pipe(transformer).pipe(transform(function (record, callback) {
  output.push(record);
  callback(null, null);
}));

parser.on('finish', function(){
  fs.writeFile('docs/data/bugs.json', JSON.stringify(output), 'utf8', function(err) {
    if (err) return console.err(err);
  });
});