const graph = require('tiny-graph');

class Person {
  constructor (name) {
    this.name = name
  }
}

class Place {
  constructor (id) {
    this.id = id
    this.people = new Set()
  }

  addPerson (person) {
    this.people.add(person)

    return this
  }

  removePerson (person) {
    this.people.delete(person)

    return this
  }
}

class GameMap {
  constructor () {
    this.graph = graph()
    this.people = new Set()

    this._init()
  }

  get places () {
    return Object.keys(this.graph.nodes)
      .map(key => this.graph.nodes[key].value) 
  }

  _init () {
    const ratsNest = this.addPlace('rats_nest')
    const wizardGuild = this.addPlace('wizard_guild')
    const watchersGate = this.addPlace('watchers_gate')

    this.link(ratsNest, wizardGuild)
    this.link(ratsNest, watchersGate)
  }

  addPlace (id) {
    const place = new Place(id)

    this.graph.setNodeValue(place.id, place)

    return place
  }

  link (placeA, placeB) {
    this.graph.add(placeA.id, placeB.id)

    return this
  }

  findPersonByName (name) {
    const people = Array.from(this.people.entries())

    return people.find(p => p.name === name)
  }

  findPlaceById (id) {
    return this.graph.getNodeValue(id)
  }

  findPersonPlace (person) {
    return this.places.find(place => place.people.has(person))
  }

  addPerson (name, placeId) {
    const person = new Person(name)
    const place = this.findPlaceById(placeId)

    this.people.add(person)

    place.addPerson(person)

    return person
  }

  move (personName, placeIdB) {
    const person = this.findPersonByName(personName)
    const placeA = this.findPersonPlace(person)
    const placeB = this.findPlaceById(placeIdB)

    placeA.removePerson(person)
    placeB.addPerson(person)
  }

  removePerson (name) {
    const person = this.findPersonByName(name)

    this.people.delete(person)

    return this
  }
}

module.exports = GameMap
