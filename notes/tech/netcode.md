# netcode


3 loosely coupled loops, 

Server Game Loop, 
Client side prediction Loop, and 
Client side UI Rendering Loop

publisher-subscriber pattern

send sync events to the view clients if the state changed

distinct set of updates

locking mechanism

transaction
lock
sync notifications that locked by view client x
timeout mechanism for disconnect before unlocking

synchronize tick offsets

keep a circular buffer of past character state and input for the local player on the client, then when the client receives a correction from the server

client prediction
emulate the game

Reconcilation

trade network latency tolerance for more accurate game state update, or vice versa

how tolerant on input that arrives late?
(player with ping > P ms wont be able to play the game)


--
network speed?

9600 baud

const throttle = require('@sitespeed.io/throttle');
// Returns a promise
throttle.start({up: 360, down: 780, rtt: 200}).then(() => ...

Crashes
Errors
