let animals
let valuesAnimals

let orderArray = []
let basicArray = []
let cartArrayTemp = localStorage.getItem('cartArray') || ''
let cartArray = cartArrayTemp.split(',').map((n) => +n)
if (cartArray[0] === '') {
    cartArray.shift()
}
for (let i = 1; i <= 24; i++) {
    basicArray.push(i)
}

const optionAnimal = document.querySelectorAll('.option-animal')
const optionColor = document.querySelectorAll('.option-color')
const optionDelivery = document.querySelectorAll('.option-delivery')
const optionYes = document.querySelectorAll('.option-yes')

async function jsonReturn() {
    let response = await fetch('JSON.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
    })
    animals = await response.json()
    valuesAnimals = Object.values(animals) //массив с массивами значений объекта
    addCard()
    initAsideOptions(optionAnimal, optionColor, optionDelivery, optionYes)
    initLocalStorage()
}

jsonReturn()

// работа с корзиной и добавлением в корзину

const cartCounter = document.querySelector('.header-cart-number')

cartCounter.textContent = localStorage.getItem('cartCounter') || '0'

const cardWrapper = document.querySelector('.card-wrapper')

//шаблон добавления элементов
function addP(elem, txt1, txt2, txt3, ...classlist) {
    const e = document.createElement(`${elem}`)
    for (let el of classlist) {
        e.classList.add(`${el}`)
    }
    e.textContent = txt1 + txt2 + txt3
    return e
}

//генерация карточек животных
function addCard() {
    deleteAllCard()
    for (let i = 1; i <= 24; i++) {
        if (!basicArray.includes(i)) {
            continue
        }
        cardWrapper.appendChild(addP('div', '', '', '', `card${i}`))
        const cardTmp = document.querySelector(`.card${i}`)
        cardTmp.appendChild(
            addP('p', `${valuesAnimals[i - 1][4]}`, '', '', 'card-title') //animal
        )
        cardTmp.appendChild(
            addP('p', `${valuesAnimals[i - 1][0]}`, '', '', 'card-name')
        )
        cardTmp.appendChild(addP('div', '', '', '', 'card-img', `card-img${i}`))
        const cardImgTmp = document.querySelector(`.card-img${i}`)
        cardImgTmp.style.backgroundImage = `url(${valuesAnimals[i - 1][8]})`
        cardTmp.appendChild(
            addP(
                'p',
                'Вес: ',
                `${valuesAnimals[i - 1][3]}`,
                'кг',
                'card-weight'
            )
        )
        cardTmp.appendChild(
            addP('p', 'Цвет: ', `${valuesAnimals[i - 1][5]}`, '', 'card-color') //color
        )
        cardTmp.appendChild(
            addP(
                'p',
                'В наличии: ',
                `${valuesAnimals[i - 1][2]}`,
                'шт',
                'card-aviable'
            )
        )
        cardTmp.appendChild(
            addP(
                'p',
                'Доставка: ',
                deliveryConverter(`${valuesAnimals[i - 1][6]}`), //delivery
                '',
                'card-delivery'
            )
        )
        cardTmp.appendChild(
            addP(
                'p',
                'Популярность: ',
                `${valuesAnimals[i - 1][7]}`, //popular
                '',
                'card-popular'
            )
        )
        cardTmp.appendChild(
            addP(
                'p',
                'Цена: ',
                `${valuesAnimals[i - 1][1]}`,
                'у.е',
                'card-price'
            )
        )
        cardTmp.appendChild(addP('div', 'В корзину', '', '', 'card-cart'))
        if (cartArray.includes(i)) {
            cardTmp.childNodes[9].classList.add('card-cart-active')
        }
        cardTmp.addEventListener('click', function () {
            if (cardTmp.childNodes[9].classList.contains('card-cart-active')) {
                cardTmp.childNodes[9].classList.remove('card-cart-active')
                cartArray = cartArray.filter((el) => el != i)
                cartCounter.textContent = (
                    +cartCounter.textContent - 1
                ).toString()
                localStorage.setItem(
                    'cartCounter',
                    `${cartCounter.textContent}`
                )
                localStorage.setItem('cartArray', `${cartArray.join()}`)
            } else {
                if (cartCounter.textContent !== '20') {
                    cardTmp.childNodes[9].classList.add('card-cart-active')
                    cartArray.push(i)
                    cartCounter.textContent = (
                        +cartCounter.textContent + 1
                    ).toString()
                    localStorage.setItem(
                        'cartCounter',
                        `${cartCounter.textContent}`
                    )
                    localStorage.setItem('cartArray', `${cartArray.join()}`)
                } else {
                    alert('Извините, все слоты заполнены')
                }
            }
        })
        cardTmp.style.order = `${orderArray[i - 1]}` //Назначение очередности
    }
}

function deleteAllCard() {
    while (cardWrapper.firstChild) {
        cardWrapper.removeChild(cardWrapper.firstChild)
    }
}

function deliveryConverter(value) {
    if (value === '1') {
        return '1-3 дня'
    } else if (value === '2') {
        return '4-9 дней'
    } else if (value === '3') {
        return '10-30 дней'
    }
}

//сортировка по имени и цене

const sortOrderOption = document.querySelectorAll('.sort-order')
let currentOrderSelect = localStorage.getItem('currentOrderSelect') || 0

for (let i = 0; i < sortOrderOption.length; i++) {
    sortOrderOption[i].addEventListener('click', function () {
        for (let j = 0; j < sortOrderOption.length; j++) {
            sortOrderOption[j].classList.remove('sort-active')
        }
        sortOrderOption[i].classList.add('sort-active')
        currentOrderSelect = i
        localStorage.setItem('currentOrderSelect', `${currentOrderSelect}`)
        prepareOrderArr(+currentOrderSelect)
        sortStepAll()
    })
}

// базовый массив очередности в зависимости от сортировки

function prepareOrderArr(n) {
    orderArray.length = 0
    if (n === 0) {
        for (let i = 1; i <= 24; i++) {
            orderArray.push(i)
        }
    } else if (n === 1) {
        for (let i = 24; i >= 1; i--) {
            orderArray.push(i)
        }
    } else if (n === 2) {
        let tempArr = []
        for (let i = 1; i <= 24; i++) {
            tempArr.push(valuesAnimals[i - 1][1])
            tempArr.sort(function (a, b) {
                return a - b
            })
        }
        for (let i = 0; i < tempArr.length; i++) {
            for (let j = 0; j < valuesAnimals.length; j++) {
                if (tempArr[i] === valuesAnimals[j][1]) {
                    orderArray[j] = i + 1
                }
            }
        }
    } else if (n === 3) {
        let tempArr = []
        for (let i = 1; i <= 24; i++) {
            tempArr.push(valuesAnimals[i - 1][1])
            tempArr.sort(function (a, b) {
                return b - a
            })
        }
        for (let i = 0; i < tempArr.length; i++) {
            for (let j = 0; j < valuesAnimals.length; j++) {
                if (tempArr[i] === valuesAnimals[j][1]) {
                    orderArray[j] = i + 1
                }
            }
        }
    }
}

//отслеживание нажатий по меню с множественным выбором

let currentClicked
let currentClickedActive

function initOptionListener(...names) {
    for (let j = 0; j < names.length; j++) {
        for (let i = 0; i < names[j].length; i++) {
            names[j][i].addEventListener('click', function () {
                names[j][i].classList.toggle('option-active')
                localStorage.setItem(
                    `${arguments[0].target.classList[0]}`,
                    `${names[j][i].classList.contains('option-active')}`
                )
                currentClicked = names[j][i].textContent
                currentClickedActive = names[j][i].classList.contains(
                    'option-active'
                )
                prepareOrderArr(+currentOrderSelect)
                clickChecker()
                sortStepAll()
            })
        }
    }
}

initOptionListener(optionAnimal, optionColor, optionDelivery, optionYes)

function initAsideOptions(...names) {
    for (let j = 0; j < names.length; j++) {
        for (let i = 0; i < names[j].length; i++) {
            if (
                localStorage.getItem(`${arguments[j][i].classList[0]}`) ==
                'true'
            ) {
                names[j][i].click()
            }
        }
    }
}

const optionsArray = [
    ['Корова', 'Свинья', 'Лошадь', 'Овца'],
    ['Черный', 'Белый', 'Розовый', 'Коричневый', 'Пятнистый'],
    ['1-3 дня', '4-9 дней', '10-30 дней'],
]

let optionAnimalArray = [...optionsArray[0]]
let optionColorArray = [...optionsArray[1]]
let optionDeliveryArray = [...optionsArray[2]]

// выполнение большинства действий по сортировке

const errorMessage = document.querySelector('.error-message')

function sortStepAll() {
    basicArray = []
    for (let i = 1; i <= 24; i++) {
        basicArray.push(i)
    }
    sortAnimalColorDelivery()
    sortStepYes()
    sortBySearch()
    sortByAviable()
    sortByWeight()
    if (basicArray.filter((el) => el != null).length === 0) {
        deleteAllCard()
        cardWrapper.style.display = 'none'
        errorMessage.style.display = 'flex'
    } else {
        errorMessage.style.display = 'none'
        cardWrapper.style.display = 'flex'
        addCard()
    }
}

// отслеживание и запоминание выбранных опций

function clickChecker() {
    if (optionsArray[0].includes(currentClicked)) {
        if (currentClickedActive) {
            if (optionAnimalArray.length === 4) {
                optionAnimalArray.length = 0
            }
            optionAnimalArray.push(currentClicked)
        } else {
            if (optionAnimalArray.length === 1) {
                optionAnimalArray = [...optionsArray[0]]
            } else {
                optionAnimalArray = optionAnimalArray.filter(
                    (el) => el !== currentClicked
                )
            }
        }
    } else if (optionsArray[1].includes(currentClicked)) {
        if (currentClickedActive) {
            if (optionColorArray.length === 5) {
                optionColorArray.length = 0
            }
            optionColorArray.push(currentClicked)
        } else {
            if (optionColorArray.length === 1) {
                optionColorArray = [...optionsArray[1]]
            } else {
                optionColorArray = optionColorArray.filter(
                    (el) => el !== currentClicked
                )
            }
        }
    } else if (optionsArray[2].includes(currentClicked)) {
        if (currentClickedActive) {
            if (optionDeliveryArray.length === 3) {
                optionDeliveryArray.length = 0
            }
            optionDeliveryArray.push(currentClicked)
        } else {
            if (optionDeliveryArray.length === 1) {
                optionDeliveryArray = [...optionsArray[2]]
            } else {
                optionDeliveryArray = optionDeliveryArray.filter(
                    (el) => el !== currentClicked
                )
            }
        }
    }
}

// удаление элементов, которые не подошли под требования

function sortAnimalColorDelivery() {
    for (let i = 0; i < valuesAnimals.length; i++) {
        if (
            !(
                optionAnimalArray.includes(valuesAnimals[i][4]) &&
                optionColorArray.includes(
                    valuesAnimals[i][5].charAt(0).toUpperCase() +
                        valuesAnimals[i][5].slice(1)
                ) &&
                optionDeliveryArray.includes(
                    deliveryConverter(valuesAnimals[i][6])
                )
            )
        ) {
            basicArray[i] = null
        }
    }
}

// сортировка по популярным

function sortStepYes() {
    if (optionYes[0].classList.contains('option-active')) {
        for (let i = 0; i < valuesAnimals.length; i++) {
            if (valuesAnimals[i][7] !== 'да') {
                basicArray[i] = null
            }
        }
    }
}

// сортировка по поисковой строке

const optionSearch = document.querySelector('.search')
let valueMemory = localStorage.getItem('valueMemory') || ''
optionSearch.value = valueMemory

//отслеживаем крестик

optionSearch.addEventListener('search', function (e) {
    localStorage.setItem('valueMemory', '')
    valueMemory = ''
    sortStepAll()
})

//отслеживание Enter

optionSearch.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        e.preventDefault()
        valueMemory = optionSearch.value.trim().toLowerCase()
        localStorage.setItem('valueMemory', `${valueMemory}`)
        sortStepAll()
    }
})

//удаляем номера карточек, которые не подоходят по поиску

function sortBySearch() {
    for (let i = 0; i < valuesAnimals.length; i++) {
        if (!valuesAnimals[i][0].includes(valueMemory) && valueMemory !== '') {
            basicArray[i] = null
        }
    }
}

// сортировка ползунками

const aviableInput = document.querySelector('.aviable-input')
const weightInput = document.querySelector('.weight-input')
let aviableInputMin = localStorage.getItem('aviableInputMin') || 1
let aviableInputMax = localStorage.getItem('aviableInputMax') || 20
let weightInputMin = localStorage.getItem('weightInputMin') || 50
let weightInputMax = localStorage.getItem('weightInputMax') || 700

aviableInput.addEventListener('rangechange', function () {
    aviableInputMin = +aviableInput.value.split(',')[0]
    aviableInputMax = +aviableInput.value.split(',')[1]
    localStorage.setItem('aviableInputMin', `${aviableInputMin}`)
    localStorage.setItem('aviableInputMax', `${aviableInputMax}`)
    sortStepAll()
})

weightInput.addEventListener('rangechange', function () {
    weightInputMin = +weightInput.value.split(',')[0]
    weightInputMax = +weightInput.value.split(',')[1]
    localStorage.setItem('weightInputMin', `${weightInputMin}`)
    localStorage.setItem('weightInputMax', `${weightInputMax}`)
    sortStepAll()
})

function sortByAviable() {
    for (let i = 0; i < valuesAnimals.length; i++) {
        if (
            +valuesAnimals[i][2] < +aviableInputMin ||
            +valuesAnimals[i][2] > +aviableInputMax
        ) {
            basicArray[i] = null
        }
    }
}

function sortByWeight() {
    for (let i = 0; i < valuesAnimals.length; i++) {
        if (
            +valuesAnimals[i][3] < +weightInputMin ||
            +valuesAnimals[i][3] > +weightInputMax
        ) {
            basicArray[i] = null
        }
    }
}

// сброс настроек

const resetOption = document.querySelector('.reset-option')
const resetAll = document.querySelector('.reset-all')

resetOption.addEventListener('click', function () {
    resetOptionStorage()
    for (let i = 0; i < optionAnimal.length; i++) {
        optionAnimal[i].classList.remove('option-active')
    }
    for (let i = 0; i < optionColor.length; i++) {
        optionColor[i].classList.remove('option-active')
    }
    for (let i = 0; i < optionDelivery.length; i++) {
        optionDelivery[i].classList.remove('option-active')
    }
    for (let i = 0; i < optionYes.length; i++) {
        optionYes[i].classList.remove('option-active')
    }
    optionAnimalArray = [...optionsArray[0]]
    optionColorArray = [...optionsArray[1]]
    optionDeliveryArray = [...optionsArray[2]]
    optionYes[0].classList.remove('option-active')
    valueMemory = ''
    optionSearch.value = ''
    aviableInputMin = 1
    aviableInputMax = 20
    weightInputMin = 50
    weightInputMax = 700
    // ДОБАВИТЬ УДАЛЕНИЕ И ПОВТОРНУЮ ГЕНЕРАЦИЮ СЛАЙДЕРОВ
    aviableInput.value = '1, 20'
    weightInput.value = '50, 700'
    basicArray.length = 0
    for (let i = 1; i <= 24; i++) {
        basicArray.push(i)
    }
    sortStepAll()
    addCard()
})

resetAll.addEventListener('click', function () {
    cartArray = []
    resetAllStorage()
    cartCounter.textContent = '0'
    resetOption.click()
    sortOrderOption[0].click()
})

function resetOptionStorage() {
    localStorage.setItem('valueMemory', '')
    localStorage.setItem('aviableInputMin', '1')
    localStorage.setItem('aviableInputMax', '20')
    localStorage.setItem('weightInputMin', '50')
    localStorage.setItem('weightInputMax', '700')
    resetAsideOptions(optionAnimal, optionColor, optionDelivery, optionYes)
}

function resetAsideOptions(...names) {
    for (let j = 0; j < names.length; j++) {
        for (let i = 0; i < names[j].length; i++) {
            if (names[j][i].classList.contains('option-active')) {
                names[j][i].classList.remove('option-active')
                localStorage.setItem(
                    `${arguments[j][i].classList[0]}`,
                    `${names[j][i].classList.contains('option-active')}`
                )
            }
        }
    }
}

function resetAllStorage() {
    localStorage.clear()
}

function initLocalStorage() {
    sortOrderOption[+currentOrderSelect].click()
}
