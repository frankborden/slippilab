import { battlefield } from './battlefield';
import { dreamland } from './dreamland';
import { pokemonStadium } from './pstadium';
import { yoshis } from './ystory';
import { fd } from './fdest';
import { fountain } from './fountain';
import type { Stage } from '../stages/stage';

const stageByStageId: { [id: number]: Stage } = {
  //000 [000]   // Dummy
  //001 [001]   // TEST

  2: fountain, //002 [002]   // Fountain of Dreams (Izumi)
  3: pokemonStadium, //003 [003]   // Pokémon Stadium (Pstadium)
  //004 [004]   // Princess Peach's Castle (Castle)
  //005 [005]   // Kongo Jungle (Kongo)
  //006 [006]   // Brinstar (Zebes)
  //007 [007]   // Corneria
  8: yoshis, //008 [008]   // Yoshi's Story (Story)
  //009 [009]   // Onett
  //010 [00A]   // Mute City
  //011 [00B]   // Rainbow Cruise (RCruise)
  //012 [00C]   // Jungle Japes (Garden)
  //013 [00D]   // Great Bay
  //014 [00E]   // Hyrule Temple (Shrine)
  //015 [00F]   // Brinstar Depths (Kraid)
  //016 [010]   // Yoshi's Island (Yoster)
  //017 [011]   // Green Greens (Greens)
  //018 [012]   // Fourside
  //019 [013]   // Mushroom Kingdom I (Inishie1)
  //020 [014]   // Mushroom Kingdom II (Inishie2)
  // 021 [015]   // Akaneia (Deleted Stage)
  //022 [016]   // Venom
  //023 [017]   // Poké Floats (Pura)
  //025 [019]   // Icicle Mountain (Icemt)

  //026 [01A]   // Icetop
  //027 [01B]   // Flat Zone
  28: dreamland, //028 [01C]   // Dream Land N64 (old ppp)
  //029 [01D]   // Yoshi's Island N64 (old yosh)
  //030 [01E]   // Kongo Jungle N64 (old kong)
  31: battlefield, //031 [01F]   // Battlefield (battle)
  32: fd, //032 [020]   // Final Destination (last)
};

export const getStage = function (stageId: number): Stage {
  if (!stageByStageId[stageId]) {
    console.log('STAGE IS NOT COMPATIBLE!');
    stageId = 31;
  }
  return stageByStageId[stageId];
};

export const stageExists = function (val: number): boolean {
  return !(stageByStageId[val] == null);
};
