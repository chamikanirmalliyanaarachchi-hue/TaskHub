"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Trash2,
  Check,
  Pencil,
  Calendar,
  Flag,
  Tag,
  Sun,
  Moon,
  ListTodo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useTaskStore,
  TASK_CATEGORIES,
  TASK_PRIORITIES,
  type Priority,
  type TaskCategory,
  type Task,
} from "@/lib/useTaskStore";
import { useToast } from "@/lib/useToast";
import { fireConfetti } from "@/lib/confetti";
import { Toaster } from "@/components/Toaster";

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

const PRIORITY_STYLE: Record<Priority, string> = {
  high: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  low: "bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300",
};

const CATEGORY_STYLE: Record<TaskCategory, string> = {
  Work: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  Personal: "bg-pink-100 text-pink-700 dark:bg-pink-500/15 dark:text-pink-300",
  Study: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
};

const DUE_STYLE = {
  overdue: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  soon: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  upcoming: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  none: "bg-slate-100 text-slate-500 dark:bg-slate-700/50 dark:text-slate-400",
} as const;

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function dueStatus(due: string | null, completed: boolean): keyof typeof DUE_STYLE {
  if (!due || completed) return "none";
  const d = new Date(due + "T00:00:00");
  if (d < startOfToday()) return "overdue";
  const diff = Math.round((d.getTime() - startOfToday().getTime()) / 86400000);
  return diff <= 2 ? "soon" : "upcoming";
}

function formatDue(due: string): string {
  return new Date(due + "T00:00:00").toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function parseTags(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    )
  );
}

export function TaskManager() {
  const [ready, setReady] = React.useState(false);

  const tasks = useTaskStore((s) => s.tasks);
  const theme = useTaskStore((s) => s.theme);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const clearCompleted = useTaskStore((s) => s.clearCompleted);
  const setTheme = useTaskStore((s) => s.setTheme);

  const toast = useToast((s) => s.push);

  const [query, setQuery] = React.useState("");
  const [filterCat, setFilterCat] = React.useState<TaskCategory | "All">("All");
  const [filterPri, setFilterPri] = React.useState<Priority | "All">("All");

  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<TaskCategory>("Work");
  const [priority, setPriority] = React.useState<Priority>("medium");
  const [dueDate, setDueDate] = React.useState("");
  const [tagsInput, setTagsInput] = React.useState("");

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [edit, setEdit] = React.useState<Partial<Task>>({});

  React.useEffect(() => setReady(true), []);

  const stats = React.useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter(
      (t) => dueStatus(t.dueDate, t.completed) === "overdue"
    ).length;
    return { total: tasks.length, completed, pending: tasks.length - completed, overdue };
  }, [tasks]);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks
      .filter((t) => {
        if (filterCat !== "All" && t.category !== filterCat) return false;
        if (filterPri !== "All" && t.priority !== filterPri) return false;
        if (q) {
          const hay = `${t.title} ${t.tags.join(" ")} ${t.category}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (PRIORITY_RANK[a.priority] !== PRIORITY_RANK[b.priority])
          return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        return b.createdAt - a.createdAt;
      });
  }, [tasks, query, filterCat, filterPri]);

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast("error", "Please enter a task title");
      return;
    }
    addTask({
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || null,
      tags: parseTags(tagsInput),
    });
    toast("success", "Task added");
    setTitle("");
    setTagsInput("");
    setDueDate("");
  };

  const onToggle = (t: Task) => {
    toggleTask(t.id);
    const justCompleted = !t.completed;
    const list = useTaskStore.getState().tasks;
    if (justCompleted && list.length > 0 && list.every((x) => x.completed)) {
      fireConfetti();
      toast("success", "All tasks completed! 🎉");
    } else {
      toast(justCompleted ? "success" : "info", justCompleted ? "Task completed" : "Task marked incomplete");
    }
  };

  const onDelete = (t: Task) => {
    deleteTask(t.id);
    toast("error", "Task removed");
  };

  const startEdit = (t: Task) => {
    setEditingId(t.id);
    setEdit({ title: t.title, category: t.category, priority: t.priority, dueDate: t.dueDate, tags: t.tags });
  };

  const saveEdit = (id: string) => {
    if (!edit.title?.trim()) {
      toast("error", "Title can't be empty");
      return;
    }
    updateTask(id, {
      title: edit.title.trim(),
      category: edit.category,
      priority: edit.priority,
      dueDate: edit.dueDate ?? null,
      tags: edit.tags ?? [],
    });
    toast("info", "Task updated");
    setEditingId(null);
  };

  const inputCls =
    "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

  if (!ready) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />;
  }

  return (
    <section
      className={cn(
        "min-h-screen bg-slate-50 pb-20 pt-28 transition-colors dark:bg-slate-950",
        theme === "dark" && "dark"
      )}
    >
      <Toaster />
      <div className="mx-auto w-full max-w-3xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-white shadow-glow">
              <ListTodo className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                My Tasks
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Plan, prioritise and track your work.
              </p>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total", value: stats.total },
            { label: "Completed", value: stats.completed },
            { label: "Pending", value: stats.pending },
            { label: "Overdue", value: stats.overdue },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {s.value}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Add form */}
        <form
          onSubmit={onAdd}
          className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className={cn(inputCls, "w-full")}
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className={cn(inputCls, "min-w-[120px]")}
            >
              {TASK_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className={cn(inputCls, "min-w-[120px]")}
            >
              {TASK_PRIORITIES.map((p) => (
                <option key={p} value={p} className="capitalize">
                  {p}
                </option>
              ))}
            </select>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={cn(inputCls, "pl-9")}
              />
            </div>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Tags (comma separated)"
              className={cn(inputCls, "min-w-[150px] flex-1")}
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
        </form>

        {/* Toolbar */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks…"
              className={cn(inputCls, "w-full pl-9")}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["All", ...TASK_CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setFilterCat(c as TaskCategory | "All")}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition",
                  filterCat === c
                    ? "bg-primary text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                )}
              >
                {c}
              </button>
            ))}
            <span className="mx-1 h-5 w-px bg-slate-200 dark:bg-slate-700" />
            {(["All", ...TASK_PRIORITIES] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPri(p as Priority | "All")}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition",
                  filterPri === p
                    ? "bg-primary text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <ul className="mt-5 flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {visible.map((t) => {
              const status = dueStatus(t.dueDate, t.completed);
              const isEditing = editingId === t.id;
              return (
                <motion.li
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 24, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "rounded-2xl border bg-white p-4 shadow-sm transition dark:bg-slate-900",
                    t.completed
                      ? "border-slate-100 opacity-70 dark:border-slate-800"
                      : "border-slate-200 dark:border-slate-800"
                  )}
                >
                  {isEditing ? (
                    <div className="flex flex-col gap-3">
                      <input
                        value={edit.title ?? ""}
                        onChange={(e) => setEdit((p) => ({ ...p, title: e.target.value }))}
                        className={cn(inputCls, "w-full")}
                      />
                      <div className="flex flex-wrap gap-3">
                        <select
                          value={edit.category}
                          onChange={(e) => setEdit((p) => ({ ...p, category: e.target.value as TaskCategory }))}
                          className={inputCls}
                        >
                          {TASK_CATEGORIES.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <select
                          value={edit.priority}
                          onChange={(e) => setEdit((p) => ({ ...p, priority: e.target.value as Priority }))}
                          className={inputCls}
                        >
                          {TASK_PRIORITIES.map((p) => (
                            <option key={p} className="capitalize">{p}</option>
                          ))}
                        </select>
                        <input
                          type="date"
                          value={edit.dueDate ?? ""}
                          onChange={(e) => setEdit((p) => ({ ...p, dueDate: e.target.value }))}
                          className={inputCls}
                        />
                        <input
                          value={(edit.tags ?? []).join(", ")}
                          onChange={(e) => setEdit((p) => ({ ...p, tags: parseTags(e.target.value) }))}
                          placeholder="Tags"
                          className={cn(inputCls, "flex-1 min-w-[140px]")}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(t.id)}
                          className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onToggle(t)}
                        aria-label={t.completed ? "Mark incomplete" : "Mark complete"}
                        className={cn(
                          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition",
                          t.completed
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 text-transparent hover:border-primary dark:border-slate-600"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </button>

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "font-medium text-slate-900 dark:text-white",
                            t.completed && "line-through"
                          )}
                        >
                          {t.title}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", CATEGORY_STYLE[t.category])}>
                            {t.category}
                          </span>
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", PRIORITY_STYLE[t.priority])}>
                            <Flag className="h-3 w-3" /> {t.priority}
                          </span>
                          {t.dueDate && (
                            <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", DUE_STYLE[status])}>
                              <Calendar className="h-3 w-3" />
                              {status === "overdue" ? "Overdue" : status === "soon" ? "Due soon" : formatDue(t.dueDate)}
                            </span>
                          )}
                          {t.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            >
                              <Tag className="h-3 w-3" /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => startEdit(t)}
                          aria-label="Edit task"
                          className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(t)}
                          aria-label="Delete task"
                          className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>

          {visible.length === 0 && (
            <li className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400 dark:border-slate-800">
              {tasks.length === 0 ? "No tasks yet — add your first one above." : "No tasks match your filters."}
            </li>
          )}
        </ul>

        {stats.completed > 0 && (
          <button
            onClick={() => {
              clearCompleted();
              toast("info", "Cleared completed tasks");
            }}
            className="mt-4 text-xs font-medium text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
          >
            Clear completed
          </button>
        )}
      </div>
    </section>
  );
}
