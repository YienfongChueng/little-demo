window.onload = function () {
    function addHandler(ele,type,handler){
        if(ele.addEventListener) {
            ele.addEventListener(type,handler,false);
        }else if(ele.attachEvent) {
            ele.attachEvent('on'+type,handler);
        }else {
            ele['on' + type] = handler;
        }
    }
    function addClass(ele,cls) {
        var baseCls = ele.getAttribute('class');
        if(baseCls.indexOf(cls) === -1) {
            ele.setAttribute('class',baseCls + ' ' + cls);
        }
    }
    function delClass(ele,cls) {
        var baseCls = ele.getAttribute('class');
        if(baseCls.indexOf(cls) !== -1) {
            ele.setAttribute('class',baseCls.replace(cls,'').replace(/\s{2,}/g, ' '));
        }
    }

    function innerText(ele,text) {
         ele.innerHTML = text;
    }


    //头部的下拉菜单
    var menuEle = document.getElementById('header__item_select');
    var menuList = document.querySelector('.header__item-list');
    addHandler(menuEle,'mouseover',function(){
        menuList.style.display = 'block';
    });
    addHandler(menuEle,'mouseout',function(){
        menuList.style.display = 'none';
    });


    //给我密码,我返回对应的级别
    function getPassWordLvl(pwd) {
        var lvl=0;//默认是0级
        var p1 = /^\d{6,20}$|^[a-zA-Z]{6,20}$|^(\W_){6,20}$/,
            p2 = /^[\d|a-zA-Z]{6,20}$|^[(\W|_)|a-zA-z]{6,20}$|^[(\W|_)\d]{6,20}$/,
            p3 = /^[(\W|_)\d a-zA-Z]{6,20}$/;
        if(p1.test(pwd)) {
            lvl = 1;
        }else if(p2.test(pwd)) {
            lvl = 2;
        }else if(p3.test(pwd)){
            lvl = 3;
        }
        // //密码中是否有数字,或者是字母,或者是特殊符号
        // if(/[0-9]/.test(pwd)){
        //     lvl++;
        // }
        // //判断密码中有没有字母
        // if(/[a-zA-Z]/.test(pwd)){
        //     lvl++;
        // }
        // //判断密码中有没有特殊符号
        // if(/[^0-9a-zA-Z]/.test(pwd)){
        //     lvl++;
        // }
        return lvl;//0 1 2 3
    }


    //正则
    var regList = {
        'userName': /^[a-zA-Z]\w{5,29}$/,
        // 'password': /^[a-zA-Z0-9!@#$%^&*=?]{6,20}$/,
        'password': /\S{6,20}/,
        'realName': /^[\u4e00-\u9fa5]{2,15}$|^[a-zA-Z]{3,30}$/,
        'cId': /^\d{17}[xX0-9]{1}$/,
        'email': /^[\w-]+@[\w-]+(\.[\w-]+)+$/,
        'phone': /^1[^12]{1}\d{9}$/
    }

    var userName = document.getElementById('userName'),
        password = document.getElementById('password'),
        comfirmedPwd = document.getElementById('comfirmedPwd'),
        realName = document.getElementById('realName'),
        cId = document.getElementById('cId'),
        email = document.getElementById('email'),
        phone = document.getElementById('phone'),
        agreen = document.getElementById('agreen'),
        submit = document.getElementById('submit'),
        realNameRuleEle = document.querySelector('.main__form-rules'),
        realNameRule = document.querySelector('.main__form-body_rules'),
        userTips = document.querySelectorAll('.main__form-body_tips'),
        pwdErrorTipEle = document.querySelector('.main__form-body_tips-pwd')

        //姓名填写规则鼠标滑过时展示规则文字说明
        addHandler(realNameRule,'mouseover',function(){
            realNameRuleEle.style.display = 'block';
        });
        addHandler(realNameRule,'mouseout',function(){
            realNameRuleEle.style.display = 'none';
        });
    
        //校验用户输入
        var needCheckEles = {
            'userName' : userName,
            'password' : password,
            'comfirmedPwd' : comfirmedPwd,
            'realName': realName,
            'cId' : cId,
            'email' : email,
            'phone': phone
        };
        //用于判断是否都成功或者都填写
        var allCheckResults = {
            'userName' : false,
            'password' : false,
            'comfirmedPwd' : false,
            'realName': false,
            'cId' : false,
            'email' : false,
            'phone': false
        };
        var errorTips = {
            'userName' : '6-30位字母、数字或"_"，字母开头，且字体颜色变为红色',
            'password' : '6-20位字母、数字或符号',
            'comfirmedPwd' : '两次密码输入不一致，请重新输入',
            'realName': '姓名只能包含中文或者英文,且字符在3-30个之间',
            'cId' : '请输入18位身份证号码',
            'email' : '请输入正确的邮箱',
            'phone': '您输入的手机号码不是有效的格式！'
        };
        var successTips = {
            'userName' : '用户名输入正确',
            'comfirmedPwd' : '两次输入一致',
            'realName': '姓名输入正确',
            'cId' : '证件号输入正确',
            'email' : '邮箱格式正确',
            'phone': '手机格式正确！'
        }

        var userTipsHash = {
            'userName': userTips[0],
            'password': userTips[1],
            'comfirmedPwd': userTips[2],
            'realName': userTips[3],
            'cId': userTips[4],
            'email': userTips[5],
            'phone': userTips[6]
        }

        function successTip(str) {
            userTipsHash[str].style.color='green';
            innerText(userTipsHash[str],successTips[str]);
        }
    
        function errorTip(str){
            userTipsHash[str].style.color='red';
            innerText(userTipsHash[str],errorTips[str]);
        }

        function setCheckResult(str,flag) {
            // var pattern = /^([a-z]){1}/;
            // str = str.replace(pattern,function(all,letter){
            //     return 'is' + letter.toUpperCase();
            // });
            allCheckResults[str] = flag;
        }


        //失焦事件回调函数
        function callBackHandler(ele,str) {
            var userInput = ele.value;
            if(userInput.length > 0) {
                var pattern = regList[str];
                if(str === 'password') {
                    var pwdBlock = document.querySelectorAll('.main__form-body_strong-pwd');
                    if(pattern.test(userInput)) {
                        var level = getPassWordLvl(userInput);
                        if(level === 1) {
                            //移除橙色和绿色样式
                            delClass(pwdBlock[1],'main__form-body_strong-orange');
                            delClass(pwdBlock[2],'main__form-body_strong-green');

                        }else if (level === 2) {
                            //添加橙色样式，移除绿色样式
                            delClass(pwdBlock[2],'main__form-body_strong-green');
                            addClass(pwdBlock[1],'main__form-body_strong-orange');
                        }else if(level === 3) {
                            //添加橙色，绿色样式
                            addClass(pwdBlock[1],'main__form-body_strong-orange');
                            addClass(pwdBlock[2],'main__form-body_strong-green');
                        }
                        if(level > 0) {
                            //密码正确，隐藏提示信息
                            addClass(pwdErrorTipEle,'main__form-body_tips-pwd_hide');
                            delClass(pwdErrorTipEle,'main__form-body_tips-pwd_show');
                        }
                        setCheckResult(str,true);
                    }else {
                        errorTip(str);
                        //密码错误，显示提示信息
                        addClass(pwdErrorTipEle,'main__form-body_tips-pwd_show');
                        delClass(pwdErrorTipEle,'main__form-body_tips-pwd_hide');
                        //移除色块
                        delClass(pwdBlock[1],'main__form-body_strong-orange');
                        delClass(pwdBlock[2],'main__form-body_strong-green');

                        setCheckResult(str,false);
                    }
                }else if(str === 'comfirmedPwd') {
                    if(userInput !== password.value) {
                        errorTip(str);
                        setCheckResult(str,false);
                    }else {
                        successTip(str);
                        setCheckResult(str,true);
                    }
                }else {
                    if(str === 'realName') {
                        // 隐藏姓名规则
                        realNameRule.style.display = 'none';
                    }
                    if(pattern.test(userInput)) {
                        //ok
                        successTip(str);
                        setCheckResult(str,true);
                    }else {
                        //fail
                        errorTip(str);
                        setCheckResult(str,false);
                    }
                }
            }else {
                if(str === 'comfirmedPwd') {
                    innerText(userTipsHash[str],'输入框不能为空');
                    setCheckResult(str,false);
                }else if(str === 'email') {
                    innerText(userTipsHash[str],''); //非必填，所以清空提示语
                    setCheckResult(str,true);//邮箱非必填，为空时可以提交
                }else {
                    setCheckResult(str,false);
                }
            }
        }

        //失去焦点时绑定事件
        for(let key in needCheckEles) {
            addHandler(needCheckEles[key],'blur',function () {
                callBackHandler(this,key);
            });
        }

        //提交按钮（下一步）
        addHandler(submit,'click',function(){
            var isSuccess = true;
            //判断是否有填写
            for(let key in allCheckResults) {
                if(!allCheckResults[key]) {
                    errorTip(key);
                }
            }
            // for(let key in needCheckEles) {
            //     if(key !== 'email' && needCheckEles[key].value === '') {
            //         errorTip(key);
            //     }
            //     if(key === 'realName') {
            //         // 隐藏姓名规则
            //         realNameRule.style.display = 'none';
            //     }
            //     if(key === 'password') {
            //         //密码错误，显示提示信息
            //         addClass(pwdErrorTipEle,'main__form-body_tips-pwd_show');
            //         delClass(pwdErrorTipEle,'main__form-body_tips-pwd_hide');
            //     }
            // }

            if(agreen.checked) {
                for(let key in allCheckResults) {
                    if(allCheckResults[key] === false) {
                        isSuccess = false;
                        break;
                    }
                }
                if(isSuccess) {
                    window.location.href="https://www.imooc.com/"
                }else {
                    alert('填写有误，请修正后再操作！');
                    event.preventDefault();
                    return;
                }
            }else {
                alert('请阅读并同意遵守《中国铁路客户服务中心网站服务条款》');
            }
        })

        


}