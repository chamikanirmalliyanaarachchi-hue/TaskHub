import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Priority = "high" | "medium" | "low";
export type TaskCategory = "Work" | "Personal" | "Study";
export type ThemePref = "light" | "dark";

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  priority: Priority;
  dueDate: string | null; // yyyy-mm-dd
  tags: string[];
  completed: boolean;
  createdAt: number;
}

const CATEGORIES: TaskCategory[] = ["Work", "Personal", "Study"];
const PRIORITIES: Priority[] = ["high", "medium", "low"];

export const TASK_CATEGORIES = CATEGORIES;
export const TASK_PRIORITIES = PRIORITIES;

interface TaskState {
  tasks: Task[];
  theme: ThemePref;
  addTask: (t: Omit<Task, "id" | "completed" | "createdAt">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, patch: Partial<Omit<Task, "id" | "createdAt">>) => void;
  clearCompleted: () => void;
  setTheme: (t: ThemePref) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const noopStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      theme: "light",
      addTask: (t) =>
        set({
          tasks: [
            { ...t, id: uid(), completed: false, createdAt: Date.now() },
            ...get().tasks,
          ],
        }),
      toggleTask: (id) =>
        set({
          tasks: get().tasks.map((x) =>
            x.id === id ? { ...x, completed: !x.completed } : x
          ),
        }),
      deleteTask: (id) => set({ tasks: get().tasks.filter((x) => x.id !== id) }),
      updateTask: (id, patch) =>
        set({
          tasks: get().tasks.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        }),
      clearCompleted: () => set({ tasks: get().tasks.filter((x) => !x.completed) }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "taskhub.tasks",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : noopStorage
      ),
      version: 1,
    }
  )
);
