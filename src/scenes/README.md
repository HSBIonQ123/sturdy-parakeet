# scenes/

Empty in State 1, deliberately.

State 4 puts the scene sequencer here: an ordered list of `ViewState` slices
that a talk walks through. `state/viewState.ts` already stores `view` as a
discriminated scene descriptor rather than a boolean, so a scene serialises
directly and no translation layer is needed.
