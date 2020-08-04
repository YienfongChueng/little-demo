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

function setAnimation(screenCls) {
    var screen = document.querySelector(screenCls);
    var animationEles = animationClsList[screenCls];
    var isSetAnimationInit = false;
    var isAnimationDone = false;
    screen.onclick = function() {
        //初始化样式，增加init A A_init
        if(!isSetAnimationInit) {
            for (let i = 0; i < animationEles.length; i++) {
                var ele = document.querySelector(animationEles[i]);
                var baseCls = ele.getAttribute('class');
                ele.setAttribute('class',baseCls + " " + animationEles[i].substr(1) + "_animate_init")
            }
            isSetAnimationInit = true;
            return;
        }
        //init -> done   A A_done
        if(!isAnimationDone) {
            for (let i = 0; i < animationEles.length; i++) {
                var ele = document.querySelector(animationEles[i]);
                var baseCls = ele.getAttribute('class');
                ele.setAttribute('class',baseCls.replace('_animate_init','_animate_done'))
            }
            isAnimationDone = true;
            return;
        }
        //done -> init A A_init
        if(isAnimationDone) {
            for (let i = 0; i < animationEles.length; i++) {
                var ele = document.querySelector(animationEles[i]);
                var baseCls = ele.getAttribute('class');
                ele.setAttribute('class',baseCls.replace('_animate_done','_animate_init'));
            }
            isAnimationDone = false;
            return;
        }

        
    }
}

for(let key in animationClsList) {
    setAnimation(key);
}