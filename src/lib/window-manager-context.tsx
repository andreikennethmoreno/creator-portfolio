"use client";

import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";

export interface AppDef {
  id: string;
  title: string;
}

export const APPS: AppDef[] = [
  { id: "hero", title: "Hero" },
  { id: "instagram", title: "Instagram" },
  { id: "youtube", title: "YouTube" },
  { id: "reading", title: "Reading" },
  { id: "listening", title: "Listening" },
  { id: "projects", title: "Projects" },
  { id: "threads", title: "Feed" },
  { id: "support", title: "Support" },
];

export interface AppWindow {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  zIndex: number;
}

interface WMState {
  windows: AppWindow[];
  zTop: number;
  idCounter: number;
}

type WMAction =
  | { type: "OPEN"; appId: string; title: string }
  | { type: "CLOSE"; id: string }
  | { type: "MINIMIZE"; id: string }
  | { type: "RESTORE"; id: string }
  | { type: "FOCUS"; id: string }
  | { type: "MOVE"; id: string; x: number; y: number }
  | { type: "RESIZE"; id: string; x: number; y: number; width: number; height: number };

function wmReducer(state: WMState, action: WMAction): WMState {
  switch (action.type) {
    case "OPEN": {
      const existing = state.windows.find((w) => w.appId === action.appId);
      if (existing) {
        if (existing.minimized) {
          return {
            ...state,
            zTop: state.zTop + 1,
            windows: state.windows.map((w) =>
              w.id === existing.id
                ? { ...w, minimized: false, zIndex: state.zTop + 1 }
                : w
            ),
          };
        }
        return state;
      }
      const count = state.windows.length;
      const newZ = state.zTop + 1;
      const newWin: AppWindow = {
        id: `win-${state.idCounter}`,
        appId: action.appId,
        title: action.title,
        x: 80 + (count % 5) * 32,
        y: 60 + (count % 5) * 32,
        width: 520,
        height: 400,
        minimized: false,
        zIndex: newZ,
      };
      return {
        windows: [...state.windows, newWin],
        zTop: newZ,
        idCounter: state.idCounter + 1,
      };
    }
    case "CLOSE":
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
      };
    case "MINIMIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w
        ),
      };
    case "RESTORE": {
      const newZ = state.zTop + 1;
      return {
        ...state,
        zTop: newZ,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: false, zIndex: newZ } : w
        ),
      };
    }
    case "FOCUS": {
      const win = state.windows.find((w) => w.id === action.id);
      if (!win || win.zIndex === state.zTop) return state;
      const newZ = state.zTop + 1;
      return {
        ...state,
        zTop: newZ,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, zIndex: newZ } : w
        ),
      };
    }
    case "MOVE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, x: action.x, y: action.y } : w
        ),
      };
    case "RESIZE":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, x: action.x, y: action.y, width: action.width, height: action.height }
            : w
        ),
      };
  }
}

interface WMContextType {
  windows: AppWindow[];
  openWindow: (app: AppDef) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, x: number, y: number, w: number, h: number) => void;
  isAppOpen: (appId: string) => boolean;
  isAppMinimized: (appId: string) => boolean;
  getWindow: (appId: string) => AppWindow | undefined;
}

const WMContext = createContext<WMContextType | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wmReducer, {
    windows: [],
    zTop: 0,
    idCounter: 0,
  });

  const openWindow = useCallback(
    (app: AppDef) => dispatch({ type: "OPEN", appId: app.id, title: app.title }),
    []
  );
  const closeWindow = useCallback(
    (id: string) => dispatch({ type: "CLOSE", id }),
    []
  );
  const minimizeWindow = useCallback(
    (id: string) => dispatch({ type: "MINIMIZE", id }),
    []
  );
  const restoreWindow = useCallback(
    (id: string) => dispatch({ type: "RESTORE", id }),
    []
  );
  const focusWindow = useCallback(
    (id: string) => dispatch({ type: "FOCUS", id }),
    []
  );
  const moveWindow = useCallback(
    (id: string, x: number, y: number) =>
      dispatch({ type: "MOVE", id, x, y }),
    []
  );
  const resizeWindow = useCallback(
    (id: string, x: number, y: number, width: number, height: number) =>
      dispatch({ type: "RESIZE", id, x, y, width, height }),
    []
  );
  const isAppOpen = useCallback(
    (appId: string) => state.windows.some((w) => w.appId === appId),
    [state.windows]
  );
  const isAppMinimized = useCallback(
    (appId: string) => {
      const win = state.windows.find((w) => w.appId === appId);
      return win ? win.minimized : false;
    },
    [state.windows]
  );
  const getWindow = useCallback(
    (appId: string) => state.windows.find((w) => w.appId === appId),
    [state.windows]
  );

  return (
    <WMContext.Provider
      value={{
        windows: state.windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        restoreWindow,
        focusWindow,
        moveWindow,
        resizeWindow,
        isAppOpen,
        isAppMinimized,
        getWindow,
      }}
    >
      {children}
    </WMContext.Provider>
  );
}

export function useWindowManager() {
  const ctx = useContext(WMContext);
  if (!ctx) throw new Error("useWindowManager outside WindowManagerProvider");
  return ctx;
}
