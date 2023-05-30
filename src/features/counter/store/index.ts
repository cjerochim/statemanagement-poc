import { assign } from "xstate";
import xstate from "zustand-middleware-xstate";
import { create, StateCreator } from "zustand";
import { lens, withLenses } from "@dhmk/zustand-lens";

// Example of defining Infra which includes a store and a service
// These a dependency injected into each user case
// The user case uitlises a state machines to manage state

//
import counterMachine from "../machines/counterMachine";

// ***************************************************
// store (Infra)
// ***************************************************

interface PrimaryStoreProps {
  amount: number;
  setValue: (value: number) => void;
  getValue: () => number;
}

const primaryStore: StateCreator<
  CounterStore & Partial<PrimaryStoreProps>,
  [],
  [],
  PrimaryStoreProps
> = (set, get): PrimaryStoreProps => {
  return {
    amount: 0,
    setValue: (value) => set({ amount: value }),
    getValue: () => get().amount!,
  };
};

interface CounterServiceProps {
  request: () => Promise<void>;
}

type PrimaryService = ReturnType<typeof primaryStore>;

// ***************************************************
// Services (Infra)
// ***************************************************
const counterService: StateCreator<
  CounterStore & Partial<CounterServiceProps>,
  [],
  [],
  any
> = (set, get): CounterServiceProps => {
  return {
    request: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
  };
};

type CounterService = ReturnType<typeof counterService>;

// ***************************************************
// Counter 1 (User case)
// ***************************************************
const counterSlice: StateCreator<CounterStore, [], [], any> = (set, get) => {
  return xstate(
    counterMachine.withConfig({
      guards: {},
      services: {
        // Inject dependencies into machine
        request: () => get().service.request(),
      },
      actions: {
        increment: assign((ctx) => ({ count: ctx.count + 1 })),
        decrement: assign((ctx) => ({ count: ctx.count - 1 })),
      },
    })
  );
};

type CounterSlice = ReturnType<typeof counterSlice>;

// ***************************************************
// Counter 2 (User case)
// ***************************************************
const counterSlice2: StateCreator<CounterStore, [], [], any> = (set, get) => {
  return xstate(
    counterMachine.withConfig({
      guards: {},
      services: {
        // Inject dependencies into machine
        request: () => get().service.request(),
      },
      actions: {
        increment: assign((ctx) => ({ count: ctx.count + 1 })),
        decrement: assign((ctx) => ({ count: ctx.count - 1 })),
      },
    })
  );
};

type counterSlice2 = ReturnType<typeof counterSlice2>;

// ***************************************************
// Interface
// ***************************************************

type CounterStore = {
  counter: CounterSlice;
  counter2: counterSlice2;
  service: CounterService;
  primaryService: PrimaryService;
};

// ***************************************************
// Combine to store
// ***************************************************
const useStore = create<CounterStore>(
  withLenses((_, get, api) => ({
    // Infra
    primaryService: lens<CounterService>((set) => primaryStore(set, get, api)),
    // Infra
    service: lens<CounterService>((set) => counterService(set, get, api)),
    // App (User case)
    counter: lens<CounterSlice>((set) => counterSlice(set, get, api)(set)),
    // App (User case)
    counter2: lens<counterSlice2>((set) => counterSlice2(set, get, api)(set)),
  }))
);

export default useStore;
