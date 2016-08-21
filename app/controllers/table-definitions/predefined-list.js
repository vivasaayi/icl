const predefinedList = {
  name: 'PREDEFINEDLIST',
  caption: 'Predefined List',
  description: 'Used to store predefined list',
  identifier: 'NAME',
  children: ['PREDEFINEDLISTITEMS'],
  columns: [
    {
      name: 'KEY',
      caption: 'Key',
      type: 'guid',
      primarykey: true
    },
    {
      name: 'NAME',
      caption: 'Name',
      type: 'text'
    },
    {
      name: 'DESCRIPTION',
      caption: 'Description',
      type: 'text'
    }
  ]
};

module.exports = predefinedList;