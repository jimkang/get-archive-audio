/* global Buffer */

var test = require('tape');
var GetArchiveAudio = require('../index');
var request = require('request');
var assertNoError = require('assert-no-error');
var fs = require('fs');
var rimraf = require('rimraf');
var callNextTick = require('call-next-tick');

const testOutputDir = 'tests/output/';

rimraf.sync(testOutputDir + '*');

var existingIdCases = [
  {
    opts: {
      archiveId: 'IbertEscales',
    },
    expectedFileMetadata: {
      'name': '01.I.Palermo.mp3',
      'source': 'original',
      'format': 'VBR MP3',
      'length': '351.4',
      'height': '0',
      'width': '0',
      'title': '01. I. Palermo',
      'mtime': '1487875064',
      'size': '8419768',
      'md5': '7c2c00ee00c1e4b2e0f2f51a50fa0259',
      'crc32': 'b1116ec1',
      'sha1': '9018d8dd74a14d8f9b1571f74275212c8ddbbc27',
      'album': 'IBERT: Escales',
      'genre': 'classical',
      'track': '1/3',
      'artist': 'Artur Rodzinski, New York Philharmonic Orchestra'
    }
  },
  {
    opts: {
      archiveId: 'UkrainskaOrchestraPawlaHumeniukaCzaban1926',
      pickFileFn: pickSecond
    },
    expectedFileMetadata: {
      'name': 'Ukrainska_Orchestra_Pawla_Humeniuka-Hutzulka-1926.mp3',
      'source': 'derivative',
      'bitrate': '111',
      'length': '03:12',
      'format': 'VBR MP3',
      'original': 'Ukrainska_Orchestra_Pawla_Humeniuka-Hutzulka-1926.wav',
      'mtime': '1487729227',
      'size': '2664448',
      'md5': 'd38ae7741241b967ef7a60104e778ab1',
      'crc32': 'e301c106',
      'sha1': '70ac97ebbbea8b2d71e7570327fc6444a671c414',
      'height': '0',
      'width': '0'
    }
  }
];

var nonExistentIdCases = [
  {
    opts: {
      archiveId: 'gimLv2eAKyk1NB'
    }
  }
];

existingIdCases.forEach(runTest);
nonExistentIdCases.forEach(runBadIdTest);

function runTest(testCase) {
  test('Get track audio', basicTest);

  function basicTest(t) {
    var getArchiveAudio = GetArchiveAudio({
      request: request
    });
    getArchiveAudio(testCase.opts, checkAudio);

    function checkAudio(error, buffer, fileMetadata) {
      assertNoError(t.ok, error, 'No error while getting audio.');
      t.ok(Buffer.isBuffer(buffer), 'A buffer was retrieved.');
      t.ok(buffer.length > 0, 'The buffer is not empty.');
      t.deepEqual(fileMetadata, testCase.expectedFileMetadata, 'Metadata is correct.');
      fs.writeFileSync(testOutputDir +  testCase.opts.archiveId + '.mp3', buffer);
      t.end();
    }
  }
}

function runBadIdTest(testCase) {
  test('Get track audio for bad id', basicTest);

  function basicTest(t) {
    var getArchiveAudio = GetArchiveAudio({
      request: request
    });
    getArchiveAudio(testCase.opts, checkAudio);

    function checkAudio(error) {
      t.ok(error, 'There is an error.');
      t.equal(error.message, 'Could not get metadata for ' +
        testCase.opts.archiveId + 
        '. Status code: 200. Body: {}');
      t.end();
    }
  }
}

function pickSecond(files, done) {
  callNextTick(done, null, files[1]);
}
