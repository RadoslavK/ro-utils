* Damage
    * Use ammunition only if it makes sense
    * Save input to local storage  

Bugs:  
* Fix starting refine level -> costs for refine box
* Fix refine box, it requires. min 4 lvl and check if it uses 20k for HD

New features:
* Add few % buffer for unsuccessful results? If its still worth if we expect bad luck (20%?)
* Indicate/cut refine levels before the latest one when its worth to do refine box
* Prefetch images
* +11-20

Refactor refining formula for HD to be more straightforward to make sense
rather than formulas from raw calculation. E.g. 1.5x downgrades... 1 downgrade, now I need 1.43 attempts to 0.43 items extra, then another 0.5 downgrades so 0.215 items extra and 1.5*1.43 total refine attempts from the previous level

Refactor and Clean code:
* in general