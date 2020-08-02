import puppeteer from 'puppeteer'

// Read the Instagram page

async function start() {
    
    async function loadMore(page, selector) {
        const moreButtom = await page.$(selector)
        if (moreButtom) {
            console.log('More')
            await moreButtom.click()
            await page.waitFor(selector, {timeout: 5000}).catch(() => { console.log("timeout") })
            await loadMore(page, selector)
        }
    }    
    

    // Catch the comments / at sign content
    async function getComments(page, selector) {
        const comments = await page.$$eval(selector, links => links.map(link => link.innerText))
        return comments
    }

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.instagram.com/p/CCkF5CxMyXA/')

    await loadMore(page, '.dCJp8')
    const arrobas = await getComments(page, '.C4VMK h3')
    const counted = count(arrobas)
    const sorted = sort(counted)
    sorted.forEach(arroba => {console.log(arroba)})

    await browser.close()
    

}

// Count repeated at sign

function count(arrobas) {
    const count = {}
    arrobas.forEach(arroba => {count[arroba] = (count[arroba] || 0) + 1})
    return count
}

// console.log(count(fakeAt))

// Sort

function sort(counted) {
    const entries = Object.entries(counted)
    const sorted = entries.sort((a, b) => b[1] - a[1])
    return sorted
}

start()