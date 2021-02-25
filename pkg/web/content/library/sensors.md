---
title: Sensor Network Nodes
---

Rooms can contain sensors nodes. 
Sensors are fed data from the world simulation.

Notes:

- a radio transceiver  with an internal antenna or connection to an external antenna
  - ISM band (free radio, spectrum allocation and global availability)
  - wireless transmission media: 
    - radio frequency (RF), 
    - optical communication (laser) less energy, need line-of-sight, sensitive to atmospheric conditions
    - infrared limited in its broadcasting capacity
  - tend to use license-free communication frequencies: 173, 433, 868, and 915 MHz; and 2.4 GHz
  - operational states are transmit, receive, idle, and sleep
  - built-in state machines that perform some operations automatically
a microcontroller,
external memory
  - kinds
    - the on-chip memory of a microcontroller and 
    - Flash memory
  - user memory used for storing application related or personal data
  - program memory used for programming the device
  - identification data of the device
- an electronic circuit for interfacing with the sensors
- an energy source usually a battery or an embedded form of energy harvesting
  - sensor node consumes power for sensing, communicating and data processing
  - process. The energy cost of transmitting 1 Kb a distance of 100 metres (330 ft) is approximately the same as that used for the execution of 3 million instructions by a 100 million instructions per second/W processor
  - batteries: NiCd (nickel-cadmium), NiZn (nickel-zinc), NiMH (nickel-metal hydride), and lithium-ion. 
  - renew their energy from solar sources, temperature differences, or vibration
  - power saving policies used are Dynamic Power Management (DPM) and Dynamic Voltage Scaling (DVS)
    - conserves power shutting down parts of the sensor node which are not currently used or active
    - By varying the voltage along with the frequency, it is possible to obtain quadratic reduction in power consumption.
  - power source of less than 0.5-2 ampere-hour and 1.2-3.7 volts
sensors
  - passive, omnidirectional sensors; passive, narrow-beam sensors; and active sensors
  - signal sampling and conversion of physical signals to electrical ones
  - signal conditioning
  - analog-to-digital conversion
  - continual analog signal produced by the sensors and digitized by an analog-to-digital converter
  - convert the raw signals into readings which can be retrieved via a digital link (e.g. I2C, SPI) 
  -  convert to units such as °C.
  - https://en.wikipedia.org/wiki/List_of_sensors
