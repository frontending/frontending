const videoSelect = document.querySelectorAll('.video-select')
const panelButton = document.querySelectorAll('.videobtn')
const mainVideo = document.querySelector('.main-video')
const mainVideoPoster = document.querySelector('.main-video-poster')
const videoTv = document.querySelector('.video-tv')
const mainButton = document.querySelector('.main-button')
const mainPanel = document.querySelector('.main-panel')
const mainProgressbar = document.querySelector('.main-progressbar')
const mainPanelWrapper = document.querySelector('.main-panel-wrapper')
const mainProgressWrapper = document.querySelector('.main-progressbar-wrapper')
const videoVolumeBar = document.querySelector('.video-volume')
const videoProgressbar = document.querySelector('.progressbar')
const videoTime = document.querySelector('.video-time')

let currentVideo = 0
let volumeIconCurrent
let valueCurrent = 0.6
let volumeBarCurrent
let progressbarCurrent
let fullscreenReadyStatus = true
mainVideoPoster.style.zIndex = '50'

//клик по видео справа на выбор

for (let i = 0; i < videoSelect.length; i++) {
    videoSelect[i].addEventListener('click', function () {
        currentVideo = i
        mainVideo.style.backgroundImage =
            'url("assets/image/' + videoSelect[i].dataset.select + '.jpg")'
        videoActiveChange(i)
        panelHider(false)
        panelButton[0].src = 'assets/image/pause.png'
    })
}

//событие активности выбранного видео

function videoActiveChange(n) {
    for (let el of videoSelect) {
        el.classList.remove('video-active')
    }
    videoSelect[n].classList.add('video-active')
    videoTv.src = 'assets/video/video' + (n + 1) + '.mp4'
    mainVideoPoster.style.backgroundImage =
        'url("assets/image/' + videoSelect[n].dataset.select + '.jpg")'
    mainVideoPoster.style.zIndex = '50'
    mainButton.style.zIndex = '51'
}

//клик по кнопке в центру видео

mainButton.addEventListener('click', function () {
    mainVideoPoster.style.zIndex = '40'
    mainButton.style.zIndex = '40'
    panelHider(true)
    videoTv.play()
    panelButton[0].src = 'assets/image/pause.png'
})

//показать-спрятать панель управления видеоплеером

function panelHider(status) {
    if (status) {
        mainPanelWrapper.style.top = '0vw'
        mainProgressWrapper.style.top = '0vw'
    } else {
        mainPanelWrapper.style.top = '-4.3vw'
        mainProgressWrapper.style.top = '-4.3vw'
    }
}

//клик по кнопке play

panelButton[0].addEventListener('click', function () {
    if (videoTv.paused) {
        videoTv.play()
        panelButton[0].src = 'assets/image/pause.png'
        mainButton.style.zIndex = '40'
    } else {
        videoTv.pause()
        panelButton[0].src = 'assets/image/play.png'
        mainButton.style.zIndex = '51'
    }
})

//клик по кнопке stop

panelButton[1].addEventListener('click', function () {
    videoTv.pause()
    panelButton[0].src = 'assets/image/play.png'
    videoTv.currentTime = 0
    mainButton.style.zIndex = '51'
})

//клик по кнопке volume

panelButton[2].addEventListener('click', function () {
    if (videoTv.muted) {
        videoTv.muted = false
        panelButton[2].src = volumeIconCurrent
        videoTv.volume = valueCurrent
        videoVolumeBar.value = volumeBarCurrent
        videoVolumeBar.style.background = `linear-gradient(to right, 
            #bbbb00 ${valueCurrent * 100}%, 
            #bbbb00 ${valueCurrent * 100}%, 
            #d4d499 0%, 
            #d4d499 100%)`
    } else {
        volumeIconCurrent = panelButton[2].src
        valueCurrent = videoTv.volume
        volumeBarCurrent = videoVolumeBar.value
        videoVolumeBar.value = '0'
        videoTv.muted = true
        panelButton[2].src = 'assets/image/volumeoff.png'
        videoVolumeBar.style.background = `linear-gradient(
            to right, 
            #bbbb00 0%, 
            #bbbb00 0%, 
            #d4d499 0%, 
            #d4d499 100%)`
    }
})

//клик по кнопке fullscreen

panelButton[3].addEventListener('click', function () {
    if (fullscreenReadyStatus) {
        fullscreenOn()
    } else {
        fullscreenOff()
    }
})

function fullscreenOn() {
    fullscreenReadyStatus = false
    mainVideo.style.gridArea = '1 / 1 / 200 / 200'
    mainVideo.style.border = 'solid 0px #2ac96c'
    mainProgressbar.style.gridArea = '178 / 1 / 187 / 200'
    mainPanel.style.gridArea = '187 / 1 / 200 / 200'
    mainProgressbar.style.zIndex = '60'
    mainPanel.style.zIndex = '60'
    mainButton.style.gridArea = '70 / 80 / 118 / 112'
    panelButton[3].src = 'assets/image/fulloff.png'
}

function fullscreenOff() {
    fullscreenReadyStatus = true
    mainVideo.style.gridArea = '15 / 7 / 160 / 150'
    mainVideo.style.border = 'solid 5px #2ac96c'
    mainProgressbar.style.gridArea = '160 / 7 / 170 / 150'
    mainPanel.style.gridArea = '170 / 7 / 190 / 150'
    mainProgressbar.style.zIndex = '20'
    mainPanel.style.zIndex = '20'
    mainButton.style.gridArea = '70 / 64 / 108 / 86'
    panelButton[3].src = 'assets/image/fullon.png'
}

//ползунок громкости

videoTv.volume = 0.6

videoVolumeBar.addEventListener('input', function () {
    videoTv.muted = false
    valueCurrent = this.value
    videoTv.volume = valueCurrent / 100
    volumeIconSelector(valueCurrent)
    videoVolumeBar.style.background = `linear-gradient(
        to right, 
        #bbbb00 ${valueCurrent}%, 
        #bbbb00 ${valueCurrent}%, 
        #d4d499 0%, 
        #d4d499 100%)`
    //важно! отменяем выделение и встроенное управление
    videoVolumeBar.blur()
})

function volumeIconSelector(current) {
    if (current >= 70) {
        panelButton[2].src = 'assets/image/volumehigh.png'
    } else if (current > 0 && current < 30) {
        panelButton[2].src = 'assets/image/volumelow.png'
    } else if (current >= 30 && current < 70) {
        panelButton[2].src = 'assets/image/volumemedium.png'
    } else {
        panelButton[2].src = 'assets/image/volumeoff.png'
    }
}

//ползунок видео

videoProgressbar.addEventListener('input', function () {
    progressbarCurrent = this.value
    videoTv.currentTime = (videoTv.duration / 1000) * progressbarCurrent
    videoProgressbar.style.background = `linear-gradient(
        to right, 
        #bbbb00 ${progressbarCurrent / 10}%, 
        #bbbb00 ${progressbarCurrent / 10}%, 
        #d4d499 0%, 
        #d4d499 100%)`
    //важно! отменяем выделение и встроенное управление
    videoProgressbar.blur()
})

videoTv.addEventListener('timeupdate', function () {
    videoProgressbar.value = (videoTv.currentTime * 1000) / videoTv.duration
    videoProgressbar.style.background = `linear-gradient(
        to right,
        #bbbb00 ${videoProgressbar.value / 10}%,
        #bbbb00 ${videoProgressbar.value / 10}%, 
        #d4d499 0%, 
        #d4d499 100%)`
    videoTime.textContent = videoTimeCurrent(
        videoTv.currentTime,
        videoTv.duration
    )
    //важно! отменяем выделение и встроенное управление
    videoProgressbar.blur()
})

function videoTimeCurrent(curr, total) {
    curr = Math.floor(curr)
    total = Math.floor(total)
    let currMin = ((curr - (curr % 60)) / 60).toString()
    let currSec
    curr % 60 < 10
        ? (currSec = '0' + (curr % 60).toString())
        : (currSec = (curr % 60).toString())
    let totalMin = ((total - (total % 60)) / 60).toString()
    let totalSec
    total % 60 < 10
        ? (totalSec = '0' + (total % 60).toString())
        : (totalSec = (total % 60).toString())
    if (isNaN(totalMin)) {
        totalMin = '0'
        totalSec = '00'
    }
    return `${currMin}:${currSec} / ${totalMin}:${totalSec}`
}

//завершение видео

videoTv.addEventListener('ended', endVideo)

function endVideo() {
    fullscreenOff()
    videoSelect[currentVideo].click()
}

//клик по экрану вызывает паузу

videoTv.addEventListener('click', function () {
    if (!videoTv.paused) {
        panelButton[0].click()
    }
})

//обработка нажатий кнопок клавиатуры

document.addEventListener('keydown', function (e) {
    let keyCurrent = e.key
    let keyCurrentCode = e.code
    if (keyCurrent === 'ArrowUp') {
        if (videoTv.muted) {
            panelButton[2].click()
        } else if (videoTv.volume >= 0.9) {
            videoTv.volume = 1
        } else {
            videoTv.volume += 0.1
        }
        volumeIconSelector(videoTv.volume * 100)
        videoVolumeBar.value = videoTv.volume * 100
        videoVolumeBar.style.background = `linear-gradient(
        to right, 
        #bbbb00 ${videoTv.volume * 100}%, 
        #bbbb00 ${videoTv.volume * 100}%, 
        #d4d499 0%, 
        #d4d499 100%)`
    } else if (keyCurrent === 'ArrowDown') {
        if (videoTv.muted) {
            videoTv.volume = 0
        } else if (videoTv.volume <= 0.1) {
            videoTv.volume = 0
            panelButton[2].click()
        } else if (videoTv.volume > 0.1) {
            videoTv.volume -= 0.1
        }
        volumeIconSelector(videoTv.volume * 100)
        videoVolumeBar.value = videoTv.volume * 100
        videoVolumeBar.style.background = `linear-gradient(
        to right, 
        #bbbb00 ${videoTv.volume * 100}%, 
        #bbbb00 ${videoTv.volume * 100}%, 
        #d4d499 0%, 
        #d4d499 100%)`
    } else if (keyCurrent === 'ArrowLeft') {
        videoTv.currentTime < 21
            ? (videoTv.currentTime = 0)
            : (videoTv.currentTime -= 20)
        videoProgressbar.style.background = `linear-gradient(
        to right, 
        #bbbb00 ${videoProgressbar.value / 10}%, 
        #bbbb00 ${videoProgressbar.value / 10}%, 
        #d4d499 0%, 
        #d4d499 100%)`
    } else if (keyCurrent === 'ArrowRight') {
        videoTv.currentTime < videoTv.duration - 20
            ? (videoTv.currentTime += 20)
            : endVideo()
        videoProgressbar.style.background = `linear-gradient(
        to right, 
        #bbbb00 ${videoProgressbar.value / 10}%, 
        #bbbb00 ${videoProgressbar.value / 10}%, 
        #d4d499 0%, 
        #d4d499 100%)`
    } else if (keyCurrent === 'Escape') {
        if (!fullscreenReadyStatus) {
            fullscreenOff()
        }
    } else if (keyCurrent === ' ') {
        if (!videoTv.paused) {
            panelButton[0].click()
        } else {
            mainButton.click()
        }
    } else if (keyCurrentCode === 'KeyF') {
        if (mainVideoPoster.style.zIndex !== '50') {
            panelButton[3].click()
        }
    } else if (keyCurrentCode === 'KeyM') {
        if (mainVideoPoster.style.zIndex !== '50') {
            panelButton[2].click()
        }
    } else if (keyCurrentCode === 'KeyS') {
        if (mainVideoPoster.style.zIndex !== '50') {
            panelButton[1].click()
        }
    } else if (keyCurrent === 'Tab') {
        e.preventDefault()
    }
})
