package in.appstand.icl;

import android.os.Bundle;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.Toast;

public class SettingsActivity extends Activity implements OnClickListener {
	Button saveSettingsButton;
	EditText urlEditView;	
	EditText portEditView;
	CheckBox usePortCheckBox;
	SharedPreferences sharedpreferences;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_settings);

		saveSettingsButton = (Button) findViewById(R.id.saveSettingsButton);
		saveSettingsButton.setOnClickListener(this);
		
		portEditView = (EditText) findViewById(R.id.port);
		urlEditView = (EditText) findViewById(R.id.bibleApiEndPoint);		
		usePortCheckBox = (CheckBox) findViewById(R.id.usePort);

		sharedpreferences = getSharedPreferences("MODB", Context.MODE_PRIVATE);
		urlEditView.setText(sharedpreferences.getString("URL", ""));
		portEditView.setText(sharedpreferences.getString("Port", ""));
		usePortCheckBox.setChecked(sharedpreferences.getBoolean("UsePort", false));
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public void onClick(View view) {
		if (view == saveSettingsButton) {
			Editor editor = sharedpreferences.edit();
			editor.putString("URL", urlEditView.getText().toString());
			editor.putString("Port", portEditView.getText().toString());
			editor.putBoolean("UsePort", usePortCheckBox.isChecked());
			editor.commit();
			
			Toast.makeText(this, "Settings Saved", Toast.LENGTH_LONG).show();
		}
	}
}
