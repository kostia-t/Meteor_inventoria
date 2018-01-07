App.info({
  id: 'com.inventoria.app',
  name: 'Inventoria',
  description: 'Inventoria is a barcode scanning application that allow users to scan barcodes and upload images of products.',
  author: 'Inventoria',
  email: 'dev@eaventures.co',
  website: 'http://inventoria.herokuapp.com',
  version: '3.0.9'
});


App.icons({
  // Android
  'android_mdpi': 'resources/icons/icon-48x48.png',
  'android_hdpi': 'resources/icons/icon-72x72.png',
  'android_xhdpi': 'resources/icons/icon-96x96.png',
  'android_xxhdpi':'resources/icons/icon-144x144.png',
  'android_xxxhdpi':'resources/icons/icon-192x192.png',
});

App.launchScreens({
  'android_mdpi_portrait': 'resources/splash/320x480.png',
  'android_mdpi_landscape': 'resources/splash/480x320.png',
  'android_hdpi_portrait': 'resources/splash/480x800.png',
  'android_hdpi_landscape': 'resources/splash/800x480.png',
  'android_xhdpi_portrait': 'resources/splash/720x1280.png',
  'android_xhdpi_landscape': 'resources/splash/1280x720.png'

});

App.setPreference('StatusBarOverlaysWebView', 'true');
App.setPreference('StatusBarBackgroundColor', '#003369');
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');
App.setPreference('AutoHideSplashScreen', 'true');
App.setPreference('SplashScreenDelay', '5000');
App.setPreference('SplashMaintainAspectRatio','true');
App.setPreference('SplashShowOnlyFirstTime','true');
App.setPreference('android-versionCode', '32');

App.accessRule('*');
