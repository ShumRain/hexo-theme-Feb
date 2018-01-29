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

window.addEventListener('load', () => {
	bgiLazy()
	pjax()
	drop()
})
