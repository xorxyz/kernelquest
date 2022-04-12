---
title: Agents
---

## Aging, Illness and Death

```
🌬️> ✨          beings are born
💧>  👦 👨 👴   what's born ages
🌱> 👴 🦠       aging leads to illness
🔥>  🦠⚔️ 💀    illness kills you
```

✨  Anything that spawns shows up as sparkles for the duration of it’s spawning phase.

Beings go through 3 phases of life:

1. 👦 Child
2. 👨 Parent
3. 👴 Ancestor

💀 Dead beings leave a skull behind. 

## Points

**Health points**: Agents have health. They must eat berries to recover it or they will die. 🍓 💀

**Magic points**: Agents have magic. Magic is used to organize mental things and cast spells. Sleeping, or drinking a cup of tea recovers mana. 🍵 📜

**Stamina points**: Agents have stamina. They spend it by moving around. Boots let you use less stamina when moving. 🌬️ 🥾

## Registers

1. Eyes. See. (cursor)
2. Finger. Touch. (adjacent cell)
3. Hand. Hold. (owned)
4. Back. Carry. (owned, 1-3) 

`[..  ..  ..]`
`[..  🧙 ..]`
`[..  $_  ..]`

An agent touches the adjacent cell of the direction it faces.
Agents face south (1, 1) by default.

`🧙[🚩]`
Agents have a hand register they can use to hold a thing.
The held thing always occupies the touched cell.

`[🚩]`
Putting an item means transfering it to the touched cell.

 ` [📜]`
`🧙`
Agents also have a pocket register they can use to keep a thing.

	 `    [📜 📜 📜 ]`
	 `  [📕 🎒]`
	 `[🎒]`
`🧙`
Bags lets agents store multiple objects recursively.


## Action queues
You commit to decisions on what to do next by queueing up actions.

## Common actions
Life
✨ Spawn

Movement
🌬️ Rotate, step forward
🥾 Go to a given set of coordinates, find an agent or a thing, stop walking

Interaction
👁️ Look at and observe things
🖐️ Get and put things

Communication
💬 Send a message
💱 Offer a trade
👍 Accept an offer

## Capabilities


## Patrol


## Pathfinding



## Find


## Agent events
Life
⚔️ Received damage
💀 Died

Movement
🥾 Blocked

Interaction
👁️ Produced an observation

Communication
💬 Received a message
💱 Received an offer
👍 Completed a trade


