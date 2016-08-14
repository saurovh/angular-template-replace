/*
 * angular-template-url-replace-content
 * https://github.com/fisherman/gruntplugin
 *
 * Copyright (c) 2016 Fisherman
 * Licensed under the MIT license.
 */

'use strict';
var minify = require('html-minifier').minify;
   

   function escapeString(str){
      var str;
        str = str.replace(/\\/g, "\\\\")
                 .replace(/'/g, "\\'");
      return str;
   }

module.exports = function(grunt) {


  grunt.registerMultiTask('angular-template-url-replace-content', 'this for replacing angular templateUrl : \'/path/to/template\' to its content like template : \'html cotent\'', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });
    var regex = /(\/{2,}([\s]+)?)?templateUrl\s?:([\s]+)?'([\w\W]+?)'(,)?/g;
    var regexw = /template\s?:([\s]+)?'([\w\W]+?)([^\\]')(,)?([\n]+)?/g;
    var full = /(\/{2,}([\s]+)?)?templateUrl\s?:([\s]+)?'([\w\W]+?)'(,)?(([\n]+)?template\s?:([\s]+)?'([\w\W]+?)([^\\]')(,)?([\n]+)?)?/g
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var destination;
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          destination = filepath;
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        //console.log('File "' + destination + '" requesting for process');
        return grunt.file.read(filepath);
      });
      //templateUrl : 'asdasdasdasd',
      /*  GruntreplaceStart*/
      // content
      // /*gruntreplaceend*/
      // // Handle options.
      // src += options.punctuation;
        grunt.log.writeln("asdasdasd");
        var str  = src.toString();
        if(!regex.test(str)){
          console.log("no template url found"+destination);
          return;
        }
       str = str.replace(full,function(match){
            var r_str,newline;
            r_str = match.replace(regexw,function(match,space,content,escapedbnit,coma,newline){
                  newline = newline;
                     return "";
                });
            newline = newline || "";
            r_str = r_str.replace(regex,function(match,slash,space,space2,path,coma){
                  var template,minified;
                  try {
                    template = grunt.file.read(path);
                     minified = escapeString(minify(template, {
                      preventAttributesEscaping: true,
                      collapseWhitespace: true
                    }));
                  }catch(e){
                    console.log("template not found");
                    minified = path;
                  }
                  slash = slash ? "" : "//";
                  return slash + match + '\n\r\t\t\ttemplate :  \''+minified + '\''+(coma || "")+newline;
                });
              return r_str;
        });


       //  str = str.replace(regexw,function(match,space,content,escapedbnit,coma,newline){
       //    newline = newline;
       //       return "";
       //  });
       //  newline = newline || "";
       // str = str.replace(regex,function(match,slash,space,space2,path,coma){
       //    var template,minified;
       //    try {
       //      template = grunt.file.read(path);
       //       minified = escapeString(minify(template, {
       //        preventAttributesEscaping: true,
       //        collapseWhitespace: true
       //      }));
       //    }catch(e){
       //      console.log("template not found");
       //      minified = path;
       //    }
       //    slash = slash ? "" : "//";
       //    return slash + match + '\n\r\t\t\ttemplate :  \''+minified + '\''+(coma || "")+newline;
       //  });
        console.log(str);
      // // Write the destination file.
      if(destination){
        //grunt.file.write(destination, str);  
      }
      

      // Print a success message.
      console.log('File "' + destination + '" updated.');
    });
  });

};

// 'use strict';

// var path = require('path'),
//     fs = require('fs'),
//     minify = require('html-minifier').minify,
//     escape = require('js-string-escape');

// function getFile (name, paths) {
//   var file;
//   paths.forEach(function (p) {
//     var tPath = path.resolve(process.cwd(), p, name);
//     try {
//       file = fs.readFileSync(tPath).toString();
//     } catch (e) {
//       console.log(e.message);
//       return;
//     }
//   });
//   return file;
// }

// module.exports = function(grunt) {
//   var desc = 'Replace templateUrl to template in angular directives';

//   grunt.registerMultiTask('embedAngularTemplates', desc, function () {
//     debugger;
//     var options = this.options({
//       views: ['']
//     });
//     if (!Array.isArray(options.views)) {
//       throw new Error('options.views must be an Array');
//     }
//     // Iterate over all specified file groups.
//     this.files.forEach(function(f) {
//       // Concat specified files.
//       var src = f.src.filter(function(filepath) {
//         // Warn on and remove invalid source files (if nonull was set).
//         if (!grunt.file.exists(filepath)) {
//           grunt.log.warn('Source file "' + filepath + '" not found.');
//           return false;
//         } else {
//           return true;
//         }
//       }).map(function(filepath) {
//         // Read file source.
//         return grunt.file.read(filepath);
//       }).map(function (file) {
//         var regex = /templateUrl:/g,
//             result,
//             indices = [];
//         while ( (result = regex.exec(file)) ) {
//             var index = result.index;
//             var tmp = file.substring(index);
//             var match = tmp.match(/'([^']*)'/);
//             var contents = getFile(match[1], options.views);
//             if (!contents) {
//               grunt.log.writeln('File "' + match[1] + '" was not found in given paths.');
//               continue;
//             }
//             var minified = escape(minify(contents, {
//               preventAttributesEscaping: true,
//               collapseWhitespace: true
//             }));

//             var start = tmp.indexOf(match[1]) + file.length - tmp.length,
//                 end = start + match[1].length;

//             file = file.substring(0, start) + minified + file.substring(end);
//             file = file.substring(0, index) + 'template:' + file.substring(index + 12);
//         }
//         return file;
//       });

//       grunt.file.write(f.src, src);
//       grunt.log.writeln('File "' + f.src + '" processed.');
//     });
//   });

// };
