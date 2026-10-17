execute unless score #ended ashen_story matches 1 run tellraw @a {"text":"The breach closes. Your memories remain. A new Dawnwarden order begins here.","color":"gold"}
scoreboard players set #ended ashen_story 1
clear @s kubejs:restored_oath 1
give @s kubejs:dawnwarden_crest
playsound minecraft:ui.toast.challenge_complete master @s ~ ~ ~ 1 1
