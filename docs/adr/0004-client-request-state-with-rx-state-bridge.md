# 4. Request state of Client Components with rx-state-bridge

Date: 2026-10-06

## Status

Accepted

## Context

Reads happen on the server (ADR 0002), so only a few requests start in the browser: asking for a
sign-in code, verifying it, signing out, and later loading older visits in a timeline. Each needs
the same handful of states: busy, failed, and sometimes a short "code sent" confirmation. Written
by hand with `useState` and `try`/`finally`, every one of them repeats the same bugs: a spinner
that flashes for a fast answer, a state update after the component is gone, a confirmation timer
that outlives the request that started it.

## Decision

Client Components wrap each request in an RxJS pipeline and use the operators of
[rx-state-bridge](https://github.com/samuelcsantana/rx-state-bridge):

- `defer(() => service.call())` so the request starts on subscription;
- `withSmoothLoading(setBusy, 400)` keeps the busy state for at least 400 ms, so a fast answer
  does not flash the button;
- `catchToState(setError)` turns a failure into state and completes the stream;
- `withTemporarySuccess(setCodeSent, 4000, { signal })` shows the confirmation for four seconds,
  cancellable when a newer request supersedes it;
- `tap(...)` moves to the next step or navigates only on success.

The subscription lives in a ref and is unsubscribed when a new request starts and when the
component unmounts, which also cancels pending timers.

## Consequences

- `rx-state-bridge` and its peer `rxjs` (MIT, about 5.9 KB gzip together) are runtime
  dependencies. Nothing else in the dashboard uses RxJS.
- A request answered after the component unmounted changes nothing and navigates nowhere; tests
  assert this with fake timers.
- The pipelines read the same in every Client Component, and the services stay plain promises
  behind their interfaces, so a component can be tested with a fake service.
