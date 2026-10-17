scoreboard players set #kill_dragon ashen_story 1
execute at @s run summon minecraft:item ~ ~0.5 ~ {Item:{id:"kubejs:trophy_dragon",Count:1b},PickupDelay:0s,Invulnerable:1b,Glowing:1b}
tellraw @s {"text":"The Dragon Soul Scale dropped at your feet. Pick it up to complete the inventory check, then claim the quest reward.","color":"gold"}
advancement revoke @s only ashen:story/dragon
