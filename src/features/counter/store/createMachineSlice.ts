import {
  Event,
  EventData,
  EventObject,
  interpret,
  SingleOrArray,
} from "xstate";
import { StateCreator } from "zustand";
import machine, { CounterEvent, Machine } from "../machines/counterMachine";

type SendAction<T extends EventObject> = (
  event: Event<T> | SingleOrArray<Event<T>>,
  payload?: EventData | undefined
) => void;

// Declare interface for the slice
export interface CreateMachineSliceProps {
  state: Machine;
  send: SendAction<CounterEvent>;
  destroy: () => void;
}

const createMachineSlice: StateCreator<CreateMachineSliceProps> = (set) => {
  const service = interpret(machine)
    .onTransition((state) => set({ state }))
    .start();
  return {
    state: service.getSnapshot(),
    send: service.send,
    destroy: () => service.stop(),
  };
};

export default createMachineSlice;
