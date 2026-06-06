
function setupMainPage() {
  let setupFlow = () => {
    let page = document.querySelector('.lessonpage')

    for (let e of document.querySelectorAll('section')) {
      e.classList.add('hidden')
    }

    let onscroll= e => {
      let d = document.documentElement.scrollTop + document.documentElement.clientHeight - 50
      for (let e of document.querySelectorAll('section.hidden')) {
        if (d > e.offsetTop) {
          e.classList.remove('hidden')
        }
      }
    }

    onscroll()

    document.addEventListener('scroll', onscroll)
  }

  setupFlow()
}

function main() {
  setupMainPage()
}

document.addEventListener('DOMContentLoaded', main)
