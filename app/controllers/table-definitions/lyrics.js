const lyrics = {
  name: 'LYRICS',
  caption: 'Lyrics',
  description: 'Lyrics',
  identifier: 'SONGTITLETAMIL',
  children: ['LYRICSSTANZAS'],
  columns: [
    {
      name: 'KEY',
      caption: 'Key',
      type: 'guid',
      primarykey: true
    },
    {
      name: 'SONGTITLEENGLISH',
      caption: 'Song Title (English)',
      type: 'text'
    },
    {
      name: 'SONGTITLETAMIL',
      caption: 'Song Title',
      type: 'text'
    },
    {
      name: 'Written By',
      caption: 'Written By',
      type: 'predefinedlist',
      typesource: '568c5acfaf3e53a50ad83408'
    }
  ]
};

module.exports = lyrics;