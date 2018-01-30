const throttle = (fn, interval = 250) => {
	let timer,
		firstTime = true
	return function () {
		let args = arguments,
			me = this
		if (firstTime) {
			fn.apply(me, args)
			return firstTime = false
		}
		if (timer) {
			return false
		}
		timer = setTimeout(() => {
			clearTimeout(timer)
			timer = null
			fn.apply(me, args)
		}, interval)
	}
}

const bgiLazy = () => {
	let lazyBg = Array.from(document.getElementsByClassName('lazy-bg'))

	lazyBg.forEach(i => {
		let tempImg = new Image()
		tempImg.src = i.getAttribute('data-lazy')
		
		tempImg.addEventListener('load', () => {
			i.style.backgroundImage = `url(${tempImg.src})`
			i.classList.remove('blur')
			i.removeAttribute('data-lazy')
			tempImg = null
		})
	})
}

const onloadDisqus = (open) => {
    if (open == null) return

    const fn = () => {
        let shortname = document.querySelector('.shortname').innerHTML
        open.innerHTML = '稍等哦～ ～'

        let disqusJS = document.querySelector('.disqus-js')
        disqusJS &&  document.body.removeChild(disqusJS)

        let docfrag = document.createDocumentFragment(),
            s = document.createElement('script')
        
        s.classList.add('disqus-js')
        s.src = 'https://'+ shortname + '.disqus.com/embed.js'
        s.setAttribute('data-timestamp', + new Date())

        docfrag.appendChild(s)
        document.body.appendChild(docfrag)

        s.onerror = () => open.innerHTML = '你需要科学上网 - 。-'
    }
    
	open.addEventListener('click', fn)
}

const pjax = () => {
	if (!$ && !jQuery) {
		console.log('no found jquery')
		return
	}

	$(document).pjax('a', '#pjax-container', {
		fragment:'#pjax-container',
		timeout: 1000
	})
	$(document).on({
		'pjax:click': function() {
		},
		'pjax:start': function() {
		},
		'pjax:end': function() {
			bgiLazy()
			
			$('pre code').each(function(i, block) {
				hljs.highlightBlock(block)
			})

			let openDisqus = document.querySelector('.open-disqus')
			onloadDisqus(openDisqus)
		}
	})
}

const drop = () => {
	let menu = document.querySelector('.dropdown-toggle'),
		dropdown = document.querySelector('.dropdown-body'),
		isDroping = false
	
	if (!menu || !dropdown) {
		console.log('err in the dropdown')
		return
	}

	menu.addEventListener('click', function() {
		if (isDroping) return

		this.classList.toggle('open')
		let dropdownClass = dropdown.classList

		if (this.classList.contains('open')) {
			dropdownClass.add('droping')
			setTimeout(() => {
				dropdownClass.add('drop')
			}, 0)
			return
		} 
		
		dropdownClass.remove('drop')
		isDroping = true
	})

	dropdown.addEventListener('transitionend', function() {
		isDroping && (
			this.classList.remove('droping'),
			isDroping = false
		)
	})
}

const lazy = () => {

}

const returnTop = (returnTopButton) => {
	if (returnTopButton == null) return

	let returnTopClass = returnTopButton.classList

	window.addEventListener('scroll', throttle(() => {
		window.scrollY > 1000 ?
		returnTopClass.add('show'):
		returnTopClass.remove('show')
	},500))

	returnTopButton.addEventListener('click', () => {
		window.scrollTo(0, window)
	})
}

drop()


window.addEventListener('load', () => {
	bgiLazy()
	pjax()
	
	const returnTopButton = document.getElementById('return-top')
	returnTop(returnTopButton)

	let openDisqus = document.querySelector('.open-disqus')
	onloadDisqus(openDisqus)
})
