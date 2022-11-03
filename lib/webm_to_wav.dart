@JS()
library webm_to_wav;

import 'dart:html';
import 'dart:js_util';
import 'package:js/js.dart';

@JS()
external getAudio(blob);

@JS()
external conversionVAD(url);

// TODO:make the function accept file name as a parameter and save the file with that name
convertWave(blob) async {
  var promise = getAudio(blob);
  var qs = await promiseToFuture(promise);
  var nblob = Blob([qs], 'audio/wav');
  var url = Url.createObjectUrlFromBlob(nblob);

  var vad = conversionVAD(url);
  var vadPromise = await promiseToFuture(vad);
  var vadBlob = Blob([vadPromise], 'audio/wav');
  var vadUrl = Url.createObjectUrlFromBlob(vadBlob);

  AnchorElement anchorElement = AnchorElement(href: vadUrl);
  anchorElement.download = 'audio.wav';
  anchorElement.click();
}
