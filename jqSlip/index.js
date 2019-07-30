(function () {
  $('.photo li').eq(0)[0].style.pointerEvents = 'auto';

  var target; //绑定的元素  

  var startX,
      startY,
      moveX,
      moveY,
      endX;

  $('body').on('touchstart touchmove touchend tap', '.photo_item', function (e) {
    switch(e.type) {
      case 'tap':
        break;
      case 'touchstart':
        $(this).removeClass('tocenter');  // 初始化
        
        target = e.currentTarget;

        startX = e.changedTouches[0].pageX;
        startY = e.changedTouches[0].pageY;

        $(this).css({
          "transform": "translate3d(0, 0, 0)",
          "-webkit-transform": "translate3d(0, 0, 0)"
        }).next().css({
          "transform": "translate3d(0, 0, 0)",
          "-webkit-transform": "translate3d(0, 0, 0)"
        }).next().css({
          "transform": "translate3d(0, .5rem, 0)",
          "-webkit-transform": "translate3d(0, .5rem, 0)"
        })
        break;
      case 'touchmove':
        moveX = e.changedTouches[0].pageX;
        moveY = e.changedTouches[0].pageY;
        requestAnimationFrame(step)
        break;
      case 'touchend':
        moveX = 0;
        moveY = 0;
        endX = e.changedTouches[0].pageX;

        if (Math.abs(startX - endX) > ($('.photo_item img').width() / 2)) {
          if (startX - endX > 0) {
            $(this).addClass('swipeleft')
          } else {
            $(this).addClass('swiperight')
          }
          initActive(e.currentTarget);
        } else { // 回退到位置
          $(this).addClass('tocenter')
          $(this).next().css({
						'transform': 'translate3d(0,.5rem,0)',
						'-webkit-transform': 'translate3d(0,.5rem,0)'
					}).next().css({
						'transform': 'translate3d(0,1rem,0)',
						'-webkit-transform': 'translate3d(0,1rem,0)'
					});
        }
        break;
    }
  })

  function step() {
    if (!moveX || !startX) {
      requestAnimationFrame(step)
      return
    }

    oldMoveX = moveX;
    oldStartX = startX;

    $(target).css({
      "transform": "translate3d(" + (moveX - startX) + "px," + (moveY - startY) + "px, 0)",
      "-webkit-transform": "translate3d(" + (moveX - startX) + "px," + (moveY - startY) + "px, 0)",
    })

    requestAnimationFrame(step);
  }

  function initActive(target) {
    $(target)[0].style.pointerEvents = 'none';
    $(target).next()[0].style.pointerEvents = 'auto'; // 任何时候能够点击的只有一张
    setTimeout(function () {
      $(target).remove()
    }, 450)
  }
}())