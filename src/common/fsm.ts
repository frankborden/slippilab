import { createSignal } from "solid-js";

/**
 * For states extend this and overwrite type with a string constant.
 */
export interface StateBase {
  type: string;
}

/**
 * For events extend this and overwrite type with a string constant.
 */
export interface EventBase {
  type: string;
}

/**
 * A transition or entry/exit function.
 */
export type Reducer<
  InputState extends StateBase,
  ReturnState extends StateBase,
  Event extends EventBase
> = (current: InputState, event: Event) => ReturnState;

/**
 * A map of states with transitions and entry/exit functions for each state
 */
export type Schema<State extends StateBase, Event extends EventBase> = {
  [StateType in State["type"]]?: StateSchema<
    State & { type: StateType },
    State,
    Event
  >;
};

/**
 * A list of transitions and entry/exit functions for a state
 */
export type StateSchema<
  InputState extends StateBase,
  ReturnState extends StateBase,
  Event extends EventBase
> = {
  on?: {
    [EventType in Event["type"]]?: Reducer<
      InputState,
      ReturnState,
      Event & { type: EventType }
    >;
  };
  // TODO: handle entry reducer changing type. Should the other entry reducers
  // still execute?
  entry?: Reducer<InputState, ReturnState, Event>[];
  // TODO: handle exit reducer changing type. Should the other exit reducers
  // still execute?
  exit?: Reducer<InputState, ReturnState, Event>[];
};

/**
 * Starts a state machine with the given initialState and Schema. Pass your
 * state and event types as generics:
 *
 *   interface ActiveState extends StateBase {type: 'active'}
 *   interface InactiveState extends StateBase {type: 'inactive'}
 *   interface ToggleEvent extends EventBase {type: 'toggle'}
 *   const [state, send] = createMachine<
 *     ActiveState | InactiveState,
 *     ToggleEvent,
 *   >(
 *     {type: 'inactive'},
 *     {
 *       active: {
 *         on: {toggle: (state, event) => ({type: 'inactive'})}
 *       },
 *       inactive: {
 *         on: {toggle: (state, event) => ({type: 'active'})}
 *       }
 *     }
 *   );
 *
 *   console.log(state()); // {type: 'inactive'}
 *   send({type: 'toggle'});
 *   console.log(state()); // {type: 'active'}
 */
export function createMachine<State extends StateBase, Event extends EventBase>(
  initialState: State,
  schema: Schema<State, Event>
) {
  const [state, setState] = createSignal<State>(initialState);
  function reduce(current: State, event: Event) {
    const transition =
      schema[current.type as State["type"]]?.on?.[event.type as Event["type"]];
    let next = transition ? transition(current, event) : current;
    if (current.type !== next.type) {
      const exit = schema[current.type as State["type"]]?.exit;
      console.log("exit", exit);
      exit?.forEach((fn) => (next = fn(next, event)));
      const entry = schema[next.type as State["type"]]?.entry;
      entry?.forEach((fn) => (next = fn(next, event)));
    }
    return next;
  }
  function send(event: Event) {
    setState((currentState) => reduce(currentState, event));
  }
  return [state, send] as const;
}
