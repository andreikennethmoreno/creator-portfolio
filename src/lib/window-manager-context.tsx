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

interface WMState {
  windows: AppWindow[];
  zTop: number;
  idCounter: number;
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
  | { type: "RESIZE_MAXIMIZED_AND_RETILE"; vw: number; vh: number };

function wmReducer(state: WMState, action: WMAction): WMState {
  const vw = action.type === "OPEN" || action.type === "CLOSE"
    ? (typeof window !== "undefined" ? window.innerWidth : 1920)
    : "vw" in action ? action.vw : 1920;
  const vh = action.type === "OPEN" || action.type === "CLOSE"
    ? (typeof window !== "undefined" ? window.innerHeight : 1080)
    : "vh" in action ? action.vh : 1080;

  switch (action.type) {
    case "OPEN": {
      const existing = state.windows.find((w) => w.appId === action.appId);
      if (existing) {
        if (!existing.minimized) return state;
        const updated = state.windows.map((w) =>
          w.id === existing.id ? { ...w, minimized: false, zIndex: state.zTop + 1 } : w
        );
        return {
          ...state,
          zTop: state.zTop + 1,
          windows: retileWindows(updated, vw, vh),
        };
      }
      const newZ = state.zTop + 1;
      const newWin: AppWindow = {
        id: `win-${state.idCounter}`,
        appId: action.appId,
        title: action.title,
        x: 0, y: 0, width: 520, height: 400,
        minimized: false, maximized: false, prevRect: null, zIndex: newZ,
      };
      const updated = [...state.windows, newWin];
      return {
        windows: retileWindows(updated, vw, vh),
        zTop: newZ,
        idCounter: state.idCounter + 1,
      };
    }
    case "CLOSE": {
      const updated = state.windows.filter((w) => w.id !== action.id);
      return {
        ...state,
        windows: retileWindows(updated, vw, vh),
      };
    }
    case "MINIMIZE": {
      const updated = state.windows.map((w) =>
        w.id === action.id ? { ...w, minimized: true } : w
      );
      return {
        ...state,
        windows: retileWindows(updated, action.vw, action.vh),
      };
    }
    case "RESTORE": {
      const newZ = state.zTop + 1;
      const updated = state.windows.map((w) =>
        w.id === action.id ? { ...w, minimized: false, zIndex: newZ } : w
      );
      return {
        ...state,
        zTop: newZ,
        windows: retileWindows(updated, action.vw, action.vh),
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
    case "MAXIMIZE": {
      const win = state.windows.find((w) => w.id === action.id);
      if (!win) return state;
      if (win.maximized) {
        const updated = state.windows.map((w) =>
          w.id === action.id ? { ...w, maximized: false, prevRect: null } : w
        );
        return {
          ...state,
          windows: retileWindows(updated, action.vw, action.vh),
        };
      }
      return {
        ...state,
        windows: state.windows.map((w) =>
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
      };
    }
    case "RESIZE_MAXIMIZED_AND_RETILE": {
      return {
        ...state,
        windows: retileWindows(
          state.windows.map((w) =>
            w.maximized
              ? { ...w, x: MAX_MARGIN, y: MAX_MARGIN, width: action.vw - MAX_MARGIN * 2, height: action.vh - MAX_MARGIN * 2 }
              : w
          ),
          action.vw,
          action.vh,
        ),
      };
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
}

const WMContext = createContext<WMContextType | null>(null);

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wmReducer, {
    windows: [],
    zTop: 0,
    idCounter: 0,
  });

  const getVw = () => (typeof window !== "undefined" ? window.innerWidth : 1920);
  const getVh = () => (typeof window !== "undefined" ? window.innerHeight : 1080);

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
      const win = state.windows.find((w) => w.id === id);
      if (!win) return;
      dispatch({ type: "MAXIMIZE", id, vw: getVw(), vh: getVh() });
    },
    [state.windows]
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
  const hasMaximizedWindow = state.windows.some((w) => w.maximized);

  const retileAll = useCallback(
    () => dispatch({ type: "RESIZE_MAXIMIZED_AND_RETILE", vw: getVw(), vh: getVh() }),
    []
  );

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
        windows: state.windows,
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
