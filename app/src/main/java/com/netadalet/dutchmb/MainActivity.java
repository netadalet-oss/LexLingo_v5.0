package com.netadalet.dutchmb;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.speech.tts.TextToSpeech;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebChromeClient.FileChooserParams;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Locale;

public class MainActivity extends Activity implements TextToSpeech.OnInitListener {
    private WebView webView;
    private TextToSpeech tts;
    private boolean ttsReady = false;
    private SpeechRecognizer speechRecognizer;
    private ValueCallback<Uri[]> filePathCallback;
    private static final int FILE_CHOOSER_REQUEST = 6420;
    private static final int AUDIO_PERMISSION_REQUEST = 6421;
    private String pendingListenLang = "nl-NL";
    private String pendingListenCallback = "lexSpeechResult";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        webView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));
        webView.setBackgroundColor(Color.rgb(2, 7, 17));
        webView.setOverScrollMode(WebView.OVER_SCROLL_IF_CONTENT_SCROLLS);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        settings.setTextZoom(100);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (MainActivity.this.filePathCallback != null) {
                    MainActivity.this.filePathCallback.onReceiveValue(null);
                }
                MainActivity.this.filePathCallback = callback;
                try {
                    Intent intent = params.createIntent();
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                    return true;
                } catch (Exception ex) {
                    MainActivity.this.filePathCallback = null;
                    return false;
                }
            }
        });

        tts = new TextToSpeech(this, this);
        webView.addJavascriptInterface(new AndroidBridge(), "AndroidBridge");
        setContentView(webView);
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onInit(int status) {
        ttsReady = status == TextToSpeech.SUCCESS;
        if (ttsReady && tts != null) {
            tts.setLanguage(new Locale("nl", "NL"));
            tts.setSpeechRate(0.88f);
            tts.setPitch(1.0f);
        }
    }

    private Locale localeFor(String lang) {
        if (lang == null) return new Locale("nl", "NL");
        String l = lang.toLowerCase(Locale.ROOT);
        if (l.startsWith("tr")) return new Locale("tr", "TR");
        if (l.startsWith("en")) return Locale.US;
        if (l.startsWith("nl")) return new Locale("nl", "NL");
        if (l.startsWith("ar")) return new Locale("ar", "SA");
        if (l.startsWith("ru")) return new Locale("ru", "RU");
        return new Locale("nl", "NL");
    }

    private boolean isTtsLanguageUsable(Locale locale) {
        if (tts == null || !ttsReady || locale == null) return false;
        try {
            int result = tts.isLanguageAvailable(locale);
            return result != TextToSpeech.LANG_MISSING_DATA && result != TextToSpeech.LANG_NOT_SUPPORTED;
        } catch (Exception ex) {
            return false;
        }
    }

    private void speakInternal(String text, String lang, String fallbackText, String fallbackLang) {
        if (tts == null || !ttsReady) return;
        String primary = text == null ? "" : text.trim();
        String fallback = fallbackText == null ? "" : fallbackText.trim();
        if (primary.isEmpty() && fallback.isEmpty()) return;

        Locale primaryLocale = localeFor(lang);
        Locale fallbackLocale = localeFor(fallbackLang == null ? "tr-TR" : fallbackLang);
        boolean primaryUsable = isTtsLanguageUsable(primaryLocale);

        String output = primary;
        Locale outputLocale = primaryLocale;

        if ((!primaryUsable || output.isEmpty()) && !fallback.isEmpty()) {
            output = fallback;
            outputLocale = fallbackLocale;
        }
        if (output.isEmpty()) return;

        try {
            tts.stop();
            tts.setLanguage(outputLocale);
            tts.setSpeechRate(0.88f);
            tts.setPitch(1.0f);
            tts.speak(output, TextToSpeech.QUEUE_FLUSH, null, "lexlingo_tts");
        } catch (Exception ignored) {}
    }

    private void callbackToJs(final String functionName, final String value) {
        if (webView == null) return;
        final String fn = (functionName == null || functionName.trim().isEmpty()) ? "lexSpeechResult" : functionName;
        final String payload = JSONObject.quote(value == null ? "" : value);
        webView.post(new Runnable() {
            @Override public void run() {
                webView.evaluateJavascript("if(window['" + fn + "']){window['" + fn + "'](" + payload + ");}", null);
            }
        });
    }

    private void startListeningInternal(String lang, String callback) {
        pendingListenLang = lang == null ? "nl-NL" : lang;
        pendingListenCallback = callback == null ? "lexSpeechResult" : callback;
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            callbackToJs(pendingListenCallback, "");
            return;
        }
        if (android.os.Build.VERSION.SDK_INT >= 23 && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, AUDIO_PERMISSION_REQUEST);
            return;
        }
        if (speechRecognizer != null) {
            try { speechRecognizer.destroy(); } catch (Exception ignored) {}
            speechRecognizer = null;
        }
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
        speechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override public void onReadyForSpeech(Bundle params) {}
            @Override public void onBeginningOfSpeech() {}
            @Override public void onRmsChanged(float rmsdB) {}
            @Override public void onBufferReceived(byte[] buffer) {}
            @Override public void onEndOfSpeech() {}
            @Override public void onError(int error) { callbackToJs(pendingListenCallback, ""); }
            @Override public void onResults(Bundle results) {
                ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                callbackToJs(pendingListenCallback, matches != null && !matches.isEmpty() ? matches.get(0) : "");
            }
            @Override public void onPartialResults(Bundle partialResults) {}
            @Override public void onEvent(int eventType, Bundle params) {}
        });
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, pendingListenLang);
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false);
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 3);
        speechRecognizer.startListening(intent);
    }

    public class AndroidBridge {
        @JavascriptInterface
        public void speak(final String text, final String lang) {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    speakInternal(text, lang, text, lang);
                }
            });
        }

        @JavascriptInterface
        public void speakAlt(final String text, final String lang, final String fallbackText, final String fallbackLang) {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    speakInternal(text, lang, fallbackText, fallbackLang);
                }
            });
        }

        @JavascriptInterface
        public void stop() {
            runOnUiThread(new Runnable() {
                @Override public void run() {
                    try { if (tts != null) tts.stop(); } catch (Exception ignored) {}
                    try { if (speechRecognizer != null) speechRecognizer.cancel(); } catch (Exception ignored) {}
                }
            });
        }

        @JavascriptInterface
        public void listen(final String lang, final String callback) {
            runOnUiThread(new Runnable() {
                @Override public void run() { startListeningInternal(lang, callback); }
            });
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == AUDIO_PERMISSION_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startListeningInternal(pendingListenLang, pendingListenCallback);
            } else {
                callbackToJs(pendingListenCallback, "");
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST) {
            if (filePathCallback == null) return;
            Uri[] results = null;
            if (resultCode == RESULT_OK && data != null && data.getData() != null) {
                results = new Uri[]{data.getData()};
            }
            filePathCallback.onReceiveValue(results);
            filePathCallback = null;
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null) {
            webView.evaluateJavascript("if(window.closeModal){if(document.getElementById('modalShade')&&document.getElementById('modalShade').classList.contains('open')){closeModal();'closed'}else if(window.navPrev){navPrev();'nav'}else{'none'}}", null);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        try { if (speechRecognizer != null) speechRecognizer.destroy(); } catch (Exception ignored) {}
        if (tts != null) {
            try { tts.stop(); } catch (Exception ignored) {}
            tts.shutdown();
        }
        super.onDestroy();
    }
}
