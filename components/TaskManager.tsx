"use client";

import * as React from "react";
import Link from "next/link";
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
  ArrowLeft,
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
import { AuthModal } from "@/components/AuthModal";

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
  React.useEffect(() => setReady(true), []);

  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const clearCompleted = useTaskStore((s) => s.clearCompleted);

  const toast = useToast((s) => s.push);

  /* auth modal (local to this page) */
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"signup" | "login">("signup");
  const openAuth = (mode: "signup" | "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

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

  const stats = React.useMemo(() => {
    const completed = tasks.filter((t) => t.completed).length;
    const overdue = tasks.filter(
      (t) => dueStatus(t.dueDate, t.completed) === "overdue"
    ).length;
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
      overdue,
      pct: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    };
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
      toast(
        justCompleted ? "success" : "info",
        justCompleted ? "Task completed" : "Task marked incomplete"
      );
    }
  };

  const onDelete = (t: Task) => {
    deleteTask(t.id);
    toast("error", "Task removed");
  };

  const startEdit = (t: Task) => {
    setEditingId(t.id);
    setEdit({
      title: t.title,
      category: t.category,
      priority: t.priority,
      dueDate: t.dueDate,
      tags: t.tags,
    });
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
    return <div className="min-h-screen bg-slate-50" />;
  }

  const overview = [
    { label: "Total", value: stats.total, dot: "bg-primary" },
    { label: "Completed", value: stats.completed, dot: "bg-emerald-500" },
    { label: "Pending", value: stats.pending, dot: "bg-amber-500" },
    { label: "Overdue", value: stats.overdue, dot: "bg-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to TaskHub
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAuth("login")}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Log In
            </button>
            <button
              onClick={() => openAuth("signup")}
              className="rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-10">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-glow">
              <ListTodo className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900">My Tasks</h1>
              <p className="text-sm text-slate-500">
                Plan, prioritise and track your work.
              </p>
            </div>
          </div>
          <button
            onClick={() => document.getElementById("task-title-input")?.focus()}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" /> New task
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Overview</h3>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {stats.completed} of {stats.total} done
                  </span>
                  <span className="font-medium text-slate-700">{stats.pct}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${stats.pct}%` }}
                  />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {overview.map((o) => (
                  <div
                    key={o.label}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-2 w-2 rounded-full", o.dot)} />
                      <span className="text-xs text-slate-500">{o.label}</span>
                    </div>
                    <p className="mt-1 font-display text-xl font-bold text-slate-900">
                      {o.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
                Category
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["All", ...TASK_CATEGORIES] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilterCat(c as TaskCategory | "All")}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium transition",
                      filterCat === c
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                Priority
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["All", ...TASK_PRIORITIES] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilterPri(p as Priority | "All")}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition",
                      filterPri === p
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {stats.completed > 0 && (
                <button
                  onClick={() => {
                    clearCompleted();
                    toast("info", "Cleared completed tasks");
                  }}
                  className="mt-5 w-full rounded-full border border-slate-200 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-50"
                >
                  Clear completed
                </button>
              )}
            </div>
          </aside>

          {/* Main column */}
          <section className="space-y-5">
            {/* Add form */}
            <form
              onSubmit={onAdd}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <input
                id="task-title-input"
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
                    <option key={p} className="capitalize">
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

            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks…"
                className={cn(
                  inputCls,
                  "w-full rounded-full py-3 pl-11 pr-4 shadow-sm"
                )}
              />
            </div>

            {/* List */}
            <ul className="flex flex-col gap-3">
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
                        "rounded-2xl border bg-white p-4 shadow-sm transition hover:border-primary/30 hover:shadow-md",
                        t.completed
                          ? "border-slate-100 opacity-70"
                          : "border-slate-200"
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
                              onChange={(e) =>
                                setEdit((p) => ({ ...p, category: e.target.value as TaskCategory }))
                              }
                              className={inputCls}
                            >
                              {TASK_CATEGORIES.map((c) => (
                                <option key={c}>{c}</option>
                              ))}
                            </select>
                            <select
                              value={edit.priority}
                              onChange={(e) =>
                                setEdit((p) => ({ ...p, priority: e.target.value as Priority }))
                              }
                              className={inputCls}
                            >
                              {TASK_PRIORITIES.map((p) => (
                                <option key={p} className="capitalize">
                                  {p}
                                </option>
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
                              onChange={(e) =>
                                setEdit((p) => ({ ...p, tags: parseTags(e.target.value) }))
                              }
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
                              className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
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
                                : "border-slate-300 text-transparent hover:border-primary"
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </button>

                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "font-medium text-slate-900",
                                t.completed && "line-through"
                              )}
                            >
                              {t.title}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                                  CATEGORY_STYLE[t.category]
                                )}
                              >
                                {t.category}
                              </span>
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                                  PRIORITY_STYLE[t.priority]
                                )}
                              >
                                <Flag className="h-3 w-3" /> {t.priority}
                              </span>
                              {t.dueDate && (
                                <span
                                  className={cn(
                                    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                                    DUE_STYLE[status]
                                  )}
                                >
                                  <Calendar className="h-3 w-3" />
                                  {status === "overdue"
                                    ? "Overdue"
                                    : status === "soon"
                                      ? "Due soon"
                                      : formatDue(t.dueDate)}
                                </span>
                              )}
                              {t.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500"
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
                              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDelete(t)}
                              aria-label="Delete task"
                              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
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
                <li className="rounded-2xl border border-dashed border-slate-200 py-12 text-center text-sm text-slate-400">
                  {tasks.length === 0
                    ? "No tasks yet — add your first one above."
                    : "No tasks match your filters."}
                </li>
              )}
            </ul>
          </section>
        </div>
      </main>

      <Toaster />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setAuthOpen(false)}
        initialTab={authMode}
      />
    </div>
  );
}
