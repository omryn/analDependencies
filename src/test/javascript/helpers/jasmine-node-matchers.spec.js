beforeEach(function () {
    var fs = require('fs');
    var readFile = fs.readFile;

    this.addMatchers({
        toExist: function () {
            return fs.existsSync(this.actual);
        },

        toHaveParsedContent: function (content, done) {
            var fileName = this.actual;
            readFile(this.actual, 'utf8', function (err, data) {
                if (!err && data) {
                    expect(JSON.parse(data)).toEqual(content);
                    done();
                } else {
                    done("Error reading file: " + fileName);
                }

            });
            return true;
        },

        toHaveSameParsedContentAs: function (expectedResultFile, done) {
            var actual = this.actual;
            var content = {};

            function checkContent() {
                if (actual in content && expectedResultFile in content) {
                    expect(content[actual]).toEqual(content[expectedResultFile]);
                    done();
                }
            }

            function read(file) {
                readFile(file, 'utf8', function (err, data) {
                    if (!err && data) {
                        try {
                            content[file] = JSON.parse(data);
                            checkContent();
                        } catch (err) {
                            done('Error parsing content of ' + file);
                        }
                    } else {
                        done("Error reading file: " + file + "\n" + err);
                    }
                });
            }

            read(actual);
            read(expectedResultFile);
            return true;
        },

        toHaveContent: function (content, done) {
            var fileName = this.actual;
            readFile(fileName, 'utf8', function (err, data) {
                if (!err && data) {
                    expect(data).toEqual(content);
                    done();
                } else {
                    done("Error reading file: " + fileName);
                }

            });
            return true;
        }
    });
});