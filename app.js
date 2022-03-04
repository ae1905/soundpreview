playlinks = document.querySelector("#playlist");
// Add a change event listener to the file input
fileinput = document.querySelector("#fileinput");
btn = document.querySelector("#refresh");
fileinput.addEventListener("change", getthewave, false);

function getthewave(e) {
  setTimeout(() => {
    while (playlinks.firstChild) {
      playlinks.removeChild(playlinks.firstChild);
    }

    for (let i = 0; i < this.files.length; i++) {
      var file = this.files[i];
      path = (window.URL || window.webkitURL).createObjectURL(file);
      console.log(path);
      console.log("2022-3-4");
      sound_name = file.name.slice(0, file.name.length - 4);
      console.log(sound_name);

      const link = document.createElement("a");
      const itag = document.createElement("i");
      const s = document.createElement("span");
      link.textContent = sound_name;

      // link.href = `./samples/${file.name}`;
      link.href = path;

      link.classList.add("list-group-item");

      itag.classList.add("glyphicon");
      itag.classList.add("glyphicon-play");

      s.classList.add("badge");
      s.classList.add("badge-info");
      link.appendChild(itag);
      link.appendChild(s);
      playlinks.appendChild(link);

      // Create instance of FileReader
      var reader = new FileReader();

      // When the file has been succesfully read
      reader.onload = function (event) {
        // Create an instance of AudioContext
        var audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();

        // Asynchronously decode audio file data contained in an ArrayBuffer.
        audioContext.decodeAudioData(event.target.result, function (buffer) {
          // Obtain the duration in seconds of the audio file (with milliseconds as well, a float value)
          var duration = buffer.duration;
          duration = Math.round(duration * 100) / 100;
          s.textContent = duration;
          // example 12.3234 seconds
          console.log(
            "The duration of the song is of: " + duration + " seconds"
          );
          // Alternatively, just display the integer value with
          // parseInt(duration)
          // 12 seconds
        });
      };

      // In case that the file couldn't be read
      reader.onerror = function (event) {
        console.error("An error ocurred reading the file: ", event);
      };

      // Read file as an ArrayBuffer, important !
      reader.readAsArrayBuffer(file);
    }
  }, 2000);
  initsets();
}

function initsets() {
  // Create a WaveSurfer instance
  console.log("does touch here2");
  var wavesurfer;

  // Init on DOM ready
  btn.addEventListener("click", function () {
    wavesurfer = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple",
      loaderColor: "purple",
      cursorColor: "navy",
    });
  });

  // Bind controls
  btn.addEventListener("click", function () {
    let playPause = document.querySelector("#playPause");
    playPause.addEventListener("click", function () {
      wavesurfer.playPause();
    });

    // Toggle play/pause text
    wavesurfer.on("play", function () {
      document.querySelector("#play").style.display = "none";
      document.querySelector("#pause").style.display = "";
    });
    wavesurfer.on("pause", function () {
      document.querySelector("#play").style.display = "";
      document.querySelector("#pause").style.display = "none";
    });

    // The playlist links
    let links = document.querySelectorAll("#playlist a");
    let currentTrack = 0;
    // console.log(links);
    console.log(links[currentTrack]);
    console.log("haha");

    // Load a track by index and highlight the corresponding link
    let setCurrentSong = function (index) {
      links[currentTrack].classList.remove("active");
      currentTrack = index;
      links[currentTrack].classList.add("active");
      wavesurfer.load(links[currentTrack].href);
    };

    // Load the track on click
    Array.prototype.forEach.call(links, function (link, index) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        setCurrentSong(index);
      });
    });

    // Play on audio load
    wavesurfer.on("ready", function () {
      wavesurfer.play();
      console.log("play ok");
    });

    wavesurfer.on("error", function (e) {
      console.warn(e);
      console.log("bad thing hanppend Lx");
    });

    // Go to the next track on finish
    wavesurfer.on("finish", function () {
      setCurrentSong((currentTrack + 1) % links.length);
    });

    // Load the first track
    setCurrentSong(currentTrack);
  });
}
