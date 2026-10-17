execute if score #chapter ashen_story matches 5 run tellraw @a {"text":"Chapter 5 is complete. The campaign is complete.","color":"gold"}
execute if score #chapter ashen_story matches 5 run scoreboard players set #chapter ashen_story 6
execute as @a run function ashen:recover
