import cards from './cards.js'
import { renderSelectionLevelGame } from './difficult-level-game-pages.js'

export function renderPageFirstLevelDifficulty(difficulty, formattedTime) {
    // let timerInterval
    const shuffledCards = shuffle([...cards, ...cards]) // удваиваем массив, чтобы получить пары карточек
    const app = document.querySelector('#app')
    const appHtml = `
    <div class="content__game_display">
        <div class="content__game_header center">
        <div class="content__game_head">
            <div class="content__game_timer">
                <span class="timer__label"></span>
                <span class="timer__value">00:00</span>
            </div>

            <div id="myModal2" class="window__fin center modal">
                <div class="window__fin_game">
                    <div class="window__fin_game2">
                        <span id="myModal3"                     class="window__fin_img">
                        </span>

                        <div class="window__fin_"> 
                            <p class="window__fin_text">текст победы</p>
                        </div> 
                        <div class="window__fin_"> 
                            <p class="window__fin_text2">Затраченное время</p>
                        </div> 
                        <div class="window__fin_"> 
                            <p class="window__fin_time">formattedTime</p>
                        </div> 
                        
                        <button id="restart-button2" class="button button__again ">Играть снова</button>
                    </div>
                </div>
            </div>

            <div>
             <button id="restart-button" class="button button__restart">Начать заново</button>
             </div>
             </div>
            <div class="content__box">
            <div class="cards">
                ${renderCards(difficulty, shuffledCards)}
            </div>
            </div>
        </div>
    </div> 
  `
    app.innerHTML = appHtml

    const reStartGame2 = document.querySelector('#restart-button2')

    reStartGame2.addEventListener('click', () => {
        reStartGameButton2()
    })

    function reStartGameButton2() {
        console.log(`Игра перезапущена`)
        renderSelectionLevelGame()
    }

    const cardElements = document.querySelectorAll('.card')
    cardElements.forEach((card) => {
        card.addEventListener('click', (event) =>
            flipCard(event, timerInterval),
        )
    })

    const memoryTime = 5000

    // Переворачиваем карточки рубашкой вверх
    cardElements.forEach((card) => {
        card.classList.add('flipped')
    })

    // Убираем класс flipped через заданный промежуток времени
    let memoryTimeoutId = setTimeout(() => {
        cardElements.forEach((card) => {
            card.classList.remove('flipped')
        })
    }, memoryTime)

    const startTime = new Date().getTime()

    const timerValue = document.querySelector('.timer__value')
    const timerInterval = setInterval(() => {
        const currentTime = new Date().getTime()
        const elapsedTime = currentTime - startTime
        const minutes = Math.floor(elapsedTime / 60000)
        const seconds = Math.floor((elapsedTime % 60000) / 1000)
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(
            seconds,
        ).padStart(2, '0')}`
        timerValue.textContent = formattedTime
    }, 1000)

    const restartButton = document.querySelector('#restart-button')
    restartButton.addEventListener('click', () => {
        clearInterval(timerInterval)
        clearTimeout(memoryTimeoutId)
        cardElements.forEach((card) => {
            card.classList.remove('flipped')
        })
        renderPageFirstLevelDifficulty(difficulty, formattedTime)
    })

    function renderCards(difficulty, cards) {
        const numCards = getNumCards(difficulty) * 2
        const selectedCards = cards.slice(0, Math.floor(numCards / 2))
        const duplicatedCards = [...selectedCards, ...selectedCards]
        const shuffledCards = shuffle(duplicatedCards)
        let cardsHtml = ''
        for (let i = 0; i < shuffledCards.length; i++) {
            const { front, back } = shuffledCards[i] // Деструктурируем свойства объекта card
            const cardHtml = `
                <div class="card">
                    <div class="card__front">
                        <img src="${front}" alt="">
                    </div>
                    <div class="card__back">
                        <img src="${back}" alt="">
                    </div>
                </div>
            `
            // console.log(`Rendered card ${i}: ${front}`)
            cardsHtml += cardHtml
        }
        return cardsHtml
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

function getNumCards(difficulty) {
    switch (difficulty) {
        case 'easy':
            return 6
        case 'medium':
            return 12
        case 'hard':
            return 18
        default:
            return 6
    }
}

let currentCard = null
let previousCard = null

function flipCard(event, timerInterval) {
    const card = event.currentTarget

    if (card.classList.contains('flipped')) {
        // Карта уже открыта, ничего не делаем
        return
    }

    if (currentCard === null) {
        // Это первая открытая карта
        currentCard = card
        card.classList.toggle('flipped')
    } else if (previousCard === null && currentCard !== card) {
        // Это вторая открытая карта
        previousCard = card
        card.classList.toggle('flipped')
        // isFlippingCards = true
        const currentCardFront =
            currentCard.querySelector('.card__front img').src
        const previousCardFront =
            previousCard.querySelector('.card__front img').src

        if (currentCardFront === previousCardFront) {
            // Карты совпали
            currentCard.isMatched = true
            previousCard.isMatched = true

            // Проверяем, нашли ли все карты
            const allCards = document.querySelectorAll('.card')
            const allMatched = [...allCards].every((card) => card.isMatched)
            if (allMatched) {
                // Пользователь победил
                const formattedTime =
                    document.querySelector('.timer__value')?.textContent
                clearInterval(timerInterval)
                showModal(formattedTime, true)
            }
            currentCard = null
            previousCard = null
        } else {
            // Карты не совпали, переворачиваем их рубашкой вверх
            // const formattedTime =
            //     document.querySelector('.timer__value')?.textContent
            // clearInterval(timerInterval)
            // showModal(formattedTime, false)
            setTimeout(() => {
                currentCard.classList.remove('flipped')
                previousCard.classList.remove('flipped')
                currentCard = null
                previousCard = null
                // isFlippingCards = false
            }, 1000)
        }
    }
}

function showModal(formattedTime, gameResult) {
    const modal = document.getElementById('myModal2')
    modal.style.display = 'block'

    const modalTimeElement = modal.querySelector('.window__fin_time')
    modalTimeElement.textContent = formattedTime

    const modalTextElement = modal.querySelector('.window__fin_text')
    modalTextElement.textContent = gameResult ? 'Вы выиграли!' : 'Вы проиграли!'

    const modalElement = document.getElementById('myModal3')
    modalElement.classList.toggle('window__fin_imgwin', gameResult)
    modalElement.classList.toggle('window__fin_imgconq', !gameResult)
}
