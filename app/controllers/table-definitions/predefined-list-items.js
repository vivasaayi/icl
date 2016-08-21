const predefinedListItems = {
  name: 'PREDEFINEDLISTITEMS',
  caption: 'Predefined List Items',
  description: 'Used to store items in a predefined list',
  identifier: 'VALUE',
  children: [],
  columns: [
    {
      name: 'KEY',
      caption: 'Key',
      type: 'guid',
      primarykey: true
    },
    {
      name: 'VALUE',
      caption: 'Value',
      type: 'text'
    },
    {
      name: 'CAPTION',
      caption: 'Caption',
      type: 'text'
    }
  ]
};

module.exports = predefinedListItems;