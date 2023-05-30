import { assign, createMachine, StateFrom } from "xstate";

export type CounterEvent = { type: "INCREMENT" } | { type: "DECREMENT" };

export interface CounterContext {
  count: number;
}

export const initialCounterContext: CounterContext = {
  count: 0,
};

const machine =
  /** @xstate-layout N4IgpgJg5mDOIC5QGMD2BXAdgFzAJwDoBLCAGzAGIBJAOQGEAlAUQFkmaAVAbQAYBdRKAAOqWEWxFUmQSAAeiAIwBWBQR7qeygExKAHAHZdATh4A2ADQgAnoi0AWAMxrdD12-cOFAXy+W0WXEIScgoAESZGVnZufhkRMQkpGXkEZVUNTSUdA2MzSxtUh30CPQ8y718Qfxx8YkxkPDAAWzAcIkwoCl4BJBB48UlpXpStBS0CUzszKezDEwtrRSMlEpcy9wq-DBrCCDAG5taJDq7Y3v7EodARsYmpyZ5Z3IWCk2d1jx9KzFQ9+F7qoE4qIBklhogALQvSGmHxbAK1YJgYEJQbJRB2LT5RTqAgKD6fSqAxH1RotNodFGgq5yRAOHjFfQORwmJ7zbGpAxwqrbQIEPYHcnHKBUy7ohD0xnMhysvRzPKLBC6VRKL5eIA */
  createMachine<CounterContext, CounterEvent>(
    {
      id: "counter",
      predictableActionArguments: true,
      context: {
        count: 0,
      },
      initial: "idle",
      states: {
        idle: {
          on: {
            INCREMENT: "incrementing",
            DECREMENT: "decrementing",
          },
        },
        incrementing: {
          always: "delay",
        },
        decrementing: {
          always: "idle",
          entry: ["decrement"],
        },
        delay: {
          exit: ["log"],
          invoke: {
            id: "delay",
            src: "request",
            onDone: { target: "idle", actions: ["increment"] },
          },
        },
      },
    },
    {
      actions: {
        log: () => console.log("log"),
        increment: assign((ctx) => ({ count: ctx.count + 1 })),
        decrement: assign((ctx) => ({ count: ctx.count - 1 })),
      },
    }
  );

export type Machine = StateFrom<typeof machine>;

export default machine;
