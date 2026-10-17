execute if score #chapter ashen_story matches 3 run tellraw @a {"text":"Chapter 3 is complete. Chapter 4 is unlocked.","color":"gold"}
execute if score #chapter ashen_story matches 3 run scoreboard players set #chapter ashen_story 4
execute as @a run function ashen:recover
