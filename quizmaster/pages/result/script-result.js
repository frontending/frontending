const mainResultCurrent = document.querySelector('.main-result-current')
const mainTitle = document.querySelector('.main-return-title')
const titleOptional = document.querySelector('.optional')

let result = localStorage.getItem('score') || '0'
mainResultCurrent.textContent = result

if (result === '30') {
    mainTitle.textContent = 'Perfect!'
    titleOptional.textContent = ''
}
