execute if score #chapter ashen_story matches 4 run tellraw @a {"text":"Chapter 4 is complete. Chapter 5 is unlocked.","color":"gold"}
execute if score #chapter ashen_story matches 4 run scoreboard players set #chapter ashen_story 5
execute as @a run function ashen:recover
