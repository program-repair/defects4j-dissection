var fs = require('fs');
var exec = require('child_process').exec;

var parse = require('csv-parse');
var transform = require('stream-transform');

var ejs = require('ejs');


var defects4jPath = "/home/thomas/git/defects4j/framework/bin/defects4j";
var defects4jBuggyProjectsPath = "/mnt/secondary/projects/";
var defects4jFixedProjectsPath = "/mnt/secondary/projects_fix/";

var input = fs.createReadStream(__dirname + '/defects4j-bugs.csv');

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

function parseDefects4jInfo(strInfo, record) {
  var program = strInfo.match(/Program: ([^\n]+)/)[1];
  var revisionId = strInfo.match(/Revision ID \(fixed version\):\n([^\n]+)/)[1];
  var strFailingTests = strInfo.match(/Root cause in triggering tests:\n(.|[\r\n])+List/)[0];
  var failingTestsLines = strFailingTests.split(/\r?\n/);

  var failingTests = [];
  var currentTest = null;
  for (var i = 1; i < failingTestsLines.length - 2; i++) {
    var line = failingTestsLines[i];
    if (line[1] == '-') {
      line = line.substring(2);
      currentTest = {
        "className": line.substring(0, line.indexOf("::")),
        "methodName": line.substring(line.indexOf("::") + 2)
      }
    } else {
      line = line.substring(7);
      
      var error = line;
      var message = '';

      var index = line.indexOf(':');
      
      if (index != -1) {
        error = line.substring(0, index);
        message = line.substring(index + 2);
      }
      currentTest["error"] = error;
      currentTest["message"] = message;
      if (currentTest != null) {
        failingTests.push(currentTest);
      }
    }
  }
  record.program = program;
  record.revisionId = revisionId;
  record.failingTests = failingTests;
  return record;
}

function cleanDiff(diff, projectPath) {
  var indexBegin = diff.indexOf("diff --git ");
  var endHeader = diff.indexOf("---", indexBegin);
  while (indexBegin != -1) {
    diff = diff.replace(diff.substring(indexBegin, endHeader), "");
    indexBegin = diff.indexOf("diff --git ");
    endHeader = diff.indexOf("---", indexBegin);
  }
  diff = diff.replace(new RegExp(defects4jBuggyProjectsPath  + projectPath, 'g'), "").replace(new RegExp(defects4jFixedProjectsPath  + projectPath, 'g'), "");
  return diff;
}

var defects4jInfoFunc = function(record, callback) {
  var cmd = defects4jPath + ' info -p ' + record['project'] + ' -b ' + record['bugId'];

  exec(cmd, function(error, stdout, stderr) {
    record = parseDefects4jInfo(stdout, record);

    var projectPath =  record['project'].toLowerCase() + '/' + record['project'].toLowerCase() + '_' + record['bugId'];

    var sources = ["src/java", "src/main/java", "src", "source"]
    for (var i = 0; i < sources.length; i++) {
      if(fs.existsSync(defects4jBuggyProjectsPath  + projectPath + "/" + sources[i])) {
        cmd = 'git diff '
        if (projectPath.indexOf("chart_18") != -1 || projectPath.indexOf("closure_43") != -1 || projectPath.indexOf("closure_98") != -1 || 
          projectPath.indexOf("lang_13") != -1 || projectPath.indexOf("lang_56") != -1 || projectPath.indexOf("math_47") != -1 || 
          projectPath.indexOf("math_65") != -1 || projectPath.indexOf("mockito_16") != -1 || projectPath.indexOf("mockito_25") != -1) {
          cmd += "-U0 -W "
        }
        cmd +=  defects4jBuggyProjectsPath  + projectPath  + "/" + sources[i] + ' ' + defects4jFixedProjectsPath + projectPath + '/' + sources[i];
        console.log(cmd)
        exec(cmd, function(error, stdout, stderr) {
          if (stderr == '' || stderr.indexOf("warning") != -1) {
            record['diff'] = cleanDiff(stdout, projectPath);
            callback(null, record)
          } else {
            console.log(error)
            callback(error, record)
          }
        });
        break;
      }
    }
  });
}

var defects4jInfo = transform(defects4jInfoFunc, {parallel: 10});

output = []
input.pipe(parser).pipe(transformer).pipe(defects4jInfo).pipe(transform(function (record, callback) {
  output.push(record);
  callback(null, null);
})).on('finish', function () {  // finished
  fs.writeFile(__dirname + '/../defects4j-bugs.json', JSON.stringify(output), 'utf8', function(err) {});
  fs.writeFile(__dirname + '/../docs/data/defects4j-bugs.json', JSON.stringify(output), 'utf8', function(err) {});
}).on('end', function (err) {
  console.log(err)
})