/**
 * Note: internal and external lists do not match.
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const characterNameByExternalId = [
  "Captain Falcon", // 0, 0x0
  "Donkey Kong", // 1, 0x1
  "Fox", // 2, 0x2
  "Mr. Game & Watch", // 3, 0x3
  "Kirby", // 4, 0x4
  "Bowser", // 5, 0x5
  "Link", // 6, 0x6
  "Luigi", // 7, 0x7
  "Mario", // 8, 0x8
  "Marth", // 9, 0x9
  "Mewtwo", // 10, 0xa
  "Ness", // 11, 0xb
  "Peach", // 12, 0xc
  "Pikachu", // 13, 0xd
  "Ice Climbers", // 14, 0xe
  "Jigglypuff", // 15, 0xf
  "Samus", // 16, 0x10
  "Yoshi", // 17, 0x11
  "Zelda", // 18, 0x12
  "Sheik", // 19, 0x13
  "Falco", // 20, 0x14
  "Young Link", // 21, 0x15
  "Dr. Mario", // 22, 0x16
  "Roy", // 23, 0x17
  "Pichu", // 24, 0x18
  "Ganondorf", // 25, 0x19
  "Master Hand", // 26, 0x1a
  "Wireframe Male", // 27, 0x1b
  "Wireframe Female", // 28, 0x1c
  "Giga Bowser", // 29, 0x1d
  "Crazy Hand", // 30, 0x1e
  "Sandbag", // 31, 0x1f
  "Popo", // 32, 0x20
] as const;
export type ExternalCharacterName = typeof characterNameByExternalId[number];

/**
 * Note: internal and external lists do not match.
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const characterNameByInternalId = [
  "Mario", // 0, 0x0
  "Fox", // 1, 0x1
  "Captain Falcon", // 2, 0x2
  "Donkey Kong", // 3, 0x3
  "Kirby", // 4, 0x4
  "Bowser", // 5, 0x5
  "Link", // 6, 0x6
  "Sheik", // 7, 0x7
  "Ness", // 8, 0x8
  "Peach", // 9, 0x9
  "Popo", // 10, 0xa
  "Nana", // 11, 0xb
  "Pikachu", // 12, 0xc
  "Samus", // 13, 0xd
  "Yoshi", // 14, 0xe
  "Jigglypuff", // 15, 0xf
  "Mewtwo", // 16, 0x10
  "Luigi", // 17, 0x11
  "Marth", // 18, 0x12
  "Zelda", // 19, 0x13
  "Young Link", // 20, 0x14
  "Dr. Mario", // 21, 0x15
  "Falco", // 22, 0x16
  "Pichu", // 23, 0x17
  "Mr. Game & Watch", // 24, 0x18
  "Ganondorf", // 25, 0x19
  "Roy", // 26, 0x1a
  "Master Hand", // 27, 0x1b
  "Crazy Hand", // 28, 0x1c
  "Wireframe Male (Boy)", // 29, 0x1d
  "Wireframe Female (Girl)", // 30, 0x1e
  "Giga Bowser", // 31, 0x1f
  "Sandbag", // 32, 0x20
] as const;
export type InternalCharacterNames = typeof characterNameByInternalId[number];

/**
 * Does not yet include single player stages (ids 33-285)
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const stageNameByExternalId = [
  "Dummy", // 0, 0x0
  "TEST", // 1, 0x1
  "Fountain of Dreams", // 2, 0x2
  "Pokémon Stadium", // 3, 0x3
  "Princess Peach's Castle", // 4, 0x4
  "Kongo Jungle", // 5, 0x5
  "Brinstar", // 6, 0x6
  "Corneria", // 7, 0x7
  "Yoshi's Story", // 8, 0x8
  "Onett", // 9, 0x9
  "Mute City", // 10, 0xa
  "Rainbow Cruise", // 11, 0xb
  "Jungle Japes", // 12, 0xc
  "Great Bay", // 13, 0xd
  "Hyrule Temple", // 14, 0xe
  "Brinstar Depths", // 15, 0xf
  "Yoshi's Island", // 16, 0x10
  "Green Greens", // 17, 0x11
  "Fourside", // 18, 0x12
  "Mushroom Kingdom I", // 19, 0x13
  "Mushroom Kingdom II", // 20, 0x14
  "Akaneia", // 21, 0x15
  "Venom", // 22, 0x16
  "Poké Floats", // 23, 0x17
  "Big Blue", // 24, 0x18
  "Icicle Mountain", // 25, 0x19
  "Icetop", // 26, 0x1a
  "Flat Zone", // 27, 0x1b
  "Dream Land N64", // 28, 0x1c
  "Yoshi's Island N64", // 29, 0x1d
  "Kongo Jungle N64", // 30, 0x1e
  "Battlefield", // 31, 0x1f
  "Final Destination", // 32, 0x20
  // TODO: Single player mode stages, goes up to 285
] as const;
export type ExternalStageName = typeof stageNameByExternalId[number];

/**
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const stageNameByInternalId = [
  "Princess Peach's Castle", // 2, 0x2
  "Rainbow Cruise", // 3, 0x3
  "Kongo Jungle", // 4, 0x4
  "Jungle Japes", // 5, 0x5
  "Great Bay", // 6, 0x6
  "Hyrule Temple", // 7, 0x7
  "Brinstar", // 8, 0x8
  "Brinstar Depths", // 9, 0x9
  "Yoshi's Story", // 10, 0xa
  "Yoshi's Island", // 11, 0xb
  "Fountain of Dreams", // 12, 0xc
  "Green Greens", // 13, 0xd
  "Corneria", // 14, 0xe
  "Venom", // 15, 0xf
  "Pokemon Stadium", // 16, 0x10
  "Poke Floats", // 17, 0x11
  "Mute City", // 18, 0x12
  "Big Blue", // 19, 0x13
  "Onett", // 20, 0x14
  "Fourside", // 21, 0x15
  "Icicle Mountain", // 22, 0x16
  "Mushroom Kingdom", // 24, 0x18
  "Mushroom Kingdom II", // 25, 0x19
  "Flat Zone", // 27, 0x1b
  "Dream Land", // 28, 0x1c
  "Yoshi's Island (64)", // 29, 0x1d
  "Kongo Jungle (64)", // 30, 0x1e
] as const;
export type InternalStageName = typeof stageNameByInternalId[number];

/**
 * Does not include character-specific actions, and some characters may use
 * character-specific actions instead of normal ones. For example: Yoshi's
 * shield or Kirby's jumps. Ids 341+ are character-specific.
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const actionNameById = [
  "DeadDown", // 0, 0x0
  "DeadLeft", // 1, 0x1
  "DeadRight", // 2, 0x2
  "DeadUp", // 3, 0x3
  "DeadUpStar", // 4, 0x4
  "DeadUpStarIce", // 5, 0x5
  "DeadUpFall", // 6, 0x6
  "DeadUpFallHitCamera", // 7, 0x7
  "DeadUpFallHitCameraFlat", // 8, 0x8
  "DeadUpFallIce", // 9, 0x9
  "DeadUpFallHitCameraIce", // 10, 0xa
  "Sleep", // 11, 0xb
  "Rebirth", // 12, 0xc
  "RebirthWait", // 13, 0xd
  "Wait", // 14, 0xe
  "WalkSlow", // 15, 0xf
  "WalkMiddle", // 16, 0x10
  "WalkFast", // 17, 0x11
  "Turn", // 18, 0x12
  "TurnRun", // 19, 0x13
  "Dash", // 20, 0x14
  "Run", // 21, 0x15
  "RunDirect", // 22, 0x16
  "RunBrake", // 23, 0x17
  "KneeBend", // 24, 0x18
  "JumpF", // 25, 0x19
  "JumpB", // 26, 0x1a
  "JumpAerialF", // 27, 0x1b
  "JumpAerialB", // 28, 0x1c
  "Fall", // 29, 0x1d
  "FallF", // 30, 0x1e
  "FallB", // 31, 0x1f
  "FallAerial", // 32, 0x20
  "FallAerialF", // 33, 0x21
  "FallAerialB", // 34, 0x22
  "FallSpecial", // 35, 0x23
  "FallSpecialF", // 36, 0x24
  "FallSpecialB", // 37, 0x25
  "DamageFall", // 38, 0x26
  "Squat", // 39, 0x27
  "SquatWait", // 40, 0x28
  "SquatRv", // 41, 0x29
  "Landing", // 42, 0x2a
  "LandingFallSpecial", // 43, 0x2b
  "Attack11", // 44, 0x2c
  "Attack12", // 45, 0x2d
  "Attack13", // 46, 0x2e
  "Attack100Start", // 47, 0x2f
  "Attack100Loop", // 48, 0x30
  "Attack100End", // 49, 0x31
  "AttackDash", // 50, 0x32
  "AttackS3Hi", // 51, 0x33
  "AttackS3HiS", // 52, 0x34
  "AttackS3S", // 53, 0x35
  "AttackS3LwS", // 54, 0x36
  "AttackS3Lw", // 55, 0x37
  "AttackHi3", // 56, 0x38
  "AttackLw3", // 57, 0x39
  "AttackS4Hi", // 58, 0x3a
  "AttackS4HiS", // 59, 0x3b
  "AttackS4S", // 60, 0x3c
  "AttackS4LwS", // 61, 0x3d
  "AttackS4Lw", // 62, 0x3e
  "AttackHi4", // 63, 0x3f
  "AttackLw4", // 64, 0x40
  "AttackAirN", // 65, 0x41
  "AttackAirF", // 66, 0x42
  "AttackAirB", // 67, 0x43
  "AttackAirHi", // 68, 0x44
  "AttackAirLw", // 69, 0x45
  "LandingAirN", // 70, 0x46
  "LandingAirF", // 71, 0x47
  "LandingAirB", // 72, 0x48
  "LandingAirHi", // 73, 0x49
  "LandingAirLw", // 74, 0x4a
  "DamageHi1", // 75, 0x4b
  "DamageHi2", // 76, 0x4c
  "DamageHi3", // 77, 0x4d
  "DamageN1", // 78, 0x4e
  "DamageN2", // 79, 0x4f
  "DamageN3", // 80, 0x50
  "DamageLw1", // 81, 0x51
  "DamageLw2", // 82, 0x52
  "DamageLw3", // 83, 0x53
  "DamageAir1", // 84, 0x54
  "DamageAir2", // 85, 0x55
  "DamageAir3", // 86, 0x56
  "DamageFlyHi", // 87, 0x57
  "DamageFlyN", // 88, 0x58
  "DamageFlyLw", // 89, 0x59
  "DamageFlyTop", // 90, 0x5a
  "DamageFlyRoll", // 91, 0x5b
  "LightGet", // 92, 0x5c
  "HeavyGet", // 93, 0x5d
  "LightThrowF", // 94, 0x5e
  "LightThrowB", // 95, 0x5f
  "LightThrowHi", // 96, 0x60
  "LightThrowLw", // 97, 0x61
  "LightThrowDash", // 98, 0x62
  "LightThrowDrop", // 99, 0x63
  "LightThrowAirF", // 100, 0x64
  "LightThrowAirB", // 101, 0x65
  "LightThrowAirHi", // 102, 0x66
  "LightThrowAirLw", // 103, 0x67
  "HeavyThrowF", // 104, 0x68
  "HeavyThrowB", // 105, 0x69
  "HeavyThrowHi", // 106, 0x6a
  "HeavyThrowLw", // 107, 0x6b
  "LightThrowF4", // 108, 0x6c
  "LightThrowB4", // 109, 0x6d
  "LightThrowHi4", // 110, 0x6e
  "LightThrowLw4", // 111, 0x6f
  "LightThrowAirF4", // 112, 0x70
  "LightThrowAirB4", // 113, 0x71
  "LightThrowAirHi4", // 114, 0x72
  "LightThrowAirLw4", // 115, 0x73
  "HeavyThrowF4", // 116, 0x74
  "HeavyThrowB4", // 117, 0x75
  "HeavyThrowHi4", // 118, 0x76
  "HeavyThrowLw4", // 119, 0x77
  "SwordSwing1", // 120, 0x78
  "SwordSwing3", // 121, 0x79
  "SwordSwing4", // 122, 0x7a
  "SwordSwingDash", // 123, 0x7b
  "BatSwing1", // 124, 0x7c
  "BatSwing3", // 125, 0x7d
  "BatSwing4", // 126, 0x7e
  "BatSwingDash", // 127, 0x7f
  "ParasolSwing1", // 128, 0x80
  "ParasolSwing3", // 129, 0x81
  "ParasolSwing4", // 130, 0x82
  "ParasolSwingDash", // 131, 0x83
  "HarisenSwing1", // 132, 0x84
  "HarisenSwing3", // 133, 0x85
  "HarisenSwing4", // 134, 0x86
  "HarisenSwingDash", // 135, 0x87
  "StarRodSwing1", // 136, 0x88
  "StarRodSwing3", // 137, 0x89
  "StarRodSwing4", // 138, 0x8a
  "StarRodSwingDash", // 139, 0x8b
  "LipStickSwing1", // 140, 0x8c
  "LipStickSwing3", // 141, 0x8d
  "LipStickSwing4", // 142, 0x8e
  "LipStickSwingDash", // 143, 0x8f
  "ItemParasolOpen", // 144, 0x90
  "ItemParasolFall", // 145, 0x91
  "ItemParasolFallSpecial", // 146, 0x92
  "ItemParasolDamageFall", // 147, 0x93
  "LGunShoot", // 148, 0x94
  "LGunShootAir", // 149, 0x95
  "LGunShootEmpty", // 150, 0x96
  "LGunShootAirEmpty", // 151, 0x97
  "FireFlowerShoot", // 152, 0x98
  "FireFlowerShootAir", // 153, 0x99
  "ItemScrew", // 154, 0x9a
  "ItemScrewAir", // 155, 0x9b
  "DamageScrew", // 156, 0x9c
  "DamageScrewAir", // 157, 0x9d
  "ItemScopeStart", // 158, 0x9e
  "ItemScopeRapid", // 159, 0x9f
  "ItemScopeFire", // 160, 0xa0
  "ItemScopeEnd", // 161, 0xa1
  "ItemScopeAirStart", // 162, 0xa2
  "ItemScopeAirRapid", // 163, 0xa3
  "ItemScopeAirFire", // 164, 0xa4
  "ItemScopeAirEnd", // 165, 0xa5
  "ItemScopeStartEmpty", // 166, 0xa6
  "ItemScopeRapidEmpty", // 167, 0xa7
  "ItemScopeFireEmpty", // 168, 0xa8
  "ItemScopeEndEmpty", // 169, 0xa9
  "ItemScopeAirStartEmpty", // 170, 0xaa
  "ItemScopeAirRapidEmpty", // 171, 0xab
  "ItemScopeAirFireEmpty", // 172, 0xac
  "ItemScopeAirEndEmpty", // 173, 0xad
  "LiftWait", // 174, 0xae
  "LiftWalk1", // 175, 0xaf
  "LiftWalk2", // 176, 0xb0
  "LiftTurn", // 177, 0xb1
  "GuardOn", // 178, 0xb2
  "Guard", // 179, 0xb3
  "GuardOff", // 180, 0xb4
  "GuardSetOff", // 181, 0xb5
  "GuardReflect", // 182, 0xb6
  "DownBoundU", // 183, 0xb7
  "DownWaitU", // 184, 0xb8
  "DownDamageU", // 185, 0xb9
  "DownStandU", // 186, 0xba
  "DownAttackU", // 187, 0xbb
  "DownFowardU", // 188, 0xbc
  "DownBackU", // 189, 0xbd
  "DownSpotU", // 190, 0xbe
  "DownBoundD", // 191, 0xbf
  "DownWaitD", // 192, 0xc0
  "DownDamageD", // 193, 0xc1
  "DownStandD", // 194, 0xc2
  "DownAttackD", // 195, 0xc3
  "DownFowardD", // 196, 0xc4
  "DownBackD", // 197, 0xc5
  "DownSpotD", // 198, 0xc6
  "Passive", // 199, 0xc7
  "PassiveStandF", // 200, 0xc8
  "PassiveStandB", // 201, 0xc9
  "PassiveWall", // 202, 0xca
  "PassiveWallJump", // 203, 0xcb
  "PassiveCeil", // 204, 0xcc
  "ShieldBreakFly", // 205, 0xcd
  "ShieldBreakFall", // 206, 0xce
  "ShieldBreakDownU", // 207, 0xcf
  "ShieldBreakDownD", // 208, 0xd0
  "ShieldBreakStandU", // 209, 0xd1
  "ShieldBreakStandD", // 210, 0xd2
  "FuraFura", // 211, 0xd3
  "Catch", // 212, 0xd4
  "CatchPull", // 213, 0xd5
  "CatchDash", // 214, 0xd6
  "CatchDashPull", // 215, 0xd7
  "CatchWait", // 216, 0xd8
  "CatchAttack", // 217, 0xd9
  "CatchCut", // 218, 0xda
  "ThrowF", // 219, 0xdb
  "ThrowB", // 220, 0xdc
  "ThrowHi", // 221, 0xdd
  "ThrowLw", // 222, 0xde
  "CapturePulledHi", // 223, 0xdf
  "CaptureWaitHi", // 224, 0xe0
  "CaptureDamageHi", // 225, 0xe1
  "CapturePulledLw", // 226, 0xe2
  "CaptureWaitLw", // 227, 0xe3
  "CaptureDamageLw", // 228, 0xe4
  "CaptureCut", // 229, 0xe5
  "CaptureJump", // 230, 0xe6
  "CaptureNeck", // 231, 0xe7
  "CaptureFoot", // 232, 0xe8
  "EscapeF", // 233, 0xe9
  "EscapeB", // 234, 0xea
  "Escape", // 235, 0xeb
  "EscapeAir", // 236, 0xec
  "ReboundStop", // 237, 0xed
  "Rebound", // 238, 0xee
  "ThrownF", // 239, 0xef
  "ThrownB", // 240, 0xf0
  "ThrownHi", // 241, 0xf1
  "ThrownLw", // 242, 0xf2
  "ThrownLwWomen", // 243, 0xf3
  "Pass", // 244, 0xf4
  "Ottotto", // 245, 0xf5
  "OttottoWait", // 246, 0xf6
  "FlyReflectWall", // 247, 0xf7
  "FlyReflectCeil", // 248, 0xf8
  "StopWall", // 249, 0xf9
  "StopCeil", // 250, 0xfa
  "MissFoot", // 251, 0xfb
  "CliffCatch", // 252, 0xfc
  "CliffWait", // 253, 0xfd
  "CliffClimbSlow", // 254, 0xfe
  "CliffClimbQuick", // 255, 0xff
  "CliffAttackSlow", // 256, 0x100
  "CliffAttackQuick", // 257, 0x101
  "CliffEscapeSlow", // 258, 0x102
  "CliffEscapeQuick", // 259, 0x103
  "CliffJumpSlow1", // 260, 0x104
  "CliffJumpSlow2", // 261, 0x105
  "CliffJumpQuick1", // 262, 0x106
  "CliffJumpQuick2", // 263, 0x107
  "AppealR", // 264, 0x108
  "AppealL", // 265, 0x109
  "ShoulderedWait", // 266, 0x10a
  "ShoulderedWalkSlow", // 267, 0x10b
  "ShoulderedWalkMiddle", // 268, 0x10c
  "ShoulderedWalkFast", // 269, 0x10d
  "ShoulderedTurn", // 270, 0x10e
  "ThrownFF", // 271, 0x10f
  "ThrownFB", // 272, 0x110
  "ThrownFHi", // 273, 0x111
  "ThrownFLw", // 274, 0x112
  "CaptureCaptain", // 275, 0x113
  "CaptureYoshi", // 276, 0x114
  "YoshiEgg", // 277, 0x115
  "CaptureKoopa", // 278, 0x116
  "CaptureDamageKoopa", // 279, 0x117
  "CaptureWaitKoopa", // 280, 0x118
  "ThrownKoopaF", // 281, 0x119
  "ThrownKoopaB", // 282, 0x11a
  "CaptureKoopaAir", // 283, 0x11b
  "CaptureDamageKoopaAir", // 284, 0x11c
  "CaptureWaitKoopaAir", // 285, 0x11d
  "ThrownKoopaAirF", // 286, 0x11e
  "ThrownKoopaAirB", // 287, 0x11f
  "CaptureKirby", // 288, 0x120
  "CaptureWaitKirby", // 289, 0x121
  "ThrownKirbyStar", // 290, 0x122
  "ThrownCopyStar", // 291, 0x123
  "ThrownKirby", // 292, 0x124
  "BarrelWait", // 293, 0x125
  "Bury", // 294, 0x126
  "BuryWait", // 295, 0x127
  "BuryJump", // 296, 0x128
  "DamageSong", // 297, 0x129
  "DamageSongWait", // 298, 0x12a
  "DamageSongRv", // 299, 0x12b
  "DamageBind", // 300, 0x12c
  "CaptureMewtwo", // 301, 0x12d
  "CaptureMewtwoAir", // 302, 0x12e
  "ThrownMewtwo", // 303, 0x12f
  "ThrownMewtwoAir", // 304, 0x130
  "WarpStarJump", // 305, 0x131
  "WarpStarFall", // 306, 0x132
  "HammerWait", // 307, 0x133
  "HammerWalk", // 308, 0x134
  "HammerTurn", // 309, 0x135
  "HammerKneeBend", // 310, 0x136
  "HammerFall", // 311, 0x137
  "HammerJump", // 312, 0x138
  "HammerLanding", // 313, 0x139
  "KinokoGiantStart", // 314, 0x13a
  "KinokoGiantStartAir", // 315, 0x13b
  "KinokoGiantEnd", // 316, 0x13c
  "KinokoGiantEndAir", // 317, 0x13d
  "KinokoSmallStart", // 318, 0x13e
  "KinokoSmallStartAir", // 319, 0x13f
  "KinokoSmallEnd", // 320, 0x140
  "KinokoSmallEndAir", // 321, 0x141
  "Entry", // 322, 0x142
  "EntryStart", // 323, 0x143
  "EntryEnd", // 324, 0x144
  "DamageIce", // 325, 0x145
  "DamageIceJump", // 326, 0x146
  "CaptureMasterhand", // 327, 0x147
  "CapturedamageMasterhand", // 328, 0x148
  "CapturewaitMasterhand", // 329, 0x149
  "ThrownMasterhand", // 330, 0x14a
  "CaptureKirbyYoshi", // 331, 0x14b
  "KirbyYoshiEgg", // 332, 0x14c
  "CaptureLeadead", // 333, 0x14d
  "CaptureLikelike", // 334, 0x14e
  "DownReflect", // 335, 0x14f
  "CaptureCrazyhand", // 336, 0x150
  "CapturedamageCrazyhand", // 337, 0x151
  "CapturewaitCrazyhand", // 338, 0x152
  "ThrownCrazyhand", // 339, 0x153
  "BarrelCannonWait", // 340, 0x154
] as const;
export type ActionName = typeof actionNameById[number];

/**
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const attackNamesById = [
  "None", // 0, 0x00
  "Non-Staling", // 1, 0x01
  "Jab 1", // 2, 0x02
  "Jab 2", // 3, 0x03
  "Jab 3", // 4, 0x04
  "Rapid Jabs", // 5, 0x05
  "Dash Attack", // 6, 0x06
  "Side Tilt", // 7, 0x07
  "Up Tilt", // 8, 0x08
  "Down Tilt", // 9, 0x09
  "Side Smash", // 10, 0x0A
  "Up Smash", // 11, 0x0B
  "Down Smash", // 12, 0x0C
  "Nair", // 13, 0x0D
  "Fair", // 14, 0x0E
  "Bair", // 15, 0x0F
  "Uair", // 16, 0x10
  "Dair", // 17, 0x11
  "Neutral Special", // 18, 0x12
  "Side Special", // 19, 0x13
  "Up Special", // 20, 0x14
  "Down Special", // 21, 0x15
  "Kirby Hat: Mario Neutral Special", // 22, 0x16
  "Kirby Hat: Fox Neutral Special", // 23, 0x17
  "Kirby Hat: CFalcon Neutral Special", // 24, 0x18
  "Kirby Hat: DK Neutral Special", // 25, 0x19
  "Kirby Hat: Bowser Neutral Special", // 26, 0x1A
  "Kirby Hat: Link Neutral Special", // 27, 0x1B
  "Kirby Hat: Sheik Neutral Special", // 28, 0x1C
  "Kirby Hat: Ness Neutral Special", // 29, 0x1D
  "Kirby Hat: Peach Neutral Special", // 30, 0x1E
  "Kirby Hat: Ice Climber Neutral Special", // 31, 0x1F
  "Kirby Hat: Pikachu Neutral Special", // 32, 0x20
  "Kirby Hat: Samus Neutral Special", // 33, 0x21
  "Kirby Hat: Yoshi Neutral Special", // 34, 0x22
  "Kirby Hat: Jigglypuff Neutral Special", // 35, 0x23
  "Kirby Hat: Mewtwo Neutral Special", // 36, 0x24
  "Kirby Hat: Luigi Neutral Special", // 37, 0x25
  "Kirby Hat: Marth Neutral Special", // 38, 0x26
  "Kirby Hat: Zelda Neutral Special", // 39, 0x27
  "Kirby Hat: Young Link Neutral Special", // 40, 0x28
  "Kirby Hat: Doc Neutral Special", // 41, 0x29
  "Kirby Hat: Falco Neutral Special", // 42, 0x2A
  "Kirby Hat: Pichu Neutral Special", // 43, 0x2B
  "Kirby Hat: Game & Watch Neutral Special", // 44, 0x2C
  "Kirby Hat: Ganon Neutral Special", // 45, 0x2D
  "Kirby Hat: Roy Neutral Special", // 46, 0x2E
  "Unknown", // 47, 0x2F
  "Unknown", // 48, 0x30
  "Unknown", // 49, 0x31
  "Get Up Attack (From Back)", // 50, 0x32
  "Get Up Attack (From Front)", // 51, 0x33
  "Pummel", // 52, 0x34
  "Forward Throw", // 53, 0x35
  "Back Throw", // 54, 0x36
  "Up Throw", // 55, 0x37
  "Down Throw", // 56, 0x38
  "Cargo Forward Throw", // 57, 0x39
  "Cargo Back Throw", // 58, 0x3A
  "Cargo Up Throw", // 59, 0x3B
  "Cargo Down Throw", // 60, 0x3C
  "Ledge Get Up Attack 100%+", // 61, 0x3D
  "Ledge Get Up Attack", // 62, 0x3E
  "Beam Sword Jab", // 63, 0x3F
  "Beam Sword Tilt Swing", // 64, 0x40
  "Beam Sword Smash Swing", // 65, 0x41
  "Beam Sword Dash Swing", // 66, 0x42
  "Home Run Bat Jab", // 67, 0x43
  "Home Run Bat Tilt Swing", // 68, 0x44
  "Home Run Bat Smash Swing", // 69, 0x45
  "Home Run Bat Dash Swing", // 70, 0x46
  "Parasol Jab", // 71, 0x47
  "Parasol Tilt Swing", // 72, 0x48
  "Parasol Smash Swing", // 73, 0x49
  "Parasol Dash Swing", // 74, 0x4A
  "Fan Jab", // 75, 0x4B
  "Fan Tilt Swing", // 76, 0x4C
  "Fan Smash Swing", // 77, 0x4D
  "Fan Dash Swing", // 78, 0x4E
  "Star Rod Jab", // 79, 0x4F
  "Star Rod Tilt Swing", // 80, 0x50
  "Star Rod Smash Swing", // 81, 0x51
  "Star Rod Dash Swing", // 82, 0x52
  "Lip's Stick Jab", // 83, 0x53
  "Lip's Stick Tilt Swing", // 84, 0x54
  "Lip's Stick Smash Swing", // 85, 0x55
  "Lip's Stick Dash Swing", // 86, 0x56
  "Open Parasol", // 87, 0x57
  "Ray Gun Shoot", // 88, 0x58
  "Fire Flower Shoot", // 89, 0x59
  "Screw Attack", // 90, 0x5A
  "Super Scope (Rapid)", // 91, 0x5B
  "Super Scope (Charged)", // 92, 0x5C
  "Hammer", // 93, 0x5D
] as const;
export type AttackName = typeof attackNamesById[number];

/**
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const itemNamesById = [
  // Basic Items
  "Capsule", // 0x00
  "Box", // 0x01
  "Barrel (Taru)", // 0x02
  "Egg", // 0x03
  "Party Ball (Kusudama)", // 0x04
  "Barrel Cannon (TaruCann)", // 0x05
  "Bob-omb (BombHei)", // 0x06
  "Mr. Saturn (Dosei)", // 0x07
  "Heart Container", // 0x08
  "Maxim Tomato", // 0x09
  "Starman (Super Star)", // 0x0A
  "Home-Run Bat", // 0x0B
  "Beam Sword", // 0x0C
  "Parasol", // 0x0D
  "Green Shell (G Shell)", // 0x0E
  "Red Shell (R Shell)", // 0x0F
  "Ray Gun (L Gun)", // 0x10
  "Freezie (Freeze)", // 0x11
  "Food", // 0x12
  "Proximity Mine (MSBomb)", // 0x13
  "Flipper", // 0x14
  "Super Scope (S Scope)", // 0x15
  "Star Rod", // 0x16
  "Lip's Stick", // 0x17
  "Fan (Harisen)", // 0x18
  "Fire Flower (F Flower)", // 0x19
  "Super Mushroom (Kinoko)", // 0x1A
  "", // 0x1B
  "", // 0x1C
  "Warp Star (WStar)", // 0x1D
  "Screw Attack (ScBall)", // 0x1E
  "Bunny Hood (RabbitC)", // 0x1F
  "Metal Box (MetalB)", // 0x20
  "Cloaking Device (SpyCloak)", // 0x21
  "Poké Ball (M Ball)", // 0x22

  // Item Related
  "Ray Gun recoil effect", // 0x23
  "Star Rod Star", // 0x24
  "Lips Stick Dust", // 0x25
  "Super Scope Beam", // 0x26
  "Ray Gun Beam", // 0x27
  "Hammer Head", // 0x28
  "Flower", // 0x29
  "Yoshi's egg (Event)", // 0x2A

  // Monsters Part 1
  "Goomba (DKuriboh)", // 0x2B
  "Redead (Leadead)", // 0x2C
  "Octarok (Octarock)", // 0x2D
  "Ottosea", // 0x2E
  "Stone(Octarok Projectile)", // 0x2F

  // Character Related
  "Mario's fire", // 0x30
  "", // 0x31
  "Kirby's Cutter beam", // 0x32
  "Kirby's Hammer", // 0x33
  "", // 0x34
  "", // 0x35
  "Fox's Laser", // 0x36
  "Falco's Laser", // 0x37
  "Fox's shadow", // 0x38
  "Falco's shadow", // 0x39
  "Link's bomb", // 0x3A
  "Young Link's bomb", // 0x3B
  "Link's boomerang", // 0x3C
  "Young Link's boomerang", // 0x3D
  "Link's Hookshot", // 0x3E
  "Young Link's Hookshot", // 0x3F
  "Arrow", // 0x40
  "Fire Arrow", // 0x41
  "PK Fire", // 0x42
  "PK Flash", // 0x43
  "PK Flash", // 0x44
  "PK Thunder (Primary)", // 0x45
  "PK Thunder", // 0x46
  "PK Thunder", // 0x47
  "PK Thunder", // 0x48
  "PK Thunder", // 0x49
  "Fox's Blaster", // 0x4A
  "Falco's Blaster", // 0x4B
  "Link's Arrow", // 0x4C
  "Young Link's arrow", // 0x4D
  "PK Flash (explosion)", // 0x4E
  "Needle(thrown)", // 0x4F
  "Needle", // 0x50
  "Pikachu's Thunder", // 0x51
  "Pichu's Thunder", // 0x52
  "Mario's cape", // 0x53
  "Dr.Mario's cape", // 0x54
  "Smoke (Sheik)", // 0x55
  "Yoshi's egg(thrown)", // 0x56
  "Yoshi's Tongue??", // 0x57
  "Yoshi's Star", // 0x58
  "Pikachu's thunder (B)", // 0x59
  "Pikachu's thunder (B)", // 0x5A
  "Pichu's thunder (B)", // 0x5B
  "Pichu's thunder (B)", // 0x5C
  "Samus's bomb", // 0x5D
  "Samus's chargeshot", // 0x5E
  "Missile", // 0x5F
  "Grapple beam", // 0x60
  "Sheik's chain", // 0x61
  "", // 0x62
  "Turnip", // 0x63
  "Bowser's flame", // 0x64
  "Ness's bat", // 0x65
  "Yoyo", // 0x66
  "Peach's parasol", // 0x67
  "Toad", // 0x68
  "Luigi's fire", // 0x69
  "Ice(Iceclimbers)", // 0x6A
  "Blizzard", // 0x6B
  "Zelda's fire", // 0x6C
  "Zelda's fire (explosion)", // 0x6D
  "", // 0x6E
  "Toad's spore", // 0x6F
  "Mewtwo's Shadowball", // 0x70
  "Iceclimbers' UpB", // 0x71
  "Pesticide", // 0x72
  "Manhole", // 0x73
  "Fire(G&W)", // 0x74
  "Parashute", // 0x75
  "Turtle", // 0x76
  "Sperky", // 0x77
  "Judge", // 0x78
  "", // 0x79
  "Sausage", // 0x7A
  "Milk (Young Link)", // 0x7B
  "Firefighter(G&W)", // 0x7C
  "Masterhand's Laser", // 0x7D
  "Masterhand's Bullet", // 0x7E
  "Crazyhand's Laser", // 0x7F
  "Crazyhand's Bullet", // 0x80
  "Crazyhand's Bomb", // 0x81
  "Kirby copy Mario's Fire (B)", // 0x82
  "Kirby copy Dr. Mario's Capsule (B)", // 0x83
  "Kirby copy Luigi's Fire (B)", // 0x84
  "Kirby copy IceClimber's IceCube (B)", // 0x85
  "Kirby copy Peach's Toad (B)", // 0x86
  "Kirby copy Toad's Spore (B)", // 0x87
  "Kirby copy Fox's Laser (B)", // 0x88
  "Kirby copy Falco's Laser (B)", // 0x89
  "Kirby copy Fox's Blaster (B)", // 0x8A
  "Kirby copy Falco's Blaster (B)", // 0x8B
  "Kirby copy Link's Arrow (B)", // 0x8C
  "Kirby copy Young Link's Arrow (B)", // 0x8D
  "Kirby copy Link's Arrow (B)", // 0x8E
  "Kirby copy Young Link's Arrow (B)", // 0x8F
  "Kirby copy Mewtwo's Shadowball (B)", // 0x90
  "Kirby copy PK Flash (B)", // 0x91
  "Kirby copy PK Flash Explosion (B)", // 0x92
  "Kirby copy Pikachu's Thunder (B)", // 0x93
  "Kirby copy Pikachu's Thunder (B)", // 0x94
  "Kirby copy Pichu's Thunder (B)", // 0x95
  "Kirby copy Pichu's Thunder (B)", // 0x96
  "Kirby copy Samus' Chargeshot (B)", // 0x97
  "Kirby copy Sheik's Needle (thrown) (B)", // 0x98
  "Kirby copy Sheik's Needle (ground) (B)", // 0x99
  "Kirby copy Bowser's Flame (B)", // 0x9A
  "Kirby copy Mr. Game & Watch's Sausage (B)", // 0x9B
  "(unique)", // 0x9C
  "Yoshi's Tongue?? (B)", // 0x9D
  "(unique)", // 0x9E
  "Coin", // 0x9F

  // Pokemon
  "Random Pokemon", // 0xA0
  "Goldeen (Tosakinto)", // 0xA1
  "Chicorita", // 0xA2
  "Snorlax", // 0xA3
  "Blastoise", // 0xA4
  "Weezing (Matadogas)", // 0xA5
  "Charizard (Lizardon)", // 0xA6
  "Moltres", // 0xA7
  "Zapdos", // 0xA8
  "Articuno", // 0xA9
  "Wobbuffet", // 0xAA
  "Scizor", // 0xAB
  "Unown", // 0xAC
  "Entei", // 0xAD
  "Raikou", // 0xAE
  "Suicune", // 0xAF
  "Bellossom (Kireihana)", // 0xB0
  "Electrode (Marumine)", // 0xB1
  "Lugia", // 0xB2
  "Ho-oh", // 0xB3
  "Ditto (Metamon)", // 0xB4
  "Clefairy", // 0xB5
  "Togepi", // 0xB6
  "Mew", // 0xB7
  "Celebi", // 0xB8
  "Staryu (Hitodeman)", // 0xB9
  "Chansey", // 0xBA
  "Porygon2", // 0xBB
  "Cyndaquil (Hinoarashi)", // 0xBC
  "Marill", // 0xBD
  "Venusaur (Fushigibana)", // 0xBE

  // Pokemon Related
  "Chicorita's Leaf", // 0xBF
  "Blastoise's Water", // 0xC0
  "Weezing's Gas", // 0xC1
  "Weezing's Gas", // 0xC2
  "Charizard's Breath", // 0xC3
  "Charizard's Breath", // 0xC4
  "Charizard's Breath", // 0xC5
  "Charizard's Breath", // 0xC6
  "Mini-Unowns", // 0xC7
  "Lugia's Aeroblast", // 0xC8
  "Lugia's Aeroblast", // 0xC9
  "Lugia's Aeroblast", // 0xCA
  "Ho-Oh's Flame", // 0xCB
  "Staryu's Star", // 0xCC
  "Healing Egg", // 0xCD
  "Cyndaquil's Fire", // 0xCE
  "", // 0xCF

  // Monsters Part 2
  "Old Goomba (Old-Kuri)", // 0xD0
  "Target (Mato)", // 0xD1
  "Shyguy (Heiho)", // 0xD2
  "Koopa(Green) (Nokonoko)", // 0xD3
  "Koopa(Red) (PataPata)", // 0xD4
  "Likelile", // 0xD5
  "Old Redead (old-lead) [invalid]", // 0xD6
  "Old Octorok(old-octa) [invalid]", // 0xD7
  "Old Ottosea (old-otto)", // 0xD8
  "White Bear (whitebea)", // 0xD9
  "Klap", // 0xDA
  "Green Shell (zgshell)", // 0xDB
  "Red Shell (green act) (zrshell)", // 0xDC

  // Stage Specific
  "Tingle (on balloon)", // 0xDD
  "[Invalid]", // 0xDE
  "[Invalid]", // 0xDF
  "[Invalid]", // 0xE0
  "Apple", // 0xE1
  "Healing Apple", // 0xE2
  "[Invalid]", // 0xE3
  "[Invalid]", // 0xE4
  "[Invalid]", // 0xE5
  "Tool (Flatzone)", // 0xE6
  "[Invalid]", // 0xE7
  "[Invalid]", // 0xE8
  "Birdo", // 0xE9
  "Arwing Laser", // 0xEA
  "Great Fox's Laser", // 0xEB
  "Birdo's Egg", // 0xEC
] as const;
export type ItemName = typeof itemNamesById[number];
