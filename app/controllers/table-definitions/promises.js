const promises = {
  name: 'PROMISES',
  caption: 'Promises',
  description: 'Promises',
  identifier: 'VERSE',
  columns: [
    {
      name: 'KEY',
      caption: 'Key',
      type: 'guid',
      primarykey: true
    },
    {
      name: 'VERSETEXT',
      caption: 'VerseText',
      type: 'text'
    },
    {
      name: 'BOOK',
      caption: 'Book',
      type: 'predefinedlist',
      typesource: '568c4b860dbdb8be082bf14f'
    },
    {
      name: 'CHAPTER',
      caption: 'Chapter',
      type: 'text'
    },
    {
      name: 'VERSE',
      caption: 'Verse',
      type: 'text'
    },
    {
      name: 'DATE',
      caption: 'Date',
      type: 'date'
    }
  ]
};

module.exports = promises;