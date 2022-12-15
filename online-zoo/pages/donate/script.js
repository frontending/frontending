//переключение кастомных радиокнопок согласно реальным радиокнопкам

const radioMonthly = document.querySelector('.help-label-monthly')
const radioOnce = document.querySelector('.help-label-once')
const customMonthly = document.querySelector('.custom-monthly')
const customOnce = document.querySelector('.custom-once')

radioMonthly.addEventListener('click', function () {
    customMonthly.classList.add('custom-active')
    customOnce.classList.remove('custom-active')
})

radioOnce.addEventListener('click', function () {
    customOnce.classList.add('custom-active')
    customMonthly.classList.remove('custom-active')
})

//шкала с выбором суммы и поле с суммой

const progressbarPoint = document.querySelectorAll('.help-progressbar-point')
const progressbarUsd = document.querySelectorAll('.help-usd')
const helpAmount = document.querySelector('.help-amount')

for (let i = 0; i < progressbarPoint.length; i++) {
    progressbarPoint[i].addEventListener('click', function () {
        removeAll()
        progressbarPoint[i].classList.add('help-progressbar-active')
        progressbarUsd[i].classList.add('help-usd-active')
        helpAmount.value = progressbarUsd[i].textContent.slice(1)
    })
}

function removeAll() {
    for (let el of progressbarPoint) {
        el.classList.remove('help-progressbar-active')
    }
    for (let el of progressbarUsd) {
        el.classList.remove('help-usd-active')
    }
}

helpAmount.addEventListener('input', function () {
    let arr = ['5000', '2000', '1000', '500', '250', '100', '50', '25']
    if (arr.indexOf(helpAmount.value) != -1) {
        progressbarPoint[arr.indexOf(helpAmount.value)].click()
    } else {
        removeAll()
    }
})

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

window.addEventListener('click', function (e) {
    if (
        !e.target.closest('.burger-menu') &&
        headerContent.classList.contains('burger-menu')
    ) {
        headerBurger.click()
    }
})
