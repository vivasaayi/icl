db.schema.remove();

db.schema.insert(
/* 0 */
{
    "_id" : ObjectId("54422ee7e3721986ef57f251"),
    "name" : "lyrics-listview",
    "properties" : {
        "caption" : "Lyrics",
        "icon" : "icon-pencil"
    },
    "columns" : [
        {
            "title" : "Name",
            "name" : "name",
            "width" : "400px"
        },
        {
            "title" : "Author",
            "name" : "author",
            "width" : "200px"
        },
        {
            "title" : "View",
            "name" : "view",
            "align" : "center",
            "sortable" : false,
            "width" : "40px",
            "actions" : "returnData"
        }
    ]
});

db.schema.insert(
/* 0 */
{
    "_id" : ObjectId("545df22e1829d34fd95f6779"),
    "name" : "promises-listview",
    "properties" : {
        "caption" : "Promises",
        "icon" : "icon-pencil"
    },
    "columns" : [
        {
            "title" : "Text",
            "name" : "text",
            "width" : "400px"
        },
        {
            "title" : "Verse",
            "name" : "verse",
            "width" : "200px"
        },
        {
            "title" : "Start",
            "name" : "start",
            "width" : "200px"
        }
    ]
});

db.schema.insert(
/* 0 */
{
    "_id" : ObjectId("545df22e1549d34fd95f6779"),
    "name" : "churches-listview",
    "properties" : {
        "caption" : "Church",
        "icon" : "icon-pencil"
    },
    "columns" : [
        {
            "title" : "Text",
            "name" : "text",
            "width" : "400px"
        },
        {
            "title" : "Verse",
            "name" : "verse",
            "width" : "200px"
        },
        {
            "title" : "Start",
            "name" : "start",
            "width" : "200px"
        }
    ]
});


db.schema.insert(
  {
    "_id": ObjectId("53e6bcdf275020df8ff76ec0"),
    "name": "promises",
    "properties": {
      "caption": "Promises",
      "icon": "icon-home"
    },
    "fields": {
      "text": {
        "type": "Text",
        "controlCssType": "text"
      },
      "verse": {
        "type": "Text",
        "controlCssType": "text"
      },
      "start": {
        "type": "Text",
        "controlCssType": "text"
      },
      "end": {
        "type": "Text",
        "controlCssType": "text"
      }
    },
    "layout": [
      {
        "colspans": [
          12
        ],
        "fields": [
          "text"
        ]
      },
      {
        "colspans": [
          4,
          4,
          4
        ],
        "fields": [
          "verse",
          "start",
          "end"
        ]
      }
    ]
  }
);




db.schema.insert(
  {
    "_id" : ObjectId("54738ce8440d74d819449ff3"),
    "name" : "events-listview",
    "properties" : {
        "caption" : "Events",
        "icon" : "icon-pencil"
    },
    "columns" : [
        {
            "title" : "Name",
            "name" : "name",
            "width" : "400px"
        },
        {
            "title" : "City",
            "name" : "city"
        }
    ]
}
);

db.schema.insert(
  {
    "_id" : ObjectId("54739239440d74d819449ff4"),
    "name" : "events",
    "properties" : {
        "caption" : "Events",
        "icon" : "icon-home"
    },
    "fields" : {
        "name" : {
            "type" : "Text",
            "controlCssType" : "text"
        },
        "place" : {
            "type" : "Text",
            "controlCssType" : "text"
        },
        "city" : {
            "type" : "Text",
            "controlCssType" : "text"
        },
        "startTime" : {
            "type" : "Text",
            "controlCssType" : "text"
        },
        "endTime" : {
            "type" : "Text",
            "controlCssType" : "text"
        },
        "startDate" : {
            "type" : "Text",
            "controlCssType" : "text"
        },
        "endDate" : {
            "type" : "Text",
            "controlCssType" : "text"
        },
        "weekly" : {
            "type" : "Checkboxes",
            "controlCssType" : "checkbox",
            "options" : [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ]
        },
        "recurrence" : {
            "type" : "Radio",
            "controlCssType" : "radio",
            "options" : {
                "value1" : "One Day",
                "value2" : "Daily",
                "value3" : "Weekly",
                "value4" : "Monthly"
            }
        },
        "monthlyEvery" : {
            "type" : "Select",
            "controlCssType" : "select",
            "options" : [
                "First",
                "Second",
                "Third",
                "Fourth",
                "Last"
            ]
        },
        "monthlyWeekDay" : {
            "type" : "Select",
            "controlCssType" : "select",
            "options" : [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ]
        }
    },
    "layout" : [
        {
            "colspans" : [
                12
            ],
            "fields" : [
                "name"
            ]
        },
        {
            "colspans" : [
                6,
                6
            ],
            "fields" : [
                "place",
                "city"
            ]
        },
        {
            "colspans" : [
                3,
                3,
                3,
                3
            ],
            "fields" : [
                "startDate",
                "startTime",
                "endDate",
                "endTime"
            ]
        },
        {
            "colspans" : [
                12
            ],
            "fields" : [
                "recurrence"
            ]
        },
        {
            "colspans" : [
                12
            ],
            "fields" : [
                "weekly"
            ]
        },
        {
            "colspans" : [
                6,
                6
            ],
            "fields" : [
                "monthlyEvery",
                "monthlyWeekDay"
            ]
        }
    ]
}
);


db.schema.insert(
/* 0 */
  {
    "_id" : ObjectId("545df22e1839d34fd95f6779"),
    "name" : "books-listview",
    "properties" : {
      "caption" : "Books",
      "icon" : "icon-book"
    },
    "columns" : [
      {
        "title" : "Text",
        "name" : "text",
        "width" : "400px"
      },
      {
        "title" : "Verse",
        "name" : "verse",
        "width" : "200px"
      },
      {
        "title" : "Start",
        "name" : "start",
        "width" : "200px"
      }
    ]
  });

db.schema.insert(
  {
    "_id": ObjectId("53e6bcdf2750203f8ff76ec0"),
    "name": "books",
    "properties": {
      "caption": "Books",
      "icon": "icon-home"
    },
    "fields": {
      "text": {
        "type": "Text",
        "controlCssType": "text"
      },
      "verse": {
        "type": "Text",
        "controlCssType": "text"
      },
      "start": {
        "type": "Text",
        "controlCssType": "text"
      },
      "end": {
        "type": "Text",
        "controlCssType": "text"
      }
    },
    "layout": [
      {
        "colspans": [
          12
        ],
        "fields": [
          "text"
        ]
      },
      {
        "colspans": [
          4,
          4,
          4
        ],
        "fields": [
          "verse",
          "start",
          "end"
        ]
      }
    ]
  }
);
