"use client";

import { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from "react";

export interface AppDef {
  id: string;
  title: string;
}

const MAX_MARGIN = 8;

export const APPS: AppDef[] = [
  { id: "hero", title: "Hero" },
  { id: "instagram", title: "Instagram" },
  { id: "youtube", title: "YouTube" },
  { id: "reading", title: "Reading" },
  { id: "listening", title: "Listening" },
  { id: "vercel", title: "Projects" },

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
  maximized: boolean;
  prevRect: { x: number; y: number; width: number; height: number } | null;
  zIndex: number;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function computeTilingLayout(index: number, count: number, vw: number, vh: number, gap: number): Rect {
  const m = gap;

  if (count <= 0) return { x: 0, y: 0, width: 0, height: 0 };
  if (count === 1) return { x: m, y: m, width: vw - 2 * m, height: vh - 2 * m };

  if (count === 2) {
    const innerW = vw - 3 * m;
    const w = innerW / 2;
    if (index === 0) return { x: m, y: m, width: w, height: vh - 2 * m };
    return { x: 2 * m + w, y: m, width: w, height: vh - 2 * m };
  }

  if (count === 3) {
    const innerW = vw - 3 * m;
    const innerH = vh - 3 * m;
    const mw = innerW * 0.55;
    const sw = innerW * 0.45;
    const sh = innerH / 2;
    if (index === 0) return { x: m, y: m, width: mw, height: vh - 2 * m };
    if (index === 1) return { x: 2 * m + mw, y: m, width: sw, height: sh };
    return { x: 2 * m + mw, y: 2 * m + sh, width: sw, height: sh };
  }

  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const cellW = (vw - (cols + 1) * m) / cols;
  const cellH = (vh - (rows + 1) * m) / rows;
  const col = index % cols;
  const row = Math.floor(index / cols);

  return {
    x: m + col * (cellW + m),
    y: m + row * (cellH + m),
    width: cellW,
    height: cellH,
  };
}

function retileWindows(windows: AppWindow[], vw: number, vh: number): AppWindow[] {
  const tiled = windows.filter(w => !w.minimized && !w.maximized);
  let idx = 0;
  return windows.map(w => {
    if (w.minimized || w.maximized) return w;
    const tile = computeTilingLayout(idx++, tiled.length, vw, vh, MAX_MARGIN);
    return { ...w, ...tile };
  });
}

interface ScreenState {
  windows: AppWindow[];
  zTop: number;
  idCounter: number;
}

function emptyScreen(): ScreenState {
  return { windows: [], zTop: 0, idCounter: 0 };
}

interface WMState {
  screens: [ScreenState, ScreenState, ScreenState];
  activeScreen: number;
  isTransitioning: boolean;
  transitionDirection: 'left' | 'right' | null;
}

type WMAction =
  | { type: "OPEN"; appId: string; title: string }
  | { type: "CLOSE"; id: string }
  | { type: "MINIMIZE"; id: string; vw: number; vh: number }
  | { type: "RESTORE"; id: string; vw: number; vh: number }
  | { type: "FOCUS"; id: string }
  | { type: "MOVE"; id: string; x: number; y: number }
  | { type: "RESIZE"; id: string; x: number; y: number; width: number; height: number }
  | { type: "MAXIMIZE"; id: string; vw: number; vh: number }
  | { type: "RESIZE_MAXIMIZED_AND_RETILE"; vw: number; vh: number }
  | { type: "SET_ACTIVE_SCREEN"; index: number; vw: number; vh: number }
  | { type: "TRANSFER_WINDOW"; appId: string; toScreen: number; vw: number; vh: number }
  | { type: "TRANSITION_END" };

function vp() {
  return {
    vw: typeof window !== "undefined" ? window.innerWidth : 1920,
    vh: typeof window !== "undefined" ? window.innerHeight : 1080,
  };
}

function withActiveScreen(state: WMState, fn: (screen: ScreenState) => ScreenState): WMState {
  const screens = [...state.screens] as [ScreenState, ScreenState, ScreenState];
  screens[state.activeScreen] = fn(screens[state.activeScreen]);
  return { ...state, screens };
}

function handleTransfer(
  state: WMState,
  appId: string,
  fromScreen: number,
  toScreen: number,
  vw: number,
  vh: number
): WMState {
  const win = state.screens[fromScreen].windows.find(w => w.appId === appId);
  if (!win) return state;

  const newScreens = [...state.screens] as [ScreenState, ScreenState, ScreenState];

  newScreens[fromScreen] = {
    ...newScreens[fromScreen],
    windows: newScreens[fromScreen].windows.filter(w => w.id !== win.id),
  };

  const tgt = { ...newScreens[toScreen] };
  const newId = `win-${tgt.idCounter}`;
  const transferredWin: AppWindow = {
    ...win,
    id: newId,
    zIndex: tgt.zTop + 1,
    minimized: false,
  };

  tgt.windows = retileWindows([...tgt.windows, transferredWin], vw, vh);
  tgt.zTop++;
  tgt.idCounter++;
  newScreens[toScreen] = tgt;

  return { ...state, screens: newScreens };
}

function wmReducer(state: WMState, action: WMAction): WMState {
  switch (action.type) {
    case "SET_ACTIVE_SCREEN": {
      if (action.index === state.activeScreen || action.index < 0 || action.index > 2) return state;
      const total = 3;
      const diff = action.index - state.activeScreen;
      const shortest = ((diff + total / 2) % total + total) % total - total / 2;
      const direction = shortest > 0 ? 'right' : 'left';
      return { ...state, activeScreen: action.index, isTransitioning: true, transitionDirection: direction };
    }

    case "TRANSITION_END":
      return { ...state, isTransitioning: false, transitionDirection: null };

    case "TRANSFER_WINDOW": {
      const { appId, toScreen, vw, vh } = action;
      let fromScreen = -1;
      for (let i = 0; i < 3; i++) {
        if (state.screens[i].windows.some(w => w.appId === appId)) {
          fromScreen = i;
          break;
        }
      }
      if (fromScreen < 0) return state;
      return handleTransfer(state, appId, fromScreen, toScreen, vw, vh);
    }

    case "OPEN": {
      const { appId, title } = action;
      const { vw, vh } = vp();

      for (let i = 0; i < 3; i++) {
        const existing = state.screens[i].windows.find(w => w.appId === appId);
        if (existing) {
          if (i === state.activeScreen) {
            return withActiveScreen(state, screen => {
              if (!existing.minimized) {
                return {
                  ...screen,
                  windows: screen.windows.map(w =>
                    w.id === existing.id ? { ...w, minimized: true } : w
                  ),
                };
              }
              const updated = screen.windows.map(w =>
                w.id === existing.id
                  ? { ...w, minimized: false, zIndex: screen.zTop + 1 }
                  : w
              );
              return {
                ...screen,
                windows: retileWindows(updated, vw, vh),
                zTop: screen.zTop + 1,
              };
            });
          }
          return handleTransfer(state, appId, i, state.activeScreen, vw, vh);
        }
      }

      const result = withActiveScreen(state, s => {
        const newZ = s.zTop + 1;
        const newWin: AppWindow = {
          id: `win-${s.idCounter}`,
          appId,
          title,
          x: 0, y: 0, width: 520, height: 400,
          minimized: false, maximized: false, prevRect: null, zIndex: newZ,
        };
        const hasMaximized = s.windows.some(w => w.maximized && !w.minimized);
        let updatedWindows = [...s.windows, newWin];
        if (hasMaximized) {
          updatedWindows = updatedWindows.map(w =>
            w.maximized ? { ...w, maximized: false, prevRect: null } : w
          );
        }
        return {
          ...s,
          windows: retileWindows(updatedWindows, vw, vh),
          zTop: newZ,
          idCounter: s.idCounter + 1,
        };
      });
      const active = result.screens[result.activeScreen];
      const visibleCount = active.windows.filter(w => !w.minimized).length;
      const created = active.windows.find(w => w.appId === appId && w.zIndex === active.zTop);
      if (!created || visibleCount > 1) return result;
      return withActiveScreen(result, s => ({
        ...s,
        windows: s.windows.map(w =>
          w.id === created.id
            ? {
                ...w,
                maximized: true,
                prevRect: { x: w.x, y: w.y, width: w.width, height: w.height },
                x: MAX_MARGIN,
                y: MAX_MARGIN,
                width: vw - MAX_MARGIN * 2,
                height: vh - MAX_MARGIN * 2,
              }
            : w
        ),
      }));
    }

    case "CLOSE": {
      const { vw, vh } = vp();
      return withActiveScreen(state, screen => ({
        ...screen,
        windows: retileWindows(screen.windows.filter(w => w.id !== action.id), vw, vh),
      }));
    }

    case "MINIMIZE":
      return withActiveScreen(state, screen => ({
        ...screen,
        windows: retileWindows(
          screen.windows.map(w =>
            w.id === action.id
              ? {
                  ...w,
                  minimized: true,
                  maximized: false,
                  prevRect: null,
                }
              : w
          ),
          action.vw,
          action.vh,
        ),
      }));

    case "RESTORE": {
      const newZ = state.screens[state.activeScreen].zTop + 1;
      return withActiveScreen(state, screen => ({
        ...screen,
        zTop: newZ,
        windows: retileWindows(
          screen.windows.map(w =>
            w.id === action.id ? { ...w, minimized: false, zIndex: newZ } : w
          ),
          action.vw,
          action.vh,
        ),
      }));
    }

    case "FOCUS": {
      const screen = state.screens[state.activeScreen];
      const win = screen.windows.find(w => w.id === action.id);
      if (!win || win.zIndex === screen.zTop) return state;
      const newZ = screen.zTop + 1;
      return withActiveScreen(state, s => ({
        ...s,
        zTop: newZ,
        windows: s.windows.map(w =>
          w.id === action.id ? { ...w, zIndex: newZ } : w
        ),
      }));
    }

    case "MOVE":
      return withActiveScreen(state, screen => ({
        ...screen,
        windows: screen.windows.map(w =>
          w.id === action.id ? { ...w, x: action.x, y: action.y } : w
        ),
      }));

    case "RESIZE":
      return withActiveScreen(state, screen => ({
        ...screen,
        windows: screen.windows.map(w =>
          w.id === action.id
            ? { ...w, x: action.x, y: action.y, width: action.width, height: action.height }
            : w
        ),
      }));

    case "MAXIMIZE": {
      const screen = state.screens[state.activeScreen];
      const win = screen.windows.find(w => w.id === action.id);
      if (!win) return state;
      if (win.maximized) {
        return withActiveScreen(state, s => ({
          ...s,
          windows: s.windows.map(w =>
            w.id === action.id
              ? {
                  ...w,
                  maximized: false,
                  prevRect: null,
                  x: Math.max(MAX_MARGIN, (action.vw - 640) / 2),
                  y: Math.max(MAX_MARGIN, (action.vh - 480) / 2),
                  width: 640,
                  height: 480,
                }
              : w
          ),
        }));
      }
      return withActiveScreen(state, s => ({
        ...s,
        windows: s.windows.map(w =>
          w.id === action.id
            ? {
                ...w,
                maximized: true,
                prevRect: { x: w.x, y: w.y, width: w.width, height: w.height },
                x: MAX_MARGIN,
                y: MAX_MARGIN,
                width: action.vw - MAX_MARGIN * 2,
                height: action.vh - MAX_MARGIN * 2,
              }
            : w
        ),
      }));
    }

    case "RESIZE_MAXIMIZED_AND_RETILE": {
      const { vw, vh } = action;
      const newScreens = state.screens.map(screen => ({
        ...screen,
        windows: retileWindows(
          screen.windows.map(w =>
            w.maximized
              ? { ...w, x: MAX_MARGIN, y: MAX_MARGIN, width: vw - MAX_MARGIN * 2, height: vh - MAX_MARGIN * 2 }
              : w
          ),
          vw,
          vh,
        ),
      })) as [ScreenState, ScreenState, ScreenState];
      return { ...state, screens: newScreens };
    }
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
  toggleMaximize: (id: string) => void;
  isAppOpen: (appId: string) => boolean;
  isAppMinimized: (appId: string) => boolean;
  getWindow: (appId: string) => AppWindow | undefined;
  hasMaximizedWindow: boolean;
  retileAll: () => void;
  activeScreen: number;
  setActiveScreen: (index: number) => void;
  screenWindows: AppWindow[][];
  isTransitioning: boolean;
  transitionDirection: 'left' | 'right' | null;
  resetTransition: () => void;
}

export const WMContext = createContext<WMContextType | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wmReducer, {
    screens: [emptyScreen(), emptyScreen(), emptyScreen()],
    activeScreen: 0,
    isTransitioning: false,
    transitionDirection: null,
  });

  const getVw = () => (typeof window !== "undefined" ? window.innerWidth : 1920);
  const getVh = () => (typeof window !== "undefined" ? window.innerHeight : 1080);

  const activeWindows = state.screens[state.activeScreen].windows;

  const openWindow = useCallback(
    (app: AppDef) => dispatch({ type: "OPEN", appId: app.id, title: app.title }),
    []
  );
  const closeWindow = useCallback(
    (id: string) => dispatch({ type: "CLOSE", id }),
    []
  );
  const minimizeWindow = useCallback(
    (id: string) => dispatch({ type: "MINIMIZE", id, vw: getVw(), vh: getVh() }),
    []
  );
  const restoreWindow = useCallback(
    (id: string) => dispatch({ type: "RESTORE", id, vw: getVw(), vh: getVh() }),
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
  const toggleMaximize = useCallback(
    (id: string) => {
      dispatch({ type: "MAXIMIZE", id, vw: getVw(), vh: getVh() });
    },
    []
  );
  const isAppOpen = useCallback(
    (appId: string) => activeWindows.some(w => w.appId === appId),
    [activeWindows]
  );
  const isAppMinimized = useCallback(
    (appId: string) => {
      const win = activeWindows.find(w => w.appId === appId);
      return win ? win.minimized : false;
    },
    [activeWindows]
  );
  const getWindow = useCallback(
    (appId: string) => activeWindows.find(w => w.appId === appId),
    [activeWindows]
  );
  const hasMaximizedWindow = activeWindows.some(w => w.maximized);

  const retileAll = useCallback(
    () => dispatch({ type: "RESIZE_MAXIMIZED_AND_RETILE", vw: getVw(), vh: getVh() }),
    []
  );

  const setActiveScreen = useCallback(
    (index: number) => dispatch({ type: "SET_ACTIVE_SCREEN", index, vw: getVw(), vh: getVh() }),
    []
  );

  const resetTransition = useCallback(
    () => dispatch({ type: "TRANSITION_END" }),
    []
  );

  const screenWindows = state.screens.map(s => s.windows);

  useEffect(() => {
    const handleResize = () => {
      dispatch({ type: "RESIZE_MAXIMIZED_AND_RETILE", vw: window.innerWidth, vh: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <WMContext.Provider
      value={{
        windows: activeWindows,
        openWindow,
        closeWindow,
        minimizeWindow,
        restoreWindow,
        focusWindow,
        moveWindow,
        resizeWindow,
        toggleMaximize,
        isAppOpen,
        isAppMinimized,
        getWindow,
        hasMaximizedWindow,
        retileAll,
        activeScreen: state.activeScreen,
        setActiveScreen,
        screenWindows,
        isTransitioning: state.isTransitioning,
        transitionDirection: state.transitionDirection,
        resetTransition,
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

export function ScreenProvider({ screenIndex, children }: { screenIndex: number; children: ReactNode }) {
  const ctx = useWindowManager();
  const scoped: WMContextType = {
    ...ctx,
    windows: ctx.screenWindows[screenIndex],
  };
  return <WMContext.Provider value={scoped}>{children}</WMContext.Provider>;
}
