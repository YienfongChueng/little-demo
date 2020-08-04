//获取元素
function getElement(selector) {
    return document.querySelector(selector)
}

function getAllElements(selector) {
    return document.querySelectorAll(selector)
}

// 获取元素的样式
function getCls(ele) {
    return ele.getAttribute('class');
}

// 设置元素的样式
function setCls(ele,cls) {
    return ele.setAttribute('class',cls);
}
// 为元素添加样式
function addClass(ele,cls) {
    var baseCls = getCls(ele);
    if(baseCls.indexOf(cls) === -1) {
        setCls(ele,baseCls + ' ' + cls);
    }
    return ;
}

// 为元素删减样式
function delClass(ele,cls) {
    var baseCls = getCls(ele);
    if(baseCls.indexOf(cls) > 0) {
        setCls(ele,baseCls.split(cls).join(' ').replace(/\s+/g, ' '))
    }
    return;
}

var animationClsList = {
    '.header':[
        '.header'
    ],
    '.screen-1' : [
        '.screen-1__title',
        '.screen-1__subtitle',
        '.screen-1__bg'
    ],
    '.screen-2' : [
        '.screen-2__title',
        '.screen-2__line',
        '.screen-2__subtitle',
        '.screen-2__bg-1',
        '.screen-2__bg-2'
    ],
    '.screen-3':[
        '.screen-3__bg',
        '.screen-3__title',
        '.screen-3__line',
        '.screen-3__subtitle',
        '.screen-3__language__html',
        '.screen-3__language__php',
        '.screen-3__language__java',
        '.screen-3__language__python',
        '.screen-3__language__nodejs'
    ],
    '.screen-4':[
        '.screen-4__title',
        '.screen-4__line',
        '.screen-4__subtitle',
        '.screen-4__item-1',
        '.screen-4__item-2',
        '.screen-4__item-3',
        '.screen-4__item-4',
    ],
    '.screen-5':[
        '.screen-5__bg',
        '.screen-5__title',
        '.screen-5__line',
        '.screen-5__subtitle',
    ]
}

function setAnimateInit(screenCls) {
    var animateElements = animationClsList[screenCls];
    for (let index = 0; index < animateElements.length; index++) {
        var ele = getElement(animateElements[index]);
        var baseCls = getCls(ele);
        setCls(ele,baseCls + ' ' + animateElements[index].substr(1)+'_animate_init');
    }
}

function setAnimatedone(screenCls) {
    var animateElements = animationClsList[screenCls];
    for (let index = 0; index < animateElements.length; index++) {
        var ele = getElement(animateElements[index]);
        var baseCls = getCls(ele);
        setCls(ele,baseCls.replace('_animate_init','_animate_done'));
    }
}

// window.onload = function () {
    //  为所有元素设置 init
    for(var k in animationClsList) {
        setAnimateInit(k);
    }
    //初始化第一屏和头部
    setTimeout(() => {
        setAnimatedone('.screen-1');
        setAnimatedone('.header');
    }, 1000);
// }

var headerNavItems = getAllElements('.header__nav__item');
var outlineItems = getAllElements('.outline__item');
var headerNavTip = getElement('.header__nav__tip');

function setActiveItem(idx) {
    for(var i = 0; i < headerNavItems.length; i++) {
        delClass(headerNavItems[i],'header__nav__item_status_active');
        headerNavTip.style.left = 0+'px';
    }
    addClass(headerNavItems[idx],'header__nav__item_status_active');

    headerNavTip.style.left = ( idx * 96 )+'px';

    for(var i=0; i <outlineItems.length; i++) {
        delClass(outlineItems[i],'outline__item_status_active');
    }
    addClass(outlineItems[idx],'outline__item_status_active');
}

//滑动门
function setNavTip(idx,lib) {
    lib[idx].onmouseover = function () {
        headerNavTip.style.left = (idx * 96 )+'px';
    }
    var curIndex = 0;
    lib[idx].onmouseout = function () {
        for(i=0; i< lib.length -1; i++) {
            if( getCls( lib[i] ).indexOf('header__nav__item_status_active') > -1  ){
                curIndex = i;
                break;
              }
        }
        headerNavTip.style.left = ( curIndex * 96 )+'px';
    }

}

for(var i=0; i < headerNavItems.length -1; i++) {
    setNavTip(i,headerNavItems);
}

//双向绑定
function setNavJump(i,lib) {
    var elem = lib[i];
    elem.onclick = function(){
        document.body.scrollTop = document.documentElement.scrollTop = i*640 + 1;
    }
}

for(var i=0; i < headerNavItems.length; i++) {
    setNavJump(i,headerNavItems);
}

for(var i=0; i< outlineItems.length; i++) {
    setNavJump(i,outlineItems);
}

//继续学习按钮，点击回到顶部
var studyBtn = getElement('.screen-6__study_btn');
studyBtn.onclick = function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
}

window.onscroll = function () {
    var top = document.body.scrollTop || document.documentElement.scrollTop;

    //导航条样式
    if(top > 100) {
        addClass( getElement('.header'),'header_status_white' );
    }else {
        delClass( getElement('.header'),'header_status_white' );
        setActiveItem(0);
    }
    if(top > 200) {
       addClass(getElement('.outline'),'outline_status_in');
    }

    if(top > (640*1 -400)) {
        setAnimatedone('.screen-2');
        setActiveItem(1);
    }
    if(top > (640*2 -400)) {
        setAnimatedone('.screen-3');
        setActiveItem(2);
    }
    if(top > (640*3 -400)) {
        setAnimatedone('.screen-4');
        setActiveItem(3);
    }
    if(top > (640*4 -400)) {
        setAnimatedone('.screen-5');
        setActiveItem(4);
    }
}