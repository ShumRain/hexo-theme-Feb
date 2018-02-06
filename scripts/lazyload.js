hexo.extend.filter.register('after_post_render', function(data) {
    const loadingImg = 'https://cdn.shumrain.me/img/blog/common/loading.svg' 
    const re = /<img src="(.*?)"(.*?)>/gi

    const replacer = (match, p1) => '<img src="'+ loadingImg + '" data-img="' + p1 + '">'

    let newData = data
    newData.content = newData.content.replace(re, replacer)

    return newData
})