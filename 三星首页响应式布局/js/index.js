window.onload = function() {
    var nav = document.getElementById('nav');
    var navExtendClsName = 'nav-container-extended';
    var btn = document.getElementById('btn-toggle');
    btn.addEventListener('click',function(){
        if(nav.classList.contains(navExtendClsName)) {
            //已展开，需要隐藏
            nav.classList.remove(navExtendClsName);
        }else {
            //已隐藏，需要展开
            nav.classList.add(navExtendClsName);
        }
    },false)
}