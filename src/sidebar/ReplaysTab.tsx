import { Badge, Box, hope, HStack, VStack } from '@hope-ui/solid'
import { createOptions, Select } from '@thisbeyond/solid-select'
import { groupBy } from 'rambda'
import { createMemo, JSX } from 'solid-js'
import {
  characterNameByExternalId,
  ExternalStageName,
  stageNameByExternalId
} from '../common/ids'
import { Picker } from '../common/Picker'
import { GameSettings, PlayerSettings } from '../common/types'
import { gameSettings, setFile, setFilters, store } from '../state'
import { Upload } from './Upload'
import './select.css'
import { NowPlaying } from './NowPlaying'

const filterProps = createOptions(
  [
    ...characterNameByExternalId.map((name) => ({
      type: 'character',
      label: name
    })),
    ...stageNameByExternalId.map((name) => ({ type: 'stage', label: name }))
  ],
  {
    key: 'label',
    createable: (code) => ({ type: 'codeOrName', label: code })
  }
)
export function ReplaysTab (): JSX.Element {
  const filteredGameSettings = createMemo(() =>
    store.filteredIndexes === undefined
      ? gameSettings()
      : store.filteredIndexes.map((i) => gameSettings()[i])
  )
  const HopeSelect = hope(Select)
  return (
    <>
      <VStack height='$full' gap='$2'>
        <Upload />
        <Box
          width='$full'
          onkeydown={(e: Event) => e.stopPropagation()}
          onkeyup={(e: Event) => e.stopPropagation()}
        >
          <HopeSelect
            class='custom'
            width='$full'
            placeholder='Filter'
            multiple
            {...filterProps}
            initialValue={store.filters}
            onChange={setFilters}
          />
        </Box>
        <Box width='$full' overflowY='auto'>
          <Picker
            items={filteredGameSettings()}
            render={(gameSettings: GameSettings) => (
              <GameInfo gameSettings={gameSettings} />
            )}
            onClick={async (_, index) =>
              await setFile(
                gameSettings().indexOf(filteredGameSettings()[index])
              )}
            selected={(settings) =>
              gameSettings().indexOf(settings) === store.currentFile}
          />
        </Box>
        <NowPlaying />
      </VStack>
    </>
  )
}

function GameInfo (props: { gameSettings: GameSettings }): JSX.Element {
  function playerString (player: PlayerSettings): string {
    const name = [player.displayName, player.connectCode, player.nametag].find(
      (s) => s?.length > 0
    )
    const character = characterNameByExternalId[player.externalCharacterId]
    return name !== undefined ? `${name}(${character})` : character
  }

  return (
    <>
      <HStack width='$full'>
        <StageBadge stage={stageNameByExternalId[props.gameSettings.stageId]} />
        <VStack flexGrow='1'>
          {props.gameSettings.isTeams
            ? Object.values(
              groupBy(
                (p) => String(p.teamId),
                props.gameSettings.playerSettings.filter((s) => s)
              )
            ).map((team) => (
              <Box color={['red', 'blue', 'green'][team[0].teamId]}>
                {team.map(playerString).join(' + ')}
              </Box>
            ))
            : props.gameSettings.playerSettings
              .filter((s) => s)
              .map(playerString)
              .join(' vs ')}
        </VStack>
      </HStack>
    </>
  )
}

function StageBadge (props: { stage: ExternalStageName }): JSX.Element {
  const abbreviations: Partial<{ [key in ExternalStageName]: string }> = {
    'Final Destination': 'FD',
    'Pokémon Stadium': 'PS',
    Battlefield: 'BF',
    'Fountain of Dreams': 'FoD',
    "Yoshi's Story": 'YS',
    'Dream Land N64': 'DL'
  }
  const colors: Partial<{ [key in ExternalStageName]: string }> = {
    'Final Destination': 'fuchsia',
    'Pokémon Stadium': 'blue',
    Battlefield: 'dimgray',
    'Fountain of Dreams': 'darkviolet',
    "Yoshi's Story": 'green',
    'Dream Land N64': 'chocolate'
  }
  return (
    <Badge backgroundColor={colors[props.stage] ?? 'black'} color='white'>
      {abbreviations[props.stage] ?? '??'}
    </Badge>
  )
}
