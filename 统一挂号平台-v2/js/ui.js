//ui-search定义
$.fn.UiSearch =  function() {
    var ui = $(this);
    $('.ui-search-selected',ui).on('click',function(){
        $('.ui-search-select-list').show();
        return false; //防止冒泡事件
    });
    $('.ui-search-select-list a',ui).on('click',function(){
        $('.ui-search-selected').text($(this).text());
        $('.ui-search-select-list').hide();
        return false;
    });
    $('body').on('click',function(){
        $('.ui-search-select-list').hide();
    });
}

//ui-tab定义
/**
 * @param {string} header tab组件，的所有选项卡 item
 * @param {string} content tab组件，内容区域，所有item
 * @param {string} 选项卡高亮样式
 */
$.fn.UiTab = function(header,content,active_class) {
    var ui = $(this);
    var tabs = $(header,ui);
    var cons = $(content,ui);
    tabs.on('click',function(){
        var index = $(this).index();
        tabs.removeClass(active_class).eq(index).addClass(active_class);
        cons.hide().eq(index).show();
        return false;
    });
}

//UiBackTop 回到顶部定义
$.fn.UiBackTop = function() {
    var ui = $(this);
    var el = $('<a class="ui-backTop" href="#"></a>' );
    ui.append(el);
    var windowHeight = $(window).height();
    $(window).on('scroll',function(){
        var top = $('html,body').scrollTop();
        if(top > windowHeight) {
            el.show();
        }else {
            el.hide();
        }
    });
    el.on('click',function(){
        $(window).scrollTop(0);
    })
}

//UiSlider定义
//	1. 左右箭头需要能控制翻页
//	2. 翻页的时候，进度点，要联动进行focus
//  3. 翻到第三页的时候，下一页需要回到 第一页，翻到第一页的时候，同理

//  4. 进度点，在点击的时候，需要切换到对应的页面

//  5. 没有（进度点点击、翻页操作）的时候需要进行自动滚动

//  6. 滚动过程中，屏蔽其他操作（自动滚动、左右翻页、进度点点击）

//	7. 高级-无缝滚动
$.fn.UiSlider = function(){
    var ui = $(this);
    var wrap = $('.ui-slider-wrap');
    var btn_pre = $('.ui-slider-arrow .left',ui);
    var btn_next = $('.ui-slider-arrow .right',ui);
    var items = $('.ui-slider-wrap .item',ui);
    var tips = $('.ui-slider-process .item',ui);

    //预定义
    var current = 0;
    var size = items.length;
    var width = items.eq(0).width();
    var enableAuto = true;

    //设置自动滚动（如果鼠标在wrap中，不要自动滚动）
    ui
    .on('mouseover',function(){
        enableAuto = false;
    })
    .on('mouseout',function(){
        enableAuto = true;
    });
    //具体操作
    wrap
    .on('move_pre',function(){
        if(current <= 0) {
            current = size;
        }
        current = current -1;
        wrap.triggerHandler('move_to',current);
    })
    .on('move_next',function(){
        if(current >= size -1) {
            current = -1;
        }
        current = current +1;
        wrap.triggerHandler('move_to',current);
    })
    .on('move_to',function(evt,index){
        wrap.css('left',index*width*-1);
        tips.removeClass('item_active').eq(index).addClass('item_active');
    })
    .on('auto_move',function(){
        setInterval(() => {
            enableAuto && wrap.triggerHandler('move_next');
        }, 2000);
    })
    .triggerHandler('auto_move');

    //事件
    btn_pre.on('click',function () {
        wrap.triggerHandler('move_pre');
    });
    btn_next.on('click',function () {
        wrap.triggerHandler('move_next');
    });
    tips.on('click',function(){
        var index = $(this).index();
        current = index;
        wrap.triggerHandler('move_to',index);
    });
}

//ui-cascading
$.fn.UiCascading = function(){
    var ui = $(this);
    var selects = $('select',ui);
    selects
    .on('change',function(){
        var val = $(this).val();
        var index = selects.index(this);
        //触发下一个select的更新，根据当前值
        var where = $(this).attr('data-where');
        where = where ? where.split(',') : [];
        where.push($(this).val());

        selects.eq(index + 1)
                .attr('data-where',where.join(','))
                .triggerHandler('reloadOptions');
        //触发下一个之后的select的初始化（清除不应该的数据项）
        ui.find('select:gt(' + (index +1)+ ')').each(function(){
            $(this).attr('data-where','').triggerHandler('reloadOptions');
        });
    })
    .on('reloadOptions',function(){
        var method = $(this).attr('data-search');
        var args = $(this).attr('data-where').split(',');
        var data = AjaxRemoteGetData[method].apply(this,args);
        var select = $(this);
        select.find('option').remove();
        $.each(data,function(i,item){
            var el = $('<option value="' + item+ '">' + item + '</option>');
            select.append(el);
        });
    });
    selects.eq(0).triggerHandler('reloadOptions');
}

//展开全部定义
$.fn.UiExpand = function () {
    var ui = $(this);
    ui.on('click',function(){
        if(ui.text() === '展开全部') {
            $('.main-classify').css({'height':'auto'});
            ui.text('收起全部');
        }else {
            $('.main-classify').css({'height':'80px'});
            ui.text('展开全部');
        }
    })
}

//ui-tab方法定义
$.fn.UiTab = function(header,content){
    var ui = $(this);
    var tabs = $(header,ui);
    var cons = $(content,ui);
    tabs.on('click',function(){
        var index = $(this).index();
        tabs.removeClass('active').eq(index).addClass('active');
        cons.hide().eq(index).show();
        return false;
    })
}
$.fn.UiSchdule = function(){
    var ui = $(this);
    var weeks = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    var currentPages = 0;
    var pagesCount = 7;
    var days = pagesCount * 7;
    var date = new Date();
    var time = date.getTime();
    for(let i=0; i < days; i++) {
        var _t = time + i *24*60*60*1000;//一天的毫秒数
        var _d = new Date(_t);
        var html = [];
        var w = weeks[_d.getDay()];
        var y = _d.getFullYear();
        var m = _d.getMonth()+1;
        m = m < 10 ? '0' + m : m;
        var d = _d.getDate();
        d = d < 10 ? '0' + d : d;
        var d_str = y + '-' + m  + '-' + d;
        html.push(`<div class="ui-schedule-item"><div class="ui-schedule-item__date">${w}<br/>${d_str}</div>`);
        html.push(`<div class="ui-schedule-item__status"></div>`);
        html.push(`<div class="ui-schedule-item__status status_full">约满</div>`);
        html.push(`<div class="ui-schedule-item__status"></div></div>`);
        ui.append(html.join(' '));
    }

    //点击按钮
    var pre_btn = $('.ui-pre-week');
    var next_btn = $('.ui-next-week');
    pre_btn.on('click',function(){
        if(currentPages <= 0) {
            currentPages = 0
            alert('已经是第一周了！');
            return false;
        }
        //上一周
        currentPages -- ;
        $('.schedule-block__wrapper').css('left',-658*currentPages);

    });
    next_btn.on('click',function(){
        if(currentPages >= 6) {
            currentPages = 6;
            alert('已经没有更多排班了！');
            return false;
        }
        //下一周
        currentPages ++;
        $('.schedule-block__wrapper').css('left',-658*currentPages);
    });
}



//脚本逻辑
$(function(){
    $('.ui-search').UiSearch();
    $('.content-tab').UiTab('.content-tab__caption > .content-tab__caption-item','.content-tab__block > .content-tab__block-item','content-tab__caption-item_active');
    $('.content-tab .content-tab__block .content-tab__block-item').UiTab('.block-item__caption > a','.block-item__content > .block-item__content-wrap' , 'block-item__caption-link_active');
    $('body').UiBackTop();
    $('.ui-slider').UiSlider();
    $('.ui-cascading').UiCascading();
    $('.all').UiExpand();

    //点击预约，跳转页面
    $('.main-content-item__btn').on('click',function(){
        window.open("./hospital-detail.html");
    });

    $('.ui-tab').UiTab('.main-detail__tab>a','.main-detail__block');
    $('.ui-schedule').UiSchdule();
})