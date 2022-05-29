import { Badge, Box, Center, HStack, useColorModeValue } from '@hope-ui/solid'
import { JSX, createMemo } from 'solid-js'
import { Picker } from '../common/Picker'
import { Highlight } from '../search/search'
import { setClip, store } from '../state'

export function ClipsTab (): JSX.Element {
  const playerColors = useColorModeValue(
    ['red', 'blue', 'gold', 'green'],
    ['darkred', 'darkblue', 'darkgoldenrod', 'darkgreen']
  )
  function renderClip ([name, clip]: [string, Highlight]): JSX.Element {
    const index = Object.keys(store.clips).indexOf(name)
    const nameColorScheme = (
      [
        'primary',
        'accent',
        'neutral',
        'success',
        'info',
        'warning',
        'danger'
      ] as const
    )[index % 7]
    return (
      <>
        <HStack width='$full'>
          <HStack gap='$1'>
            <Badge
              color='white'
              backgroundColor={playerColors()[clip.playerIndex]}
            >
              {`P${clip.playerIndex + 1}`}
            </Badge>
            <Badge colorScheme={nameColorScheme}>{name}</Badge>
          </HStack>
          <Center flexGrow='1'>{`${clip.startFrame}-${clip.endFrame}`}</Center>
        </HStack>
      </>
    )
  }
  const entries = createMemo(() => {
    return Array.from(Object.entries(store.clips)).flatMap(([name, clips]) =>
      clips.map((clip): [string, Highlight] => [name, clip])
    )
  })
  return (
    <>
      <Box overflowY='auto'>
        <Picker
          items={entries()}
          render={renderClip}
          onClick={(_, index) => setClip(index)}
          selected={(_, index) => index === store.currentClip}
        />
      </Box>
    </>
  )
}
