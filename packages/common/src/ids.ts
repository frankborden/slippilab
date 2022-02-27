/**
 * Note: internal and external lists do not match.
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const characterNameByExternalId = [
  'Captain Falcon', // 0, 0x0
  'Donkey Kong',// 1, 0x1
  'Fox',// 2, 0x2
  'Mr. Game & Watch',// 3, 0x3
  'Kirby',// 4, 0x4
  'Bowser',// 5, 0x5
  'Link',// 6, 0x6
  'Luigi',// 7, 0x7
  'Mario',// 8, 0x8
  'Marth',// 9, 0x9
  'Mewtwo',// 10, 0xa
  'Ness',// 11, 0xb
  'Peach',// 12, 0xc
  'Pikachu',// 13, 0xd
  'Ice Climbers',// 14, 0xe
  'Jigglypuff',// 15, 0xf
  'Samus',// 16, 0x10
  'Yoshi',// 17, 0x11
  'Zelda',// 18, 0x12
  'Sheik',// 19, 0x13
  'Falco',// 20, 0x14
  'Young Link',// 21, 0x15
  'Dr. Mario',// 22, 0x16
  'Roy',// 23, 0x17
  'Pichu',// 24, 0x18
  'Ganondorf',// 25, 0x19
  'Master Hand',// 26, 0x1a
  'Wireframe Male',// 27, 0x1b
  'Wireframe Female',// 28, 0x1c
  'Giga Bowser',// 29, 0x1d
  'Crazy Hand',// 30, 0x1e
  'Sandbag',// 31, 0x1f
  'Popo',// 32, 0x20
] as const;
export type ExternalCharacterName = typeof characterNameByExternalId[number];

/**
 * Note: internal and external lists do not match.
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const characterNameByInternalId = [
  'Mario', // 0, 0x0
  'Fox', // 1, 0x1
  'Captain Falcon', // 2, 0x2
  'Donkey Kong', // 3, 0x3
  'Kirby', // 4, 0x4
  'Bowser', // 5, 0x5
  'Link', // 6, 0x6
  'Sheik', // 7, 0x7
  'Ness', // 8, 0x8
  'Peach', // 9, 0x9
  'Popo', // 10, 0xa
  'Nana', // 11, 0xb
  'Pikachu', // 12, 0xc
  'Samus', // 13, 0xd
  'Yoshi', // 14, 0xe
  'Jigglypuff', // 15, 0xf
  'Mewtwo', // 16, 0x10
  'Luigi', // 17, 0x11
  'Marth', // 18, 0x12
  'Zelda', // 19, 0x13
  'Young Link', // 20, 0x14
  'Dr. Mario', // 21, 0x15
  'Falco', // 22, 0x16
  'Pichu', // 23, 0x17
  'Mr. Game & Watch', // 24, 0x18
  'Ganondorf', // 25, 0x19
  'Roy', // 26, 0x1a
  'Master Hand', // 27, 0x1b
  'Crazy Hand', // 28, 0x1c
  'Wireframe Male (Boy)', // 29, 0x1d
  'Wireframe Female (Girl)', // 30, 0x1e
  'Giga Bowser', // 31, 0x1f
  'Sandbag', // 32, 0x20
] as const;
export type InternalCharacterNames = typeof characterNameByInternalId[number];

/**
 * Does not yet include single player stages (ids 33-285)
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const stageNameByExternalId = [
  'Dummy', // 0, 0x0
  'TEST', // 1, 0x1
  'Fountain of Dreams', // 2, 0x2
  'Pokémon Stadium', // 3, 0x3
  "Princess Peach's Castle", // 4, 0x4
  'Kongo Jungle', // 5, 0x5
  'Brinstar', // 6, 0x6
  'Corneria', // 7, 0x7
  "Yoshi's Story", // 8, 0x8
  'Onett', // 9, 0x9
  'Mute City', // 10, 0xa
  'Rainbow Cruise', // 11, 0xb
  'Jungle Japes', // 12, 0xc
  'Great Bay', // 13, 0xd
  'Hyrule Temple', // 14, 0xe
  'Brinstar Depths', // 15, 0xf
  "Yoshi's Island", // 16, 0x10
  'Green Greens', // 17, 0x11
  'Fourside', // 18, 0x12
  'Mushroom Kingdom I', // 19, 0x13
  'Mushroom Kingdom II', // 20, 0x14
  'Akaneia', // 21, 0x15
  'Venom', // 22, 0x16
  'Poké Floats', // 23, 0x17
  'Big Blue', // 24, 0x18
  'Icicle Mountain', // 25, 0x19
  'Icetop', // 26, 0x1a
  'Flat Zone', // 27, 0x1b
  'Dream Land N64', // 28, 0x1c
  "Yoshi's Island N64", // 29, 0x1d
  'Kongo Jungle N64', // 30, 0x1e
  'Battlefield', // 31, 0x1f
  'Final Destination', // 32, 0x20
  // TODO: Single player mode stages, goes up to 285
] as const;
export type ExternalStageName = typeof stageNameByExternalId[number];

/**
 * Does not include character-specific actions, and some characters may use
 * character-specific actions instead of normal ones. For example: Yoshi's
 * shield or Kirby's jumps. Ids 341+ are character-specific.
 * Source: https://github.com/project-slippi/slippi-wiki/blob/master/SPEC.md#melee-ids
 */
export const actionNameById = [
  'DeadDown', // 0, 0x0
  'DeadLeft', // 1, 0x1
  'DeadRight', // 2, 0x2
  'DeadUp', // 3, 0x3
  'DeadUpStar', // 4, 0x4
  'DeadUpStarIce', // 5, 0x5
  'DeadUpFall', // 6, 0x6
  'DeadUpFallHitCamera', // 7, 0x7
  'DeadUpFallHitCameraFlat', // 8, 0x8
  'DeadUpFallIce', // 9, 0x9
  'DeadUpFallHitCameraIce', // 10, 0xa
  'Sleep', // 11, 0xb
  'Rebirth', // 12, 0xc
  'RebirthWait', // 13, 0xd
  'Wait', // 14, 0xe
  'WalkSlow', // 15, 0xf
  'WalkMiddle', // 16, 0x10
  'WalkFast', // 17, 0x11
  'Turn', // 18, 0x12
  'TurnRun', // 19, 0x13
  'Dash', // 20, 0x14
  'Run', // 21, 0x15
  'RunDirect', // 22, 0x16
  'RunBrake', // 23, 0x17
  'KneeBend', // 24, 0x18
  'JumpF', // 25, 0x19
  'JumpB', // 26, 0x1a
  'JumpAerialF', // 27, 0x1b
  'JumpAerialB', // 28, 0x1c
  'Fall', // 29, 0x1d
  'FallF', // 30, 0x1e
  'FallB', // 31, 0x1f
  'FallAerial', // 32, 0x20
  'FallAerialF', // 33, 0x21
  'FallAerialB', // 34, 0x22
  'FallSpecial', // 35, 0x23
  'FallSpecialF', // 36, 0x24
  'FallSpecialB', // 37, 0x25
  'DamageFall', // 38, 0x26
  'Squat', // 39, 0x27
  'SquatWait', // 40, 0x28
  'SquatRv', // 41, 0x29
  'Landing', // 42, 0x2a
  'LandingFallSpecial', // 43, 0x2b
  'Attack11', // 44, 0x2c
  'Attack12', // 45, 0x2d
  'Attack13', // 46, 0x2e
  'Attack100Start', // 47, 0x2f
  'Attack100Loop', // 48, 0x30
  'Attack100End', // 49, 0x31
  'AttackDash', // 50, 0x32
  'AttackS3Hi', // 51, 0x33
  'AttackS3HiS', // 52, 0x34
  'AttackS3S', // 53, 0x35
  'AttackS3LwS', // 54, 0x36
  'AttackS3Lw', // 55, 0x37
  'AttackHi3', // 56, 0x38
  'AttackLw3', // 57, 0x39
  'AttackS4Hi', // 58, 0x3a
  'AttackS4HiS', // 59, 0x3b
  'AttackS4S', // 60, 0x3c
  'AttackS4LwS', // 61, 0x3d
  'AttackS4Lw', // 62, 0x3e
  'AttackHi4', // 63, 0x3f
  'AttackLw4', // 64, 0x40
  'AttackAirN', // 65, 0x41
  'AttackAirF', // 66, 0x42
  'AttackAirB', // 67, 0x43
  'AttackAirHi', // 68, 0x44
  'AttackAirLw', // 69, 0x45
  'LandingAirN', // 70, 0x46
  'LandingAirF', // 71, 0x47
  'LandingAirB', // 72, 0x48
  'LandingAirHi', // 73, 0x49
  'LandingAirLw', // 74, 0x4a
  'DamageHi1', // 75, 0x4b
  'DamageHi2', // 76, 0x4c
  'DamageHi3', // 77, 0x4d
  'DamageN1', // 78, 0x4e
  'DamageN2', // 79, 0x4f
  'DamageN3', // 80, 0x50
  'DamageLw1', // 81, 0x51
  'DamageLw2', // 82, 0x52
  'DamageLw3', // 83, 0x53
  'DamageAir1', // 84, 0x54
  'DamageAir2', // 85, 0x55
  'DamageAir3', // 86, 0x56
  'DamageFlyHi', // 87, 0x57
  'DamageFlyN', // 88, 0x58
  'DamageFlyLw', // 89, 0x59
  'DamageFlyTop', // 90, 0x5a
  'DamageFlyRoll', // 91, 0x5b
  'LightGet', // 92, 0x5c
  'HeavyGet', // 93, 0x5d
  'LightThrowF', // 94, 0x5e
  'LightThrowB', // 95, 0x5f
  'LightThrowHi', // 96, 0x60
  'LightThrowLw', // 97, 0x61
  'LightThrowDash', // 98, 0x62
  'LightThrowDrop', // 99, 0x63
  'LightThrowAirF', // 100, 0x64
  'LightThrowAirB', // 101, 0x65
  'LightThrowAirHi', // 102, 0x66
  'LightThrowAirLw', // 103, 0x67
  'HeavyThrowF', // 104, 0x68
  'HeavyThrowB', // 105, 0x69
  'HeavyThrowHi', // 106, 0x6a
  'HeavyThrowLw', // 107, 0x6b
  'LightThrowF4', // 108, 0x6c
  'LightThrowB4', // 109, 0x6d
  'LightThrowHi4', // 110, 0x6e
  'LightThrowLw4', // 111, 0x6f
  'LightThrowAirF4', // 112, 0x70
  'LightThrowAirB4', // 113, 0x71
  'LightThrowAirHi4', // 114, 0x72
  'LightThrowAirLw4', // 115, 0x73
  'HeavyThrowF4', // 116, 0x74
  'HeavyThrowB4', // 117, 0x75
  'HeavyThrowHi4', // 118, 0x76
  'HeavyThrowLw4', // 119, 0x77
  'SwordSwing1', // 120, 0x78
  'SwordSwing3', // 121, 0x79
  'SwordSwing4', // 122, 0x7a
  'SwordSwingDash', // 123, 0x7b
  'BatSwing1', // 124, 0x7c
  'BatSwing3', // 125, 0x7d
  'BatSwing4', // 126, 0x7e
  'BatSwingDash', // 127, 0x7f
  'ParasolSwing1', // 128, 0x80
  'ParasolSwing3', // 129, 0x81
  'ParasolSwing4', // 130, 0x82
  'ParasolSwingDash', // 131, 0x83
  'HarisenSwing1', // 132, 0x84
  'HarisenSwing3', // 133, 0x85
  'HarisenSwing4', // 134, 0x86
  'HarisenSwingDash', // 135, 0x87
  'StarRodSwing1', // 136, 0x88
  'StarRodSwing3', // 137, 0x89
  'StarRodSwing4', // 138, 0x8a
  'StarRodSwingDash', // 139, 0x8b
  'LipStickSwing1', // 140, 0x8c
  'LipStickSwing3', // 141, 0x8d
  'LipStickSwing4', // 142, 0x8e
  'LipStickSwingDash', // 143, 0x8f
  'ItemParasolOpen', // 144, 0x90
  'ItemParasolFall', // 145, 0x91
  'ItemParasolFallSpecial', // 146, 0x92
  'ItemParasolDamageFall', // 147, 0x93
  'LGunShoot', // 148, 0x94
  'LGunShootAir', // 149, 0x95
  'LGunShootEmpty', // 150, 0x96
  'LGunShootAirEmpty', // 151, 0x97
  'FireFlowerShoot', // 152, 0x98
  'FireFlowerShootAir', // 153, 0x99
  'ItemScrew', // 154, 0x9a
  'ItemScrewAir', // 155, 0x9b
  'DamageScrew', // 156, 0x9c
  'DamageScrewAir', // 157, 0x9d
  'ItemScopeStart', // 158, 0x9e
  'ItemScopeRapid', // 159, 0x9f
  'ItemScopeFire', // 160, 0xa0
  'ItemScopeEnd', // 161, 0xa1
  'ItemScopeAirStart', // 162, 0xa2
  'ItemScopeAirRapid', // 163, 0xa3
  'ItemScopeAirFire', // 164, 0xa4
  'ItemScopeAirEnd', // 165, 0xa5
  'ItemScopeStartEmpty', // 166, 0xa6
  'ItemScopeRapidEmpty', // 167, 0xa7
  'ItemScopeFireEmpty', // 168, 0xa8
  'ItemScopeEndEmpty', // 169, 0xa9
  'ItemScopeAirStartEmpty', // 170, 0xaa
  'ItemScopeAirRapidEmpty', // 171, 0xab
  'ItemScopeAirFireEmpty', // 172, 0xac
  'ItemScopeAirEndEmpty', // 173, 0xad
  'LiftWait', // 174, 0xae
  'LiftWalk1', // 175, 0xaf
  'LiftWalk2', // 176, 0xb0
  'LiftTurn', // 177, 0xb1
  'GuardOn', // 178, 0xb2
  'Guard', // 179, 0xb3
  'GuardOff', // 180, 0xb4
  'GuardSetOff', // 181, 0xb5
  'GuardReflect', // 182, 0xb6
  'DownBoundU', // 183, 0xb7
  'DownWaitU', // 184, 0xb8
  'DownDamageU', // 185, 0xb9
  'DownStandU', // 186, 0xba
  'DownAttackU', // 187, 0xbb
  'DownFowardU', // 188, 0xbc
  'DownBackU', // 189, 0xbd
  'DownSpotU', // 190, 0xbe
  'DownBoundD', // 191, 0xbf
  'DownWaitD', // 192, 0xc0
  'DownDamageD', // 193, 0xc1
  'DownStandD', // 194, 0xc2
  'DownAttackD', // 195, 0xc3
  'DownFowardD', // 196, 0xc4
  'DownBackD', // 197, 0xc5
  'DownSpotD', // 198, 0xc6
  'Passive', // 199, 0xc7
  'PassiveStandF', // 200, 0xc8
  'PassiveStandB', // 201, 0xc9
  'PassiveWall', // 202, 0xca
  'PassiveWallJump', // 203, 0xcb
  'PassiveCeil', // 204, 0xcc
  'ShieldBreakFly', // 205, 0xcd
  'ShieldBreakFall', // 206, 0xce
  'ShieldBreakDownU', // 207, 0xcf
  'ShieldBreakDownD', // 208, 0xd0
  'ShieldBreakStandU', // 209, 0xd1
  'ShieldBreakStandD', // 210, 0xd2
  'FuraFura', // 211, 0xd3
  'Catch', // 212, 0xd4
  'CatchPull', // 213, 0xd5
  'CatchDash', // 214, 0xd6
  'CatchDashPull', // 215, 0xd7
  'CatchWait', // 216, 0xd8
  'CatchAttack', // 217, 0xd9
  'CatchCut', // 218, 0xda
  'ThrowF', // 219, 0xdb
  'ThrowB', // 220, 0xdc
  'ThrowHi', // 221, 0xdd
  'ThrowLw', // 222, 0xde
  'CapturePulledHi', // 223, 0xdf
  'CaptureWaitHi', // 224, 0xe0
  'CaptureDamageHi', // 225, 0xe1
  'CapturePulledLw', // 226, 0xe2
  'CaptureWaitLw', // 227, 0xe3
  'CaptureDamageLw', // 228, 0xe4
  'CaptureCut', // 229, 0xe5
  'CaptureJump', // 230, 0xe6
  'CaptureNeck', // 231, 0xe7
  'CaptureFoot', // 232, 0xe8
  'EscapeF', // 233, 0xe9
  'EscapeB', // 234, 0xea
  'Escape', // 235, 0xeb
  'EscapeAir', // 236, 0xec
  'ReboundStop', // 237, 0xed
  'Rebound', // 238, 0xee
  'ThrownF', // 239, 0xef
  'ThrownB', // 240, 0xf0
  'ThrownHi', // 241, 0xf1
  'ThrownLw', // 242, 0xf2
  'ThrownLwWomen', // 243, 0xf3
  'Pass', // 244, 0xf4
  'Ottotto', // 245, 0xf5
  'OttottoWait', // 246, 0xf6
  'FlyReflectWall', // 247, 0xf7
  'FlyReflectCeil', // 248, 0xf8
  'StopWall', // 249, 0xf9
  'StopCeil', // 250, 0xfa
  'MissFoot', // 251, 0xfb
  'CliffCatch', // 252, 0xfc
  'CliffWait', // 253, 0xfd
  'CliffClimbSlow', // 254, 0xfe
  'CliffClimbQuick', // 255, 0xff
  'CliffAttackSlow', // 256, 0x100
  'CliffAttackQuick', // 257, 0x101
  'CliffEscapeSlow', // 258, 0x102
  'CliffEscapeQuick', // 259, 0x103
  'CliffJumpSlow1', // 260, 0x104
  'CliffJumpSlow2', // 261, 0x105
  'CliffJumpQuick1', // 262, 0x106
  'CliffJumpQuick2', // 263, 0x107
  'AppealR', // 264, 0x108
  'AppealL', // 265, 0x109
  'ShoulderedWait', // 266, 0x10a
  'ShoulderedWalkSlow', // 267, 0x10b
  'ShoulderedWalkMiddle', // 268, 0x10c
  'ShoulderedWalkFast', // 269, 0x10d
  'ShoulderedTurn', // 270, 0x10e
  'ThrownFF', // 271, 0x10f
  'ThrownFB', // 272, 0x110
  'ThrownFHi', // 273, 0x111
  'ThrownFLw', // 274, 0x112
  'CaptureCaptain', // 275, 0x113
  'CaptureYoshi', // 276, 0x114
  'YoshiEgg', // 277, 0x115
  'CaptureKoopa', // 278, 0x116
  'CaptureDamageKoopa', // 279, 0x117
  'CaptureWaitKoopa', // 280, 0x118
  'ThrownKoopaF', // 281, 0x119
  'ThrownKoopaB', // 282, 0x11a
  'CaptureKoopaAir', // 283, 0x11b
  'CaptureDamageKoopaAir', // 284, 0x11c
  'CaptureWaitKoopaAir', // 285, 0x11d
  'ThrownKoopaAirF', // 286, 0x11e
  'ThrownKoopaAirB', // 287, 0x11f
  'CaptureKirby', // 288, 0x120
  'CaptureWaitKirby', // 289, 0x121
  'ThrownKirbyStar', // 290, 0x122
  'ThrownCopyStar', // 291, 0x123
  'ThrownKirby', // 292, 0x124
  'BarrelWait', // 293, 0x125
  'Bury', // 294, 0x126
  'BuryWait', // 295, 0x127
  'BuryJump', // 296, 0x128
  'DamageSong', // 297, 0x129
  'DamageSongWait', // 298, 0x12a
  'DamageSongRv', // 299, 0x12b
  'DamageBind', // 300, 0x12c
  'CaptureMewtwo', // 301, 0x12d
  'CaptureMewtwoAir', // 302, 0x12e
  'ThrownMewtwo', // 303, 0x12f
  'ThrownMewtwoAir', // 304, 0x130
  'WarpStarJump', // 305, 0x131
  'WarpStarFall', // 306, 0x132
  'HammerWait', // 307, 0x133
  'HammerWalk', // 308, 0x134
  'HammerTurn', // 309, 0x135
  'HammerKneeBend', // 310, 0x136
  'HammerFall', // 311, 0x137
  'HammerJump', // 312, 0x138
  'HammerLanding', // 313, 0x139
  'KinokoGiantStart', // 314, 0x13a
  'KinokoGiantStartAir', // 315, 0x13b
  'KinokoGiantEnd', // 316, 0x13c
  'KinokoGiantEndAir', // 317, 0x13d
  'KinokoSmallStart', // 318, 0x13e
  'KinokoSmallStartAir', // 319, 0x13f
  'KinokoSmallEnd', // 320, 0x140
  'KinokoSmallEndAir', // 321, 0x141
  'Entry', // 322, 0x142
  'EntryStart', // 323, 0x143
  'EntryEnd', // 324, 0x144
  'DamageIce', // 325, 0x145
  'DamageIceJump', // 326, 0x146
  'CaptureMasterhand', // 327, 0x147
  'CapturedamageMasterhand', // 328, 0x148
  'CapturewaitMasterhand', // 329, 0x149
  'ThrownMasterhand', // 330, 0x14a
  'CaptureKirbyYoshi', // 331, 0x14b
  'KirbyYoshiEgg', // 332, 0x14c
  'CaptureLeadead', // 333, 0x14d
  'CaptureLikelike', // 334, 0x14e
  'DownReflect', // 335, 0x14f
  'CaptureCrazyhand', // 336, 0x150
  'CapturedamageCrazyhand', // 337, 0x151
  'CapturewaitCrazyhand', // 338, 0x152
  'ThrownCrazyhand', // 339, 0x153
  'BarrelCannonWait', // 340, 0x154
] as const;
export type ActionName = typeof actionNameById[number];
