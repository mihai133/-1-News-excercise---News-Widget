'use strict'
/* 
1. The 3 dots must switch pages and the current page must be highlighted.
2. Every 15 seconds, the next page should be displayed.
3. The Widget must update every 3 minutes reloading the page.

Create 3 sections of news
create logic for adding or removing classes
    idea : use slice

http://www.mocky.io/v2/58fda6ce0f0000c40908b8c8
  
*/

const news = () => {
    const newsContainer = document.querySelector(".news-list-container")
    const newsList = document.querySelector('.news-list')
    const slides = document.querySelectorAll('.news-div')
    const btns = document.querySelector('.btns')

    // News Lists
    const firstList = document.getElementById("1")
    const secondList = document.getElementById("2")
    const thirdList = document.getElementById("3")

    // News Lists Containers
    const firstContainer = firstList.closest(".news-div")
    const secondContainer = secondList.closest(".news-div")
    const thirdContainer = thirdList.closest(".news-div")
    
    let currentSlide = 0;
    const maxSlide = slides.length;
    

    const createDots = () => {
        slides.forEach((_,i)=>{
            btns.insertAdjacentHTML(
                'beforeend',
                `<button class="dots-dot" data-slide="${i}"></button>`
            )
        })
    }

    const activateDot = (slide) => {
        document
            .querySelectorAll('.dots-dot')
            .forEach(dot => dot.classList.remove('dot-active'))
        document
            .querySelector(`.dots-dot[data-slide="${slide}"]`)
            .classList.add('dot-active')
    }

    const goToSlide = (slide) => {
        slides.forEach(
            (s,i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
        )
    }

    const nextSlide = () => {
        if(currentSlide === maxSlide - 1) {
            currentSlide = 0
        } else {
            currentSlide++
        }

        goToSlide(currentSlide)
        activateDot(currentSlide)
    }

    // Next Page every 15 sec
    setInterval(nextSlide, 15000);

    // Event Handler for button
    btns.addEventListener('click', function(e) {
        if(e.target.classList.contains('dots-dot')) {
            const {slide } = e.target.dataset
            goToSlide(slide)
            activateDot(slide)
        }
    })

    // RENDER FUNCTION
    const renderList = (title, details, list) => {
        const html = `
            <li>
                <h2>${title}</h2>
                <p>${details}</p>
            </li>
            `;
        list.insertAdjacentHTML('beforeend', html)
    }

    
    // FETCHING FUNCTION
    const fetchNews =  async(errorMsg = 'Something went wrong') =>  {
        try {
            // Fetching the API
            const res = await fetch('http://www.mocky.io/v2/58fda6ce0f0000c40908b8c8')
            if(!res.ok) throw new Error (`${errorMsg} (${res.status})`)
            
            const data = await res.json()
            const newsArr = data.news

            // Slicing into equal chunks of data
            const sliceIntoChunks = (arr, chunkSize) =>{
                const res = []
                for (let i = 0; i < arr.length; i+= chunkSize) {
                    const chunk = arr.slice(i, i+chunkSize)
                    res.push(chunk)
                }
                return res

            }
            const displayList = (nArr, list) =>{
                const slicedArr = sliceIntoChunks(newsArr, 5)
                
                slicedArr[nArr].forEach(element => {
                    const title = element.title;
                    const details = element.details;
                    renderList(title, details, list)
                });
            }
            // First dataset
            displayList(0, firstList)
            // Second dataset
            displayList(1, secondList)
            // Third dataset
            displayList(2, thirdList)

        } catch(err) {
            console.error(err)
        }
    }

    // INITIATE WIDGET
    const init = () => {
        fetchNews()
        goToSlide(0)
        createDots()
        activateDot(0)
        setTimeout(function () { location.reload(1); }, 180000);
    }
    init()
}

news()
