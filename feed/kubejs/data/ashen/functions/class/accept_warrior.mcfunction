function ashen:class/migrate_kit_claims
execute unless entity @s[tag=ashen_kit_warrior_claimed] run function ashen:class/starter_warrior
tag @s add ashen_kit_warrior_claimed
tag @s add ashen_starter_kit_received
tag @s remove ashen_class_mage
tag @s remove ashen_class_warrior
tag @s remove ashen_class_rogue
tag @s remove ashen_class_ranger
tag @s add ashen_class_warrior
tag @s add ashen_class_selected
tag @s remove ashen_class_change_pending
tellraw @s {"text": "Starter class: Warrior. Open Passive Skill Trees (O by default). Each class starter kit can be claimed once; class changes keep combat XP.", "color": "gold"}
