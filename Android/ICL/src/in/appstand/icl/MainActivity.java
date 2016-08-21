package in.appstand.icl;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.Iterator;
import java.util.Map;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.webkit.WebView;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

public class MainActivity extends Activity implements OnItemSelectedListener, OnClickListener {
	private IclDatabaseAdapter databaseAdapter;
	private Map<String, Integer> booksAndChapters;
	private ArrayAdapter<String> booksAdapter;
	private ArrayAdapter<String> chaptersAdapter;
	private ArrayAdapter<String> versesAdapter;

	Spinner booksSpinner;
	Spinner chaptersSpinner;
	Spinner startVerseSpinner;
	Spinner endVerseSpinner;
	Button validateButton;
	Button publishButton;

	EditText resultEditText;
	SharedPreferences sharedpreferences;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_INDETERMINATE_PROGRESS);
		setContentView(R.layout.activity_main);

		booksSpinner = (Spinner) findViewById(R.id.chapterNameSpinner);
		chaptersSpinner = (Spinner) findViewById(R.id.chapterNumberSpinner);
		startVerseSpinner = (Spinner) findViewById(R.id.startVerseSpinner);
		endVerseSpinner = (Spinner) findViewById(R.id.endVerseSpinner);
		validateButton = (Button) findViewById(R.id.saveSettingsButton);
		publishButton = (Button) findViewById(R.id.button2);
		resultEditText = (EditText) findViewById(R.id.resultEditText);

		validateButton.setOnClickListener(this);
		publishButton.setOnClickListener(this);

		databaseAdapter = new IclDatabaseAdapter(this, getAssets());
		databaseAdapter.open();

		booksAndChapters = databaseAdapter.getAllBooks();

		booksAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item);
		chaptersAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item);
		versesAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item);

		for (String string : booksAndChapters.keySet()) {
			booksAdapter.add(string);
		}

		booksSpinner.setOnItemSelectedListener(this);
		chaptersSpinner.setOnItemSelectedListener(this);
		startVerseSpinner.setOnItemSelectedListener(this);
		endVerseSpinner.setOnItemSelectedListener(this);

		booksSpinner.setAdapter(booksAdapter);
		chaptersSpinner.setAdapter(chaptersAdapter);
		startVerseSpinner.setAdapter(versesAdapter);
		endVerseSpinner.setAdapter(versesAdapter);
		initializeSettingsDefault();
	}

	private void initializeSettingsDefault() {
		sharedpreferences = getSharedPreferences("MODB", Context.MODE_PRIVATE);

		// First Time
		if (sharedpreferences.getAll().size() <= 0) {
			Editor editor = sharedpreferences.edit();
			editor.putString("URL", "http://christianliterature.in");
			editor.putString("Port", "4040");
			editor.putBoolean("UsePort", false);
			editor.commit();
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case R.id.action_settings:
			Intent intent = new Intent(MainActivity.this, SettingsActivity.class);
			startActivity(intent);
			break;
		default:
			break;
		}

		return true;
	}

	int selectedBookIndex = 0;

	@Override
	public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
		if (parent == booksSpinner) {
			String selectedBook = parent.getItemAtPosition(position).toString();
			selectedBookIndex = position + 1;

			chaptersAdapter.clear();
			for (int i = 0; i < booksAndChapters.get(selectedBook); i++) {
				chaptersAdapter.add("" + (i + 1));
			}

			chaptersAdapter.notifyDataSetChanged();
			reloadVerses(1);
			chaptersSpinner.setSelection(0);
		} else if (parent == chaptersSpinner) {
			int chapterNumber = position + 1;
			reloadVerses(chapterNumber);
		} else if (parent == startVerseSpinner) {
			endVerseSpinner.setSelection(position);
		}
	}

	private void reloadVerses(int chapterNumber) {
		int[] result = databaseAdapter.getBookDetails(selectedBookIndex, chapterNumber);

		versesAdapter.clear();
		versesAdapter.notifyDataSetChanged();
		for (int i = 0; i < result[1]; i++) {
			versesAdapter.add("" + (i + 1));
		}
		versesAdapter.notifyDataSetChanged();
		startVerseSpinner.setSelection(0);
	}

	@Override
	public void onNothingSelected(AdapterView<?> arg0) {

	}

	@Override
	public void onClick(View view) {
		try {
			if (view == validateButton) {
				String book = booksSpinner.getSelectedItem().toString().toLowerCase().replace(" ", "_");

				if (book.equals("songs_of_solomon")) {
					book = "songs";
				}

				int chapter = chaptersSpinner.getSelectedItemPosition() + 1;
				int startVerse = startVerseSpinner.getSelectedItemPosition() + 1;
				int endVerse = endVerseSpinner.getSelectedItemPosition() + 1;

				if (startVerse > endVerse) {
					Toast.makeText(this, "The end verse should be greater than the start verse.", Toast.LENGTH_LONG).show();
					return;
				}

				String url = "https://getbible.net/json?scrip=" + Uri.encode(book + " ") + chapter + ":" + startVerse;

				if (endVerse > startVerse) {
					url += "-" + endVerse;
				}

				url += "&version=web";

				Toast.makeText(this, url, Toast.LENGTH_LONG).show();

				new HttpGetTask().execute(url, startVerse + "", endVerse + "");
			} else if (view == publishButton) {
				String book = booksSpinner.getSelectedItem().toString();
				String verseText = resultEditText.getText().toString();
				int chapter = chaptersSpinner.getSelectedItemPosition() + 1;
				int verse = startVerseSpinner.getSelectedItemPosition() + 1;

				JSONObject promiseInfo = new JSONObject();
				promiseInfo.put("book", book);
				promiseInfo.put("chapter", chapter);
				promiseInfo.put("verse", verse);
				promiseInfo.put("text", verseText);

				String urlSetting = sharedpreferences.getString("URL", "");
				String portSetting = sharedpreferences.getString("Port", "");

				String url = urlSetting;

				if (sharedpreferences.getBoolean("UsePort", false)) {
					url = url + ":" + portSetting;
				}
				
				url = url + "/promises";

				Toast.makeText(this, "Posting to: " + url, Toast.LENGTH_LONG).show();

				new HttpPostTask().execute(url, promiseInfo.toString());
			}
		} catch (Exception e) {
			Toast.makeText(this, e.getMessage() + e.getStackTrace(), Toast.LENGTH_LONG).show();
		}
	}

	public void setContent(String text) {
		resultEditText.setText(text);
	}

	private class HttpGetTask extends AsyncTask<String, Void, String> {

		@Override
		protected String doInBackground(String... urls) {
			String result = "";
			BufferedReader reader;
			try {

				HttpClient httpClient = new DefaultHttpClient();
				HttpGet request = new HttpGet();
				request.setURI(new URI(urls[0]));
				HttpResponse response = httpClient.execute(request);

				reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

				StringBuffer buffer = new StringBuffer();
				String line = "";

				while ((line = reader.readLine()) != null) {
					buffer.append(line);
				}

				buffer.replace(0, 1, "");
				buffer.deleteCharAt(buffer.length() - 2);

				result = buffer.toString();

				JSONObject jObject = new JSONObject(result);
				JSONArray jArray = jObject.getJSONArray("book");

				result = "";
				for (int i = 0; i < jArray.length(); i++) {
					try {
						JSONObject oneObject = jArray.getJSONObject(i);
						// Pulling items from the array
						JSONObject chapter = oneObject.getJSONObject("chapter");

						Iterator<?> keys = chapter.keys();

						while (keys.hasNext()) {
							String key = (String) keys.next();
							JSONObject verseObject = (JSONObject) chapter.get(key);
							result += verseObject.getString("verse");
							result += "\n";
						}

					} catch (JSONException e) {
						// Oops
						result = "Error";
					}
				}

			} catch (Exception e) {
				result = e.getMessage() + "-" + e.getStackTrace();
			}

			return result;
		}

		protected void onPreExecute() {
			MainActivity.this.setProgressBarIndeterminateVisibility(true);
		}

		protected void onPostExecute(String result) {
			MainActivity.this.setProgressBarIndeterminateVisibility(false);
			// Toast.makeText(MainActivity.this, result,
			// Toast.LENGTH_LONG).show();
			MainActivity.this.setContent(result);
		}
	}

	private class HttpPostTask extends AsyncTask<String, Void, String> {

		@Override
		protected String doInBackground(String... data) {
			String result = "";
			BufferedReader reader;
			try {

				HttpClient httpClient = new DefaultHttpClient();
				HttpPost request = new HttpPost();
				request.setURI(new URI(data[0]));

				StringEntity se = new StringEntity(data[1]);
				request.setEntity(se);

				request.setHeader("Content-type", "application/json");
				HttpResponse response = httpClient.execute(request);

				reader = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

				StringBuffer buffer = new StringBuffer();
				String line = "";

				while ((line = reader.readLine()) != null) {
					buffer.append(line);
				}

				result = buffer.toString();

			} catch (Exception e) {
				result = e.getMessage() + "-" + e.getStackTrace();
			}

			return result;
		}

		protected void onPreExecute() {
			MainActivity.this.setProgressBarIndeterminateVisibility(true);
		}

		protected void onPostExecute(String result) {
			MainActivity.this.setProgressBarIndeterminateVisibility(false);
			Toast.makeText(MainActivity.this, result, Toast.LENGTH_LONG).show();
		}
	}

}
