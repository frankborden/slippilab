import { type Character } from "@slippilab/common";

export const kirby: Character = {
  scale: 0.92,
  shieldBone: 57,
  shieldSize: 0.92 * 14.7,
  animationMap: new Map<string, string>([
    ["AppealL", "AppealL"],
    ["AppealR", "AppealR"],
    ["AttackS3Hi", "AttackS3Hi"],
    ["AttackS3HiS", "AttackS3Hi"],
    ["AttackS3Lw", "AttackS3Lw"],
    ["AttackS3LwS", "AttackS3Lw"],
    ["AttackS3S", "AttackS3S"],
    ["AttackS4Hi", "AttackS4Hi"],
    ["AttackS4HiS", "AttackS4Hi"],
    ["AttackS4Lw", "AttackS4Lw"],
    ["AttackS4LwS", "AttackS4Lw"],
    ["AttackS4S", "AttackS4S"],
    ["BarrelWait", ""],
    ["Bury", ""],
    ["BuryJump", ""],
    ["BuryWait", ""],
    ["CaptureCaptain", ""],
    ["CaptureDamageKoopa", ""],
    ["CaptureDamageKoopaAir", ""],
    ["CaptureKirby", ""],
    ["CaptureKirbyYoshi", ""],
    ["CaptureKoopa", ""],
    ["CaptureKoopaAir", ""],
    ["CaptureMewtwo", ""],
    ["CaptureMewtwoAir", ""],
    ["CaptureWaitKirby", ""],
    ["CaptureWaitKoopa", ""],
    ["CaptureWaitKoopaAir", ""],
    ["CaptureYoshi", ""],
    ["CatchDashPull", "CatchWait"],
    ["CatchPull", "CatchWait"],
    ["DamageBind", ""],
    ["DamageIce", ""],
    ["DamageIceJump", "Fall"],
    ["DamageSong", ""],
    ["DamageSongRv", ""],
    ["DamageSongWait", ""],
    ["DeadDown", ""],
    ["DeadLeft", ""],
    ["DeadRight", ""],
    ["DeadUpFallHitCamera", ""],
    ["DeadUpFallHitCameraIce", ""],
    ["DeadUpFallIce", ""],
    ["DeadUpStar", ""],
    ["DeadUpStarIce", ""],
    ["DownReflect", ""],
    ["EntryEnd", "Entry"],
    ["EntryStart", "Entry"],
    ["Escape", "EscapeN"],
    ["FlyReflectCeil", ""],
    ["FlyReflectWall", "WallDamage"],
    ["Guard", "Guard"],
    ["GuardOff", "GuardOff"],
    ["GuardOn", "GuardOn"],
    ["GuardReflect", "Guard"],
    ["GuardSetOff", "GuardDamage"],
    ["ItemParasolDamageFall", ""],
    ["ItemParasolFall", ""],
    ["ItemParasolFallSpecial", ""],
    ["ItemParasolOpen", ""],
    ["KirbyYoshiEgg", ""],
    ["KneeBend", "Landing"],
    ["LandingFallSpecial", "Landing"],
    ["LiftTurn", ""],
    ["LiftWait", ""],
    ["LiftWalk1", ""],
    ["LiftWalk2", ""],
    ["LightThrowAirB4", "LightThrowAirB"],
    ["LightThrowAirF4", "LightThrowAirF"],
    ["LightThrowAirHi4", "LightThrowAirHi"],
    ["LightThrowAirLw4", "LightThrowAirLw"],
    ["LightThrowB4", "LightThrowB"],
    ["LightThrowF4", "LightThrowF"],
    ["LightThrowHi4", "LightThrowHi"],
    ["LightThrowLw4", "LightThrowLw"],
    ["Rebirth", "Entry"],
    ["RebirthWait", "Wait1"],
    ["ReboundStop", "Rebound"],
    ["RunDirect", ""],
    ["ShieldBreakDownD", "DownBoundD"],
    ["ShieldBreakDownU", "DownBoundU"],
    ["ShieldBreakFall", "DamageFall"],
    ["ShieldBreakFly", ""],
    ["ShieldBreakStandD", "DownStandD"],
    ["ShieldBreakStandU", "DownStandU"],
    ["ShoulderedTurn", ""],
    ["ShoulderedWait", ""],
    ["ShoulderedWalkFast", ""],
    ["ShoulderedWalkMiddle", ""],
    ["ShoulderedWalkSlow", ""],
    ["SwordSwing1", "Swing1"],
    ["SwordSwing3", "Swing3"],
    ["SwordSwing4", "Swing4"],
    ["SwordSwingDash", "SwingDash"],
    ["ThrownB", ""],
    ["ThrownCopyStar", ""],
    ["ThrownF", ""],
    ["ThrownFB", ""],
    ["ThrownFF", ""],
    ["ThrownFHi", ""],
    ["ThrownFLw", ""],
    ["ThrownHi", ""],
    ["ThrownKirby", ""],
    ["ThrownKirbyStar", ""],
    ["ThrownKoopaAirB", ""],
    ["ThrownKoopaAirF", ""],
    ["ThrownKoopaB", ""],
    ["ThrownKoopaF", ""],
    ["ThrownLw", ""],
    ["ThrownLwWomen", ""],
    ["ThrownMewtwo", ""],
    ["ThrownMewtwoAir", ""],
    ["Wait", "Wait1"],
    ["YoshiEgg", ""],
  ]),
  specialsMap: new Map<number, string>([
    [341, "JumpAerialF1"],
    [342, "JumpAerialF2"],
    [343, "JumpAerialF3"],
    [344, "JumpAerialF4"],
    [345, "JumpAerialF5"],
    [346, "JumpAerialF1Met"],
    [347, "JumpAerialF2Met"],
    [348, "JumpAerialF3Met"],
    [349, "JumpAerialF4Met"],
    [350, "JumpAerialF5Met"],
    [351, "AttackDash"],
    [352, "AttackDash"],
    [353, "SpecialN"], // Ground Startup (Drink?)
    [354, "SpecialNLoop"],
    [355, "SpecialNEnd"],
    [356, "Eat"], // Capture (Eat?)
    [357, ""], // ???
    [358, ""], // Captured (used as swallowed character state? or is that ThrownKirby?)
    [359, "EatWait"],
    [360, "EatWalkSlow"],
    [361, "EatWalkMiddle"],
    [362, "EatWalkFast"],
    [363, "EatTurn"],
    [364, "EatLanding"],
    [365, "EatJump1"],
    [366, "EatLanding"],
    [367, "SpecialNDrink"], // Digest (Drink?)
    [368, ""], // ???
    [369, "SpecialNSpit"], // Spit
    [370, ""], // ???
    [371, "SpecialN"], // Air Startup (Drink?)
    [372, "SpecialNLoop"],
    [373, "SpecialNEnd"],
    [374, "Eat"], // Air Capture (Eat?)
    [375, ""], // ???
    [376, ""], // Air Captured (see 358)
    [377, "EatWait"],
    [378, "SpecialNDrink"], // Air Digest (Drink?)
    [379, ""], // ???
    [380, "SpecialNSpit"], // Air Spit
    [381, ""], // ???
    [382, "EatTurn"],
    [383, "SpecialS"],
    [384, "SpecialAirS"],
    [385, "SpecialHi1"],
    [386, "SpecialHi2"],
    [387, "SpecialHi3"],
    [388, "SpecialHi4"],
    [389, "SpecialAirHi1"],
    [390, "SpecialAirHi2"],
    [391, "SpecialAirHi3"],
    [392, "SpecialAirHi4"],
    [393, "SpecialLw1"],
    [394, "SpecialLw1"],
    [395, "SpecialLw2"],
    [396, "SpecialAirLw1"],
    [397, "SpecialAirLw1"],
    [398, "SpecialAirLw2"],
    [399, "MrSpecialN"],
    [400, "MrSpecialAirN"],
    [401, "LkSpecialNStart"],
    [402, "LkSpecialNLoop"],
    [403, "LkSpecialNEnd"],
    [404, "LkSpecialAirNStart"],
    [405, "LkSpecialAirNLoop"],
    [406, "LkSpecialAirNEnd"],
    [407, "SsSpecialNStart"],
    [408, "SsSpecialNHold"],
    [409, "SsSpecialNCancel"],
    [410, "SsSpecialN"],
    [411, "SsSpecialAirNStart"],
    [412, "SsSpecialAirN"],
    [413, "YsSpecialN1"],
    [414, "YsSpecialN2"],
    [415, ""],
    [416, "YsSpecialN2"],
    [417, ""],
    [418, "YsSpecialAirN1"],
    [419, "YsSpecialAirN2"],
    [420, ""],
    [421, "YsSpecialAirN2"],
    [422, ""],
    [423, "FxSpecialNStart"],
    [424, "FxSpecialNLoop"],
    [425, "FxSpecialNEnd"],
    [426, "FxSpecialAirNStart"],
    [427, "FxSpecialAirNLoop"],
    [428, "FxSpecialAirNEnd"],
    [429, "PkSpecialN"],
    [430, "PkSpecialAirN"],
    [431, "LgSpecialN"],
    [432, "LgSpecialAirN"],
    [433, "CaSpecialN"],
    [434, "CaSpecialAirN"],
    [435, "NsSpecialNStart"],
    [436, "NsSpecialNHold"],
    [437, "NsSpecialNEnd"], // explode
    [438, "NsSpecialNEnd"], // just ends
    [439, "NsSpecialAirNStart"],
    [440, "NsSpecialAirNHold"],
    [441, "NsSpecialAirNEnd"], // explode
    [442, "NsSpecialAirNEnd"], // just ends
    [443, "KpSpecialNStart"],
    [444, "KpSpecialN"],
    [445, "KpSpecialNEnd"],
    [446, "KpSpecialAirNStart"],
    [447, "KpSpecialAirN"],
    [448, "KpSpecialAirNEnd"],
    [449, "PeSpecialLw"],
    [450, "PeSpecialLwHit"],
    [451, "PeSpecialAirLw"],
    [452, "PeSpecialAirLwHit"],
    [453, "PpSpecialN"],
    [454, "PpSpecialAirN"],
    [455, "DkSpecialNStart"],
    [456, "DkSpecialNLoop"],
    [457, "DkSpecialNCansel"],
    [458, "DkSpecialN"], // early
    [459, "DkSpecialN"], // full charge
    [460, "DkSpecialAirNStart"],
    [461, "DkSpecialAirNLoop"],
    [462, "DkSpecialAirNCancel"],
    [463, "DkSpecialAirN"], // early
    [464, "DkSpecialAirN"], // full charge
    [465, "ZdSpecialN"],
    [466, "ZdSpecialAirN"],
    [467, "SkSpecialNStart"],
    [468, "SkSpecialNLoop"],
    [469, "SkSpecialNCancel"],
    [470, "SkSpecialNEnd"], // shoot
    [471, "SkSpecialAirNStart"],
    [472, "SkSpecialAirNLoop"],
    [473, "SkSpecialAirNCancel"],
    [474, "SkSpecialAirNEnd"], // shoot
    [475, "PrSpecialNStartR"],
    [476, "PrSpecialNStartL"],
    [477, "PrSpecialN"], // ground charge
    [478, "PrSpecialN"], // ground full charge
    [479, "PrSpecialN"], // ground release
    [480, "PrSpecialN"], // ground turn
    [481, "PrSpecialNEndR"],
    [482, "PrSpecialNEndL"],
    [483, "PrSpecialNStartR"],
    [484, "PrSpecialNStartL"],
    [485, "PrSpecialN"], // air charge
    [486, "PrSpecialN"], // air full charge
    [487, "PrSpecialN"], // air release
    [489, "PrSpecialAirNEndR"],
    [490, "PrSpecialAirNEndR"], // end left
    [491, "PrSpecialN"], // hit
    [492, "MsSpecialNStart"],
    [493, "MsSpecialNLoop"],
    [494, "MsSpecialNEnd"], // ends early
    [495, "MsSpecialNEnd"], // full charge
    [496, "MsSpecialAirNStart"],
    [497, "MsSpecialAirNLoop"],
    [498, "MsSpecialAirNEnd"], // ends early
    [499, "MsSpecialAirNEnd"], // full charge
    [500, "MtSpecialNStart"],
    [501, "MtSpecialNLoop"],
    [502, "MtSpecialNLoop"],
    [503, "MtSpecialNCancel"],
    [504, "MtSpecialNEnd"],
    [505, "MtSpecialAirNStart"],
    [506, "MtSpecialAirNLoop"],
    [507, "MtSpecialAirNLoop"],
    [508, "MtSpecialAirNCancel"],
    [509, "MtSpecialAirNEnd"],
    [510, "GwSpecialN"],
    [511, "GwSpecialAirN"],
    // doc using mario's animations
    [512, "MrSpecialN"],
    [513, "MrSpecialAirN"],
    // young link using link's animations
    [514, "LkSpecialNStart"],
    [515, "LkSpecialNLoop"],
    [516, "LkSpecialNEnd"],
    [517, "LkSpecialAirNStart"],
    [518, "LkSpecialAirNLoop"],
    [519, "LkSpecialAirNEnd"],
    [520, "FcSpecialNStart"],
    [521, "FcSpecialNLoop"],
    [522, "FcSpecialNEnd"],
    [523, "FcSpecialAirNStart"],
    [524, "FcSpecialAirNLoop"],
    [525, "FcSpecialAirNEnd"],
    // pichu using pikachu's animations
    [526, "PkSpecialN"],
    [527, "PkSpecialAirN"],
    [528, "GnSpecialN"],
    [529, "GnSpecialAirN"],
    // roy using marth's animations
    [530, "MsSpecialNStart"],
    [531, "MsSpecialNLoop"],
    [532, "MsSpecialNEnd"], // ends early
    [533, "MsSpecialNEnd"], // full charge
    [534, "MsSpecialAirNStart"],
    [535, "MsSpecialAirNLoop"],
    [536, "MsSpecialAirNEnd"], // ends early
    [537, "MsSpecialAirNEnd"], // full charge
  ]),
};