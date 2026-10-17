execute unless entity @s[tag=ashen_class_selected] run function ashen:class/accept_mage
execute if entity @s[tag=ashen_class_selected,tag=ashen_class_change_pending] run function ashen:class/accept_mage
