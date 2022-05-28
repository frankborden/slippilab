import {
  adjust,
  frame,
  speedFast,
  jump,
  jumpPercent,
  pause,
  speedSlow,
  tick,
  tickBack,
  togglePause,
  speedNormal,
  zoomOut,
  zoomIn,
  nextFile,
  previousFile,
  toggleDebug,
  nextClip,
  previousClip,
  store
} from '../state'
import { Box, hope, HStack } from '@hope-ui/solid'
import { controlsColor } from './colors'
import { onCleanup, onMount, Show, JSX } from 'solid-js'
import {
  ClockClockwise,
  ClockCounterClockwise,
  FastForward,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Pause,
  Play,
  Rewind
} from 'phosphor-solid'

export function Controls (): JSX.Element {
  onMount(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
  })
  onCleanup(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
  })

  function onKeyDown ({ key }: KeyboardEvent): void {
    switch (key) {
      case 'k':
      case ' ':
        togglePause()
        break
      case 'ArrowRight':
      case 'l':
        adjust(120)
        break
      case 'ArrowLeft':
      case 'j':
        adjust(-120)
        break
      case '.':
        pause()
        tick()
        break
      case ',':
        pause()
        tickBack()
        break
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        jumpPercent(Number(key) * 0.1) // convert 3 => 30%
        break
      case 'ArrowUp':
        speedSlow()
        break
      case 'ArrowDown':
        speedFast()
        break
      case '-':
      case '_':
        zoomOut()
        break
      case '=':
      case '+':
        zoomIn()
        break
      case ']':
      case '}':
        void nextFile()
        break
      case '[':
      case '{':
        void previousFile()
        break
      case "'":
      case '"':
        nextClip()
        break
      case ';':
      case ':':
        previousClip()
        break
      case 'd':
        toggleDebug()
        break
    }
  }

  function onKeyUp ({ key }: KeyboardEvent): void {
    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
        speedNormal()
        break
    }
  }

  let seekbarInput!: HTMLInputElement

  return (
    <foreignObject
      transform='scale(1 -1)'
      x='-50%'
      y='-50%'
      width='100%'
      height='100%'
    >
      <HStack
        justifyContent='space-evenly'
        gap='$4'
        paddingLeft='$2'
        paddingRight='$4'
        color={controlsColor}
      >
        <Box width='6ch' textAlign='end'>
          {store.isDebug ? frame() - 123 : frame()}
        </Box>
        <HStack gap='$2'>
          <ClockCounterClockwise
            style={{ cursor: 'pointer' }}
            size={32}
            weight='fill'
            onClick={() => adjust(-120)}
          />
          <Rewind
            style={{ cursor: 'pointer' }}
            size={32}
            weight='fill'
            onClick={() => {
              pause()
              tickBack()
            }}
          />
          <Show
            when={store.running}
            fallback={
              <Play
                style={{ cursor: 'pointer' }}
                size={32}
                weight='fill'
                onClick={() => togglePause()}
              />
            }
          >
            <Pause
              style={{ cursor: 'pointer' }}
              size={32}
              weight='fill'
              onClick={() => togglePause()}
            />
          </Show>
          <FastForward
            style={{ cursor: 'pointer' }}
            size={32}
            weight='fill'
            onClick={() => {
              pause()
              tick()
            }}
          />
          <ClockClockwise
            style={{ cursor: 'pointer' }}
            size={32}
            weight='fill'
            onClick={() => adjust(120)}
          />
        </HStack>
        <hope.input
          type='range'
          width='$lg'
          css={{
            'accent-color': 'var(--hope-colors-primary9)'
          }}
          ref={seekbarInput}
          value={frame()}
          max={store.replayData!.frames.length - 1}
          onInput={() => jump(Number(seekbarInput.value))}
        />
        <HStack gap='$2'>
          <MagnifyingGlassMinus
            style={{ cursor: 'pointer' }}
            size={32}
            onClick={() => zoomOut()}
          />
          <MagnifyingGlassPlus
            style={{ cursor: 'pointer' }}
            weight='bold'
            size={32}
            onClick={() => zoomIn()}
          />
        </HStack>
      </HStack>
    </foreignObject>
  )
}
