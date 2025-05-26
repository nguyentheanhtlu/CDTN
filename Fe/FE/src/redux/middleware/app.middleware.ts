
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { store } from "../store";


export const appMiddleware = createListenerMiddleware();

appMiddleware.startListening({
  predicate: (action) => {
    return action.type?.startsWith("project/create-project")
  },
  effect: async (action, listenerApi) => {
    switch (action.type) {
      // case 'project/create-project/fulfilled':
      //   listenerApi.dispatch(loadProjects())
    }
  }
})