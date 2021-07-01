import _, { forEach } from 'lodash';
import { EventEmitter } from 'events';
import fs from 'fs';
import moment from 'moment';
import { Writable } from 'stream';
import net from 'net';
import inject from 'reconnect-core';
import { decode, encode } from '@shelacek/ubjson';
import iconv from 'iconv-lite';
import path from 'path';
import semver from 'semver';

// eslint-disable-next-line
function getDeathDirection(actionStateId) {
    if (actionStateId > 0xa) {
        return null;
    }
    switch (actionStateId) {
        case 0:
            return "down";
        case 1:
            return "left";
        case 2:
            return "right";
        default:
            return "up";
    }
}

var animations = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getDeathDirection: getDeathDirection
});

var Character;
(function (Character) {
    Character[Character["CAPTAIN_FALCON"] = 0] = "CAPTAIN_FALCON";
    Character[Character["DONKEY_KONG"] = 1] = "DONKEY_KONG";
    Character[Character["FOX"] = 2] = "FOX";
    Character[Character["GAME_AND_WATCH"] = 3] = "GAME_AND_WATCH";
    Character[Character["KIRBY"] = 4] = "KIRBY";
    Character[Character["BOWSER"] = 5] = "BOWSER";
    Character[Character["LINK"] = 6] = "LINK";
    Character[Character["LUIGI"] = 7] = "LUIGI";
    Character[Character["MARIO"] = 8] = "MARIO";
    Character[Character["MARTH"] = 9] = "MARTH";
    Character[Character["MEWTWO"] = 10] = "MEWTWO";
    Character[Character["NESS"] = 11] = "NESS";
    Character[Character["PEACH"] = 12] = "PEACH";
    Character[Character["PIKACHU"] = 13] = "PIKACHU";
    Character[Character["ICE_CLIMBERS"] = 14] = "ICE_CLIMBERS";
    Character[Character["JIGGLYPUFF"] = 15] = "JIGGLYPUFF";
    Character[Character["SAMUS"] = 16] = "SAMUS";
    Character[Character["YOSHI"] = 17] = "YOSHI";
    Character[Character["ZELDA"] = 18] = "ZELDA";
    Character[Character["SHEIK"] = 19] = "SHEIK";
    Character[Character["FALCO"] = 20] = "FALCO";
    Character[Character["YOUNG_LINK"] = 21] = "YOUNG_LINK";
    Character[Character["DR_MARIO"] = 22] = "DR_MARIO";
    Character[Character["ROY"] = 23] = "ROY";
    Character[Character["PICHU"] = 24] = "PICHU";
    Character[Character["GANONDORF"] = 25] = "GANONDORF";
})(Character || (Character = {}));
var Stage;
(function (Stage) {
    Stage[Stage["FOUNTAIN_OF_DREAMS"] = 2] = "FOUNTAIN_OF_DREAMS";
    Stage[Stage["POKEMON_STADIUM"] = 3] = "POKEMON_STADIUM";
    Stage[Stage["PEACHS_CASTLE"] = 4] = "PEACHS_CASTLE";
    Stage[Stage["KONGO_JUNGLE"] = 5] = "KONGO_JUNGLE";
    Stage[Stage["BRINSTAR"] = 6] = "BRINSTAR";
    Stage[Stage["CORNERIA"] = 7] = "CORNERIA";
    Stage[Stage["YOSHIS_STORY"] = 8] = "YOSHIS_STORY";
    Stage[Stage["ONETT"] = 9] = "ONETT";
    Stage[Stage["MUTE_CITY"] = 10] = "MUTE_CITY";
    Stage[Stage["RAINBOW_CRUISE"] = 11] = "RAINBOW_CRUISE";
    Stage[Stage["JUNGLE_JAPES"] = 12] = "JUNGLE_JAPES";
    Stage[Stage["GREAT_BAY"] = 13] = "GREAT_BAY";
    Stage[Stage["HYRULE_TEMPLE"] = 14] = "HYRULE_TEMPLE";
    Stage[Stage["BRINSTAR_DEPTHS"] = 15] = "BRINSTAR_DEPTHS";
    Stage[Stage["YOSHIS_ISLAND"] = 16] = "YOSHIS_ISLAND";
    Stage[Stage["GREEN_GREENS"] = 17] = "GREEN_GREENS";
    Stage[Stage["FOURSIDE"] = 18] = "FOURSIDE";
    Stage[Stage["MUSHROOM_KINGDOM"] = 19] = "MUSHROOM_KINGDOM";
    Stage[Stage["MUSHROOM_KINGDOM_2"] = 20] = "MUSHROOM_KINGDOM_2";
    Stage[Stage["VENOM"] = 22] = "VENOM";
    Stage[Stage["POKE_FLOATS"] = 23] = "POKE_FLOATS";
    Stage[Stage["BIG_BLUE"] = 24] = "BIG_BLUE";
    Stage[Stage["ICICLE_MOUNTAIN"] = 25] = "ICICLE_MOUNTAIN";
    Stage[Stage["ICETOP"] = 26] = "ICETOP";
    Stage[Stage["FLAT_ZONE"] = 27] = "FLAT_ZONE";
    Stage[Stage["DREAMLAND"] = 28] = "DREAMLAND";
    Stage[Stage["YOSHIS_ISLAND_N64"] = 29] = "YOSHIS_ISLAND_N64";
    Stage[Stage["KONGO_JUNGLE_N64"] = 30] = "KONGO_JUNGLE_N64";
    Stage[Stage["BATTLEFIELD"] = 31] = "BATTLEFIELD";
    Stage[Stage["FINAL_DESTINATION"] = 32] = "FINAL_DESTINATION";
})(Stage || (Stage = {}));

const UnknownCharacter = {
    id: -1,
    name: "Unknown Character",
    shortName: "Unknown",
    colors: ["Default"],
};
const externalCharacters = [
    {
        id: Character.CAPTAIN_FALCON,
        name: "Captain Falcon",
        shortName: "Falcon",
        colors: ["Default", "Black", "Red", "White", "Green", "Blue"],
    },
    {
        id: Character.DONKEY_KONG,
        name: "Donkey Kong",
        shortName: "DK",
        colors: ["Default", "Black", "Red", "Blue", "Green"],
    },
    {
        id: Character.FOX,
        name: "Fox",
        shortName: "Fox",
        colors: ["Default", "Red", "Blue", "Green"],
    },
    {
        id: Character.GAME_AND_WATCH,
        name: "Mr. Game & Watch",
        shortName: "G&W",
        colors: ["Default", "Red", "Blue", "Green"],
    },
    {
        id: Character.KIRBY,
        name: "Kirby",
        shortName: "Kirby",
        colors: ["Default", "Yellow", "Blue", "Red", "Green", "White"],
    },
    {
        id: Character.BOWSER,
        name: "Bowser",
        shortName: "Bowser",
        colors: ["Default", "Red", "Blue", "Black"],
    },
    {
        id: Character.LINK,
        name: "Link",
        shortName: "Link",
        colors: ["Default", "Red", "Blue", "Black", "White"],
    },
    {
        id: Character.LUIGI,
        name: "Luigi",
        shortName: "Luigi",
        colors: ["Default", "White", "Blue", "Red"],
    },
    {
        id: Character.MARIO,
        name: "Mario",
        shortName: "Mario",
        colors: ["Default", "Yellow", "Black", "Blue", "Green"],
    },
    {
        id: Character.MARTH,
        name: "Marth",
        shortName: "Marth",
        colors: ["Default", "Red", "Green", "Black", "White"],
    },
    {
        id: Character.MEWTWO,
        name: "Mewtwo",
        shortName: "Mewtwo",
        colors: ["Default", "Red", "Blue", "Green"],
    },
    {
        id: Character.NESS,
        name: "Ness",
        shortName: "Ness",
        colors: ["Default", "Yellow", "Blue", "Green"],
    },
    {
        id: Character.PEACH,
        name: "Peach",
        shortName: "Peach",
        colors: ["Default", "Daisy", "White", "Blue", "Green"],
    },
    {
        id: Character.PIKACHU,
        name: "Pikachu",
        shortName: "Pikachu",
        colors: ["Default", "Red", "Party Hat", "Cowboy Hat"],
    },
    {
        id: Character.ICE_CLIMBERS,
        name: "Ice Climbers",
        shortName: "ICs",
        colors: ["Default", "Green", "Orange", "Red"],
    },
    {
        id: Character.JIGGLYPUFF,
        name: "Jigglypuff",
        shortName: "Puff",
        colors: ["Default", "Red", "Blue", "Headband", "Crown"],
    },
    {
        id: Character.SAMUS,
        name: "Samus",
        shortName: "Samus",
        colors: ["Default", "Pink", "Black", "Green", "Purple"],
    },
    {
        id: Character.YOSHI,
        name: "Yoshi",
        shortName: "Yoshi",
        colors: ["Default", "Red", "Blue", "Yellow", "Pink", "Cyan"],
    },
    {
        id: Character.ZELDA,
        name: "Zelda",
        shortName: "Zelda",
        colors: ["Default", "Red", "Blue", "Green", "White"],
    },
    {
        id: Character.SHEIK,
        name: "Sheik",
        shortName: "Sheik",
        colors: ["Default", "Red", "Blue", "Green", "White"],
    },
    {
        id: Character.FALCO,
        name: "Falco",
        shortName: "Falco",
        colors: ["Default", "Red", "Blue", "Green"],
    },
    {
        id: Character.YOUNG_LINK,
        name: "Young Link",
        shortName: "YLink",
        colors: ["Default", "Red", "Blue", "White", "Black"],
    },
    {
        id: Character.DR_MARIO,
        name: "Dr. Mario",
        shortName: "Doc",
        colors: ["Default", "Red", "Blue", "Green", "Black"],
    },
    {
        id: Character.ROY,
        name: "Roy",
        shortName: "Roy",
        colors: ["Default", "Red", "Blue", "Green", "Yellow"],
    },
    {
        id: Character.PICHU,
        name: "Pichu",
        shortName: "Pichu",
        colors: ["Default", "Red", "Blue", "Green"],
    },
    {
        id: Character.GANONDORF,
        name: "Ganondorf",
        shortName: "Ganon",
        colors: ["Default", "Red", "Blue", "Green", "Purple"],
    },
];
function getAllCharacters() {
    return externalCharacters;
}
function getCharacterInfo(externalCharacterId) {
    if (externalCharacterId < 0 || externalCharacterId >= externalCharacters.length) {
        return UnknownCharacter;
    }
    return externalCharacters[externalCharacterId];
}
function getCharacterShortName(externalCharacterId) {
    const character = getCharacterInfo(externalCharacterId);
    return character.shortName;
}
function getCharacterName(externalCharacterId) {
    const character = getCharacterInfo(externalCharacterId);
    return character.name;
}
// Return a human-readable color from a characterCode.
function getCharacterColorName(externalCharacterId, characterColor) {
    const character = getCharacterInfo(externalCharacterId);
    const colors = character.colors;
    return colors[characterColor];
}

var characters = /*#__PURE__*/Object.freeze({
  __proto__: null,
  UnknownCharacter: UnknownCharacter,
  getAllCharacters: getAllCharacters,
  getCharacterInfo: getCharacterInfo,
  getCharacterShortName: getCharacterShortName,
  getCharacterName: getCharacterName,
  getCharacterColorName: getCharacterColorName
});

const UnknownMove = {
    id: -1,
    name: "Unknown Move",
    shortName: "unknown",
};
const moves = {
    1: {
        // This includes all thrown items, zair, luigi's taunt, samus bombs, etc
        id: 1,
        name: "Miscellaneous",
        shortName: "misc",
    },
    2: {
        id: 2,
        name: "Jab",
        shortName: "jab",
    },
    3: {
        id: 3,
        name: "Jab",
        shortName: "jab",
    },
    4: {
        id: 4,
        name: "Jab",
        shortName: "jab",
    },
    5: {
        id: 5,
        name: "Rapid Jabs",
        shortName: "rapid-jabs",
    },
    6: {
        id: 6,
        name: "Dash Attack",
        shortName: "dash",
    },
    7: {
        id: 7,
        name: "Forward Tilt",
        shortName: "ftilt",
    },
    8: {
        id: 8,
        name: "Up Tilt",
        shortName: "utilt",
    },
    9: {
        id: 9,
        name: "Down Tilt",
        shortName: "dtilt",
    },
    10: {
        id: 10,
        name: "Forward Smash",
        shortName: "fsmash",
    },
    11: {
        id: 11,
        name: "Up Smash",
        shortName: "usmash",
    },
    12: {
        id: 12,
        name: "Down Smash",
        shortName: "dsmash",
    },
    13: {
        id: 13,
        name: "Neutral Air",
        shortName: "nair",
    },
    14: {
        id: 14,
        name: "Forward Air",
        shortName: "fair",
    },
    15: {
        id: 15,
        name: "Back Air",
        shortName: "bair",
    },
    16: {
        id: 16,
        name: "Up Air",
        shortName: "uair",
    },
    17: {
        id: 17,
        name: "Down Air",
        shortName: "dair",
    },
    18: {
        id: 18,
        name: "Neutral B",
        shortName: "neutral-b",
    },
    19: {
        id: 19,
        name: "Side B",
        shortName: "side-b",
    },
    20: {
        id: 20,
        name: "Up B",
        shortName: "up-b",
    },
    21: {
        id: 21,
        name: "Down B",
        shortName: "down-b",
    },
    50: {
        id: 50,
        name: "Getup Attack",
        shortName: "getup",
    },
    51: {
        id: 51,
        name: "Getup Attack (Slow)",
        shortName: "getup-slow",
    },
    52: {
        id: 52,
        name: "Grab Pummel",
        shortName: "pummel",
    },
    53: {
        id: 53,
        name: "Forward Throw",
        shortName: "fthrow",
    },
    54: {
        id: 54,
        name: "Back Throw",
        shortName: "bthrow",
    },
    55: {
        id: 55,
        name: "Up Throw",
        shortName: "uthrow",
    },
    56: {
        id: 56,
        name: "Down Throw",
        shortName: "dthrow",
    },
    61: {
        id: 61,
        name: "Edge Attack (Slow)",
        shortName: "edge-slow",
    },
    62: {
        id: 62,
        name: "Edge Attack",
        shortName: "edge",
    },
};
function getMoveInfo(moveId) {
    const m = moves[moveId];
    if (!m) {
        return UnknownMove;
    }
    return m;
}
function getMoveShortName(moveId) {
    const move = getMoveInfo(moveId);
    return move.shortName;
}
function getMoveName(moveId) {
    const move = getMoveInfo(moveId);
    return move.name;
}

var moves$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  UnknownMove: UnknownMove,
  getMoveInfo: getMoveInfo,
  getMoveShortName: getMoveShortName,
  getMoveName: getMoveName
});

const UnknownStage = {
    id: -1,
    name: "Unknown Stage",
};
const stages = {
    [Stage.FOUNTAIN_OF_DREAMS]: {
        id: Stage.FOUNTAIN_OF_DREAMS,
        name: "Fountain of Dreams",
    },
    [Stage.POKEMON_STADIUM]: {
        id: Stage.POKEMON_STADIUM,
        name: "Pokémon Stadium",
    },
    [Stage.PEACHS_CASTLE]: {
        id: Stage.PEACHS_CASTLE,
        name: "Princess Peach's Castle",
    },
    [Stage.KONGO_JUNGLE]: {
        id: Stage.KONGO_JUNGLE,
        name: "Kongo Jungle",
    },
    [Stage.BRINSTAR]: {
        id: Stage.BRINSTAR,
        name: "Brinstar",
    },
    [Stage.CORNERIA]: {
        id: Stage.CORNERIA,
        name: "Corneria",
    },
    [Stage.YOSHIS_STORY]: {
        id: Stage.YOSHIS_STORY,
        name: "Yoshi's Story",
    },
    [Stage.ONETT]: {
        id: Stage.ONETT,
        name: "Onett",
    },
    [Stage.MUTE_CITY]: {
        id: Stage.MUTE_CITY,
        name: "Mute City",
    },
    [Stage.RAINBOW_CRUISE]: {
        id: Stage.RAINBOW_CRUISE,
        name: "Rainbow Cruise",
    },
    [Stage.JUNGLE_JAPES]: {
        id: Stage.JUNGLE_JAPES,
        name: "Jungle Japes",
    },
    [Stage.GREAT_BAY]: {
        id: Stage.GREAT_BAY,
        name: "Great Bay",
    },
    [Stage.HYRULE_TEMPLE]: {
        id: Stage.HYRULE_TEMPLE,
        name: "Hyrule Temple",
    },
    [Stage.BRINSTAR_DEPTHS]: {
        id: Stage.BRINSTAR_DEPTHS,
        name: "Brinstar Depths",
    },
    [Stage.YOSHIS_ISLAND]: {
        id: Stage.YOSHIS_ISLAND,
        name: "Yoshi's Island",
    },
    [Stage.GREEN_GREENS]: {
        id: Stage.GREEN_GREENS,
        name: "Green Greens",
    },
    [Stage.FOURSIDE]: {
        id: Stage.FOURSIDE,
        name: "Fourside",
    },
    [Stage.MUSHROOM_KINGDOM]: {
        id: Stage.MUSHROOM_KINGDOM,
        name: "Mushroom Kingdom I",
    },
    [Stage.MUSHROOM_KINGDOM_2]: {
        id: Stage.MUSHROOM_KINGDOM_2,
        name: "Mushroom Kingdom II",
    },
    [Stage.VENOM]: {
        id: Stage.VENOM,
        name: "Venom",
    },
    [Stage.POKE_FLOATS]: {
        id: Stage.POKE_FLOATS,
        name: "Poké Floats",
    },
    [Stage.BIG_BLUE]: {
        id: Stage.BIG_BLUE,
        name: "Big Blue",
    },
    [Stage.ICICLE_MOUNTAIN]: {
        id: Stage.ICICLE_MOUNTAIN,
        name: "Icicle Mountain",
    },
    [Stage.ICETOP]: {
        id: Stage.ICETOP,
        name: "Icetop",
    },
    [Stage.FLAT_ZONE]: {
        id: Stage.FLAT_ZONE,
        name: "Flat Zone",
    },
    [Stage.DREAMLAND]: {
        id: Stage.DREAMLAND,
        name: "Dream Land N64",
    },
    [Stage.YOSHIS_ISLAND_N64]: {
        id: Stage.YOSHIS_ISLAND_N64,
        name: "Yoshi's Island N64",
    },
    [Stage.KONGO_JUNGLE_N64]: {
        id: Stage.KONGO_JUNGLE_N64,
        name: "Kongo Jungle N64",
    },
    [Stage.BATTLEFIELD]: {
        id: Stage.BATTLEFIELD,
        name: "Battlefield",
    },
    [Stage.FINAL_DESTINATION]: {
        id: Stage.FINAL_DESTINATION,
        name: "Final Destination",
    },
};
function getStageInfo(stageId) {
    const s = stages[stageId];
    if (!s) {
        return UnknownStage;
    }
    return s;
}
function getStageName(stageId) {
    const stage = getStageInfo(stageId);
    return stage.name;
}

var stages$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  UnknownStage: UnknownStage,
  getStageInfo: getStageInfo,
  getStageName: getStageName
});

var State;
(function (State) {
    // Animation ID ranges
    State[State["DAMAGE_START"] = 75] = "DAMAGE_START";
    State[State["DAMAGE_END"] = 91] = "DAMAGE_END";
    State[State["CAPTURE_START"] = 223] = "CAPTURE_START";
    State[State["CAPTURE_END"] = 232] = "CAPTURE_END";
    State[State["GUARD_START"] = 178] = "GUARD_START";
    State[State["GUARD_END"] = 182] = "GUARD_END";
    State[State["GROUNDED_CONTROL_START"] = 14] = "GROUNDED_CONTROL_START";
    State[State["GROUNDED_CONTROL_END"] = 24] = "GROUNDED_CONTROL_END";
    State[State["SQUAT_START"] = 39] = "SQUAT_START";
    State[State["SQUAT_END"] = 41] = "SQUAT_END";
    State[State["DOWN_START"] = 183] = "DOWN_START";
    State[State["DOWN_END"] = 198] = "DOWN_END";
    State[State["TECH_START"] = 199] = "TECH_START";
    State[State["TECH_END"] = 204] = "TECH_END";
    State[State["DYING_START"] = 0] = "DYING_START";
    State[State["DYING_END"] = 10] = "DYING_END";
    State[State["CONTROLLED_JUMP_START"] = 24] = "CONTROLLED_JUMP_START";
    State[State["CONTROLLED_JUMP_END"] = 34] = "CONTROLLED_JUMP_END";
    State[State["GROUND_ATTACK_START"] = 44] = "GROUND_ATTACK_START";
    State[State["GROUND_ATTACK_END"] = 64] = "GROUND_ATTACK_END";
    State[State["AERIAL_ATTACK_START"] = 65] = "AERIAL_ATTACK_START";
    State[State["AERIAL_ATTACK_END"] = 74] = "AERIAL_ATTACK_END";
    // Animation ID specific
    State[State["ROLL_FORWARD"] = 233] = "ROLL_FORWARD";
    State[State["ROLL_BACKWARD"] = 234] = "ROLL_BACKWARD";
    State[State["SPOT_DODGE"] = 235] = "SPOT_DODGE";
    State[State["AIR_DODGE"] = 236] = "AIR_DODGE";
    State[State["ACTION_WAIT"] = 14] = "ACTION_WAIT";
    State[State["ACTION_DASH"] = 20] = "ACTION_DASH";
    State[State["ACTION_KNEE_BEND"] = 24] = "ACTION_KNEE_BEND";
    State[State["GUARD_ON"] = 178] = "GUARD_ON";
    State[State["TECH_MISS_UP"] = 183] = "TECH_MISS_UP";
    State[State["TECH_MISS_DOWN"] = 191] = "TECH_MISS_DOWN";
    State[State["NEUTRAL_TECH"] = 199] = "NEUTRAL_TECH";
    State[State["FORWARD_TECH"] = 200] = "FORWARD_TECH";
    State[State["BACKWARD_TECH"] = 201] = "BACKWARD_TECH";
    State[State["WALL_TECH"] = 202] = "WALL_TECH";
    State[State["MISSED_WALL_TECH"] = 247] = "MISSED_WALL_TECH";
    State[State["DASH"] = 20] = "DASH";
    State[State["TURN"] = 18] = "TURN";
    State[State["LANDING_FALL_SPECIAL"] = 43] = "LANDING_FALL_SPECIAL";
    State[State["JUMP_FORWARD"] = 25] = "JUMP_FORWARD";
    State[State["JUMP_BACKWARD"] = 26] = "JUMP_BACKWARD";
    State[State["FALL_FORWARD"] = 30] = "FALL_FORWARD";
    State[State["FALL_BACKWARD"] = 31] = "FALL_BACKWARD";
    State[State["GRAB"] = 212] = "GRAB";
    State[State["GRAB_WAIT"] = 216] = "GRAB_WAIT";
    State[State["PUMMEL"] = 217] = "PUMMEL";
    State[State["CLIFF_CATCH"] = 252] = "CLIFF_CATCH";
    State[State["THROW_UP"] = 221] = "THROW_UP";
    State[State["THROW_FORWARD"] = 219] = "THROW_FORWARD";
    State[State["THROW_DOWN"] = 222] = "THROW_DOWN";
    State[State["THROW_BACK"] = 220] = "THROW_BACK";
    State[State["DAMAGE_FALL"] = 38] = "DAMAGE_FALL";
    // Command Grabs
    State[State["BARREL_WAIT"] = 293] = "BARREL_WAIT";
    State[State["COMMAND_GRAB_RANGE1_START"] = 266] = "COMMAND_GRAB_RANGE1_START";
    State[State["COMMAND_GRAB_RANGE1_END"] = 304] = "COMMAND_GRAB_RANGE1_END";
    State[State["COMMAND_GRAB_RANGE2_START"] = 327] = "COMMAND_GRAB_RANGE2_START";
    State[State["COMMAND_GRAB_RANGE2_END"] = 338] = "COMMAND_GRAB_RANGE2_END";
    State[State["COMMAND_GRAB_RANGE3_START"] = 375] = "COMMAND_GRAB_RANGE3_START";
    State[State["COMMAND_GRAB_RANGE3_END"] = 382] = "COMMAND_GRAB_RANGE3_END";
})(State || (State = {}));
const Timers = {
    PUNISH_RESET_FRAMES: 45,
    RECOVERY_RESET_FRAMES: 45,
    COMBO_STRING_RESET_FRAMES: 45,
};
function getSinglesPlayerPermutationsFromSettings(settings) {
    if (!settings || settings.players.length !== 2) {
        // Only return opponent indices for singles
        return [];
    }
    return [
        {
            playerIndex: settings.players[0].playerIndex,
            opponentIndex: settings.players[1].playerIndex,
        },
        {
            playerIndex: settings.players[1].playerIndex,
            opponentIndex: settings.players[0].playerIndex,
        },
    ];
}
function didLoseStock(frame, prevFrame) {
    if (!frame || !prevFrame) {
        return false;
    }
    return prevFrame.stocksRemaining - frame.stocksRemaining > 0;
}
function isInControl(state) {
    const ground = state >= State.GROUNDED_CONTROL_START && state <= State.GROUNDED_CONTROL_END;
    const squat = state >= State.SQUAT_START && state <= State.SQUAT_END;
    const groundAttack = state > State.GROUND_ATTACK_START && state <= State.GROUND_ATTACK_END;
    const isGrab = state === State.GRAB;
    // TODO: Add grounded b moves?
    return ground || squat || groundAttack || isGrab;
}
function isTeching(state) {
    return state >= State.TECH_START && state <= State.TECH_END;
}
function isDown(state) {
    return state >= State.DOWN_START && state <= State.DOWN_END;
}
function isDamaged(state) {
    return (state >= State.DAMAGE_START && state <= State.DAMAGE_END) || state === State.DAMAGE_FALL;
}
function isGrabbed(state) {
    return state >= State.CAPTURE_START && state <= State.CAPTURE_END;
}
// TODO: Find better implementation of 3 seperate ranges
function isCommandGrabbed(state) {
    return (((state >= State.COMMAND_GRAB_RANGE1_START && state <= State.COMMAND_GRAB_RANGE1_END) ||
        (state >= State.COMMAND_GRAB_RANGE2_START && state <= State.COMMAND_GRAB_RANGE2_END) ||
        (state >= State.COMMAND_GRAB_RANGE3_START && state <= State.COMMAND_GRAB_RANGE3_END)) &&
        state !== State.BARREL_WAIT);
}
function isDead(state) {
    return state >= State.DYING_START && state <= State.DYING_END;
}
function calcDamageTaken(frame, prevFrame) {
    var _a, _b;
    const percent = (_a = frame.percent) !== null && _a !== void 0 ? _a : 0;
    const prevPercent = (_b = prevFrame.percent) !== null && _b !== void 0 ? _b : 0;
    return percent - prevPercent;
}

// Frame pattern that indicates a dash dance turn was executed
const dashDanceAnimations = [State.DASH, State.TURN, State.DASH];
class ActionsComputer {
    constructor() {
        this.playerPermutations = new Array();
        this.state = new Map();
    }
    setup(settings) {
        this.state = new Map();
        this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
        this.playerPermutations.forEach((indices) => {
            const playerCounts = {
                playerIndex: indices.playerIndex,
                wavedashCount: 0,
                wavelandCount: 0,
                airDodgeCount: 0,
                dashDanceCount: 0,
                spotDodgeCount: 0,
                ledgegrabCount: 0,
                rollCount: 0,
                lCancelCount: {
                    success: 0,
                    fail: 0,
                },
                grabCount: {
                    success: 0,
                    fail: 0,
                },
                throwCount: {
                    up: 0,
                    forward: 0,
                    back: 0,
                    down: 0,
                },
                groundTechCount: {
                    backward: 0,
                    forward: 0,
                    neutral: 0,
                    fail: 0,
                },
                wallTechCount: {
                    success: 0,
                    fail: 0,
                },
            };
            const playerState = {
                playerCounts: playerCounts,
                animations: [],
            };
            this.state.set(indices, playerState);
        });
    }
    processFrame(frame) {
        this.playerPermutations.forEach((indices) => {
            const state = this.state.get(indices);
            if (state) {
                handleActionCompute(state, indices, frame);
            }
        });
    }
    fetch() {
        return Array.from(this.state.values()).map((val) => val.playerCounts);
    }
}
function didMissGroundTech(animation) {
    return animation === State.TECH_MISS_DOWN || animation === State.TECH_MISS_UP;
}
function isRolling(animation) {
    return animation === State.ROLL_BACKWARD || animation === State.ROLL_FORWARD;
}
function didStartRoll(currentAnimation, previousAnimation) {
    const isCurrentlyRolling = isRolling(currentAnimation);
    const wasPreviouslyRolling = isRolling(previousAnimation);
    return isCurrentlyRolling && !wasPreviouslyRolling;
}
function isSpotDodging(animation) {
    return animation === State.SPOT_DODGE;
}
function didStartGrabSuccess(currentAnimation, previousAnimation) {
    return previousAnimation === State.GRAB && currentAnimation <= State.GRAB_WAIT && currentAnimation > State.GRAB;
}
function didStartGrabFail(currentAnimation, previousAnimation) {
    return previousAnimation === State.GRAB && (currentAnimation > State.GRAB_WAIT || currentAnimation < State.GRAB);
}
function didStartSpotDodge(currentAnimation, previousAnimation) {
    const isCurrentlyDodging = isSpotDodging(currentAnimation);
    const wasPreviouslyDodging = isSpotDodging(previousAnimation);
    return isCurrentlyDodging && !wasPreviouslyDodging;
}
function isAirDodging(animation) {
    return animation === State.AIR_DODGE;
}
function didStartAirDodge(currentAnimation, previousAnimation) {
    const isCurrentlyDodging = isAirDodging(currentAnimation);
    const wasPreviouslyDodging = isAirDodging(previousAnimation);
    return isCurrentlyDodging && !wasPreviouslyDodging;
}
function isGrabbingLedge(animation) {
    return animation === State.CLIFF_CATCH;
}
function isAerialAttack(animation) {
    return animation >= State.AERIAL_ATTACK_START && animation <= State.AERIAL_ATTACK_END;
}
function didStartLedgegrab(currentAnimation, previousAnimation) {
    const isCurrentlyGrabbingLedge = isGrabbingLedge(currentAnimation);
    const wasPreviouslyGrabbingLedge = isGrabbingLedge(previousAnimation);
    return isCurrentlyGrabbingLedge && !wasPreviouslyGrabbingLedge;
}
function handleActionCompute(state, indices, frame) {
    const playerFrame = frame.players[indices.playerIndex].post;
    const incrementCount = (field, condition) => {
        if (!condition) {
            return;
        }
        _.update(state.playerCounts, field, (n) => n + 1);
    };
    // Manage animation state
    const currentAnimation = playerFrame.actionStateId;
    state.animations.push(currentAnimation);
    // Grab last 3 frames
    const last3Frames = state.animations.slice(-3);
    const prevAnimation = last3Frames[last3Frames.length - 2];
    const newAnimation = currentAnimation !== prevAnimation;
    // Increment counts based on conditions
    const didDashDance = _.isEqual(last3Frames, dashDanceAnimations);
    incrementCount("dashDanceCount", didDashDance);
    const didRoll = didStartRoll(currentAnimation, prevAnimation);
    incrementCount("rollCount", didRoll);
    const didSpotDodge = didStartSpotDodge(currentAnimation, prevAnimation);
    incrementCount("spotDodgeCount", didSpotDodge);
    const didAirDodge = didStartAirDodge(currentAnimation, prevAnimation);
    incrementCount("airDodgeCount", didAirDodge);
    const didGrabLedge = didStartLedgegrab(currentAnimation, prevAnimation);
    incrementCount("ledgegrabCount", didGrabLedge);
    const didGrabSucceed = didStartGrabSuccess(currentAnimation, prevAnimation);
    incrementCount("grabCount.success", didGrabSucceed);
    const didGrabFail = didStartGrabFail(currentAnimation, prevAnimation);
    incrementCount("grabCount.fail", didGrabFail);
    incrementCount("throwCount.up", currentAnimation === State.THROW_UP && newAnimation);
    incrementCount("throwCount.forward", currentAnimation === State.THROW_FORWARD && newAnimation);
    incrementCount("throwCount.down", currentAnimation === State.THROW_DOWN && newAnimation);
    incrementCount("throwCount.back", currentAnimation === State.THROW_BACK && newAnimation);
    if (newAnimation) {
        const didMissTech = didMissGroundTech(currentAnimation);
        incrementCount("groundTechCount.fail", didMissTech);
        incrementCount("groundTechCount.forward", currentAnimation === State.FORWARD_TECH);
        incrementCount("groundTechCount.neutral", currentAnimation === State.NEUTRAL_TECH);
        incrementCount("groundTechCount.backward", currentAnimation === State.BACKWARD_TECH);
        incrementCount("wallTechCount.success", currentAnimation === State.WALL_TECH);
        incrementCount("wallTechCount.fail", currentAnimation === State.MISSED_WALL_TECH);
    }
    if (isAerialAttack(currentAnimation)) {
        incrementCount("lCancelCount.success", playerFrame.lCancelStatus === 1);
        incrementCount("lCancelCount.fail", playerFrame.lCancelStatus === 2);
    }
    // Handles wavedash detection (and waveland)
    handleActionWavedash(state.playerCounts, state.animations);
}
function handleActionWavedash(counts, animations) {
    const currentAnimation = _.last(animations);
    const prevAnimation = animations[animations.length - 2];
    const isSpecialLanding = currentAnimation === State.LANDING_FALL_SPECIAL;
    const isAcceptablePrevious = isWavedashInitiationAnimation(prevAnimation);
    const isPossibleWavedash = isSpecialLanding && isAcceptablePrevious;
    if (!isPossibleWavedash) {
        return;
    }
    // Here we special landed, it might be a wavedash, let's check
    // We grab the last 8 frames here because that should be enough time to execute a
    // wavedash. This number could be tweaked if we find false negatives
    const recentFrames = animations.slice(-8);
    const recentAnimations = _.keyBy(recentFrames, (animation) => animation);
    if (_.size(recentAnimations) === 2 && recentAnimations[State.AIR_DODGE]) {
        // If the only other animation is air dodge, this might be really late to the point
        // where it was actually an air dodge. Air dodge animation is really long
        return;
    }
    if (recentAnimations[State.AIR_DODGE]) {
        // If one of the recent animations was an air dodge, let's remove that from the
        // air dodge counter, we don't want to count air dodges used to wavedash/land
        counts.airDodgeCount -= 1;
    }
    if (recentAnimations[State.ACTION_KNEE_BEND]) {
        // If a jump was started recently, we will consider this a wavedash
        counts.wavedashCount += 1;
    }
    else {
        // If there was no jump recently, this is a waveland
        counts.wavelandCount += 1;
    }
}
function isWavedashInitiationAnimation(animation) {
    if (animation === State.AIR_DODGE) {
        return true;
    }
    const isAboveMin = animation >= State.CONTROLLED_JUMP_START;
    const isBelowMax = animation <= State.CONTROLLED_JUMP_END;
    return isAboveMin && isBelowMax;
}

var ComboEvent;
(function (ComboEvent) {
    ComboEvent["COMBO_START"] = "COMBO_START";
    ComboEvent["COMBO_EXTEND"] = "COMBO_EXTEND";
    ComboEvent["COMBO_END"] = "COMBO_END";
})(ComboEvent || (ComboEvent = {}));
class ComboComputer extends EventEmitter {
    constructor() {
        super(...arguments);
        this.playerPermutations = new Array();
        this.state = new Map();
        this.combos = new Array();
        this.settings = null;
    }
    setup(settings) {
        // Reset the state
        this.settings = settings;
        this.state = new Map();
        this.combos = [];
        this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
        this.playerPermutations.forEach((indices) => {
            const playerState = {
                combo: null,
                move: null,
                resetCounter: 0,
                lastHitAnimation: null,
                event: null,
            };
            this.state.set(indices, playerState);
        });
    }
    processFrame(frame, allFrames) {
        this.playerPermutations.forEach((indices) => {
            const state = this.state.get(indices);
            if (state) {
                handleComboCompute(allFrames, state, indices, frame, this.combos);
                // Emit an event for the new combo
                if (state.event !== null) {
                    this.emit(state.event, {
                        combo: _.last(this.combos),
                        settings: this.settings,
                    });
                    state.event = null;
                }
            }
        });
    }
    fetch() {
        return this.combos;
    }
}
function handleComboCompute(frames, state, indices, frame, combos) {
    var _a, _b, _c, _d;
    const currentFrameNumber = frame.frame;
    const playerFrame = frame.players[indices.playerIndex].post;
    const opponentFrame = frame.players[indices.opponentIndex].post;
    const prevFrameNumber = currentFrameNumber - 1;
    let prevPlayerFrame = null;
    let prevOpponentFrame = null;
    if (frames[prevFrameNumber]) {
        prevPlayerFrame = frames[prevFrameNumber].players[indices.playerIndex].post;
        prevOpponentFrame = frames[prevFrameNumber].players[indices.opponentIndex].post;
    }
    const oppActionStateId = opponentFrame.actionStateId;
    const opntIsDamaged = isDamaged(oppActionStateId);
    const opntIsGrabbed = isGrabbed(oppActionStateId);
    const opntIsCommandGrabbed = isCommandGrabbed(oppActionStateId);
    const opntDamageTaken = prevOpponentFrame ? calcDamageTaken(opponentFrame, prevOpponentFrame) : 0;
    // Keep track of whether actionState changes after a hit. Used to compute move count
    // When purely using action state there was a bug where if you did two of the same
    // move really fast (such as ganon's jab), it would count as one move. Added
    // the actionStateCounter at this point which counts the number of frames since
    // an animation started. Should be more robust, for old files it should always be
    // null and null < null = false
    const actionChangedSinceHit = playerFrame.actionStateId !== state.lastHitAnimation;
    const actionCounter = playerFrame.actionStateCounter;
    const prevActionCounter = prevPlayerFrame ? prevPlayerFrame.actionStateCounter : 0;
    const actionFrameCounterReset = actionCounter < prevActionCounter;
    if (actionChangedSinceHit || actionFrameCounterReset) {
        state.lastHitAnimation = null;
    }
    // If opponent took damage and was put in some kind of stun this frame, either
    // start a combo or count the moves for the existing combo
    if (opntIsDamaged || opntIsGrabbed || opntIsCommandGrabbed) {
        let comboStarted = false;
        if (!state.combo) {
            state.combo = {
                playerIndex: indices.opponentIndex,
                startFrame: currentFrameNumber,
                endFrame: null,
                startPercent: prevOpponentFrame ? (_a = prevOpponentFrame.percent) !== null && _a !== void 0 ? _a : 0 : 0,
                currentPercent: (_b = opponentFrame.percent) !== null && _b !== void 0 ? _b : 0,
                endPercent: null,
                moves: [],
                didKill: false,
                lastHitBy: indices.playerIndex,
            };
            combos.push(state.combo);
            // Track whether this is a new combo or not
            comboStarted = true;
        }
        if (opntDamageTaken) {
            // If animation of last hit has been cleared that means this is a new move. This
            // prevents counting multiple hits from the same move such as fox's drill
            if (state.lastHitAnimation === null) {
                state.move = {
                    playerIndex: indices.playerIndex,
                    frame: currentFrameNumber,
                    moveId: playerFrame.lastAttackLanded,
                    hitCount: 0,
                    damage: 0,
                };
                state.combo.moves.push(state.move);
                // Make sure we don't overwrite the START event
                if (!comboStarted) {
                    state.event = ComboEvent.COMBO_EXTEND;
                }
            }
            if (state.move) {
                state.move.hitCount += 1;
                state.move.damage += opntDamageTaken;
            }
            // Store previous frame animation to consider the case of a trade, the previous
            // frame should always be the move that actually connected... I hope
            state.lastHitAnimation = prevPlayerFrame ? prevPlayerFrame.actionStateId : null;
        }
        if (comboStarted) {
            state.event = ComboEvent.COMBO_START;
        }
    }
    if (!state.combo) {
        // The rest of the function handles combo termination logic, so if we don't
        // have a combo started, there is no need to continue
        return;
    }
    const opntIsTeching = isTeching(oppActionStateId);
    const opntIsDowned = isDown(oppActionStateId);
    const opntDidLoseStock = prevOpponentFrame && didLoseStock(opponentFrame, prevOpponentFrame);
    const opntIsDying = isDead(oppActionStateId);
    // Update percent if opponent didn't lose stock
    if (!opntDidLoseStock) {
        state.combo.currentPercent = (_c = opponentFrame.percent) !== null && _c !== void 0 ? _c : 0;
    }
    if (opntIsDamaged || opntIsGrabbed || opntIsCommandGrabbed || opntIsTeching || opntIsDowned || opntIsDying) {
        // If opponent got grabbed or damaged, reset the reset counter
        state.resetCounter = 0;
    }
    else {
        state.resetCounter += 1;
    }
    let shouldTerminate = false;
    // Termination condition 1 - player kills opponent
    if (opntDidLoseStock) {
        state.combo.didKill = true;
        shouldTerminate = true;
    }
    // Termination condition 2 - combo resets on time
    if (state.resetCounter > Timers.COMBO_STRING_RESET_FRAMES) {
        shouldTerminate = true;
    }
    // If combo should terminate, mark the end states and add it to list
    if (shouldTerminate) {
        state.combo.endFrame = playerFrame.frame;
        state.combo.endPercent = prevOpponentFrame ? (_d = prevOpponentFrame.percent) !== null && _d !== void 0 ? _d : 0 : 0;
        state.event = ComboEvent.COMBO_END;
        state.combo = null;
        state.move = null;
    }
}

class ConversionComputer extends EventEmitter {
    constructor() {
        super();
        this.playerPermutations = new Array();
        this.conversions = new Array();
        this.state = new Map();
        this.settings = null;
        this.metadata = {
            lastEndFrameByOppIdx: {},
        };
    }
    setup(settings) {
        // Reset the state
        this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
        this.conversions = [];
        this.state = new Map();
        this.metadata = {
            lastEndFrameByOppIdx: {},
        };
        this.settings = settings;
        this.playerPermutations.forEach((indices) => {
            const playerState = {
                conversion: null,
                move: null,
                resetCounter: 0,
                lastHitAnimation: null,
            };
            this.state.set(indices, playerState);
        });
    }
    processFrame(frame, allFrames) {
        this.playerPermutations.forEach((indices) => {
            const state = this.state.get(indices);
            if (state) {
                const terminated = handleConversionCompute(allFrames, state, indices, frame, this.conversions);
                if (terminated) {
                    this.emit("CONVERSION", {
                        combo: _.last(this.conversions),
                        settings: this.settings,
                    });
                }
            }
        });
    }
    fetch() {
        this._populateConversionTypes();
        return this.conversions;
    }
    _populateConversionTypes() {
        // Post-processing step: set the openingTypes
        const conversionsToHandle = _.filter(this.conversions, (conversion) => {
            return conversion.openingType === "unknown";
        });
        // Group new conversions by startTime and sort
        const sortedConversions = _.chain(conversionsToHandle)
            .groupBy("startFrame")
            .orderBy((conversions) => _.get(conversions, [0, "startFrame"]))
            .value();
        // Set the opening types on the conversions we need to handle
        sortedConversions.forEach((conversions) => {
            const isTrade = conversions.length >= 2;
            conversions.forEach((conversion) => {
                // Set end frame for this conversion
                this.metadata.lastEndFrameByOppIdx[conversion.playerIndex] = conversion.endFrame;
                if (isTrade) {
                    // If trade, just short-circuit
                    conversion.openingType = "trade";
                    return;
                }
                // If not trade, check the opponent endFrame
                const lastMove = _.last(conversion.moves);
                const oppEndFrame = this.metadata.lastEndFrameByOppIdx[lastMove ? lastMove.playerIndex : conversion.playerIndex];
                const isCounterAttack = oppEndFrame && oppEndFrame > conversion.startFrame;
                conversion.openingType = isCounterAttack ? "counter-attack" : "neutral-win";
            });
        });
    }
}
function handleConversionCompute(frames, state, indices, frame, conversions) {
    var _a, _b, _c, _d;
    const currentFrameNumber = frame.frame;
    const playerFrame = frame.players[indices.playerIndex].post;
    const opponentFrame = frame.players[indices.opponentIndex].post;
    const prevFrameNumber = currentFrameNumber - 1;
    let prevPlayerFrame = null;
    let prevOpponentFrame = null;
    if (frames[prevFrameNumber]) {
        prevPlayerFrame = frames[prevFrameNumber].players[indices.playerIndex].post;
        prevOpponentFrame = frames[prevFrameNumber].players[indices.opponentIndex].post;
    }
    const oppActionStateId = opponentFrame.actionStateId;
    const opntIsDamaged = isDamaged(oppActionStateId);
    const opntIsGrabbed = isGrabbed(oppActionStateId);
    const opntIsCommandGrabbed = isCommandGrabbed(oppActionStateId);
    const opntDamageTaken = prevOpponentFrame ? calcDamageTaken(opponentFrame, prevOpponentFrame) : 0;
    // Keep track of whether actionState changes after a hit. Used to compute move count
    // When purely using action state there was a bug where if you did two of the same
    // move really fast (such as ganon's jab), it would count as one move. Added
    // the actionStateCounter at this point which counts the number of frames since
    // an animation started. Should be more robust, for old files it should always be
    // null and null < null = false
    const actionChangedSinceHit = playerFrame.actionStateId !== state.lastHitAnimation;
    const actionCounter = playerFrame.actionStateCounter;
    const prevActionCounter = prevPlayerFrame ? prevPlayerFrame.actionStateCounter : 0;
    const actionFrameCounterReset = actionCounter < prevActionCounter;
    if (actionChangedSinceHit || actionFrameCounterReset) {
        state.lastHitAnimation = null;
    }
    // If opponent took damage and was put in some kind of stun this frame, either
    // start a conversion or
    if (opntIsDamaged || opntIsGrabbed || opntIsCommandGrabbed) {
        if (!state.conversion) {
            state.conversion = {
                playerIndex: indices.opponentIndex,
                lastHitBy: indices.playerIndex,
                startFrame: currentFrameNumber,
                endFrame: null,
                startPercent: prevOpponentFrame ? (_a = prevOpponentFrame.percent) !== null && _a !== void 0 ? _a : 0 : 0,
                currentPercent: (_b = opponentFrame.percent) !== null && _b !== void 0 ? _b : 0,
                endPercent: null,
                moves: [],
                didKill: false,
                openingType: "unknown",
            };
            conversions.push(state.conversion);
        }
        if (opntDamageTaken) {
            // If animation of last hit has been cleared that means this is a new move. This
            // prevents counting multiple hits from the same move such as fox's drill
            if (state.lastHitAnimation === null) {
                state.move = {
                    playerIndex: indices.playerIndex,
                    frame: currentFrameNumber,
                    moveId: playerFrame.lastAttackLanded,
                    hitCount: 0,
                    damage: 0,
                };
                state.conversion.moves.push(state.move);
            }
            if (state.move) {
                state.move.hitCount += 1;
                state.move.damage += opntDamageTaken;
            }
            // Store previous frame animation to consider the case of a trade, the previous
            // frame should always be the move that actually connected... I hope
            state.lastHitAnimation = prevPlayerFrame ? prevPlayerFrame.actionStateId : null;
        }
    }
    if (!state.conversion) {
        // The rest of the function handles conversion termination logic, so if we don't
        // have a conversion started, there is no need to continue
        return false;
    }
    const opntInControl = isInControl(oppActionStateId);
    const opntDidLoseStock = prevOpponentFrame && didLoseStock(opponentFrame, prevOpponentFrame);
    // Update percent if opponent didn't lose stock
    if (!opntDidLoseStock) {
        state.conversion.currentPercent = (_c = opponentFrame.percent) !== null && _c !== void 0 ? _c : 0;
    }
    if (opntIsDamaged || opntIsGrabbed || opntIsCommandGrabbed) {
        // If opponent got grabbed or damaged, reset the reset counter
        state.resetCounter = 0;
    }
    const shouldStartResetCounter = state.resetCounter === 0 && opntInControl;
    const shouldContinueResetCounter = state.resetCounter > 0;
    if (shouldStartResetCounter || shouldContinueResetCounter) {
        // This will increment the reset timer under the following conditions:
        // 1) if we were punishing opponent but they have now entered an actionable state
        // 2) if counter has already started counting meaning opponent has entered actionable state
        state.resetCounter += 1;
    }
    let shouldTerminate = false;
    // Termination condition 1 - player kills opponent
    if (opntDidLoseStock) {
        state.conversion.didKill = true;
        shouldTerminate = true;
    }
    // Termination condition 2 - conversion resets on time
    if (state.resetCounter > Timers.PUNISH_RESET_FRAMES) {
        shouldTerminate = true;
    }
    // If conversion should terminate, mark the end states and add it to list
    if (shouldTerminate) {
        state.conversion.endFrame = playerFrame.frame;
        state.conversion.endPercent = prevOpponentFrame ? (_d = prevOpponentFrame.percent) !== null && _d !== void 0 ? _d : 0 : 0;
        state.conversion = null;
        state.move = null;
    }
    return shouldTerminate;
}

var Command;
(function (Command) {
    Command[Command["MESSAGE_SIZES"] = 53] = "MESSAGE_SIZES";
    Command[Command["GAME_START"] = 54] = "GAME_START";
    Command[Command["PRE_FRAME_UPDATE"] = 55] = "PRE_FRAME_UPDATE";
    Command[Command["POST_FRAME_UPDATE"] = 56] = "POST_FRAME_UPDATE";
    Command[Command["GAME_END"] = 57] = "GAME_END";
    Command[Command["ITEM_UPDATE"] = 59] = "ITEM_UPDATE";
    Command[Command["FRAME_BOOKEND"] = 60] = "FRAME_BOOKEND";
})(Command || (Command = {}));
var GameMode;
(function (GameMode) {
    GameMode[GameMode["VS"] = 2] = "VS";
    GameMode[GameMode["ONLINE"] = 8] = "ONLINE";
})(GameMode || (GameMode = {}));
var Frames;
(function (Frames) {
    Frames[Frames["FIRST"] = -123] = "FIRST";
    Frames[Frames["FIRST_PLAYABLE"] = -39] = "FIRST_PLAYABLE";
})(Frames || (Frames = {}));

var JoystickRegion;
(function (JoystickRegion) {
    JoystickRegion[JoystickRegion["DZ"] = 0] = "DZ";
    JoystickRegion[JoystickRegion["NE"] = 1] = "NE";
    JoystickRegion[JoystickRegion["SE"] = 2] = "SE";
    JoystickRegion[JoystickRegion["SW"] = 3] = "SW";
    JoystickRegion[JoystickRegion["NW"] = 4] = "NW";
    JoystickRegion[JoystickRegion["N"] = 5] = "N";
    JoystickRegion[JoystickRegion["E"] = 6] = "E";
    JoystickRegion[JoystickRegion["S"] = 7] = "S";
    JoystickRegion[JoystickRegion["W"] = 8] = "W";
})(JoystickRegion || (JoystickRegion = {}));
class InputComputer {
    constructor() {
        this.state = new Map();
        this.playerPermutations = new Array();
    }
    setup(settings) {
        // Reset the state
        this.state = new Map();
        this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
        this.playerPermutations.forEach((indices) => {
            const playerState = {
                playerIndex: indices.playerIndex,
                opponentIndex: indices.opponentIndex,
                inputCount: 0,
                joystickInputCount: 0,
                cstickInputCount: 0,
                buttonInputCount: 0,
                triggerInputCount: 0,
            };
            this.state.set(indices, playerState);
        });
    }
    processFrame(frame, allFrames) {
        this.playerPermutations.forEach((indices) => {
            const state = this.state.get(indices);
            if (state) {
                handleInputCompute(allFrames, state, indices, frame);
            }
        });
    }
    fetch() {
        return Array.from(this.state.values());
    }
}
function handleInputCompute(frames, state, indices, frame) {
    const playerFrame = frame.players[indices.playerIndex].pre;
    const currentFrameNumber = playerFrame.frame;
    const prevFrameNumber = currentFrameNumber - 1;
    const prevPlayerFrame = frames[prevFrameNumber] ? frames[prevFrameNumber].players[indices.playerIndex].pre : null;
    if (currentFrameNumber < Frames.FIRST_PLAYABLE || !prevPlayerFrame) {
        // Don't count inputs until the game actually starts
        return;
    }
    // First count the number of buttons that go from 0 to 1
    // Increment action count by amount of button presses
    const invertedPreviousButtons = ~prevPlayerFrame.physicalButtons;
    const currentButtons = playerFrame.physicalButtons;
    const buttonChanges = invertedPreviousButtons & currentButtons & 0xfff;
    const newInputsPressed = countSetBits(buttonChanges);
    state.inputCount += newInputsPressed;
    state.buttonInputCount += newInputsPressed;
    // Increment action count when sticks change from one region to another.
    // Don't increment when stick returns to deadzone
    const prevAnalogRegion = getJoystickRegion(prevPlayerFrame.joystickX, prevPlayerFrame.joystickY);
    const currentAnalogRegion = getJoystickRegion(playerFrame.joystickX, playerFrame.joystickY);
    if (prevAnalogRegion !== currentAnalogRegion && currentAnalogRegion !== JoystickRegion.DZ) {
        state.inputCount += 1;
        state.joystickInputCount += 1;
    }
    // Do the same for c-stick
    const prevCstickRegion = getJoystickRegion(prevPlayerFrame.cStickX, prevPlayerFrame.cStickY);
    const currentCstickRegion = getJoystickRegion(playerFrame.cStickX, playerFrame.cStickY);
    if (prevCstickRegion !== currentCstickRegion && currentCstickRegion !== JoystickRegion.DZ) {
        state.inputCount += 1;
        state.cstickInputCount += 1;
    }
    // Increment action on analog trigger... I'm not sure when. This needs revision
    // Currently will update input count when the button gets pressed past 0.3
    // Changes from hard shield to light shield should probably count as inputs but
    // are not counted here
    if (prevPlayerFrame.physicalLTrigger < 0.3 && playerFrame.physicalLTrigger >= 0.3) {
        state.inputCount += 1;
        state.triggerInputCount += 1;
    }
    if (prevPlayerFrame.physicalRTrigger < 0.3 && playerFrame.physicalRTrigger >= 0.3) {
        state.inputCount += 1;
        state.triggerInputCount += 1;
    }
}
function countSetBits(x) {
    // This function solves the Hamming Weight problem. Effectively it counts the number of
    // bits in the input that are set to 1
    // This implementation is supposedly very efficient when most bits are zero.
    // Found: https://en.wikipedia.org/wiki/Hamming_weight#Efficient_implementation
    let bits = x;
    let count;
    for (count = 0; bits; count += 1) {
        bits &= bits - 1;
    }
    return count;
}
function getJoystickRegion(x, y) {
    let region = JoystickRegion.DZ;
    if (x >= 0.2875 && y >= 0.2875) {
        region = JoystickRegion.NE;
    }
    else if (x >= 0.2875 && y <= -0.2875) {
        region = JoystickRegion.SE;
    }
    else if (x <= -0.2875 && y <= -0.2875) {
        region = JoystickRegion.SW;
    }
    else if (x <= -0.2875 && y >= 0.2875) {
        region = JoystickRegion.NW;
    }
    else if (y >= 0.2875) {
        region = JoystickRegion.N;
    }
    else if (x >= 0.2875) {
        region = JoystickRegion.E;
    }
    else if (y <= -0.2875) {
        region = JoystickRegion.S;
    }
    else if (x <= -0.2875) {
        region = JoystickRegion.W;
    }
    return region;
}

function generateOverallStats(settings, inputs, stocks, conversions, playableFrameCount) {
    const inputsByPlayer = _.keyBy(inputs, "playerIndex");
    const originalConversions = conversions;
    const conversionsByPlayer = _.groupBy(conversions, (conv) => { var _a; return (_a = conv.moves[0]) === null || _a === void 0 ? void 0 : _a.playerIndex; });
    const conversionsByPlayerByOpening = _.mapValues(conversionsByPlayer, (conversions) => _.groupBy(conversions, "openingType"));
    const gameMinutes = playableFrameCount / 3600;
    const overall = settings.players.map((player) => {
        const playerIndex = player.playerIndex;
        const playerInputs = _.get(inputsByPlayer, playerIndex) || {};
        const inputCounts = {
            buttons: _.get(playerInputs, "buttonInputCount"),
            triggers: _.get(playerInputs, "triggerInputCount"),
            cstick: _.get(playerInputs, "cstickInputCount"),
            joystick: _.get(playerInputs, "joystickInputCount"),
            total: _.get(playerInputs, "inputCount"),
        };
        // const conversions = _.get(conversionsByPlayer, playerIndex) || [];
        // const successfulConversions = conversions.filter((conversion) => conversion.moves.length > 1);
        let conversionCount = 0;
        let successfulConversionCount = 0;
        const opponentIndices = settings.players
            .filter((opp) => {
            // We want players which aren't ourselves
            if (opp.playerIndex === playerIndex) {
                return false;
            }
            // Make sure they're not on our team either
            return !settings.isTeams || opp.teamId !== player.teamId;
        })
            .map((opp) => opp.playerIndex);
        let totalDamage = 0;
        let killCount = 0;
        // These are the conversions that we did on our opponents
        originalConversions
            // Filter down to conversions of our opponent
            .filter((conversion) => conversion.playerIndex !== playerIndex)
            .forEach((conversion) => {
            conversionCount++;
            // We killed the opponent
            if (conversion.didKill && conversion.lastHitBy === playerIndex) {
                killCount += 1;
            }
            if (conversion.moves.length > 1 && conversion.moves[0].playerIndex === playerIndex) {
                successfulConversionCount++;
            }
            conversion.moves.forEach((move) => {
                if (move.playerIndex === playerIndex) {
                    totalDamage += move.damage;
                }
            });
        });
        return {
            playerIndex: playerIndex,
            inputCounts: inputCounts,
            conversionCount: conversionCount,
            totalDamage: totalDamage,
            killCount: killCount,
            successfulConversions: getRatio(successfulConversionCount, conversionCount),
            inputsPerMinute: getRatio(inputCounts.total, gameMinutes),
            digitalInputsPerMinute: getRatio(inputCounts.buttons, gameMinutes),
            openingsPerKill: getRatio(conversionCount, killCount),
            damagePerOpening: getRatio(totalDamage, conversionCount),
            neutralWinRatio: getOpeningRatio(conversionsByPlayerByOpening, playerIndex, opponentIndices, "neutral-win"),
            counterHitRatio: getOpeningRatio(conversionsByPlayerByOpening, playerIndex, opponentIndices, "counter-attack"),
            beneficialTradeRatio: getBeneficialTradeRatio(conversionsByPlayerByOpening, playerIndex, opponentIndices),
        };
    });
    return overall;
}
function getRatio(count, total) {
    return {
        count: count,
        total: total,
        ratio: total ? count / total : null,
    };
}
function getOpeningRatio(conversionsByPlayerByOpening, playerIndex, opponentIndices, type) {
    const openings = _.get(conversionsByPlayerByOpening, [playerIndex, type]) || [];
    const opponentOpenings = _.flatten(opponentIndices.map((opponentIndex) => _.get(conversionsByPlayerByOpening, [opponentIndex, type]) || []));
    return getRatio(openings.length, openings.length + opponentOpenings.length);
}
function getBeneficialTradeRatio(conversionsByPlayerByOpening, playerIndex, opponentIndices) {
    const playerTrades = _.get(conversionsByPlayerByOpening, [playerIndex, "trade"]) || [];
    const opponentTrades = _.flatten(opponentIndices.map((opponentIndex) => _.get(conversionsByPlayerByOpening, [opponentIndex, "trade"]) || []));
    const benefitsPlayer = [];
    // Figure out which punishes benefited this player
    const zippedTrades = _.zip(playerTrades, opponentTrades);
    zippedTrades.forEach((conversionPair) => {
        const playerConversion = _.first(conversionPair);
        const opponentConversion = _.last(conversionPair);
        if (playerConversion && opponentConversion) {
            const playerDamage = playerConversion.currentPercent - playerConversion.startPercent;
            const opponentDamage = opponentConversion.currentPercent - opponentConversion.startPercent;
            if (playerConversion.didKill && !opponentConversion.didKill) {
                benefitsPlayer.push(playerConversion);
            }
            else if (playerDamage > opponentDamage) {
                benefitsPlayer.push(playerConversion);
            }
        }
    });
    return getRatio(benefitsPlayer.length, playerTrades.length);
}

const defaultOptions = {
    processOnTheFly: false,
};
class Stats {
    constructor(options) {
        this.lastProcessedFrame = null;
        this.frames = {};
        this.players = [];
        this.allComputers = new Array();
        this.options = Object.assign({}, defaultOptions, options);
    }
    /**
     * Should reset the frames to their default values.
     */
    setup(settings) {
        // Reset the frames since it's a new game
        this.frames = {};
        this.players = settings.players.map((v) => v.playerIndex);
        // Forward the settings on to the individual stat computer
        this.allComputers.forEach((comp) => comp.setup(settings));
    }
    register(...computer) {
        this.allComputers.push(...computer);
    }
    process() {
        if (this.players.length === 0) {
            return;
        }
        let i = this.lastProcessedFrame !== null ? this.lastProcessedFrame + 1 : Frames.FIRST;
        while (this.frames[i]) {
            const frame = this.frames[i];
            // Don't attempt to compute stats on frames that have not been fully received
            if (!isCompletedFrame(this.players, frame)) {
                return;
            }
            this.allComputers.forEach((comp) => comp.processFrame(frame, this.frames));
            this.lastProcessedFrame = i;
            i++;
        }
    }
    addFrame(frame) {
        this.frames[frame.frame] = frame;
        if (this.options.processOnTheFly) {
            this.process();
        }
    }
}
function isCompletedFrame(players, frame) {
    // This function checks whether we have successfully received an entire frame.
    // It is not perfect because it does not wait for follower frames. Fortunately,
    // follower frames are not used for any stat calculations so this doesn't matter
    // for our purposes.
    for (const player of players) {
        const playerPostFrame = _.get(frame, ["players", player, "post"]);
        if (!playerPostFrame) {
            return false;
        }
    }
    return true;
}

class StockComputer {
    constructor() {
        this.state = new Map();
        this.playerPermutations = new Array();
        this.stocks = new Array();
    }
    setup(settings) {
        // Reset state
        this.state = new Map();
        this.playerPermutations = getSinglesPlayerPermutationsFromSettings(settings);
        this.stocks = [];
        this.playerPermutations.forEach((indices) => {
            const playerState = {
                stock: null,
            };
            this.state.set(indices, playerState);
        });
    }
    processFrame(frame, allFrames) {
        this.playerPermutations.forEach((indices) => {
            const state = this.state.get(indices);
            if (state) {
                handleStockCompute(allFrames, state, indices, frame, this.stocks);
            }
        });
    }
    fetch() {
        return this.stocks;
    }
}
function handleStockCompute(frames, state, indices, frame, stocks) {
    var _a, _b;
    const playerFrame = frame.players[indices.playerIndex].post;
    const currentFrameNumber = playerFrame.frame;
    const prevFrameNumber = currentFrameNumber - 1;
    const prevPlayerFrame = frames[prevFrameNumber] ? frames[prevFrameNumber].players[indices.playerIndex].post : null;
    // If there is currently no active stock, wait until the player is no longer spawning.
    // Once the player is no longer spawning, start the stock
    if (!state.stock) {
        const isPlayerDead = isDead(playerFrame.actionStateId);
        if (isPlayerDead) {
            return;
        }
        state.stock = {
            playerIndex: indices.playerIndex,
            startFrame: currentFrameNumber,
            endFrame: null,
            startPercent: 0,
            endPercent: null,
            currentPercent: 0,
            count: playerFrame.stocksRemaining,
            deathAnimation: null,
        };
        stocks.push(state.stock);
    }
    else if (prevPlayerFrame && didLoseStock(playerFrame, prevPlayerFrame)) {
        state.stock.endFrame = playerFrame.frame;
        state.stock.endPercent = (_a = prevPlayerFrame.percent) !== null && _a !== void 0 ? _a : 0;
        state.stock.deathAnimation = playerFrame.actionStateId;
        state.stock = null;
    }
    else {
        state.stock.currentPercent = (_b = playerFrame.percent) !== null && _b !== void 0 ? _b : 0;
    }
}

var CommunicationType;
(function (CommunicationType) {
    CommunicationType[CommunicationType["HANDSHAKE"] = 1] = "HANDSHAKE";
    CommunicationType[CommunicationType["REPLAY"] = 2] = "REPLAY";
    CommunicationType[CommunicationType["KEEP_ALIVE"] = 3] = "KEEP_ALIVE";
})(CommunicationType || (CommunicationType = {}));
// This class is responsible for handling the communication protocol between the Wii and the
// desktop app
class ConsoleCommunication {
    constructor() {
        this.receiveBuf = Buffer.from([]);
        this.messages = new Array();
    }
    receive(data) {
        this.receiveBuf = Buffer.concat([this.receiveBuf, data]);
        while (this.receiveBuf.length >= 4) {
            // First get the size of the message we are expecting
            const msgSize = this.receiveBuf.readUInt32BE(0);
            if (this.receiveBuf.length < msgSize + 4) {
                // If we haven't received all the data yet, let's wait for more
                return;
            }
            // Here we have received all the data, so let's decode it
            const ubjsonData = this.receiveBuf.slice(4, msgSize + 4);
            this.messages.push(decode(ubjsonData));
            // Remove the processed data from receiveBuf
            this.receiveBuf = this.receiveBuf.slice(msgSize + 4);
        }
    }
    getReceiveBuffer() {
        return this.receiveBuf;
    }
    getMessages() {
        const toReturn = this.messages;
        this.messages = [];
        return toReturn;
    }
    genHandshakeOut(cursor, clientToken, isRealtime = false) {
        const clientTokenBuf = Buffer.from([0, 0, 0, 0]);
        clientTokenBuf.writeUInt32BE(clientToken, 0);
        const message = {
            type: CommunicationType.HANDSHAKE,
            payload: {
                cursor: cursor,
                clientToken: Uint8Array.from(clientTokenBuf),
                isRealtime: isRealtime,
            },
        };
        const buf = encode(message, {
            optimizeArrays: true,
        });
        const msg = Buffer.concat([Buffer.from([0, 0, 0, 0]), Buffer.from(buf)]);
        msg.writeUInt32BE(buf.byteLength, 0);
        return msg;
    }
}

var ConnectionEvent;
(function (ConnectionEvent) {
    ConnectionEvent["CONNECT"] = "connect";
    ConnectionEvent["MESSAGE"] = "message";
    ConnectionEvent["HANDSHAKE"] = "handshake";
    ConnectionEvent["STATUS_CHANGE"] = "statusChange";
    ConnectionEvent["DATA"] = "data";
    ConnectionEvent["ERROR"] = "error";
})(ConnectionEvent || (ConnectionEvent = {}));
var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["DISCONNECTED"] = 0] = "DISCONNECTED";
    ConnectionStatus[ConnectionStatus["CONNECTING"] = 1] = "CONNECTING";
    ConnectionStatus[ConnectionStatus["CONNECTED"] = 2] = "CONNECTED";
    ConnectionStatus[ConnectionStatus["RECONNECT_WAIT"] = 3] = "RECONNECT_WAIT";
})(ConnectionStatus || (ConnectionStatus = {}));
var Ports;
(function (Ports) {
    Ports[Ports["DEFAULT"] = 51441] = "DEFAULT";
    Ports[Ports["LEGACY"] = 666] = "LEGACY";
    Ports[Ports["RELAY_START"] = 53741] = "RELAY_START";
})(Ports || (Ports = {}));

const NETWORK_MESSAGE = "HELO\0";
const DEFAULT_CONNECTION_TIMEOUT_MS = 20000;
var CommunicationState;
(function (CommunicationState) {
    CommunicationState["INITIAL"] = "initial";
    CommunicationState["LEGACY"] = "legacy";
    CommunicationState["NORMAL"] = "normal";
})(CommunicationState || (CommunicationState = {}));
const defaultConnectionDetails = {
    consoleNick: "unknown",
    gameDataCursor: Uint8Array.from([0, 0, 0, 0, 0, 0, 0, 0]),
    version: "",
    clientToken: 0,
};
const consoleConnectionOptions = {
    autoReconnect: true,
};
/**
 * Responsible for maintaining connection to a Slippi relay connection or Wii connection.
 * Events are emitted whenever data is received.
 *
 * Basic usage example:
 *
 * ```javascript
 * const { ConsoleConnection } = require("@slippi/slippi-js");
 *
 * const connection = new ConsoleConnection();
 * connection.connect("localhost", 667); // You should set these values appropriately
 *
 * connection.on("data", (data) => {
 *   // Received data from console
 *   console.log(data);
 * });
 *
 * connection.on("statusChange", (status) => {
 *   console.log(`status changed: ${status}`);
 * });
 * ```
 */
class ConsoleConnection extends EventEmitter {
    constructor(options) {
        super();
        this.connectionStatus = ConnectionStatus.DISCONNECTED;
        this.connDetails = { ...defaultConnectionDetails };
        this.client = null;
        this.connection = null;
        this.shouldReconnect = false;
        this.ipAddress = "0.0.0.0";
        this.port = Ports.DEFAULT;
        this.options = Object.assign({}, consoleConnectionOptions, options);
    }
    /**
     * @returns The current connection status.
     */
    getStatus() {
        return this.connectionStatus;
    }
    /**
     * @returns The IP address and port of the current connection.
     */
    getSettings() {
        return {
            ipAddress: this.ipAddress,
            port: this.port,
        };
    }
    /**
     * @returns The specific details about the connected console.
     */
    getDetails() {
        return { ...this.connDetails };
    }
    /**
     * Initiate a connection to the Wii or Slippi relay.
     * @param ip   The IP address of the Wii or Slippi relay.
     * @param port The port to connect to.
     * @param timeout Optional. The timeout in milliseconds when attempting to connect
     *                to the Wii or relay.
     */
    connect(ip, port, timeout = DEFAULT_CONNECTION_TIMEOUT_MS) {
        this.ipAddress = ip;
        this.port = port;
        this._connectOnPort(ip, port, timeout);
    }
    _connectOnPort(ip, port, timeout) {
        // set up reconnect
        const reconnect = inject(() => net.connect({
            host: ip,
            port: port,
            timeout: timeout,
        }));
        // Indicate we are connecting
        this._setStatus(ConnectionStatus.CONNECTING);
        // Prepare console communication obj for talking UBJSON
        const consoleComms = new ConsoleCommunication();
        // TODO: reconnect on failed reconnect, not sure how
        // TODO: to do this
        const connection = reconnect({
            initialDelay: 2000,
            maxDelay: 10000,
            strategy: "fibonacci",
            failAfter: Infinity,
        }, (client) => {
            var _a;
            this.emit(ConnectionEvent.CONNECT);
            // We successfully connected so turn on auto-reconnect
            this.shouldReconnect = this.options.autoReconnect;
            this.client = client;
            let commState = CommunicationState.INITIAL;
            client.on("data", (data) => {
                if (commState === CommunicationState.INITIAL) {
                    commState = this._getInitialCommState(data);
                    console.log(`Connected to ${ip}:${port} with type: ${commState}`);
                    this._setStatus(ConnectionStatus.CONNECTED);
                    console.log(data.toString("hex"));
                }
                if (commState === CommunicationState.LEGACY) {
                    // If the first message received was not a handshake message, either we
                    // connected to an old Nintendont version or a relay instance
                    this._handleReplayData(data);
                    return;
                }
                try {
                    consoleComms.receive(data);
                }
                catch (err) {
                    console.error("Failed to process new data from server...", {
                        error: err,
                        prevDataBuf: consoleComms.getReceiveBuffer(),
                        rcvData: data,
                    });
                    client.destroy();
                    this.emit(ConnectionEvent.ERROR, err);
                    return;
                }
                const messages = consoleComms.getMessages();
                // Process all of the received messages
                try {
                    messages.forEach((message) => this._processMessage(message));
                }
                catch (err) {
                    // Disconnect client to send another handshake message
                    console.error(err);
                    client.destroy();
                    this.emit(ConnectionEvent.ERROR, err);
                }
            });
            client.on("timeout", () => {
                // const previouslyConnected = this.connectionStatus === ConnectionStatus.CONNECTED;
                console.warn(`Attempted connection to ${ip}:${port} timed out after ${timeout}ms`);
                client.destroy();
            });
            client.on("end", () => {
                console.log("disconnect");
                if (!this.shouldReconnect) {
                    client.destroy();
                }
            });
            client.on("close", () => {
                console.log("connection was closed");
            });
            const handshakeMsgOut = consoleComms.genHandshakeOut(this.connDetails.gameDataCursor, (_a = this.connDetails.clientToken) !== null && _a !== void 0 ? _a : 0);
            client.write(handshakeMsgOut);
        });
        const setConnectingStatus = () => {
            // Indicate we are connecting
            this._setStatus(this.shouldReconnect ? ConnectionStatus.RECONNECT_WAIT : ConnectionStatus.CONNECTING);
        };
        connection.on("connect", setConnectingStatus);
        connection.on("reconnect", setConnectingStatus);
        connection.on("disconnect", () => {
            if (!this.shouldReconnect) {
                connection.reconnect = false;
                connection.disconnect();
                this._setStatus(ConnectionStatus.DISCONNECTED);
            }
            // TODO: Figure out how to set RECONNECT_WAIT state here. Currently it will stay on
            // TODO: Connecting... forever
        });
        connection.on("error", (error) => {
            console.error(`Connection on port ${port} encountered an error.`, error);
        });
        this.connection = connection;
        connection.connect(port);
    }
    /**
     * Terminate the current connection.
     */
    disconnect() {
        // Prevent reconnections and disconnect
        if (this.connection) {
            this.connection.reconnect = false;
            this.connection.disconnect();
            this.connection = null;
        }
        if (this.client) {
            this.client.destroy();
        }
    }
    _getInitialCommState(data) {
        if (data.length < 13) {
            return CommunicationState.LEGACY;
        }
        const openingBytes = Buffer.from([0x7b, 0x69, 0x04, 0x74, 0x79, 0x70, 0x65, 0x55, 0x01]);
        const dataStart = data.slice(4, 13);
        return dataStart.equals(openingBytes) ? CommunicationState.NORMAL : CommunicationState.LEGACY;
    }
    _processMessage(message) {
        this.emit(ConnectionEvent.MESSAGE, message);
        switch (message.type) {
            case CommunicationType.KEEP_ALIVE:
                // console.log("Keep alive message received");
                // TODO: This is the jankiest shit ever but it will allow for relay connections not
                // TODO: to time out as long as the main connection is still receving keep alive messages
                // TODO: Need to figure out a better solution for this. There should be no need to have an
                // TODO: active Wii connection for the relay connection to keep itself alive
                const fakeKeepAlive = Buffer.from(NETWORK_MESSAGE);
                this._handleReplayData(fakeKeepAlive);
                break;
            case CommunicationType.REPLAY:
                const readPos = Uint8Array.from(message.payload.pos);
                const cmp = Buffer.compare(this.connDetails.gameDataCursor, readPos);
                if (!message.payload.forcePos && cmp !== 0) {
                    // The readPos is not the one we are waiting on, throw error
                    throw new Error(`Position of received data is incorrect. Expected: ${this.connDetails.gameDataCursor.toString()}, Received: ${readPos.toString()}`);
                }
                if (message.payload.forcePos) {
                    console.warn("Overflow occured in Nintendont, data has likely been skipped and replay corrupted. " +
                        "Expected, Received:", this.connDetails.gameDataCursor, readPos);
                }
                this.connDetails.gameDataCursor = Uint8Array.from(message.payload.nextPos);
                const data = Uint8Array.from(message.payload.data);
                this._handleReplayData(data);
                break;
            case CommunicationType.HANDSHAKE:
                const { nick, nintendontVersion } = message.payload;
                if (nick) {
                    this.connDetails.consoleNick = nick;
                }
                const tokenBuf = Buffer.from(message.payload.clientToken);
                this.connDetails.clientToken = tokenBuf.readUInt32BE(0);
                if (nintendontVersion) {
                    this.connDetails.version = nintendontVersion;
                }
                this.connDetails.gameDataCursor = Uint8Array.from(message.payload.pos);
                this.emit(ConnectionEvent.HANDSHAKE, this.connDetails);
                break;
        }
    }
    _handleReplayData(data) {
        this.emit(ConnectionEvent.DATA, data);
    }
    _setStatus(status) {
        // Don't fire the event if the status hasn't actually changed
        if (this.connectionStatus !== status) {
            this.connectionStatus = status;
            this.emit(ConnectionEvent.STATUS_CHANGE, this.connectionStatus);
        }
    }
}

const MAX_PEERS = 32;
var DolphinMessageType;
(function (DolphinMessageType) {
    DolphinMessageType["CONNECT_REPLY"] = "connect_reply";
    DolphinMessageType["GAME_EVENT"] = "game_event";
    DolphinMessageType["START_GAME"] = "start_game";
    DolphinMessageType["END_GAME"] = "end_game";
})(DolphinMessageType || (DolphinMessageType = {}));
class DolphinConnection extends EventEmitter {
    constructor() {
        super();
        this.connectionStatus = ConnectionStatus.DISCONNECTED;
        this.gameCursor = 0;
        this.nickname = "unknown";
        this.version = "";
        this.peer = null;
        this.ipAddress = "0.0.0.0";
        this.port = Ports.DEFAULT;
    }
    /**
     * @returns The current connection status.
     */
    getStatus() {
        return this.connectionStatus;
    }
    /**
     * @returns The IP address and port of the current connection.
     */
    getSettings() {
        return {
            ipAddress: this.ipAddress,
            port: this.port,
        };
    }
    getDetails() {
        return {
            consoleNick: this.nickname,
            gameDataCursor: this.gameCursor,
            version: this.version,
        };
    }
    async connect(ip, port) {
        console.log(`Connecting to: ${ip}:${port}`);
        this.ipAddress = ip;
        this.port = port;
        const enet = await import('enet');
        // Create the enet client
        const client = enet.createClient({ peers: MAX_PEERS, channels: 3, down: 0, up: 0 }, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
        this.peer = client.connect({
            address: this.ipAddress,
            port: this.port,
        }, 3, 1337, // Data to send, not sure what this is or what this represents
        (err, newPeer) => {
            if (err) {
                console.error(err);
                return;
            }
            newPeer.ping();
            this.emit(ConnectionEvent.CONNECT);
            this._setStatus(ConnectionStatus.CONNECTED);
        });
        this.peer.on("connect", () => {
            // Reset the game cursor to the beginning of the game. Do we need to do this or
            // should it just continue from where it left off?
            this.gameCursor = 0;
            const request = {
                type: "connect_request",
                cursor: this.gameCursor,
            };
            const packet = new enet.Packet(JSON.stringify(request), enet.PACKET_FLAG.RELIABLE);
            this.peer.send(0, packet);
        });
        this.peer.on("message", (packet) => {
            const data = packet.data();
            if (data.length === 0) {
                return;
            }
            const dataString = data.toString("ascii");
            const message = JSON.parse(dataString);
            const { dolphin_closed } = message;
            if (dolphin_closed) {
                // We got a disconnection request
                this.disconnect();
                return;
            }
            this.emit(ConnectionEvent.MESSAGE, message);
            switch (message.type) {
                case DolphinMessageType.CONNECT_REPLY:
                    this.connectionStatus = ConnectionStatus.CONNECTED;
                    this.gameCursor = message.cursor;
                    this.nickname = message.nick;
                    this.version = message.version;
                    this.emit(ConnectionEvent.HANDSHAKE, this.getDetails());
                    break;
                case DolphinMessageType.GAME_EVENT: {
                    const { payload } = message;
                    //TODO: remove after game start and end messages have been in stable Ishii for a bit
                    if (!payload) {
                        // We got a disconnection request
                        this.disconnect();
                        return;
                    }
                    this._updateCursor(message, dataString);
                    const gameData = Buffer.from(payload, "base64");
                    this._handleReplayData(gameData);
                    break;
                }
                case DolphinMessageType.START_GAME: {
                    this._updateCursor(message, dataString);
                    break;
                }
                case DolphinMessageType.END_GAME: {
                    this._updateCursor(message, dataString);
                    break;
                }
            }
        });
        this.peer.on("disconnect", () => {
            this.disconnect();
        });
        this._setStatus(ConnectionStatus.CONNECTING);
    }
    disconnect() {
        if (this.peer) {
            this.peer.disconnect();
            this.peer = null;
        }
        this._setStatus(ConnectionStatus.DISCONNECTED);
    }
    _handleReplayData(data) {
        this.emit(ConnectionEvent.DATA, data);
    }
    _setStatus(status) {
        // Don't fire the event if the status hasn't actually changed
        if (this.connectionStatus !== status) {
            this.connectionStatus = status;
            this.emit(ConnectionEvent.STATUS_CHANGE, this.connectionStatus);
        }
    }
    _updateCursor(message, dataString) {
        const { cursor, next_cursor } = message;
        if (this.gameCursor !== cursor) {
            const err = new Error(`Unexpected game data cursor. Expected: ${this.gameCursor} but got: ${cursor}. Payload: ${dataString}`);
            console.warn(err);
            this.emit(ConnectionEvent.ERROR, err);
        }
        this.gameCursor = next_cursor;
    }
}

function toHalfwidth(str) {
    // Converts a fullwidth character to halfwidth
    const convertChar = (charCode) => {
        /**
         * Standard full width encodings
         * https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)
         */
        if (charCode > 0xff00 && charCode < 0xff5f) {
            return 0x0020 + (charCode - 0xff00);
        }
        // space:
        if (charCode === 0x3000) {
            return 0x0020;
        }
        /**
         * Exceptions found in Melee/Japanese keyboards
         */
        // single quote: '
        if (charCode === 0x2019) {
            return 0x0027;
        }
        // double quote: "
        if (charCode === 0x201d) {
            return 0x0022;
        }
        return charCode;
    };
    const ret = _.map(str, (char) => convertChar(char.charCodeAt(0)));
    return String.fromCharCode(...ret);
}

var SlpInputSource;
(function (SlpInputSource) {
    SlpInputSource["BUFFER"] = "buffer";
    SlpInputSource["FILE"] = "file";
})(SlpInputSource || (SlpInputSource = {}));
function getRef(input) {
    switch (input.source) {
        case SlpInputSource.FILE:
            if (!input.filePath) {
                throw new Error("File source requires a file path");
            }
            const fd = fs.openSync(input.filePath, "r");
            return {
                source: input.source,
                fileDescriptor: fd,
            };
        case SlpInputSource.BUFFER:
            return {
                source: input.source,
                buffer: input.buffer,
            };
        default:
            throw new Error("Source type not supported");
    }
}
function readRef(ref, buffer, offset, length, position) {
    switch (ref.source) {
        case SlpInputSource.FILE:
            return fs.readSync(ref.fileDescriptor, buffer, offset, length, position);
        case SlpInputSource.BUFFER:
            return ref.buffer.copy(buffer, offset, position, position + length);
        default:
            throw new Error("Source type not supported");
    }
}
function getLenRef(ref) {
    switch (ref.source) {
        case SlpInputSource.FILE:
            const fileStats = fs.fstatSync(ref.fileDescriptor);
            return fileStats.size;
        case SlpInputSource.BUFFER:
            return ref.buffer.length;
        default:
            throw new Error("Source type not supported");
    }
}
/**
 * Opens a file at path
 */
function openSlpFile(input) {
    const ref = getRef(input);
    const rawDataPosition = getRawDataPosition(ref);
    const rawDataLength = getRawDataLength(ref, rawDataPosition);
    const metadataPosition = rawDataPosition + rawDataLength + 10; // remove metadata string
    const metadataLength = getMetadataLength(ref, metadataPosition);
    const messageSizes = getMessageSizes(ref, rawDataPosition);
    return {
        ref: ref,
        rawDataPosition: rawDataPosition,
        rawDataLength: rawDataLength,
        metadataPosition: metadataPosition,
        metadataLength: metadataLength,
        messageSizes: messageSizes,
    };
}
function closeSlpFile(file) {
    switch (file.ref.source) {
        case SlpInputSource.FILE:
            fs.closeSync(file.ref.fileDescriptor);
            break;
    }
}
// This function gets the position where the raw data starts
function getRawDataPosition(ref) {
    const buffer = new Uint8Array(1);
    readRef(ref, buffer, 0, buffer.length, 0);
    if (buffer[0] === 0x36) {
        return 0;
    }
    if (buffer[0] !== "{".charCodeAt(0)) {
        return 0; // return error?
    }
    return 15;
}
function getRawDataLength(ref, position) {
    const fileSize = getLenRef(ref);
    if (position === 0) {
        return fileSize;
    }
    const buffer = new Uint8Array(4);
    readRef(ref, buffer, 0, buffer.length, position - 4);
    const rawDataLen = (buffer[0] << 24) | (buffer[1] << 16) | (buffer[2] << 8) | buffer[3];
    if (rawDataLen > 0) {
        // If this method manages to read a number, it's probably trustworthy
        return rawDataLen;
    }
    // If the above does not return a valid data length,
    // return a file size based on file length. This enables
    // some support for severed files
    return fileSize - position;
}
function getMetadataLength(ref, position) {
    const len = getLenRef(ref);
    return len - position - 1;
}
function getMessageSizes(ref, position) {
    const messageSizes = {};
    // Support old file format
    if (position === 0) {
        messageSizes[0x36] = 0x140;
        messageSizes[0x37] = 0x6;
        messageSizes[0x38] = 0x46;
        messageSizes[0x39] = 0x1;
        return messageSizes;
    }
    const buffer = new Uint8Array(2);
    readRef(ref, buffer, 0, buffer.length, position);
    if (buffer[0] !== Command.MESSAGE_SIZES) {
        return {};
    }
    const payloadLength = buffer[1];
    messageSizes[0x35] = payloadLength;
    const messageSizesBuffer = new Uint8Array(payloadLength - 1);
    readRef(ref, messageSizesBuffer, 0, messageSizesBuffer.length, position + 2);
    for (let i = 0; i < payloadLength - 1; i += 3) {
        const command = messageSizesBuffer[i];
        // Get size of command
        messageSizes[command] = (messageSizesBuffer[i + 1] << 8) | messageSizesBuffer[i + 2];
    }
    return messageSizes;
}
/**
 * Iterates through slp events and parses payloads
 */
function iterateEvents(slpFile, callback, startPos = null) {
    const ref = slpFile.ref;
    let readPosition = startPos !== null && startPos > 0 ? startPos : slpFile.rawDataPosition;
    const stopReadingAt = slpFile.rawDataPosition + slpFile.rawDataLength;
    // Generate read buffers for each
    const commandPayloadBuffers = _.mapValues(slpFile.messageSizes, (size) => new Uint8Array(size + 1));
    const commandByteBuffer = new Uint8Array(1);
    while (readPosition < stopReadingAt) {
        readRef(ref, commandByteBuffer, 0, 1, readPosition);
        const commandByte = commandByteBuffer[0];
        const buffer = commandPayloadBuffers[commandByte];
        if (buffer === undefined) {
            // If we don't have an entry for this command, return false to indicate failed read
            return readPosition;
        }
        if (buffer.length > stopReadingAt - readPosition) {
            return readPosition;
        }
        readRef(ref, buffer, 0, buffer.length, readPosition);
        const parsedPayload = parseMessage(commandByte, buffer);
        const shouldStop = callback(commandByte, parsedPayload);
        if (shouldStop) {
            break;
        }
        readPosition += buffer.length;
    }
    return readPosition;
}
function parseMessage(command, payload) {
    const view = new DataView(payload.buffer);
    switch (command) {
        case Command.GAME_START:
            const getPlayerObject = (playerIndex) => {
                // Controller Fix stuff
                const cfOffset = playerIndex * 0x8;
                const dashback = readUint32(view, 0x141 + cfOffset);
                const shieldDrop = readUint32(view, 0x145 + cfOffset);
                let cfOption = "None";
                if (dashback !== shieldDrop) {
                    cfOption = "Mixed";
                }
                else if (dashback === 1) {
                    cfOption = "UCF";
                }
                else if (dashback === 2) {
                    cfOption = "Dween";
                }
                // Nametag stuff
                const nametagLength = 0x10;
                const nametagOffset = playerIndex * nametagLength;
                const nametagStart = 0x161 + nametagOffset;
                const nametagBuf = payload.slice(nametagStart, nametagStart + nametagLength);
                const nameTagString = iconv
                    .decode(nametagBuf, "Shift_JIS")
                    .split("\0")
                    .shift();
                const nametag = nameTagString ? toHalfwidth(nameTagString) : "";
                // Display name
                const displayNameLength = 0x1f;
                const displayNameOffset = playerIndex * displayNameLength;
                const displayNameStart = 0x1a5 + displayNameOffset;
                const displayNameBuf = payload.slice(displayNameStart, displayNameStart + displayNameLength);
                const displayNameString = iconv
                    .decode(displayNameBuf, "Shift_JIS")
                    .split("\0")
                    .shift();
                const displayName = displayNameString ? toHalfwidth(displayNameString) : "";
                // Connect code
                const connectCodeLength = 0xa;
                const connectCodeOffset = playerIndex * connectCodeLength;
                const connectCodeStart = 0x221 + connectCodeOffset;
                const connectCodeBuf = payload.slice(connectCodeStart, connectCodeStart + connectCodeLength);
                const connectCodeString = iconv
                    .decode(connectCodeBuf, "Shift_JIS")
                    .split("\0")
                    .shift();
                const connectCode = connectCodeString ? toHalfwidth(connectCodeString) : "";
                const offset = playerIndex * 0x24;
                return {
                    playerIndex: playerIndex,
                    port: playerIndex + 1,
                    characterId: readUint8(view, 0x65 + offset),
                    characterColor: readUint8(view, 0x68 + offset),
                    startStocks: readUint8(view, 0x67 + offset),
                    type: readUint8(view, 0x66 + offset),
                    teamId: readUint8(view, 0x6e + offset),
                    controllerFix: cfOption,
                    nametag: nametag,
                    displayName: displayName,
                    connectCode: connectCode,
                };
            };
            return {
                slpVersion: `${readUint8(view, 0x1)}.${readUint8(view, 0x2)}.${readUint8(view, 0x3)}`,
                isTeams: readBool(view, 0xd),
                isPAL: readBool(view, 0x1a1),
                stageId: readUint16(view, 0x13),
                players: [0, 1, 2, 3].map(getPlayerObject),
                scene: readUint8(view, 0x1a3),
                gameMode: readUint8(view, 0x1a4),
            };
        case Command.PRE_FRAME_UPDATE:
            return {
                frame: readInt32(view, 0x1),
                playerIndex: readUint8(view, 0x5),
                isFollower: readBool(view, 0x6),
                seed: readUint32(view, 0x7),
                actionStateId: readUint16(view, 0xb),
                positionX: readFloat(view, 0xd),
                positionY: readFloat(view, 0x11),
                facingDirection: readFloat(view, 0x15),
                joystickX: readFloat(view, 0x19),
                joystickY: readFloat(view, 0x1d),
                cStickX: readFloat(view, 0x21),
                cStickY: readFloat(view, 0x25),
                trigger: readFloat(view, 0x29),
                buttons: readUint32(view, 0x2d),
                physicalButtons: readUint16(view, 0x31),
                physicalLTrigger: readFloat(view, 0x33),
                physicalRTrigger: readFloat(view, 0x37),
                percent: readFloat(view, 0x3c),
            };
        case Command.POST_FRAME_UPDATE:
            const selfInducedSpeeds = {
                airX: readFloat(view, 0x35),
                y: readFloat(view, 0x39),
                attackX: readFloat(view, 0x3d),
                attackY: readFloat(view, 0x41),
                groundX: readFloat(view, 0x45),
            };
            return {
                frame: readInt32(view, 0x1),
                playerIndex: readUint8(view, 0x5),
                isFollower: readBool(view, 0x6),
                internalCharacterId: readUint8(view, 0x7),
                actionStateId: readUint16(view, 0x8),
                positionX: readFloat(view, 0xa),
                positionY: readFloat(view, 0xe),
                facingDirection: readFloat(view, 0x12),
                percent: readFloat(view, 0x16),
                shieldSize: readFloat(view, 0x1a),
                lastAttackLanded: readUint8(view, 0x1e),
                currentComboCount: readUint8(view, 0x1f),
                lastHitBy: readUint8(view, 0x20),
                stocksRemaining: readUint8(view, 0x21),
                actionStateCounter: readFloat(view, 0x22),
                miscActionState: readFloat(view, 0x2b),
                isAirborne: readBool(view, 0x2f),
                lastGroundId: readUint16(view, 0x30),
                jumpsRemaining: readUint8(view, 0x32),
                lCancelStatus: readUint8(view, 0x33),
                hurtboxCollisionState: readUint8(view, 0x34),
                selfInducedSpeeds: selfInducedSpeeds,
            };
        case Command.ITEM_UPDATE:
            return {
                frame: readInt32(view, 0x1),
                typeId: readUint16(view, 0x5),
                state: readUint8(view, 0x7),
                facingDirection: readFloat(view, 0x8),
                velocityX: readFloat(view, 0xc),
                velocityY: readFloat(view, 0x10),
                positionX: readFloat(view, 0x14),
                positionY: readFloat(view, 0x18),
                damageTaken: readUint16(view, 0x1c),
                expirationTimer: readFloat(view, 0x1e),
                spawnId: readUint32(view, 0x22),
                missileType: readUint8(view, 0x26),
                turnipFace: readUint8(view, 0x27),
                chargeShotLaunched: readUint8(view, 0x28),
                chargePower: readUint8(view, 0x29),
                owner: readInt8(view, 0x2a),
            };
        case Command.FRAME_BOOKEND:
            return {
                frame: readInt32(view, 0x1),
                latestFinalizedFrame: readInt32(view, 0x5),
            };
        case Command.GAME_END:
            return {
                gameEndMethod: readUint8(view, 0x1),
                lrasInitiatorIndex: readInt8(view, 0x2),
            };
        default:
            return null;
    }
}
function canReadFromView(view, offset, length) {
    const viewLength = view.byteLength;
    return offset + length <= viewLength;
}
function readFloat(view, offset) {
    if (!canReadFromView(view, offset, 4)) {
        return null;
    }
    return view.getFloat32(offset);
}
function readInt32(view, offset) {
    if (!canReadFromView(view, offset, 4)) {
        return null;
    }
    return view.getInt32(offset);
}
function readInt8(view, offset) {
    if (!canReadFromView(view, offset, 1)) {
        return null;
    }
    return view.getInt8(offset);
}
function readUint32(view, offset) {
    if (!canReadFromView(view, offset, 4)) {
        return null;
    }
    return view.getUint32(offset);
}
function readUint16(view, offset) {
    if (!canReadFromView(view, offset, 2)) {
        return null;
    }
    return view.getUint16(offset);
}
function readUint8(view, offset) {
    if (!canReadFromView(view, offset, 1)) {
        return null;
    }
    return view.getUint8(offset);
}
function readBool(view, offset) {
    if (!canReadFromView(view, offset, 1)) {
        return null;
    }
    return !!view.getUint8(offset);
}
function getMetadata(slpFile) {
    if (slpFile.metadataLength <= 0) {
        // This will happen on a severed incomplete file
        // $FlowFixMe
        return null;
    }
    const buffer = new Uint8Array(slpFile.metadataLength);
    readRef(slpFile.ref, buffer, 0, buffer.length, slpFile.metadataPosition);
    let metadata = null;
    try {
        metadata = decode(buffer);
    }
    catch (ex) {
        // Do nothing
        // console.log(ex);
    }
    // $FlowFixMe
    return metadata;
}

var SlpStreamMode;
(function (SlpStreamMode) {
    SlpStreamMode["AUTO"] = "AUTO";
    SlpStreamMode["MANUAL"] = "MANUAL";
})(SlpStreamMode || (SlpStreamMode = {}));
const defaultSettings = {
    suppressErrors: false,
    mode: SlpStreamMode.AUTO,
};
var SlpStreamEvent;
(function (SlpStreamEvent) {
    SlpStreamEvent["RAW"] = "slp-raw";
    SlpStreamEvent["COMMAND"] = "slp-command";
})(SlpStreamEvent || (SlpStreamEvent = {}));
/**
 * SlpStream is a writable stream of Slippi data. It passes the data being written in
 * and emits an event based on what kind of Slippi messages were processed.
 *
 * SlpStream emits two events: "slp-raw" and "slp-command". The "slp-raw" event emits the raw buffer
 * bytes whenever it processes each command. You can manually parse this or write it to a
 * file. The "slp-command" event returns the parsed payload which you can access the attributes.
 *
 * @class SlpStream
 * @extends {Writable}
 */
class SlpStream extends Writable {
    /**
     *Creates an instance of SlpStream.
     * @param {Partial<SlpStreamSettings>} [slpOptions]
     * @param {WritableOptions} [opts]
     * @memberof SlpStream
     */
    constructor(slpOptions, opts) {
        super(opts);
        this.gameEnded = false; // True only if in manual mode and the game has completed
        this.payloadSizes = null;
        this.previousBuffer = Buffer.from([]);
        this.settings = Object.assign({}, defaultSettings, slpOptions);
    }
    restart() {
        this.gameEnded = false;
        this.payloadSizes = null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _write(newData, encoding, callback) {
        var _a;
        if (encoding !== "buffer") {
            throw new Error(`Unsupported stream encoding. Expected 'buffer' got '${encoding}'.`);
        }
        // Join the current data with the old data
        const data = Uint8Array.from(Buffer.concat([this.previousBuffer, newData]));
        // Clear previous data
        this.previousBuffer = Buffer.from([]);
        const dataView = new DataView(data.buffer);
        // Iterate through the data
        let index = 0;
        while (index < data.length) {
            // We want to filter out the network messages
            if (Buffer.from(data.slice(index, index + 5)).toString() === NETWORK_MESSAGE) {
                index += 5;
                continue;
            }
            // Make sure we have enough data to read a full payload
            const command = dataView.getUint8(index);
            let payloadSize = 0;
            if (this.payloadSizes) {
                payloadSize = (_a = this.payloadSizes.get(command)) !== null && _a !== void 0 ? _a : 0;
            }
            const remainingLen = data.length - index;
            if (remainingLen < payloadSize + 1) {
                // If remaining length is not long enough for full payload, save the remaining
                // data until we receive more data. The data has been split up.
                this.previousBuffer = data.slice(index);
                break;
            }
            // Only process if the game is still going
            if (this.settings.mode === SlpStreamMode.MANUAL && this.gameEnded) {
                break;
            }
            // Increment by one for the command byte
            index += 1;
            const payloadPtr = data.slice(index);
            const payloadDataView = new DataView(data.buffer, index);
            let payloadLen = 0;
            try {
                payloadLen = this._processCommand(command, payloadPtr, payloadDataView);
            }
            catch (err) {
                // Only throw the error if we're not suppressing the errors
                if (!this.settings.suppressErrors) {
                    throw err;
                }
                payloadLen = 0;
            }
            index += payloadLen;
        }
        callback();
    }
    _writeCommand(command, entirePayload, payloadSize) {
        const payloadBuf = entirePayload.slice(0, payloadSize);
        const bufToWrite = Buffer.concat([Buffer.from([command]), payloadBuf]);
        // Forward the raw buffer onwards
        this.emit(SlpStreamEvent.RAW, {
            command: command,
            payload: bufToWrite,
        });
        return new Uint8Array(bufToWrite);
    }
    _processCommand(command, entirePayload, dataView) {
        var _a;
        // Handle the message size command
        if (command === Command.MESSAGE_SIZES) {
            const payloadSize = dataView.getUint8(0);
            // Set the payload sizes
            this.payloadSizes = processReceiveCommands(dataView);
            // Emit the raw command event
            this._writeCommand(command, entirePayload, payloadSize);
            this.emit(SlpStreamEvent.COMMAND, {
                command: command,
                payload: this.payloadSizes,
            });
            return payloadSize;
        }
        let payloadSize = 0;
        if (this.payloadSizes) {
            payloadSize = (_a = this.payloadSizes.get(command)) !== null && _a !== void 0 ? _a : 0;
        }
        // Fetch the payload and parse it
        let payload;
        let parsedPayload = null;
        if (payloadSize > 0) {
            payload = this._writeCommand(command, entirePayload, payloadSize);
            parsedPayload = parseMessage(command, payload);
        }
        if (!parsedPayload) {
            return payloadSize;
        }
        switch (command) {
            case Command.GAME_END:
                // Stop parsing data until we manually restart the stream
                if (this.settings.mode === SlpStreamMode.MANUAL) {
                    this.gameEnded = true;
                }
                break;
        }
        this.emit(SlpStreamEvent.COMMAND, {
            command: command,
            payload: parsedPayload,
        });
        return payloadSize;
    }
}
const processReceiveCommands = (dataView) => {
    const payloadSizes = new Map();
    const payloadLen = dataView.getUint8(0);
    for (let i = 1; i < payloadLen; i += 3) {
        const commandByte = dataView.getUint8(i);
        const payloadSize = dataView.getUint16(i + 1);
        payloadSizes.set(commandByte, payloadSize);
    }
    return payloadSizes;
};

const DEFAULT_NICKNAME = "unknown";
/**
 * SlpFile is a class that wraps a Writable stream. It handles the writing of the binary
 * header and footer, and also handles the overwriting of the raw data length.
 *
 * @class SlpFile
 * @extends {Writable}
 */
class SlpFile extends Writable {
    /**
     * Creates an instance of SlpFile.
     * @param {string} filePath The file location to write to.
     * @param {WritableOptions} [opts] Options for writing.
     * @memberof SlpFile
     */
    constructor(filePath, slpStream, opts) {
        super(opts);
        this.fileStream = null;
        this.rawDataLength = 0;
        this.usesExternalStream = false;
        this.filePath = filePath;
        this.metadata = {
            consoleNickname: DEFAULT_NICKNAME,
            startTime: moment(),
            lastFrame: -124,
            players: {},
        };
        this.usesExternalStream = Boolean(slpStream);
        // Create a new SlpStream if one wasn't already provided
        // This SLP stream represents a single game not multiple, so use manual mode
        this.slpStream = slpStream ? slpStream : new SlpStream({ mode: SlpStreamMode.MANUAL });
        this._setupListeners();
        this._initializeNewGame(this.filePath);
    }
    /**
     * Get the current file path being written to.
     *
     * @returns {string} The location of the current file path
     * @memberof SlpFile
     */
    path() {
        return this.filePath;
    }
    /**
     * Sets the metadata of the Slippi file, such as consoleNickname, lastFrame, and players.
     * @param metadata The metadata to be written
     */
    setMetadata(metadata) {
        this.metadata = Object.assign({}, this.metadata, metadata);
    }
    _write(chunk, encoding, callback) {
        if (encoding !== "buffer") {
            throw new Error(`Unsupported stream encoding. Expected 'buffer' got '${encoding}'.`);
        }
        // Write it to the file
        if (this.fileStream) {
            this.fileStream.write(chunk);
        }
        // Parse the data manually if it's an internal stream
        if (!this.usesExternalStream) {
            this.slpStream.write(chunk);
        }
        // Keep track of the bytes we've written
        this.rawDataLength += chunk.length;
        callback();
    }
    /**
     * Here we define what to do on each command. We need to populate the metadata field
     * so we keep track of the latest frame, as well as the number of frames each character has
     * been used.
     *
     * @param data The parsed data from a SlpStream
     */
    _onCommand(data) {
        const { command, payload } = data;
        switch (command) {
            case Command.GAME_START:
                const { players } = payload;
                forEach(players, (player, i) => {
                    if (player.type === 3) {
                        return;
                    }
                    this.metadata.players[i] = {
                        characterUsage: {},
                        names: {
                            netplay: player.displayName,
                            code: player.connectCode,
                        },
                    };
                });
                break;
            case Command.POST_FRAME_UPDATE:
                // Here we need to update some metadata fields
                const { frame, playerIndex, isFollower, internalCharacterId } = payload;
                if (isFollower) {
                    // No need to do this for follower
                    break;
                }
                // Update frame index
                this.metadata.lastFrame = frame;
                // Update character usage
                const prevPlayer = this.metadata.players[playerIndex];
                const characterUsage = prevPlayer.characterUsage;
                const curCharFrames = characterUsage[internalCharacterId] || 0;
                const player = {
                    ...prevPlayer,
                    characterUsage: {
                        ...characterUsage,
                        [internalCharacterId]: curCharFrames + 1,
                    },
                };
                this.metadata.players[playerIndex] = player;
                break;
        }
    }
    _setupListeners() {
        const streamListener = (data) => {
            this._onCommand(data);
        };
        this.slpStream.on(SlpStreamEvent.COMMAND, streamListener);
        this.on("finish", () => {
            // Update file with bytes written
            const fd = fs.openSync(this.filePath, "r+");
            fs.writeSync(fd, createUInt32Buffer(this.rawDataLength), 0, 4, 11);
            fs.closeSync(fd);
            // Unsubscribe from the stream
            this.slpStream.removeListener(SlpStreamEvent.COMMAND, streamListener);
            // Terminate the internal stream
            if (!this.usesExternalStream) {
                this.slpStream.end();
            }
        });
    }
    _initializeNewGame(filePath) {
        this.fileStream = fs.createWriteStream(filePath, {
            encoding: "binary",
        });
        const header = Buffer.concat([
            Buffer.from("{U"),
            Buffer.from([3]),
            Buffer.from("raw[$U#l"),
            Buffer.from([0, 0, 0, 0]),
        ]);
        this.fileStream.write(header);
    }
    _final(callback) {
        let footer = Buffer.concat([Buffer.from("U"), Buffer.from([8]), Buffer.from("metadata{")]);
        // Write game start time
        const startTimeStr = this.metadata.startTime.toISOString();
        footer = Buffer.concat([
            footer,
            Buffer.from("U"),
            Buffer.from([7]),
            Buffer.from("startAtSU"),
            Buffer.from([startTimeStr.length]),
            Buffer.from(startTimeStr),
        ]);
        // Write last frame index
        // TODO: Get last frame
        const lastFrame = this.metadata.lastFrame;
        footer = Buffer.concat([
            footer,
            Buffer.from("U"),
            Buffer.from([9]),
            Buffer.from("lastFramel"),
            createInt32Buffer(lastFrame),
        ]);
        // write the Console Nickname
        const consoleNick = this.metadata.consoleNickname || DEFAULT_NICKNAME;
        footer = Buffer.concat([
            footer,
            Buffer.from("U"),
            Buffer.from([11]),
            Buffer.from("consoleNickSU"),
            Buffer.from([consoleNick.length]),
            Buffer.from(consoleNick),
        ]);
        // Start writting player specific data
        footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([7]), Buffer.from("players{")]);
        const players = this.metadata.players;
        forEach(players, (player, index) => {
            // Start player obj with index being the player index
            footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([index.length]), Buffer.from(`${index}{`)]);
            // Start characters key for this player
            footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([10]), Buffer.from("characters{")]);
            // Write character usage
            forEach(player.characterUsage, (usage, internalId) => {
                // Write this character
                footer = Buffer.concat([
                    footer,
                    Buffer.from("U"),
                    Buffer.from([internalId.length]),
                    Buffer.from(`${internalId}l`),
                    createUInt32Buffer(usage),
                ]);
            });
            // Close characters
            footer = Buffer.concat([footer, Buffer.from("}")]);
            // Start names key for this player
            footer = Buffer.concat([footer, Buffer.from("U"), Buffer.from([5]), Buffer.from("names{")]);
            // Write display name
            footer = Buffer.concat([
                footer,
                Buffer.from("U"),
                Buffer.from([7]),
                Buffer.from("netplaySU"),
                Buffer.from([player.names.netplay.length]),
                Buffer.from(`${player.names.netplay}`),
            ]);
            // Write connect code
            footer = Buffer.concat([
                footer,
                Buffer.from("U"),
                Buffer.from([4]),
                Buffer.from("codeSU"),
                Buffer.from([player.names.code.length]),
                Buffer.from(`${player.names.code}`),
            ]);
            // Close names and player
            footer = Buffer.concat([footer, Buffer.from("}}")]);
        });
        // Close players
        footer = Buffer.concat([footer, Buffer.from("}")]);
        // Write played on
        footer = Buffer.concat([
            footer,
            Buffer.from("U"),
            Buffer.from([8]),
            Buffer.from("playedOnSU"),
            Buffer.from([7]),
            Buffer.from("network"),
        ]);
        // Close metadata and file
        footer = Buffer.concat([footer, Buffer.from("}}")]);
        // End the stream
        if (this.fileStream) {
            this.fileStream.write(footer, callback);
        }
    }
}
const createInt32Buffer = (number) => {
    const buf = Buffer.alloc(4);
    buf.writeInt32BE(number, 0);
    return buf;
};
const createUInt32Buffer = (number) => {
    const buf = Buffer.alloc(4);
    buf.writeUInt32BE(number, 0);
    return buf;
};

/**
 * The default function to use for generating new SLP files.
 */
function getNewFilePath(folder, m) {
    return path.join(folder, `Game_${m.format("YYYYMMDD")}T${m.format("HHmmss")}.slp`);
}
const defaultSettings$1 = {
    outputFiles: true,
    folderPath: ".",
    consoleNickname: "unknown",
    newFilename: getNewFilePath,
};
var SlpFileWriterEvent;
(function (SlpFileWriterEvent) {
    SlpFileWriterEvent["NEW_FILE"] = "new-file";
    SlpFileWriterEvent["FILE_COMPLETE"] = "file-complete";
})(SlpFileWriterEvent || (SlpFileWriterEvent = {}));
/**
 * SlpFileWriter lets us not only emit events as an SlpStream but also
 * writes the data that is being passed in to an SLP file. Use this if
 * you want to process Slippi data in real time but also want to be able
 * to write out the data to an SLP file.
 *
 * @export
 * @class SlpFileWriter
 * @extends {SlpStream}
 */
class SlpFileWriter extends SlpStream {
    /**
     * Creates an instance of SlpFileWriter.
     */
    constructor(options, opts) {
        super(options, opts);
        this.currentFile = null;
        this.options = Object.assign({}, defaultSettings$1, options);
        this._setupListeners();
    }
    _writePayload(payload) {
        // Write data to the current file
        if (this.currentFile) {
            this.currentFile.write(payload);
        }
    }
    _setupListeners() {
        this.on(SlpStreamEvent.RAW, (data) => {
            const { command, payload } = data;
            switch (command) {
                case Command.MESSAGE_SIZES:
                    // Create the new game first before writing the payload
                    this._handleNewGame();
                    this._writePayload(payload);
                    break;
                case Command.GAME_END:
                    // Write payload first before ending the game
                    this._writePayload(payload);
                    this._handleEndGame();
                    break;
                default:
                    this._writePayload(payload);
                    break;
            }
        });
    }
    /**
     * Return the name of the SLP file currently being written or null if
     * no file is being written to currently.
     *
     * @returns {(string | null)}
     * @memberof SlpFileWriter
     */
    getCurrentFilename() {
        if (this.currentFile !== null) {
            return path.resolve(this.currentFile.path());
        }
        return null;
    }
    /**
     * Ends the current file being written to.
     *
     * @returns {(string | null)}
     * @memberof SlpFileWriter
     */
    endCurrentFile() {
        this._handleEndGame();
    }
    /**
     * Updates the settings to be the desired ones passed in.
     *
     * @param {Partial<SlpFileWriterOptions>} settings
     * @memberof SlpFileWriter
     */
    updateSettings(settings) {
        this.options = Object.assign({}, this.options, settings);
    }
    _handleNewGame() {
        // Only create a new file if we're outputting files
        if (this.options.outputFiles) {
            const filePath = this.options.newFilename(this.options.folderPath, moment());
            this.currentFile = new SlpFile(filePath, this);
            // console.log(`Creating new file at: ${filePath}`);
            this.emit(SlpFileWriterEvent.NEW_FILE, filePath);
        }
    }
    _handleEndGame() {
        // End the stream
        if (this.currentFile) {
            // Set the console nickname
            this.currentFile.setMetadata({
                consoleNickname: this.options.consoleNickname,
            });
            this.currentFile.end();
            // console.log(`Finished writing file: ${this.currentFile.path()}`);
            this.emit(SlpFileWriterEvent.FILE_COMPLETE, this.currentFile.path());
            // Clear current file
            this.currentFile = null;
        }
    }
}

const MAX_ROLLBACK_FRAMES = 7;
var SlpParserEvent;
(function (SlpParserEvent) {
    SlpParserEvent["SETTINGS"] = "settings";
    SlpParserEvent["END"] = "end";
    SlpParserEvent["FRAME"] = "frame";
    SlpParserEvent["FINALIZED_FRAME"] = "finalized-frame";
})(SlpParserEvent || (SlpParserEvent = {}));
// If strict mode is on, we will do strict validation checking
// which could throw errors on invalid data.
// Default to false though since probably only real time applications
// would care about valid data.
const defaultSlpParserOptions = {
    strict: false,
};
class SlpParser extends EventEmitter {
    constructor(options) {
        super();
        this.frames = {};
        this.settings = null;
        this.gameEnd = null;
        this.latestFrameIndex = null;
        this.settingsComplete = false;
        this.lastFinalizedFrame = Frames.FIRST - 1;
        this.options = Object.assign({}, defaultSlpParserOptions, options);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleCommand(command, payload) {
        switch (command) {
            case Command.GAME_START:
                this._handleGameStart(payload);
                break;
            case Command.POST_FRAME_UPDATE:
                // We need to handle the post frame update first since that
                // will finalize the settings object, before we fire the frame update
                this._handlePostFrameUpdate(payload);
                this._handleFrameUpdate(command, payload);
                break;
            case Command.PRE_FRAME_UPDATE:
                this._handleFrameUpdate(command, payload);
                break;
            case Command.ITEM_UPDATE:
                this._handleItemUpdate(payload);
                break;
            case Command.FRAME_BOOKEND:
                this._handleFrameBookend(payload);
                break;
            case Command.GAME_END:
                this._handleGameEnd(payload);
                break;
        }
    }
    /**
     * Resets the parser state to their default values.
     */
    reset() {
        this.frames = {};
        this.settings = null;
        this.gameEnd = null;
        this.latestFrameIndex = null;
        this.settingsComplete = false;
        this.lastFinalizedFrame = Frames.FIRST - 1;
    }
    getLatestFrameNumber() {
        var _a;
        return (_a = this.latestFrameIndex) !== null && _a !== void 0 ? _a : Frames.FIRST - 1;
    }
    getPlayableFrameCount() {
        if (this.latestFrameIndex === null) {
            return 0;
        }
        return this.latestFrameIndex < Frames.FIRST_PLAYABLE ? 0 : this.latestFrameIndex - Frames.FIRST_PLAYABLE;
    }
    getLatestFrame() {
        // return this.playerFrames[this.latestFrameIndex];
        // TODO: Modify this to check if we actually have all the latest frame data and return that
        // TODO: If we do. For now I'm just going to take a shortcut
        const allFrames = this.getFrames();
        const frameIndex = this.latestFrameIndex !== null ? this.latestFrameIndex : Frames.FIRST;
        const indexToUse = this.gameEnd ? frameIndex : frameIndex - 1;
        return _.get(allFrames, indexToUse) || null;
    }
    getSettings() {
        return this.settingsComplete ? this.settings : null;
    }
    getGameEnd() {
        return this.gameEnd;
    }
    getFrames() {
        return this.frames;
    }
    getFrame(num) {
        return this.frames[num] || null;
    }
    _handleGameEnd(payload) {
        // Finalize remaining frames if necessary
        if (this.latestFrameIndex !== null && this.latestFrameIndex !== this.lastFinalizedFrame) {
            this._finalizeFrames(this.latestFrameIndex);
        }
        payload = payload;
        this.gameEnd = payload;
        this.emit(SlpParserEvent.END, this.gameEnd);
    }
    _handleGameStart(payload) {
        this.settings = payload;
        const players = payload.players;
        this.settings.players = players.filter((player) => player.type !== 3);
        // Check to see if the file was created after the sheik fix so we know
        // we don't have to process the first frame of the game for the full settings
        if (payload.slpVersion && semver.gte(payload.slpVersion, "1.6.0")) {
            this._completeSettings();
        }
    }
    _handlePostFrameUpdate(payload) {
        if (this.settingsComplete) {
            return;
        }
        // Finish calculating settings
        if (payload.frame <= Frames.FIRST) {
            const playerIndex = payload.playerIndex;
            const playersByIndex = _.keyBy(this.settings.players, "playerIndex");
            switch (payload.internalCharacterId) {
                case 0x7:
                    playersByIndex[playerIndex].characterId = 0x13; // Sheik
                    break;
                case 0x13:
                    playersByIndex[playerIndex].characterId = 0x12; // Zelda
                    break;
            }
        }
        if (payload.frame > Frames.FIRST) {
            this._completeSettings();
        }
    }
    _handleFrameUpdate(command, payload) {
        payload = payload;
        const location = command === Command.PRE_FRAME_UPDATE ? "pre" : "post";
        const field = payload.isFollower ? "followers" : "players";
        const currentFrameNumber = payload.frame;
        this.latestFrameIndex = currentFrameNumber;
        _.set(this.frames, [currentFrameNumber, field, payload.playerIndex, location], payload);
        _.set(this.frames, [currentFrameNumber, "frame"], currentFrameNumber);
        // If file is from before frame bookending, add frame to stats computer here. Does a little
        // more processing than necessary, but it works
        const settings = this.getSettings();
        if (settings && (!settings.slpVersion || semver.lte(settings.slpVersion, "2.2.0"))) {
            this.emit(SlpParserEvent.FRAME, this.frames[currentFrameNumber]);
            // Finalize the previous frame since no bookending exists
            this._finalizeFrames(currentFrameNumber - 1);
        }
        else {
            _.set(this.frames, [currentFrameNumber, "isTransferComplete"], false);
        }
    }
    _handleItemUpdate(payload) {
        var _a;
        const currentFrameNumber = payload.frame;
        const items = (_a = this.frames[currentFrameNumber].items) !== null && _a !== void 0 ? _a : [];
        items.push(payload);
        // Set items with newest
        _.set(this.frames, [currentFrameNumber, "items"], items);
    }
    _handleFrameBookend(payload) {
        const latestFinalizedFrame = payload.latestFinalizedFrame;
        const currentFrameNumber = payload.frame;
        _.set(this.frames, [currentFrameNumber, "isTransferComplete"], true);
        // Fire off a normal frame event
        this.emit(SlpParserEvent.FRAME, this.frames[currentFrameNumber]);
        // Finalize frames if necessary
        const validLatestFrame = this.settings.gameMode === GameMode.ONLINE;
        if (validLatestFrame && latestFinalizedFrame >= Frames.FIRST) {
            // Ensure valid latestFinalizedFrame
            if (this.options.strict && latestFinalizedFrame < currentFrameNumber - MAX_ROLLBACK_FRAMES) {
                throw new Error(`latestFinalizedFrame should be within ${MAX_ROLLBACK_FRAMES} frames of ${currentFrameNumber}`);
            }
            this._finalizeFrames(latestFinalizedFrame);
        }
        else {
            // Since we don't have a valid finalized frame, just finalize the frame based on MAX_ROLLBACK_FRAMES
            this._finalizeFrames(currentFrameNumber - MAX_ROLLBACK_FRAMES);
        }
    }
    /**
     * Fires off the FINALIZED_FRAME event for frames up until a certain number
     * @param num The frame to finalize until
     */
    _finalizeFrames(num) {
        while (this.lastFinalizedFrame < num) {
            const frameToFinalize = this.lastFinalizedFrame + 1;
            const frame = this.getFrame(frameToFinalize);
            // Check that we have all the pre and post frame data for all players if we're in strict mode
            if (this.options.strict) {
                for (const player of this.settings.players) {
                    const playerFrameInfo = frame.players[player.playerIndex];
                    // Allow player frame info to be empty in non 1v1 games since
                    // players which have been defeated will have no frame info.
                    if (this.settings.players.length > 2 && !playerFrameInfo) {
                        continue;
                    }
                    const { pre, post } = playerFrameInfo;
                    if (!pre || !post) {
                        const preOrPost = pre ? "pre" : "post";
                        throw new Error(`Could not finalize frame ${frameToFinalize} of ${num}: missing ${preOrPost}-frame update for player ${player.playerIndex}`);
                    }
                }
            }
            // Our frame is complete so finalize the frame
            this.emit(SlpParserEvent.FINALIZED_FRAME, frame);
            this.lastFinalizedFrame = frameToFinalize;
        }
    }
    _completeSettings() {
        if (!this.settingsComplete) {
            this.settingsComplete = true;
            this.emit(SlpParserEvent.SETTINGS, this.settings);
        }
    }
}

/**
 * Slippi Game class that wraps a file
 */
class SlippiGame {
    constructor(input, opts) {
        this.metadata = null;
        this.finalStats = null;
        this.readPosition = null;
        this.actionsComputer = new ActionsComputer();
        this.conversionComputer = new ConversionComputer();
        this.comboComputer = new ComboComputer();
        this.stockComputer = new StockComputer();
        this.inputComputer = new InputComputer();
        if (_.isString(input)) {
            this.input = {
                source: SlpInputSource.FILE,
                filePath: input,
            };
        }
        else if (input instanceof Buffer) {
            this.input = {
                source: SlpInputSource.BUFFER,
                buffer: input,
            };
        }
        else if (input instanceof ArrayBuffer) {
            this.input = {
                source: SlpInputSource.BUFFER,
                buffer: Buffer.from(input),
            };
        }
        else {
            throw new Error("Cannot create SlippiGame with input of that type");
        }
        // Set up stats calculation
        this.statsComputer = new Stats(opts);
        this.statsComputer.register(this.actionsComputer, this.comboComputer, this.conversionComputer, this.inputComputer, this.stockComputer);
        this.parser = new SlpParser();
        this.parser.on(SlpParserEvent.SETTINGS, (settings) => {
            this.statsComputer.setup(settings);
        });
        // Use finalized frames for stats computation
        this.parser.on(SlpParserEvent.FINALIZED_FRAME, (frame) => {
            this.statsComputer.addFrame(frame);
        });
    }
    _process(settingsOnly = false) {
        if (this.parser.getGameEnd() !== null) {
            return;
        }
        const slpfile = openSlpFile(this.input);
        // Generate settings from iterating through file
        this.readPosition = iterateEvents(slpfile, (command, payload) => {
            if (!payload) {
                // If payload is falsy, keep iterating. The parser probably just doesn't know
                // about this command yet
                return false;
            }
            this.parser.handleCommand(command, payload);
            return settingsOnly && this.parser.getSettings() !== null;
        }, this.readPosition);
        closeSlpFile(slpfile);
    }
    /**
     * Gets the game settings, these are the settings that describe the starting state of
     * the game such as characters, stage, etc.
     */
    getSettings() {
        // Settings is only complete after post-frame update
        this._process(true);
        return this.parser.getSettings();
    }
    getLatestFrame() {
        this._process();
        return this.parser.getLatestFrame();
    }
    getGameEnd() {
        this._process();
        return this.parser.getGameEnd();
    }
    getFrames() {
        this._process();
        return this.parser.getFrames();
    }
    getStats() {
        if (this.finalStats) {
            return this.finalStats;
        }
        this._process();
        const settings = this.parser.getSettings();
        if (settings === null) {
            return null;
        }
        // Finish processing if we're not up to date
        this.statsComputer.process();
        const inputs = this.inputComputer.fetch();
        const stocks = this.stockComputer.fetch();
        const conversions = this.conversionComputer.fetch();
        const playableFrames = this.parser.getPlayableFrameCount();
        const overall = generateOverallStats(settings, inputs, stocks, conversions, playableFrames);
        const stats = {
            lastFrame: this.parser.getLatestFrameNumber(),
            playableFrameCount: playableFrames,
            stocks: stocks,
            conversions: conversions,
            combos: this.comboComputer.fetch(),
            actionCounts: this.actionsComputer.fetch(),
            overall: overall,
            gameComplete: this.parser.getGameEnd() !== null,
        };
        if (this.parser.getGameEnd() !== null) {
            // If the game is complete, store a cached version of stats because it should not
            // change anymore. Ideally the statsCompuer.process and fetch functions would simply do no
            // work in this case instead but currently the conversions fetch function,
            // generateOverallStats, and maybe more are doing work on every call.
            this.finalStats = stats;
        }
        return stats;
    }
    getMetadata() {
        if (this.metadata) {
            return this.metadata;
        }
        const slpfile = openSlpFile(this.input);
        this.metadata = getMetadata(slpfile);
        closeSlpFile(slpfile);
        return this.metadata;
    }
    getFilePath() {
        var _a;
        if (this.input.source !== SlpInputSource.FILE) {
            return null;
        }
        return (_a = this.input.filePath) !== null && _a !== void 0 ? _a : null;
    }
}

export { ActionsComputer, Character, ComboComputer, Command, ConnectionEvent, ConnectionStatus, ConsoleConnection, ConversionComputer, DolphinConnection, DolphinMessageType, Frames, GameMode, InputComputer, MAX_ROLLBACK_FRAMES, NETWORK_MESSAGE, Ports, SlippiGame, SlpFile, SlpFileWriter, SlpFileWriterEvent, SlpParser, SlpParserEvent, SlpStream, SlpStreamEvent, SlpStreamMode, Stage, State, Stats, StockComputer, Timers, animations, calcDamageTaken, characters, didLoseStock, generateOverallStats, getSinglesPlayerPermutationsFromSettings, isCommandGrabbed, isDamaged, isDead, isDown, isGrabbed, isInControl, isTeching, moves$1 as moves, stages$1 as stages };
