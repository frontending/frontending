const imgContainer = document.querySelector('main')
const mainRotate = document.querySelector('.main-rotate')
const imgRotate = document.querySelector('.img-rotate')
const imgAmount = document.querySelectorAll('.amount')
const amountActive = document.querySelector('.main-amount-active')
const mainSearch = document.querySelector('.main-search')
const inputConfirm = document.querySelector('.input-confirm')
const waitBanner = document.querySelector('.wait-banner')

let imgCollection
let orient = 'landscape' // 'portrait'
let imgNumber = 12 // 8 12 15
let data
let userSearch = 'lake'

async function getData() {
    const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${userSearch}&per_page=15&orientation=${orient}&client_id=urcqGvgs-e2nV6aZ5l0mKupCnABYCq8ATG_jLaz8q80`
    )
    data = await res.json()
    loadPictures(true)
}

getData()

inputConfirm.addEventListener('click', function () {
    if (mainSearch.value !== '') {
        userSearch = mainSearch.value
        deletePictures()
        getData()
    }
})

mainSearch.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        userSearch = mainSearch.value
        deletePictures()
        getData()
    }
})

function loadPictures(change = false) {
    if (data.total > 0) {
        for (let i = 0; i < imgNumber; i++) {
            const div = document.createElement('div')
            div.style.backgroundImage = `url(${data.results[i].urls.regular})`
            div.classList.add('img-collection')
            if (orient === 'portrait') {
                div.classList.add('img-collection-vertical')
            }
            imgContainer.appendChild(div)
        }
        imgCollection = document.querySelectorAll('.img-collection')
    } else {
        for (let i = 0; i < imgNumber; i++) {
            const div = document.createElement('div')
            div.style.backgroundImage = 'url("assets/image/test.jpg")'
            div.classList.add('img-collection')
            if (orient === 'portrait') {
                div.classList.add('img-collection-vertical')
            }
            imgContainer.appendChild(div)
        }
        imgCollection = document.querySelectorAll('.img-collection')
        if (change) {
            setTimeout(() => alert('Nothing found for your request :('), 500)
        }
    }
}

function deletePictures() {
    while (imgContainer.firstChild) {
        imgContainer.removeChild(imgContainer.firstChild)
    }
}

imgRotate.addEventListener('click', function () {
    if (orient === 'landscape') {
        orient = 'portrait'
        imgRotate.src = 'assets/image/orientation-2.png'
        for (let el of imgCollection) {
            el.classList.toggle('img-collection-vertical')
        }
    } else {
        orient = 'landscape'
        imgRotate.src = 'assets/image/orientation-1.png'
        for (let el of imgCollection) {
            el.classList.toggle('img-collection-vertical')
        }
    }
})

for (let i = 0; i < imgAmount.length; i++) {
    imgAmount[i].addEventListener('click', function () {
        amountActive.style.left = imgAmount[i].dataset.amount
        imgNumber = Number(imgAmount[i].textContent)
        deletePictures()
        loadPictures()
    })
}
