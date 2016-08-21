const lyricStanzas = {
  name: 'LYRICSSTANZAS',
  caption: 'Stanza',
  description: 'Stanza',
  identifier: 'TAMILTEXT',
  columns: [
    {
      name: 'KEY',
      caption: 'Key',
      type: 'guid',
      primarykey: true
    },
    {
      name: 'ENGLISHTEXT',
      caption: 'Text (English)',
      type: 'largetext'
    },
    {
      name: 'TAMILTEXT',
      caption: 'Text (Tamil)',
      type: 'largetext'
    },
    {
      name: 'ORDER',
      caption: 'Order',
      type: 'number'
    }
  ]
};

module.exports = lyricStanzas;