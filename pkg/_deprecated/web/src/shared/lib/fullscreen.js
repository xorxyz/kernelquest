export default {
  __fullscreen: false,
  toggle (el) {
    this.__fullscreen = !this._fullscreen

    return this._fullscreen
      ? this.exitFullscreen()
      : this.enterFullScreen(el)
  },
  onFullScreenChange () {
    var isFullscreen = !!document.fullscreenElement

    if (!isFullscreen) {
      var handler = this.onFullScreenChange

      document.removeEventListener('fullscreenchange', handler)
    }

    this._fullscreen = isFullscreen
  },
  enterFullScreen (el = document) {
    var onChange = this.onFullScreenChange.bind(this)
    var enter = (
      el.requestFullscreen || 
      el.mozRequestFullScreen ||
      el.webkitRequestFullscreen ||
      el.msRequestFullscreen
    ).bind(el)

    enter(el)

    document.addEventListener('fullscreenchange', onChange)
  },
  exitFullscreen () {
    var exit = (
      document.exitFullscreen ||
      document.mozCancelFullScreen ||
      document.webkitExitFullscreen ||
      document.msExitFullscreen
    ).bind(document)

    exit()
  }
}
