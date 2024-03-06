---
title: Lands, places, and cells
---

# Worlds, lands, places and cells
## World
A world is a grid of lands.

World sizes:
1. 1,1
2. 2,1
3. 2,2
4. 4,3
5. 8,5
6. 16,10

## Land
A land is a 16x10 grid of 4-byte cells, and a set of Agents, Things, Houses and Routes.
Doors connect cells at the edge between each land.

```
    C   D   E   F     0   1   2   3   4...
8 [..][..][++][++]  [++][..][..][..]
9 [++][++][++][11]  [01][++][++][++]

0 [++][++][++][10]  [00][++][++][++]
1 [..][..][..][++]  [++][..][..][..]
2...

```

## Cell
`[..]`
Cells are the smallest physical unit of space. Cells have 2 to 4 neighbours
Ten vertically adjacent Cells form a Cell Column, and sixteen adjacent Cells form a Cell Row. 
A Cell can contain a thing or an agent.

## Region 
`[..][..]`
`[..][..]`
A region is a set of adjacent cells.

## 🌲 Tree
Trees grow in forests.

## 🪵 Wood
Chop trees to get wood.

## `~~` River
Rivers flow downstream.

##  `##` Rock
You can push and pull rock arounds but you can't pick them up.

## Wall
Walls are made from assembling rocks into lines.
A house is made of 4 walls.

## House
A house is a region surrounded by walls.

## Door
A door exposes the cells of a house to the rest of the land.
Doors are made of wood.

Door address: `<Land Id>.<Cell Id>`  ie: `F9.F9`
Door knocks: Number of knocks required to signal to the listening agent on the other side.

## Route
A route connects two doors across lands.

## Place
A place is a set of connected doors.

🌲    🔥    🏕️         you can create a camp in a forests by building a fire, a route, and a small house.
🏕️    🏘️                camp becomes village
🏘️    🏰                city becomes castle

🚩🏕️🏘️🏰    🛡️   places protect flags
