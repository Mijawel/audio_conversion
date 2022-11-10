@JS()
library webm_to_wav;

import 'dart:html';
import 'dart:js_util';
import 'dart:convert';
import 'package:js/js.dart';

@JS()
external getAudio(blob);

@JS()
external conversionVAD(url);

convertWave(blob) async {
  var promise = getAudio(blob);
  var qs = await promiseToFuture(promise);
  var nblob = Blob([qs], 'audio/wav');
  var url = Url.createObjectUrlFromBlob(nblob);

  AnchorElement anchorElement = AnchorElement(href: url);
  anchorElement.download = 'audio.wav';
  anchorElement.click();

  var vad = conversionVAD(url);
  var vadPromise = await promiseToFuture(vad) as String;

  print(jsonDecode(vadPromise));
  return vadPromise;
}
