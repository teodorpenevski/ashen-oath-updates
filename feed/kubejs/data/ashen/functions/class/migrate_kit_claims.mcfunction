execute unless entity @s[tag=ashen_kit_claims_migrated] if entity @s[nbt={UUID:[I;1426443144,-495828685,-1634011115,720026506]}] if entity @s[tag=ashen_starter_kit_received] run tag @s add ashen_kit_warrior_claimed
tag @s add ashen_kit_claims_migrated
