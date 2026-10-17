execute if score #chapter ashen_story matches 2 run tellraw @a {"text":"Chapter 2 is complete. Chapter 3 is unlocked.","color":"gold"}
execute if score #chapter ashen_story matches 2 run scoreboard players set #chapter ashen_story 3
execute as @a run function ashen:recover
