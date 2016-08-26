import {space} from '../util/space.js';

/* eslint no-invalid-this: 0 */
export default function(cmt) {
  var that = this;
  var ct = this._hasMedia ? this.media.currentTime : Date.now() / 1000;
  function willCollide(cr, cmt) {
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      return ct - cr.time < that.duration;
    }
    var elapsed = (that.width + cr.width) * (ct - cr.time) / that.duration;
    var crLeftTime = that.duration + cr.time - ct;
    var cmtArrivalTime = that.duration * that.width / (that.width + cmt.width);
    return (crLeftTime > cmtArrivalTime) || (cr.width > elapsed);
  }
  var crs = space[cmt.mode];
  var crLen = crs.length;
  var last = 0;
  var curr = 0;
  for (var i = 1; i < crLen; i++) {
    var cr = crs[i];
    var requiredRange = cmt.height;
    if (cmt.mode === 'top' || cmt.mode === 'bottom') {
      requiredRange += cr.height;
    }
    if (cr.range - crs[last].range > requiredRange) {
      curr = i;
      break;
    }
    if (willCollide(cr, cmt)) {
      last = i;
    }
  }
  var channel = crs[last].range;
  var crObj = {
    range: channel + cmt.height,
    time: cmt.time,
    width: cmt.width,
    height: cmt.height
  };
  crs.splice(last + 1, curr - last - 1, crObj);

  if (cmt.mode === 'bottom') {
    return this.height - cmt.height - channel % this.height;
  }
  return channel % (this.height - cmt.height);
}