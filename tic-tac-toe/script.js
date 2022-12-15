const headerPlay = document.querySelector('.header-play')
const headerOption = document.querySelector('.header-option')
const headerScore = document.querySelector('.header-score')
const gameWrapper = document.querySelector('.game-wrapper')
const optionWrapper = document.querySelector('.option-wrapper')
const scoreWrapper = document.querySelector('.score-wrapper')
const playstop = document.querySelector('.playstop')
const field = document.querySelectorAll('.field')
const noticeWrapper = document.querySelector('.notice-wrapper')
const noticeText = document.querySelector('.notice-text')
const noticeBtn = document.querySelector('.notice-btn')
const score = document.querySelectorAll('.score')
const optionModeSelect = document.querySelectorAll('.option-mode-select')
const optionFirstSelect = document.querySelectorAll('.option-first-select')
const optionMusicSelect = document.querySelectorAll('.option-music-select')
const optionStyleSelect = document.querySelectorAll('.option-style-select')
const root = document.querySelector(':root')

let isCrossNow = true //утвердаем, что крестики ходят первыми
let checkArr = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
] //массив для проверки выигрышных комбинаций
let crossArr = [] //массив ходов крестика
let circleArr = [] //массив ходов нолика
let movesTotal = 0 //общее количество ходов в целом
let difficultySelect = 1 //текущая сложность
let movesArr = '012345678' //список свободных полей
let isComputerFirst = false //утверждаем, что компьютер НЕ ходит первым
let permission = true // разрешение на выполнение проверки выигрышной комбинации, защита от двойной проверки при игре с компьютером
let isMove //компьютер ходит прямо сейчас, или не ходит
let hardMoveHistory = '' //отслеживание ходов компьютером высокой сложности
let audioplayer = new Audio('assets/audio/audio1.mp3')

//инициализация оформления
function colorInit(theme) {
    if (theme === 'light') {
        root.style.setProperty('--color-1', 'rgb(235, 235, 235)')
        root.style.setProperty('--color-2', 'rgb(170, 228, 228)')
        root.style.setProperty('--color-3', 'rgb(255, 250, 205)')
        root.style.setProperty('--color-4', 'rgb(108, 194, 148)')
        root.style.setProperty('--color-5', 'rgb(64, 235, 144)')
        root.style.setProperty('--color-6', 'rgb(176, 196, 222)')
        root.style.setProperty('--color-7', 'rgb(187, 63, 139)')
        root.style.setProperty('--color-8', 'rgb(235, 109, 186)')
        root.style.setProperty('--color-9', 'rgb(224, 127, 127)')
    } else {
        root.style.setProperty('--color-1', 'rgb(56, 56, 56)')
        root.style.setProperty('--color-2', 'rgb(18, 92, 92)')
        root.style.setProperty('--color-3', 'rgb(141, 141, 106)')
        root.style.setProperty('--color-4', 'rgb(98, 141, 118)')
        root.style.setProperty('--color-5', 'rgb(35, 136, 82)')
        root.style.setProperty('--color-6', 'rgb(89, 98, 110)')
        root.style.setProperty('--color-7', 'rgb(107, 45, 83)')
        root.style.setProperty('--color-8', 'rgb(133, 55, 103)')
        root.style.setProperty('--color-9', 'rgb(78, 43, 43)')
    }
}

//инициализация последних 10 игр в истории
function historyInit() {
    for (let i = 0; i < 10; i++) {
        score[i].textContent =
            localStorage.getItem(`history${i + 1}`) || 'empty'
    }
}

historyInit()

//обработка кнопок в хедере
headerPlay.addEventListener('click', function () {
    gameWrapper.style.display = 'flex'
    optionWrapper.style.display = 'none'
    scoreWrapper.style.display = 'none'
    if (headerPlay.classList.contains('header-stop')) {
        headerPlay.classList.remove('header-stop')
        headerOption.classList.remove('header-hide')
        headerScore.classList.remove('header-hide')
        playstop.textContent = 'Play'
        stopGame()
    } else {
        headerPlay.classList.add('header-stop')
        headerOption.classList.add('header-hide')
        headerScore.classList.add('header-hide')
        playstop.textContent = 'Stop'
        initGame()
    }
})

headerOption.addEventListener('click', function () {
    gameWrapper.style.display = 'none'
    optionWrapper.style.display = 'flex'
    scoreWrapper.style.display = 'none'
})

headerScore.addEventListener('click', function () {
    gameWrapper.style.display = 'none'
    optionWrapper.style.display = 'none'
    scoreWrapper.style.display = 'flex'
})

//начальная инициализация новой игры, сброс параметров
function initGame() {
    hardMoveHistory = ''
    permission = true
    isCrossNow = true
    crossArr = []
    circleArr = []
    movesTotal = 0
    movesArr = '012345678'
    isComputerFirst = optionFirstSelect[1].classList.contains(
        'option-first-active'
    )
    for (let el of field) {
        el.classList.add('empty')
        el.style.backgroundColor = 'unset'
    }
    for (let i = 0; i < field.length; i++) {
        field[i].addEventListener('click', initClickGame(i))
    }
    if (difficultySelect !== 0 && isComputerFirst) {
        computerMove(difficultySelect)
    }
}

//инициализация кликов по игровым полям
function initClickGame(i) {
    field[i].addEventListener('click', function () {
        if (field[i].classList.contains('empty')) {
            if (difficultySelect !== 0) {
                isComputerFirst = !isComputerFirst
            }
            movesTotal++
            if (isCrossNow) {
                field[i].style.backgroundImage = 'url("assets/image/cross.png")'
                crossArr.push(i + 1)
            } else {
                field[i].style.backgroundImage =
                    'url("assets/image/circle.png")'
                circleArr.push(i + 1)
            }
            removeClicked(i)
            field[i].classList.remove('empty')
            isCrossNow = !isCrossNow
            if (permission) {
                checkGame()
            }
            if (
                difficultySelect !== 0 &&
                isComputerFirst &&
                movesArr.length > 0 &&
                permission
            ) {
                computerMove(difficultySelect)
            }
        }
    })
}

//отслеживаем свободные ячейки и ведем историю кликов
function removeClicked(n) {
    movesArr = movesArr.replace(n, '')
    hardMoveHistory += (n + 1).toString()
}

//сложность
function computerMove(dif) {
    if (dif === 1) {
        computerMoveEasy()
    }
    if (dif === 2) {
        computerMoveMedium()
    }
    if (dif === 3) {
        computerMoveHard()
    }
}

function random(min, max) {
    let random = min + Math.random() * (max + 1 - min)
    return Math.floor(random)
}

//лёгкая сложность
function computerMoveEasy() {
    field[movesArr[random(0, movesArr.length - 1)]].click()
}

//средняя сложность
function computerMoveMedium() {
    isMove = true
    if (Math.random() > 0.8 && difficultySelect !== 3) {
        isMove = false
        field[movesArr[random(0, movesArr.length - 1)]].click()
    }
    optionFirstSelect[1].classList.contains('option-first-active')
        ? computerCheckCross()
        : computerCheckCircle()
    if (isMove) {
        optionFirstSelect[1].classList.contains('option-first-active')
            ? computerCheckCircle()
            : computerCheckCross()
    }
    if (isMove) {
        field[movesArr[random(0, movesArr.length - 1)]].click()
    }
}

function computerCheckCross() {
    for (let el of checkArr) {
        if (!isMove) {
            break
        }
        let crossCount = 0
        for (let e of crossArr) {
            let temp = el.join('')
            if (el.includes(e)) {
                crossCount++
            }
            if (crossCount === 2) {
                for (let e of crossArr) {
                    temp = temp.replace(e, '')
                }
                if (field[temp[0] - 1].classList.contains('empty')) {
                    field[temp[0] - 1].click()
                } else {
                    break
                }
                isMove = false
                break
            }
        }
    }
}

function computerCheckCircle() {
    for (let el of checkArr) {
        if (!isMove) {
            break
        }
        let circleCount = 0
        for (let e of circleArr) {
            let temp = el.join('')
            if (el.includes(e)) {
                circleCount++
            }
            if (circleCount === 2) {
                for (let e of circleArr) {
                    temp = temp.replace(e, '')
                }
                if (field[temp[0] - 1].classList.contains('empty')) {
                    field[temp[0] - 1].click()
                } else {
                    break
                }
                isMove = false
                break
            }
        }
    }
}

//высокая сложность
function computerMoveHard() {
    if (hardMoveHistory === '') {
        field[4].click()
    } else if (hardMoveHistory === '52') {
        field[0].click()
    } else if (hardMoveHistory === '54') {
        field[0].click()
    } else if (hardMoveHistory === '56') {
        field[8].click()
    } else if (hardMoveHistory === '58') {
        field[8].click()
    } else if (
        hardMoveHistory === '5212' ||
        hardMoveHistory === '5213' ||
        hardMoveHistory === '5214' ||
        hardMoveHistory === '5215' ||
        hardMoveHistory === '5216' ||
        hardMoveHistory === '5217' ||
        hardMoveHistory === '5218' ||
        hardMoveHistory === '5412' ||
        hardMoveHistory === '5413' ||
        hardMoveHistory === '5414' ||
        hardMoveHistory === '5415' ||
        hardMoveHistory === '5416' ||
        hardMoveHistory === '5417' ||
        hardMoveHistory === '5418'
    ) {
        field[8].click()
    } else if (
        hardMoveHistory === '5692' ||
        hardMoveHistory === '5693' ||
        hardMoveHistory === '5694' ||
        hardMoveHistory === '5695' ||
        hardMoveHistory === '5696' ||
        hardMoveHistory === '5697' ||
        hardMoveHistory === '5698' ||
        hardMoveHistory === '5892' ||
        hardMoveHistory === '5893' ||
        hardMoveHistory === '5894' ||
        hardMoveHistory === '5895' ||
        hardMoveHistory === '5896' ||
        hardMoveHistory === '5897' ||
        hardMoveHistory === '5898'
    ) {
        field[0].click()
    } else if (hardMoveHistory === '5219') {
        field[3].click()
    } else if (hardMoveHistory === '5419') {
        field[1].click()
    } else if (hardMoveHistory === '5691') {
        field[7].click()
    } else if (hardMoveHistory === '5891') {
        field[5].click()
    } else if (hardMoveHistory === '51') {
        field[8].click()
    } else if (hardMoveHistory === '53') {
        field[6].click()
    } else if (hardMoveHistory === '57') {
        field[2].click()
    } else if (hardMoveHistory === '59') {
        field[0].click()
    } else if (hardMoveHistory === '5196') {
        field[7].click()
    } else if (hardMoveHistory === '5198') {
        field[5].click()
    } else if (hardMoveHistory === '5374') {
        field[7].click()
    } else if (hardMoveHistory === '5378') {
        field[3].click()
    } else if (hardMoveHistory === '5732') {
        field[5].click()
    } else if (hardMoveHistory === '5736') {
        field[1].click()
    } else if (hardMoveHistory === '5912') {
        field[3].click()
    } else if (hardMoveHistory === '5914') {
        field[1].click()
    } else {
        computerMoveMedium()
    }
}

//проверка победы или ничьи
function checkGame() {
    permission = true
    for (let el of checkArr) {
        let crossCount = 0
        let circleCount = 0
        for (let e of crossArr) {
            if (el.includes(e)) {
                crossCount++
            }
            if (crossCount === 3) {
                permission = false
                for (let elem of field) {
                    elem.classList.remove('empty')
                }
                for (let elem of el) {
                    field[elem - 1].style.backgroundColor =
                        'rgba(187, 86, 86, 0.5)'
                }
                setTimeout(() => endGame('cross'), 1500)
            }
        }
        for (let e of circleArr) {
            if (el.includes(e)) {
                circleCount++
            }
            if (circleCount === 3) {
                permission = false
                for (let elem of field) {
                    elem.classList.remove('empty')
                }
                for (let elem of el) {
                    field[elem - 1].style.backgroundColor =
                        'rgba(187, 86, 86, 0.5)'
                }
                setTimeout(() => endGame('circle'), 1500)
            }
        }
    }
    if (movesTotal === 9 && permission) {
        for (let elem of field) {
            elem.classList.remove('empty')
        }
        setTimeout(() => endGame('nobody'), 1000)
    }
}

//окончание игры, запись результатов
function endGame(winner) {
    if (winner === 'cross') {
        noticeText.textContent = `Cross won after ${movesTotal} moves total`
    } else if (winner === 'circle') {
        noticeText.textContent = `Circle won after ${movesTotal} moves total`
    } else if (winner === 'nobody') {
        noticeText.textContent = `It is a draw`
    }
    noticeWrapper.style.display = 'flex'
    storageSort()
    localStorage.setItem('history1', noticeText.textContent)
    historyInit()
    isComputerFirst = optionFirstSelect[1].classList.contains(
        'option-first-active'
    )
}

//закрыть попап
noticeBtn.addEventListener('click', function () {
    noticeWrapper.style.display = 'none'
    headerPlay.click()
    headerScore.click()
})

//прерываем игру в любой момент
function stopGame() {
    for (let el of field) {
        el.style.backgroundImage = ''
    }
    headerOption.click()
}

//освобождаем певую строку для записи нового результата
function storageSort() {
    for (let i = 10; i > 1; i--) {
        localStorage.setItem(
            `history${i}`,
            localStorage.getItem(`history${i - 1}`) || 'empty'
        )
    }
}

//обработка выбора сложности в настройках
for (let i = 0; i < optionModeSelect.length; i++) {
    optionModeSelect[i].addEventListener('click', function () {
        optionModeSelect[0].classList.remove('option-mode-active')
        optionModeSelect[1].classList.remove('option-mode-active')
        optionModeSelect[2].classList.remove('option-mode-active')
        optionModeSelect[3].classList.remove('option-mode-active')
        optionModeSelect[i].classList.add('option-mode-active')
        difficultySelect = i
        localStorage.setItem('optionModeSelect', `${i}`)
        if (i === 0) {
            optionFirstSelect[0].click()
            optionFirstSelect[0].style.pointerEvents = 'none'
            optionFirstSelect[1].style.pointerEvents = 'none'
            optionFirstSelect[0].style.opacity = '0.5'
            optionFirstSelect[1].style.opacity = '0.5'
        } else if (i === 3) {
            optionFirstSelect[1].click()
            optionFirstSelect[0].style.pointerEvents = 'none'
            optionFirstSelect[1].style.pointerEvents = 'none'
            optionFirstSelect[0].style.opacity = '0.5'
            optionFirstSelect[1].style.opacity = '0.5'
        } else {
            optionFirstSelect[0].style.pointerEvents = 'unset'
            optionFirstSelect[1].style.pointerEvents = 'unset'
            optionFirstSelect[0].style.opacity = '1'
            optionFirstSelect[1].style.opacity = '1'
        }
    })
}

//Прочие настройки
optionFirstSelect[0].addEventListener('click', function () {
    optionFirstSelect[1].classList.remove('option-first-active')
    optionFirstSelect[0].classList.add('option-first-active')
    localStorage.setItem('optionFirstSelect', '0')
    isComputerFirst = false
})

optionFirstSelect[1].addEventListener('click', function () {
    optionFirstSelect[0].classList.remove('option-first-active')
    optionFirstSelect[1].classList.add('option-first-active')
    localStorage.setItem('optionFirstSelect', '1')
    isComputerFirst = true
})

optionMusicSelect[0].addEventListener('click', function () {
    optionMusicSelect[1].classList.remove('option-music-active')
    optionMusicSelect[0].classList.add('option-music-active')
    audioplayer.pause()
})

optionMusicSelect[1].addEventListener('click', function () {
    optionMusicSelect[0].classList.remove('option-music-active')
    optionMusicSelect[1].classList.add('option-music-active')
    audioplayer = new Audio('assets/audio/audio1.mp3')
    audioplayer.play()
})

audioplayer.addEventListener('ended', function () {
    audioplayer.play()
})

optionStyleSelect[0].addEventListener('click', function () {
    optionStyleSelect[1].classList.remove('option-style-active')
    optionStyleSelect[0].classList.add('option-style-active')
    localStorage.setItem('optionStyleSelect', '0')
    colorInit('light')
})

optionStyleSelect[1].addEventListener('click', function () {
    optionStyleSelect[0].classList.remove('option-style-active')
    optionStyleSelect[1].classList.add('option-style-active')
    localStorage.setItem('optionStyleSelect', '1')
    colorInit('dark')
})

//Восстановление настроек при перезагрузке страницы
optionModeSelect[Number(localStorage.getItem('optionModeSelect')) || 1].click()
optionFirstSelect[
    Number(localStorage.getItem('optionFirstSelect')) || 0
].click()
optionStyleSelect[
    Number(localStorage.getItem('optionStyleSelect')) || 0
].click()

console.log(
    'Реализован весь функционал. \n Дополнительно реализована возможность выбора игры за крестик или за нолик на легкой и средней сложности \n Также есть возможность игры с человеком на одном компьютере или против компьютера \n В случае игры против компьютера есть 3 сложности. \n На легкой сложности компьютер делает ходы невпопад, хаотично, не отслеживает 3 в ряд и не мешает выигрывать. \n На средней сложности компьютер отслеживает 2 в ряд и завершает свой ряд или мешает завершать ряд игроку, но с вероятностью 20% компьютер не замечает необходимость завершить ряд и делает случайный ход. \n На высокой сложности компьютер всегда ходит первым. Кроме того компьютер знает все сценарии победы. При правильной игре игрок может сыграть в ничью, при ошибке компьютер выиграет.  \n Победа игрока на высокой сложности невозможна. Если вы смогли выиграть на высокой сложности, то, пожалуйста, сообщите как вы это сделали. \n Игра запоминает не только последние результаты, но и все настройки, кроме музыки. (Включение музыки автоматически при загрузке страницы считаю дурным тоном) \n Ещё одним дополнительным функционалом является возможность выбора светлой или тёмной темы. \n Верстка респонсивная, но адаптивность под мобильные телефоны до конца не реализована (слишком мелкие шрифты), но это и не требовалось по тех.заданию. \n При наличии багов или странного поведения элементов просьба написать.  \n Функционал проверен в Google Chrome с ОС windows 7, а также на телефоне с android. \n Спасибо за внимание к моему проекту :)'
)
