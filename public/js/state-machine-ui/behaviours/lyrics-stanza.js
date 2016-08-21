var TamilWriter = require('../../tamil-writer');

var tamilWriter = new TamilWriter();

var textConversion = {
  inputs: [
    {
      name: 'songTitle',
      path: 'data/ENGLISHTEXT'
    }
  ],
  outputs: [
    {
      data: 'songTitle',
      path: 'data/TAMILTEXT'
    }
  ],
  triggers: [
    {
      path: 'data/ENGLISHTEXT',
      event: 'change'
    }
  ],
  behaviour: function (inputs, outputs) {
    if (!inputs.songTitle) {
      return;
    }

    var songTitle = inputs.songTitle;

    var convertedText = tamilWriter.convert(songTitle)

    outputs.songTitle = convertedText;
  }
};

module.exports = textConversion;