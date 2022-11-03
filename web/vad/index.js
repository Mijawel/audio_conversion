function conversionVAD(url) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const gainNode = new GainNode(ctx);

  return new Promise(async (resolve, reject) => {
    try {
      const audio = new Audio(url);
      const audioNode = ctx.createMediaElementSource(audio);
      const myvad = await vad.AudioNodeVAD.new(ctx, {
        onFrameProcessed: (probs) => {
          // console.log("processed", probs);
        },
        onSpeechStart: () => {
          console.log("speech start");
        },
        onSpeechEnd: async (arr) => {
          console.log("speech end");
          const blob = await arrayToWav(arr);
          console.log(blob);
          resolve(blob);
        },
      });

      myvad.receive(gainNode);
      myvad.start();

      audioNode.connect(gainNode);
      audio.play();
    } catch (error) {
      reject(error);
    }
  });
}
