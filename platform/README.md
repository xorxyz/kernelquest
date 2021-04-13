# `x37` (xor4/platform)

[`x37`](x37) is an end-to-end private cloud system.

# goals

extend openbsd with a minimal core set of tools for building private clouds, including all the facilities required to run a [software factory](software-factory).

# who

- indie sysadmins
- sysops
- fediverse
- bootstrappers

# why

waste:
- everybody's building the same system from scratch over and over in isolation
- same goes for infras
- growth at all cost is invading our lives
- the web has taken over the internet

complexity:
- ["cloud giants"][cloud-giants] implement proprietary, non-standard APIs on top of open system software
- web app proliferation

scale:
- small companies not keeping up with the rate of change

security:
- sso is always an enterprise feature
- risk measurement is expensive for a small business

system overload:
- tickets unanswered
- users helpless
- systems not monitored
- sysadmins and security people burning out

# how

we need to slow down [and practice proper husbandry]:

- people must be able to inspect, maintain and repair systems that they use
- consider how to feed waste back into the system
- encourage ownership of data
- curate existing solutions
- reduce cruft & bloat to a minimum
- leverage data exhausts
- monitor energy use
- use small units?
  - MHz for cpu clock speeds
  - KBs for ram capacity
  - MBs for storage capacity

# what

an end-to-end private cloud system:

- a single package
- can be run by a single indie sysadmin
- can host a handful of small businesses
- secure, private and safe and open by default
- bare metal clustering
- curated package registry
- simple, standard, modular
- makes it easier for teams to test, deploy and manage systems
- distributed & autonomous
- continuously audited
- can be run on older systems
- can be run on low quality connections
- built on openbsd

# reference

- [x37]: https://diagonal.systems/docs/x37
- [software-factory]: https://github.com/jondavid-black/DevOpsForDefense/blob/master/Meetup/2019/2019-07%20DO4D%20-%20Software%20Factory.pdf
- [cloud-giants]: https://www.dndbeyond.com/monsters/cloud-giant
- [k3s-arch]: https://rancher.com/docs/k3s/latest/en/architecture
