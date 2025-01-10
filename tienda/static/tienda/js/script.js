document.addEventListener('DOMContentLoaded', function () {
    // Inicializa WaveSurfer
    var wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        barWidth: 3,
        volume: 1,  // Configura el volumen inicial
    });

    var isPlaying = false;
    var isMuted = false;
    var currentSongIndex = 0;
    var songs = Array.from(document.querySelectorAll('.song'));

    // Función para cambiar el icono de mute/unmute
    function toggleMuteIcon() {
        var muteBtn = document.getElementById('mute-btn').querySelector('i');
        if (isMuted) {
            muteBtn.classList.remove('bi-volume-up-fill');
            muteBtn.classList.add('bi-volume-mute-fill');
        } else {
            muteBtn.classList.remove('bi-volume-mute-fill');
            muteBtn.classList.add('bi-volume-up-fill');
        }
    }

    // Función para cambiar el icono de play/pause
    function togglePlayPauseIcon() {
        var playPauseBtn = document.getElementById('play-pause-btn').querySelector('i');
        if (isPlaying) {
            playPauseBtn.classList.remove('bi-play-fill');
            playPauseBtn.classList.add('bi-pause-fill');
        } else {
            playPauseBtn.classList.remove('bi-pause-fill');
            playPauseBtn.classList.add('bi-play-fill');
        }
    }

    // Función para cargar una canción en el waveform
    function loadAudio(audioUrl) {
        wavesurfer.load(audioUrl);
    }

    // Función para cargar y reproducir una canción
    function loadAndPlayAudio(audioUrl) {
        wavesurfer.load(audioUrl);
        wavesurfer.on('ready', function () {
            wavesurfer.play();
            isPlaying = true;
            togglePlayPauseIcon();
        });
    }

    // Función para cambiar de canción
    function changeSong(index) {
        if (index >= 0 && index < songs.length) {
            currentSongIndex = index;
            var audioUrl = songs[currentSongIndex].getAttribute('data-audio');
            loadAndPlayAudio(audioUrl);
        }
    }

    // Cargar el primer audio de la lista al cargar la página
    if (songs.length > 0) {
        var firstAudioUrl = songs[0].getAttribute('data-audio');
        loadAudio(firstAudioUrl);  // Carga el primer audio, pero no lo reproduce
    }

    // Agrega evento click a cada botón de reproducción en el bucle
    document.querySelectorAll('.play-btn').forEach(function (button, index) {
        button.addEventListener('click', function () {
            currentSongIndex = index;
            var audioUrl = this.closest('.song').getAttribute('data-audio');
            loadAndPlayAudio(audioUrl);
        });
    });

    // Control de reproducción/pausa del waveform
    document.getElementById('play-pause-btn').addEventListener('click', function () {
        wavesurfer.playPause();
        isPlaying = !isPlaying;
        togglePlayPauseIcon();
    });

    // Función para avanzar o retroceder 10 segundos
    function skip(seconds) {
        var currentTime = wavesurfer.getCurrentTime();
        var duration = wavesurfer.getDuration();
        var newTime = currentTime + seconds;

        if (newTime < 0) newTime = 0;
        if (newTime > duration) newTime = duration;

        wavesurfer.seekTo(newTime / duration);
    }

    // Botón de avanzar 10 segundos
    document.getElementById('forward-btn').addEventListener('click', function () {
        skip(10);
    });

    // Botón de retroceder 10 segundos
    document.getElementById('rewind-btn').addEventListener('click', function () {
        skip(-10);
    });

    // Botón de canción siguiente
    document.getElementById('next-btn').addEventListener('click', function () {
        if (currentSongIndex < songs.length - 1) {
            changeSong(currentSongIndex + 1);
        }
    });

    // Botón de canción anterior
    document.getElementById('prev-btn').addEventListener('click', function () {
        if (currentSongIndex > 0) {
            changeSong(currentSongIndex - 1);
        }
    });

    // Nueva funcionalidad para el control de volumen
    const volumeSlider = document.getElementById('volume-slider');
    const volumePercentage = document.getElementById('volume-percentage');
    const volumeSliderFill = document.querySelector('.volume-slider-fill');
    const muteBtn = document.getElementById('mute-btn');
    let lastVolume = 1;

    function updateVolumeUI(volume) {
        volumeSlider.value = volume;
        volumePercentage.textContent = Math.round(volume * 100) + '%';
        volumeSliderFill.style.width = (volume * 100) + '%';
        
        if (volume === 0) {
            muteBtn.querySelector('i').className = 'bi bi-volume-mute-fill';
        } else if (volume < 0.5) {
            muteBtn.querySelector('i').className = 'bi bi-volume-down-fill';
        } else {
            muteBtn.querySelector('i').className = 'bi bi-volume-up-fill';
        }
    }

    volumeSlider.addEventListener('input', function() {
        const volume = parseFloat(this.value);
        updateVolumeUI(volume);
        wavesurfer.setVolume(volume);
        isMuted = volume === 0;
        lastVolume = volume > 0 ? volume : lastVolume;
    });

    muteBtn.addEventListener('click', function() {
        if (wavesurfer.getVolume() > 0) {
            lastVolume = wavesurfer.getVolume();
            wavesurfer.setVolume(0);
            isMuted = true;
        } else {
            wavesurfer.setVolume(lastVolume);
            isMuted = false;
        }
        updateVolumeUI(wavesurfer.getVolume());
    });

    // Inicializar la UI del volumen
    updateVolumeUI(1);
});