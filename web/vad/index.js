function conversionVAD(url) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)({
    sampleRate: 16000,
  });
  const gainNode = new GainNode(ctx);

  return new Promise(async (resolve, reject) => {
    try {
      console.log("Transcoding audio...");
      let count = 0;
      const timestamps = [];
      const audio = new Audio(url);
      const audioNode = ctx.createMediaElementSource(audio);
      const myvad = await vad.AudioNodeVAD.new(ctx, {
        onSpeechStart: () => {
          const ts = ctx.getOutputTimestamp();
          console.log("Speech start", ts.contextTime, ts.performanceTime);
          timestamps[count] = { start: ts.contextTime, end: null };
        },
        onSpeechEnd: async (arr) => {
          const ts = ctx.getOutputTimestamp();
          console.log("Speech end", ts.contextTime, ts.performanceTime);
          timestamps[count] = { ...timestamps[count], end: ts.contextTime };
          count++;
        },
      });

      myvad.receive(gainNode);
      myvad.start();

      audioNode.connect(gainNode);
      audio.play();

      audio.addEventListener("ended", async () => {
        console.log("Transcoding audio... done");
        console.log("Timestamps", timestamps);
        resolve(timestamps);
      });
    } catch (error) {
      reject(error);
    }
  });
}
