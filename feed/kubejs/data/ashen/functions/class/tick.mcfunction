scoreboard players enable @a ashen_mage
scoreboard players enable @a ashen_ranger
scoreboard players enable @a ashen_warrior
scoreboard players enable @a ashen_rogue
execute as @a[scores={ashen_mage=1..}] run function ashen:class/select_mage
execute as @a[scores={ashen_ranger=1..}] run function ashen:class/select_ranger
execute as @a[scores={ashen_warrior=1..}] run function ashen:class/select_warrior
execute as @a[scores={ashen_rogue=1..}] run function ashen:class/select_rogue
scoreboard players reset @a[scores={ashen_mage=1..}] ashen_mage
scoreboard players reset @a[scores={ashen_ranger=1..}] ashen_ranger
scoreboard players reset @a[scores={ashen_warrior=1..}] ashen_warrior
scoreboard players reset @a[scores={ashen_rogue=1..}] ashen_rogue
