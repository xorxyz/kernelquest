export default class Vector {
  x: number
  y: number

  constructor (x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  static from (obj) {
    return new Vector(obj.x, obj.y)
  }

  clone () {
    return new Vector(this.x, this.y)
  }

  setXY (x, y) {
    this.x = x
    this.y = y
    return this
  }

  setX (x) {
    this.x = x
    return this
  }

  setY (y) {
    this.y = y
    return this
  }

  copyX (v) {
    this.x = v.x
    return this
  }

  copyY (v) {
    this.y = v.y
    return this
  }

  copy (v) {
    this.x = v.x
    this.y = v.y
    return this
  }

  addX (x) {
    this.x += x
    return this
  }

  addY (y) {
    this.y += y
    return this
  }

  add (v) {
    this.x += v.x
    this.y += v.y
    return this
  }

  subX (x) {
    this.x -= x
    return this
  }

  subY (y) {
    this.y -= y
    return this
  }

  sub (v) {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  equals (v) {
    return this.x === v.x && this.y === v.y
  }

  opposes (v) {
    return (
      (this.x && v.x && Math.sign(this.x) !== Math.sign(v.x)) ||
      (this.y && v.y && Math.sign(this.y) !== Math.sign(v.y))
    )
  }
}
