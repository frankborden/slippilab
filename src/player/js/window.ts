// window.mobile = false;
// if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
//   window.mobile = true;
// }
// let windwidth = 0;
// let windheight = 0;

const $ = document.querySelector;
export const resize = function () {
  // var wW = window.innerWidth;
  // var wH = window.innerHeight;
  // var maxScale = wH / 750;
  // var scale = Math.min(maxScale, wW / 1200);
  // var mY = wH - scale * 750;
  // var mX = wW - scale * 1200;
  // ($('#display') as HTMLDivElement).style = css({
  //   'margin-left': mX / 2 + 'px',
  //   'margin-top': mY / 2 + 'px',
  //   '-webkit-transform': 'scale(' + scale + ', ' + scale + ')',
  //   transform: 'scale(' + scale + ', ' + scale + ')',
  //   '-ms-transform': 'scale(' + scale + ', ' + scale + ')',
  // });
  // $('body').height(wH);
};

window.onresize = function () {
  resize();
};

function onFullScreenChange() {
  // var fullscreenElement =
  //   document.fullscreenElement ||
  //   document.mozFullScreenElement ||
  //   document.webkitFullscreenElement;
  // if in fullscreen mode fullscreenElement won't be null
  /*var cont = document.getElementById("topButtonContainer");
  var icn = document.querySelectorAll(".topButton");
  if (fullscreenElement != null){
    cont.style.transition = "opacity 0.5s linear 0s";
    cont.style.opacity = 0;;
    setTimeout(function(){
        var i;
        for (i = 0; i < icn.length; i++) {
          icn[i].style.height = "5px";
        }
        cont.style.height = "5px";
        resize();
      }, 500);
    document.querySelector("#keyboardPrompt").hide();
    document.querySelector("#keyboardControlsImg").hide();
    document.querySelector("#controllerSupportContainer").hide();
    document.querySelector("#debugButtonEdit").empty().append("OFF");
    document.querySelector("#debug").hide();
    document.querySelector("#players").hide();
    document.querySelector("body").css("overflow", "hidden");
    showHeader = false;
  } else {
    var i;
    for (i = 0; i < icn.length; i++) {
      icn[i].style.height = "25px";
    }
    cont.style.height = "31px";
    cont.style.transition = "opacity 0.5s linear 0s";
    cont.style.opacity = 1;
  }*/
}

/*$("#fullscreenButton").click(function() {
  if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !
      document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
  // resize();
});*/

document.addEventListener('fullscreenchange', onFullScreenChange, false);
document.addEventListener('webkitfullscreenchange', onFullScreenChange, false);
document.addEventListener('mozfullscreenchange', onFullScreenChange, false);
