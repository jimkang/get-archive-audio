var sb = require('standard-bail')();
var callNextTick = require('call-next-tick');

function GetArchiveAudio(opts) {
  var request;
  if (opts) {
    request = opts.request;
  }

  return getArchiveAudio;

  function getArchiveAudio(opts, getAudioDone) {
    var archiveId;
    var pickFileFn;
    var metadata;
    var fileMetadata;
    var serverIndex;

    if (opts) {
      archiveId = opts.archiveId;
      pickFileFn = opts.pickFileFn;
    }

    if (!pickFileFn) {
      pickFileFn = pickFirst;
    }

    var metadataReqOpts = {
      url: 'https://archive.org/metadata/' + archiveId,
      method: 'GET',
      json: true
    };

    request(metadataReqOpts, sb(pickFileFromMetadata, getAudioDone));

    function pickFileFromMetadata(res, body) {
      if (+res.statusCode < 300 && +res.statusCode > 199 && body && body.files) {
        metadata = body;
        var usableFiles = metadata.files.filter(fileIsUsable);
        if (usableFiles.length < 1) {
          getAudioDone(new Error('No usable files found for ' + archiveId));
        }
        else if (!metadata.workable_servers || metadata.workable_servers.length < 1) {
          getAudioDone(new Error('No workable_servers files found for ' + archiveId));          
        }
        else {
          serverIndex = 0;
          pickFileFn(usableFiles, sb(getBufferAtServer, getAudioDone));
        }
      }
      else {
        getAudioDone(new Error(
          'Could not get metadata for ' + archiveId + '. ' +
          'Status code: '  + res.statusCode + '. Body: ' + JSON.stringify(body)
        ));
      }
    }

    function getBufferAtServer(pickedFile) {
      fileMetadata = pickedFile;
      var reqOpts = {
        method: 'GET',
        binary: true,
        encoding: null,
        url: 'https://' + metadata.workable_servers[serverIndex] + '/' +
          metadata.dir + '/' + fileMetadata.name
      };
      console.log('Getting', reqOpts.url);
      request(reqOpts, decideOnServerResponse);
    }

    function decideOnServerResponse(error, res, buffer) {
      if (error) {
        console.log('Error from server1:', error);
      }
      if (error || !buffer || buffer.length < 1) {
        if (metadata.workable_servers.length > serverIndex + 1) {
          console.log('Could not get buffer from server ' + serverIndex + '. Trying next server.');
          serverIndex += 1;
          getBufferAtServer(fileMetadata);
        }
        else {
          getAudioDone(new Error(
            'Could not get audio for ' + archiveId + ' from ' +
            metadata.workable_servers[0] +
            '. No more servers to try.'
          ));
        }
      }
      else {
        getAudioDone(null, buffer, fileMetadata);
      }
    }
  }
}

function pickFirst(files, done) {
  callNextTick(done, null, files.length > 0 ? files[0] : null);
}

// TODO: Consider non-MP3 formats.
function fileIsUsable(fileMetadata) {
  return fileMetadata.format.indexOf('MP3') !== -1;
}

module.exports = GetArchiveAudio;
