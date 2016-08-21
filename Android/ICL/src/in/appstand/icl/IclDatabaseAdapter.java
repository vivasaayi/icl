package in.appstand.icl;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import android.R.integer;
import android.content.ContentValues;
import android.content.Context;
import android.content.res.AssetManager;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.sqlite.SQLiteDatabase.CursorFactory;

public class IclDatabaseAdapter {
	public static final String DATABASE_NAME = "ICL";
	public static final int DATABASE_VERSION = 1;

	public static final String BOOKS_AND_CHAPTERS_TABLE_NAME = "BooksAndChapters";
	public static final String BOOKS_AND_VERSES_TABLE_NAME = "BooksAndVerses";

	public static final String KEY_ID = "ID";
	public static final int KEY_COLUMN = 0;

	// Books and Chapters Table
	public static final String KEY_BOOKNAME = "NAME";
	public static final int BOOKNAME_INDEX = 1;

	public static final String KEY_NUMBEROFCHAPTERS = "NOOFCHAPTERS";
	public static final int NUMBEROFCHAPTERS_INDEX = 2;

	// Books and Verses Table
	public static final String KEY_BOOKID = "BOOKID";
	public static final int BOOKID_INDEX = 1;

	public static final String KEY_CHAPTERID = "CHAPTERID";
	public static final int CHAPTERID_INDEX = 2;

	public static final String KEY_VERSECOUNT = "VERSECOUNT";
	public static final int VERSECOUNT_INDEX = 3;

	// Other Variables
	private SQLiteDatabase database;
	private Context context;
	private IclDBOpenHelper dbHelper;

	public IclDatabaseAdapter(Context context, AssetManager assetManager) {
		this.context = context;
		this.dbHelper = new IclDBOpenHelper(this.context, DATABASE_NAME, null, DATABASE_VERSION, assetManager);

	}

	public void close() {
		if (database != null) {
			database.close();
		}
	}

	public void open() {
		try {
			database = dbHelper.getWritableDatabase();
		} catch (SQLException ex) {
			database = dbHelper.getReadableDatabase();
		}
	}

	public Map<String, Integer> getAllBooks() {
		Map<String, Integer> booksAndChapters = new LinkedHashMap<String, Integer>();
		String[] columns = new String[] { KEY_ID, KEY_BOOKNAME, KEY_NUMBEROFCHAPTERS };

		Cursor cursor = database.query(BOOKS_AND_CHAPTERS_TABLE_NAME, columns, null, null, null, null, null);

		if (cursor.moveToFirst()) {
			do {
				String bookName = cursor.getString(BOOKNAME_INDEX);
				int numberOfChapters = cursor.getInt(NUMBEROFCHAPTERS_INDEX);
				booksAndChapters.put(bookName, numberOfChapters);
			} while (cursor.moveToNext());
		}

		cursor.close();

		return booksAndChapters;
	}

	public int[] getBookDetails(int selectedBook, int chapterId) {
		int[] result = new int[2];
		result[0] = 0;
		result[1] = 0;

		String[] columns = new String[] { KEY_ID, KEY_BOOKID, KEY_CHAPTERID, KEY_VERSECOUNT };
		String whereClause = KEY_BOOKID + " = " + selectedBook + " AND " + KEY_CHAPTERID + " = " + chapterId;

		Cursor cursor = database.query(BOOKS_AND_VERSES_TABLE_NAME, columns, whereClause, null, null, null, null);

		if (cursor.moveToFirst()) {
			result[0] = cursor.getInt(CHAPTERID_INDEX);
			result[1] = cursor.getInt(VERSECOUNT_INDEX);
		}

		cursor.close();

		return result;
	}

	private static class IclDBOpenHelper extends SQLiteOpenHelper {
		String createBooksAndChaptersQuery = "CREATE TABLE " + BOOKS_AND_CHAPTERS_TABLE_NAME + "(" + KEY_ID + " integer primary key autoincrement, " + KEY_BOOKNAME + " text not null, " + KEY_NUMBEROFCHAPTERS + " integer not null);";

		String createBooksAndVersesQuery = "CREATE TABLE " + BOOKS_AND_VERSES_TABLE_NAME + "(" + KEY_ID + " integer primary key autoincrement, " + KEY_BOOKID + " integer not null, " + KEY_CHAPTERID + " integer not null, " + KEY_VERSECOUNT + " integer not null);";

		private AssetManager assetManager;

		public IclDBOpenHelper(Context context, String databaseName, CursorFactory factory, int version, AssetManager assetManager) {
			super(context, databaseName, factory, version);
			this.assetManager = assetManager;
		}

		@Override
		public void onCreate(SQLiteDatabase db) {
			db.execSQL(createBooksAndChaptersQuery);
			db.execSQL(createBooksAndVersesQuery);

			ReadBooksAndCapters(db);
			ReadBooksAndVerses(db);
		}

		Map<String, Integer> booksIndex = new HashMap<String, Integer>();

		private void Insertbook(String bookName, int chapterCount, SQLiteDatabase db) {
			ContentValues values = new ContentValues();
			values.put(KEY_BOOKNAME, bookName);
			values.put(KEY_NUMBEROFCHAPTERS, chapterCount);

			booksIndex.put(bookName, booksIndex.size() + 1);

			db.insert(BOOKS_AND_CHAPTERS_TABLE_NAME, null, values);
		}

		private void InsertBooksAndVerses(String bookName, int chapterId, int verseCount, SQLiteDatabase db) {
			ContentValues values = new ContentValues();

			values.put(KEY_BOOKID, booksIndex.get(bookName));
			values.put(KEY_CHAPTERID, chapterId);
			values.put(KEY_VERSECOUNT, verseCount);

			db.insert(BOOKS_AND_VERSES_TABLE_NAME, null, values);
		}

		public void ReadBooksAndVerses(SQLiteDatabase db) {
			InputStream inputStream = null;
			try {
				inputStream = assetManager.open("booksandverses.csv");
				BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

				String line;

				while ((line = reader.readLine()) != null) {
					String[] split = line.split(",");
					int chapeterId = Integer.parseInt(split[1]);
					int verseCount = Integer.parseInt(split[2]);
					InsertBooksAndVerses(split[0], chapeterId, verseCount, db);
				}
			} catch (IOException ex) {
				// handle exception
			} finally {
				try {
					inputStream.close();
				} catch (IOException e) {
					// handle exception
				}
			}
		}

		public void ReadBooksAndCapters(SQLiteDatabase db) {
			InputStream inputStream = null;
			try {
				inputStream = assetManager.open("booksandchapters.csv");
				BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));

				String line;

				while ((line = reader.readLine()) != null) {
					String[] split = line.split(",");
					int numberOfChapters = Integer.parseInt(split[1]);
					Insertbook(split[0], numberOfChapters, db);
				}
			} catch (IOException ex) {
				// handle exception
			} finally {
				try {
					inputStream.close();
				} catch (IOException e) {
					// handle exception
				}
			}
		}

		@Override
		public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
			db.execSQL("DROP TABLE IF EXISTS " + BOOKS_AND_CHAPTERS_TABLE_NAME);
			db.execSQL("DROP TABLE IF EXISTS " + BOOKS_AND_VERSES_TABLE_NAME);

			onCreate(db);
		}
	}
}
