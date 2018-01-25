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

bgiLazy()