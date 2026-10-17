execute if score #chapter ashen_story matches 1 run tellraw @a {"text":"Chapter 1 is complete. Chapter 2 is unlocked.","color":"gold"}
execute if score #chapter ashen_story matches 1 run scoreboard players set #chapter ashen_story 2
execute as @a run function ashen:recover
