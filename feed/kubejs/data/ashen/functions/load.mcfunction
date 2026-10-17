scoreboard objectives add ashen_story dummy
gamerule skillReplaceCooldown 0
scoreboard objectives add ashen_mage trigger
scoreboard objectives add ashen_ranger trigger
scoreboard objectives add ashen_warrior trigger
scoreboard objectives add ashen_rogue trigger
execute unless score #chapter ashen_story matches 1.. run scoreboard players set #chapter ashen_story 1
execute unless score #wither ashen_story matches 0.. run scoreboard players set #wither ashen_story 0
execute unless score #dragon ashen_story matches 0.. run scoreboard players set #dragon ashen_story 0
execute unless score #ended ashen_story matches 0.. run scoreboard players set #ended ashen_story 0
execute unless score #ignis ashen_story matches 0.. run scoreboard players set #ignis ashen_story 0
execute if score #chapter ashen_story matches 6.. run scoreboard players set #ignis ashen_story 1
