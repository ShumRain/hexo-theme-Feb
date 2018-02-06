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

const output = () => {
    console.log('%c https://github.com/ShumRain ', 'background:#222;color:#bada55')
}

const getPostContainer = () => {
	return document.querySelector('.markdown-body')
}

const lazyload = () => {
	let container = getPostContainer()
 
	if (container == null) {
		return false
	} 
 
	const LAZY_DEFAULT = {
		 container: container, 
		 offset: 100, 
		 throttle: 250, 
		 unload: false, 
	 }
 
	 // img isView
	 const inView = (ele, view) => {
		 let rect = ele.getBoundingClientRect()
		 return (
			 rect.right >= view.l &&
			 rect.bottom >= view.t &&
			 rect.left <= view.r &&
			 rect.top <= view.b
		 )
	 }
 
	 class Lazy {
		 constructor(opts = {}) {
			 this.opts = Object.assign({}, LAZY_DEFAULT)
			 this.init()
		 }
	 
		 init() {
			 let offsetAll = this.opts.offset,
				 offsetVertical = this.opts.offsetVertical || offsetAll,
				 offsetHorizontal = this.opts.offsetHorizontal || offsetAll,
				 offsetTop = this.opts.offsetTop || offsetVertical,
				 offsetBottom = this.opts.offsetBottom || offsetVertical,
				 offsetLeft = this.opts.offsetLeft || offsetHorizontal,
				 offsetRight = this.opts.offsetRight || offsetHorizontal
			 
			 this.opts.offset = {
				 t: offsetTop,
				 b: offsetBottom,
				 l: offsetLeft,
				 r: offsetRight
			 }
	 
			 this.rander()
	 
			 window.addEventListener('scroll',throttle(() => {
				 this.rander()
			 }, 1000))
		 }
	 
		 rander() {
			 let container = this.opts.container,
				 root = this.opts.container,
				 nodes = container.querySelectorAll('[data-img],[data-img-bg]'),
				 length = nodes.length,
				 srcCache,
				 view = {
					 l: 0 - this.opts.offset.l,
					 t: 0 - this.opts.offset.t,
					 b: window.innerHeight + this.opts.offset.b,
					 r: window.innerWidth + this.opts.offset.r
				 }
	 
			 Array.from(nodes).forEach((ele, index) => {
				 if (inView(ele, view)) {
					 //图片出现在可视区，unload为true，也就是不在可视区时候卸载图片资源
					 if (this.opts.unload && !ele.getAttribute('data-lazy-placeholer')) {
						 ele.setAttribute('data-img-placeholer', ele.src)
					 }
 
					 if (ele.getAttribute('data-img-bg') !== null) {
						 ele.style.backgroundImage = `url(${ele.getAttribute('data-img-bg')})`
					 } else if (ele.src !== (srcCache = ele.getAttribute('data-img'))) {
						 ele.src = srcCache
					 }
 
					 if (!this.opts.unload) {
						 ele.removeAttribute('data-img')
						 ele.removeAttribute('data-img-bg')
					 }
					 //回调函数
					 this.opts.callback && this.opts.callback(ele, 'load')
				 }
				 //不在可视区内，移除图片元素
				 else if (this.opts.unload && !!(srcCache = ele.getAttribute('data-lazy-placeholer'))) {
					 if (ele.getAttribute('data-img-bg' !== null)) {
						 ele.style.backgroundImage = `url(${srcCache})`
					 } else {
						 ele.src = srcCache
					 }
					 //回调函数
					 this.opts.callback && this.opts.callback(ele, 'load')
				 }
			 })
	 
			 if (!length) {
				 this.detach()
			 }
		 }
	 
		 detach() {
			 this.opts.container.removeEventListener('scroll', throttle)
		 }
	 }
 
	 new Lazy()
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

			const returnTopButton = document.getElementById('return-top')
			returnTop(returnTopButton)

			lazyload()
		}
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

	output()
	lazyload()
})
