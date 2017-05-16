get-archive-audio
==================

Gets mp3 audio for a given Internet Archive metadata as an ArrayBuffer in the browser and a Buffer in Node.

Installation
------------

    npm install get-archive-audio

Usage
-----

    var GetArchiveAudio = require('get-archive-audio');
    var getArchiveAudio = GetArchiveAudio({
      request: request
    });
    getArchiveAudio({id: 'IbertEscales', pickFileFn: pickLast}, playAudio);

    function playAudio(error, buffer) {
      if (error) {
        handleError(error);
      }
      else {
        var audioContext = new AudioContext();
        audioContext.decodeAudioData(buffer, playBuffer);
      }

      function playBuffer(decodedBuffer, fileMetadata) {
        if (sourceNode) {
          sourceNode.stop();
        }
        sourceNode = audioContext.createBufferSource();
        sourceNode.connect(audioContext.destination);

        sourceNode.buffer = decodedBuffer;
        sourceNode.loop = true;

        sourceNode.start();

        console.log(fileMetadata);
      }
    }

    function pickLast(files, done) {
      callNextTick(done, null, files[files.length - 1]);
    }

Tests
-----

Run tests with `make test`.

Notes about archive.org API
------

https://archive.org/metadata/<identifier> gets JSON metadata.

That metadata looks like:

    {
      "created": 1494813607,
      "d1": "ia600504.us.archive.org",
      "d2": "ia800504.us.archive.org",
      "dir": "/28/items/IbertEscales",
      "files": [
        {
          "name": "01.I.Palermo.mp3",
          "source": "original",
          "format": "VBR MP3",
          "length": "351.4",
          "height": "0",
          "width": "0",
          "title": "01. I. Palermo",
          "mtime": "1487875064",
          "size": "8419768",
          "md5": "7c2c00ee00c1e4b2e0f2f51a50fa0259",
          "crc32": "b1116ec1",
          "sha1": "9018d8dd74a14d8f9b1571f74275212c8ddbbc27",
          "album": "IBERT: Escales",
          "genre": "classical",
          "track": "1/3",
          "artist": "Artur Rodzinski, New York Philharmonic Orchestra"
        },
        ...
      ],
      "files_count": 12,
      "item_size": 20490899,
      "metadata": {
        "mediatype": "audio",
        "collection": [
          "78rpm",
          "audio_music"
        ],
        "title": "IBERT: Escales",
        "description": "IBERT: Escales\n\nI. Palermo\nII. Tunis - Nefta\nIII. Valencia\n\nNew York Philharmonic Orchestra\nArtur Rodzinski, conductor\nDigital transfer by F. Reeder\nColumbia 78rpm Set MX 263\nRecorded in 1945",
        "subject": "Ibert; Rodzinski; 78rpm",
        "creator": "Artur Rodzinski, conductor",
        "licenseurl": "http://creativecommons.org/licenses/by-nc-sa/3.0/",
        "identifier": "IbertEscales",
        "uploader": "freeder1@frontier.com",
        "addeddate": "2011-10-07 07:07:00",
        "publicdate": "2011-10-07 07:11:16",
        "boxid": "OL100020016",
        "date": "1945",
        "year": "1945",
        "backup_location": "ia903703_26"
      },
      "server": "ia800504.us.archive.org",
      "uniq": 1658498927,
      "updated": 1494813610,
      "workable_servers": [
        "ia800504.us.archive.org",
        "ia600504.us.archive.org"
      ]
    }

workable_servers, dir, and files/name are what you need to find what to download.

License
-------

The MIT License (MIT)

Copyright (c) 2017 Jim Kang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
