import { Box, HStack, IconButton, Text, VStack } from '@hope-ui/solid'
import { ArrowLeft, ArrowRight } from 'phosphor-solid'
import { groupBy } from 'rambda'
import { createMemo, JSX, Show } from 'solid-js'
import { characterNameByExternalId } from '../common/ids'
import { PlayerSettings } from '../common/types'
import { nextFile, previousFile, store } from '../state'

export function NowPlaying (): JSX.Element {
  function player (p: PlayerSettings): string {
    return p.displayName !== '' && p.connectCode !== ''
      ? `${p.displayName}(${p.connectCode})`
      : `P${p.port}(${characterNameByExternalId[p.externalCharacterId]})`
  }
  const info = createMemo(() => {
    return store.replayData === undefined
      ? {}
      : {
          name: store.files[store.currentFile].name,
          date: new Date(
            store.replayData.settings.startTimestamp
          ).toLocaleString(),
          platform: store.replayData.settings.platform,
          console: store.replayData.settings.consoleNickname,
          players: Object.values(
            groupBy(
              (p) => String(p.teamId),
              store.replayData.settings.playerSettings.filter((p) => p)
            )
          )
            .map((players) => players.map(player).join(', '))
            .join('\n')
        }
  })
  return (
    <HStack width='$full' justifyContent='space-between' gap='$2'>
      <IconButton
        aria-label='Previous File'
        onClick={previousFile}
        variant='subtle'
        icon={<ArrowLeft size='24' />}
      />
      <VStack alignItems='start'>
        <Box>File: {info().name}</Box>
        <Show when={info().date}>
          <Box>Date: {info().date}</Box>
        </Show>
        <Show when={info().platform}>
          <Box>Platform: {info().platform}</Box>
        </Show>
        <Show when={info().console}>
          <Box>Console: {info().console}</Box>
        </Show>
        <Show when={info().players !== ''}>
          <HStack gap='$2'>
            <Box>Players:</Box>
            <Text css={{ 'white-space': 'pre-line' }}>{info().players}</Text>
          </HStack>
        </Show>
      </VStack>
      <IconButton
        aria-label='Next File'
        onClick={nextFile}
        variant='subtle'
        icon={<ArrowRight size='24' />}
      />
    </HStack>
  )
}
