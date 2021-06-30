// import { curGame, displayDebug } from './main';

// const $ = document.querySelector;
// export function setupControls() {
//   // arrows only detect on keydown
//   $(document).keydown(function (e) {
//     // RIGHT
//     if (e.which == 39) {
//       curGame.playback.frameForward();
//     }
//     // LEFT
//     if (e.which == 37) {
//       curGame.playback.frameBackward();
//     }
//   });

//   $(document).keypress(function (e) {
//     // ENTER
//     if (e.which == 13) {
//       curGame.playback.togglePause();
//     }
//     // D
//     if (e.which == 68 || e.which == 100) {
//       displayDebug ^= true;
//       if (displayDebug) {
//         $('#debug').show();
//       } else {
//         $('#debug').hide();
//       }
//     }
//     // R
//     if (e.which == 82 || e.which == 114) {
//       curGame.playback.restart();
//     }
//   });

//   $('input[type="range"]').prop({
//     min: -123,
//     max: curGame.lastFrame,
//   });

//   // setup slider
//   $('input[type="range"]').rangeslider({
//     polyfill: false,

//     // Default CSS classes
//     rangeClass: 'rangeslider',
//     disabledClass: 'rangeslider--disabled',
//     horizontalClass: 'rangeslider--horizontal',
//     verticalClass: 'rangeslider--vertical',
//     fillClass: 'rangeslider__fill',
//     handleClass: 'rangeslider__handle',

//     // Callback function
//     onInit: function () {},

//     // Callback function
//     onSlide: function (position, value) {
//       // only do anything if the value has changed
//       // this event also triggers once after onSlideEnd
//       if (curGame.currentFrameIdx != value) {
//         curGame.currentFrameIdx = value;
//         curGame.playback.playing = false;
//         if (!(curGame.currentFrameIdx >= curGame.lastFrame)) {
//           curGame.playback.finished = false;
//         }
//         if (curGame.playback.finished) return;
//         curGame.updateState();
//         curGame.renderState();
//       }
//     },

//     // Callback function
//     onSlideEnd: function (position, value) {
//       curGame.currentFrameIdx = value;
//       curGame.playback.playing = true;
//       if (!(curGame.currentFrameIdx >= curGame.lastFrame)) {
//         curGame.playback.finished = false;
//       }
//       if (curGame.playback.finished) return;
//       curGame.updateState();
//       curGame.renderState();
//     },
//   });

//   $('#slider_container')
//     .mouseover(function () {
//       $(this).stop().fadeTo(400, 0.8);
//     })
//     .mouseout(function () {
//       $(this).stop().fadeTo(400, 0);
//     });

//   $('#slider_container').fadeTo(1400, 0);
// }

// export function setupControlsBox() {
//   $('#controls')
//     .mouseover(function () {
//       $(this).css('opacity', '0.9');
//     })
//     .mouseout(function () {
//       $(this).css('opacity', '0.15');
//     });
// }
