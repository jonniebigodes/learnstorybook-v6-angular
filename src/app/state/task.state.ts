import { Action, Selector, State, StateContext } from '@ngxs/store';

import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

// defines the actions available to the app
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
  // defines the new error field we need
  ERROR: 'APP_ERROR',
};

export class ArchiveTask {
  static readonly type = actions.ARCHIVE_TASK;

  constructor(public payload: string) {}
}

export class PinTask {
  static readonly type = actions.PIN_TASK;

  constructor(public payload: string) {}
}
// the class definition for our error field
export class AppError {
  static readonly type = actions.ERROR;
  constructor(public payload: boolean) {}
}

// The initial state of our store when the app loads.
// Usually you would fetch this from a server
const defaultTasks = {
  1: { id: '1', title: 'Something', state: 'TASK_INBOX' },
  2: { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  3: { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  4: { id: '4', title: 'Something again', state: 'TASK_INBOX' },
};

export class TaskStateModel {
  entities: { [id: number]: Task };
  error: boolean;
}

// sets the default state
@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    entities: defaultTasks,
    error: false,
  },
})@Injectable()

export class TasksState {
  @Selector()
  static getAllTasks(state: TaskStateModel): Task[] {
    const entities = state.entities;
    return Object.keys(entities).map(id => entities[+id]);
  }

  // defines a new selector for the error field
  @Selector()
  static getError(state: TaskStateModel): boolean {
    const { error } = state;
    return error;
  }
  //
  // triggers the PinTask action, similar to redux
  @Action(PinTask)
  pinTask({ patchState, getState }: StateContext<TaskStateModel>, { payload }: PinTask): void {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: 'TASK_PINNED' },
    };

    patchState({
      entities,
    });
  }
  // triggers the PinTask action, similar to redux
  @Action(ArchiveTask)
  archiveTask({ patchState, getState }: StateContext<TaskStateModel>, { payload }: ArchiveTask): void {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: 'TASK_ARCHIVED' },
    };

    patchState({
      entities,
    });
  }

  // function to handle how the state should be updated when the action is triggered
  @Action(AppError)
  setAppError({ patchState, getState }: StateContext<TaskStateModel>, { payload }: AppError): void {
    const state = getState();
    patchState({
      error: !state.error,
    });
  }
}
