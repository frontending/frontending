//бургер

const header = document.querySelector('.header')
const headerBurger = document.querySelector('.header-burger')
const span1 = document.querySelector('.span1')
const span2 = document.querySelector('.span2')
const span3 = document.querySelector('.span3')
const headerContent = document.querySelector('.header-content')
const headerLogo = document.querySelector('.header-logo')
const bamboo = document.querySelector('.bamboo')
const headerMenu = document.querySelector('.header-menu')
const headerMenuList = document.querySelector('.header-menu-list')
const headerCopyr = document.querySelector('.header-copyr-txt')
const hider = document.querySelector('.hider')
const body1 = document.querySelector('.body1')

headerBurger.addEventListener('click', function () {
    header.classList.toggle('header')
    header.classList.toggle('header-alt')
    span1.classList.toggle('span1-alt')
    span2.classList.toggle('span2-alt')
    span3.classList.toggle('span3-alt')
    headerContent.classList.toggle('burger-menu')
    headerContent.classList.toggle('header-content')
    headerLogo.classList.toggle('header-logo')
    headerLogo.classList.toggle('header-logo-alt')
    if (headerLogo.classList.contains('header-logo-alt')) {
        bamboo.src = '../../assets/image/bamboo2.png'
        body1.style.overflow = 'hidden'
    } else {
        bamboo.src = '../../assets/image/bamboo.svg'
        body1.style.overflow = 'unset'
    }
    bamboo.classList.toggle('bamboo')
    bamboo.classList.toggle('bamboo-alt')
    headerMenu.classList.toggle('header-menu')
    headerMenu.classList.toggle('header-menu-alt')
    headerMenuList.classList.toggle('header-menu-list')
    headerMenuList.classList.toggle('header-menu-list-alt')
    headerCopyr.classList.toggle('header-copyr-txt')
    headerCopyr.classList.toggle('header-copyr-txt-alt')
    headerBurger.classList.toggle('header-burger-alt')
    hider.classList.toggle('hider-active')
})

//попап

const popupWrapper = document.querySelectorAll('.popup-wrapper')
const popupContent = document.querySelectorAll('.popup-content')
const hiderPopup = document.querySelector('.hider-popup')

for (let i = 0; i < popupWrapper.length; i++) {
    popupWrapper[i].addEventListener('click', function () {
        popupWrapper[i].classList.add('popup-wrapper-alt')
        popupContent[i].classList.add('popup-content-alt')
        hiderPopup.classList.add('hider-popup-alt')
        body1.style.overflow = 'hidden'
    })
}

function closePopup() {
    for (let i = 0; i < popupWrapper.length; i++) {
        popupWrapper[i].classList.remove('popup-wrapper-alt')
        popupContent[i].classList.remove('popup-content-alt')
    }
    hiderPopup.classList.remove('hider-popup-alt')
    body1.style.overflow = 'unset'
}

//глобальное отслеживание закрытия бургера и попапа

window.addEventListener('click', function (e) {
    //закрытие бургер меню
    if (
        !e.target.closest('.burger-menu') &&
        headerContent.classList.contains('burger-menu')
    ) {
        headerBurger.click()
    }
    //закрытие попапа
    if (
        !e.target.closest('.popup-wrapper') &&
        !e.target.closest('.hider-background') &&
        hiderPopup.classList.contains('hider-popup-alt')
    ) {
        closePopup()
    }
})

//карусель карточек на input-range

const testimonialsCards = document.querySelector('.testimonials-cards')
const testimonialsLine = document.querySelector('.testimonials-line')
testimonialsLine.addEventListener('input', function () {
    if (window.innerWidth > 1500) {
        testimonialsCards.style.left = `${testimonialsLine.value * -298}px`
    } else {
        testimonialsCards.style.left = `${testimonialsLine.value * -323}px`
    }
})

//карусель питомцев

let step1
let step2

if (window.innerWidth > 1500) {
    step1 = '1188px'
    step2 = '2376px'
} else if (window.innerWidth > 999) {
    step1 = '969px'
    step2 = '1938px'
} else if (window.innerWidth > 639) {
    step1 = '628px'
    step2 = '1256px'
} else {
    step1 = '0px'
    step2 = '0px'
}

window.addEventListener('resize', function () {
    if (window.innerWidth > 1500) {
        step1 = '1188px'
        step2 = '2376px'
    } else if (window.innerWidth > 999) {
        step1 = '969px'
        step2 = '1938px'
    } else if (window.innerWidth > 639) {
        step1 = '628px'
        step2 = '1256px'
    } else {
        step1 = '0px'
        step2 = '0px'
    }
    petsSliderBox.style.left = step1
})

const petsSliderBox = document.querySelector('.pets-slider-box')
const petsLeft = document.querySelector('.pets-left')
const petsRight = document.querySelector('.pets-right')
const petsSliderElem = document.querySelectorAll('.pets-slider-elem') //от 0 до 20, 21 элемент

let randomArr = []

function getRandom(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomArrFilling(n) {
    randomArr = []
    while (randomArr.length < n) {
        let tempNumber = getRandom(0, 20)
        if (!randomArr.includes(tempNumber)) {
            randomArr.push(tempNumber)
        }
    }
}

function displayCards(amount) {
    for (let el of petsSliderElem) {
        el.style.display = 'none'
    }
    randomArrFilling(amount)
    for (let i = 0; i < randomArr.length; i++) {
        petsSliderElem[randomArr[i]].style.display = 'flex'
        petsSliderElem[randomArr[i]].style.order = `${i}`
    }
}

displayCards(6)

petsLeft.addEventListener('click', function () {
    petsLeft.disabled = true
    petsRight.disabled = true
    petsSliderBox.style.left = '0px'
    setTimeout(() => {
        petsSliderBox.style.transition = '0s'
    }, 400)
    setTimeout(displayCards, 430, 6)
    setTimeout(() => {
        petsSliderBox.style.left = step2
    }, 460)
    setTimeout(() => {
        petsSliderBox.style.transition = '0.4s'
    }, 490)
    setTimeout(() => {
        petsSliderBox.style.left = step1
    }, 520)
    setTimeout(() => {
        petsLeft.disabled = false
        petsRight.disabled = false
    }, 900)
})

petsRight.addEventListener('click', function () {
    petsRight.disabled = true
    petsLeft.disabled = true
    petsSliderBox.style.left = step2
    setTimeout(() => {
        petsSliderBox.style.transition = '0s'
    }, 400)
    setTimeout(displayCards, 430, 6)
    setTimeout(() => {
        petsSliderBox.style.left = '0px'
    }, 460)
    setTimeout(() => {
        petsSliderBox.style.transition = '0.4s'
    }, 490)
    setTimeout(() => {
        petsSliderBox.style.left = step1
    }, 520)
    setTimeout(() => {
        petsRight.disabled = false
        petsLeft.disabled = false
    }, 900)
})
