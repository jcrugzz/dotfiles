#!/usr/bin/env node

/*
 * Author: Jarrett Cruger
 */

/* Script to use after installing Zprezto to reinstate my default settings
 * Would be cleaner if I used async but I wanted to write it with zero node_modules
 *
 * Script Makes the Assumption that this .dotfiles directory is in the user folder ~/
 */

var fs = require('fs');
var path = require('path');

var ignore = ['.git', 'README.md', 'linkFiles.js'];
var toDelete = ['.zpreztorc', '.zshrc'];
var count = 0;
var count2 = 0;

// Delete and then Link files
deleteFiles(linkFiles);

//Deletes default files generated by Sorin's zprezto and replaces it with my custom files
function deleteFiles (callback) {
    toDelete.forEach(function(val, idx) {
        fs.unlink(path.resolve('..') + '/' + val, function(exception) {
            if(exception) {
                throw exception;
            }
        });
        check();
    });

    function check () {
        ++count;
        if(count === toDelete.length) {
            callback();
        }
    }
}

// Links all my custom dotfiles to the user directory
function linkFiles () {
    count2 = 0;
    fs.readdir(path.resolve('.'), function (err, files) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        console.log(files);
        stat(files);
    });

    function stat (files) {
        files.forEach(function (val, idx) {
            if(ignore.indexOf(val) === -1) {
                fs.stat(path.resolve(val), function (err, stats) {
                    if(err) {
                        console.log(err);
                        process.exit(1);
                    }
                    if(stats.isFile()) {
                        link('file', val);
                    } else if (stats.isDirectory()) {
                        link('dir', val);
                    }

                });
            }
        });
    }

    // Links dotfiles to user directory
    function link (type, relPath) {
        fs.symlink(path.resolve('.') + '/' + relPath, 
            path.resolve('..') + '/.' + relPath, 
            function (exception) {
            if(exception) {
                throw exception;
            }
        });
    }
}




