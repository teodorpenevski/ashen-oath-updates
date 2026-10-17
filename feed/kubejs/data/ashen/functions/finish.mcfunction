execute unless score #ignis ashen_story matches 1 run tellraw @s {"text":"The final seal still requires the Ignis trophy quest to be completed.","color":"red"}
execute if score #ignis ashen_story matches 1 unless entity @s[nbt={Inventory:[{id:"kubejs:restored_oath"}]}] run tellraw @s {"text":"Hold the Restored Oath to finish the seal.","color":"red"}
execute if score #ignis ashen_story matches 1 if entity @s[nbt={Inventory:[{id:"kubejs:restored_oath"}]}] run function ashen:finish_valid
