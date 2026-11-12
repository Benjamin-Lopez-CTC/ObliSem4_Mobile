import "./global.css";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";

// Los nombres completos de las clases deben aparecer escritos en el código
// para que Tailwind los detecte (por eso no se arman con partes sueltas).
const PROJECTS = {
  web: { name: "Rediseño web", dot: "bg-emerald-500" },
  casa: { name: "Casa", dot: "bg-amber-500" },
  lectura: { name: "Lectura", dot: "bg-violet-500" },
};

type ProjectKey = keyof typeof PROJECTS;
type Filter = "all" | "pending" | "done";
type Subtask = { id: number; text: string; done: boolean };
type Task = {
  id: number;
  title: string;
  description?: string;
  priority: "normal" | "high";
  project?: ProjectKey;
  due: string;
  done: boolean;
  zone?: { radius: string; inside: boolean };
  subtasks?: Subtask[];
};

const INITIAL: Task[] = [
  {
    id: 1,
    title: "Planificar la portada",
    description: "Reunir ideas para el sitio",
    priority: "high",
    project: "web",
    due: "9:00",
    done: false,
  },
  {
    id: 2,
    title: "Compras de la semana",
    priority: "normal",
    project: "casa",
    due: "Cualquier hora",
    done: false,
    zone: { radius: "500 m", inside: true },
    subtasks: [
      { id: 1, text: "Leche", done: true },
      { id: 2, text: "Huevos", done: false },
      { id: 3, text: "Verduras frescas", done: false },
    ],
  },
  {
    id: 3,
    title: "Llamar al dentista",
    priority: "normal",
    due: "16:00",
    done: false,
    zone: { radius: "100 m", inside: false },
  },
  {
    id: 4,
    title: "Leer el capítulo 4",
    description: "Subrayar las ideas principales",
    priority: "normal",
    project: "lectura",
    due: "20:00",
    done: false,
  },
  {
    id: 5,
    title: "Revisar apuntes de ayer",
    priority: "normal",
    project: "web",
    due: "Hecha hoy",
    done: true,
  },
];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "pending", label: "Pendientes" },
  { key: "done", label: "Completadas" },
];

function TaskCard({
  task,
  onToggle,
  onToggleSub,
}: {
  task: Task;
  onToggle: () => void;
  onToggleSub: (subId: number) => void;
}) {
  const project = task.project ? PROJECTS[task.project] : undefined;
  const locked = !!task.zone && !task.zone.inside && !task.done;
  const subDone = task.subtasks?.filter((s) => s.done).length ?? 0;

  return (
    <View className="mb-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <View className="flex-row items-start">
        <Pressable
          onPress={onToggle}
          disabled={locked}
          className={`mr-3 mt-0.5 h-6 w-6 items-center justify-center rounded-full border-2 ${
            task.done
              ? "border-emerald-600 bg-emerald-600"
              : "border-neutral-400 dark:border-neutral-500"
          } ${locked ? "opacity-40" : ""}`}
        >
          {task.done && <Text className="text-xs font-bold text-white">✓</Text>}
        </Pressable>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text
              className={`flex-1 pr-2 text-base font-semibold ${
                task.done
                  ? "text-neutral-400 line-through dark:text-neutral-500"
                  : "text-neutral-900 dark:text-neutral-50"
              }`}
            >
              {task.title}
            </Text>
            {task.priority === "high" && (
              <View className="rounded-md bg-amber-100 px-2 py-0.5 dark:bg-amber-900/40">
                <Text className="text-xs font-medium text-amber-800 dark:text-amber-200">
                  Alta
                </Text>
              </View>
            )}
          </View>

          {task.description && (
            <Text className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
              {task.description}
            </Text>
          )}

          <View className="mt-3 flex-row flex-wrap items-center">
            <View className="mr-4 flex-row items-center">
              <View
                className={`mr-1.5 h-2.5 w-2.5 rounded-full ${
                  project
                    ? project.dot
                    : "border border-neutral-400 dark:border-neutral-500"
                }`}
              />
              <Text className="text-xs text-neutral-500 dark:text-neutral-400">
                {project ? project.name : "Sin proyecto"}
              </Text>
            </View>
            <Text className="mr-4 text-xs text-neutral-500 dark:text-neutral-400">
              {task.due}
            </Text>
            {task.zone && (
              <View
                className={`rounded-full border px-2 py-0.5 ${
                  task.zone.inside
                    ? "border-emerald-300 dark:border-emerald-700"
                    : "border-neutral-300 dark:border-neutral-600"
                }`}
              >
                <Text
                  className={`text-xs ${
                    task.zone.inside
                      ? "text-emerald-700 dark:text-emerald-300"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {task.zone.inside
                    ? `En zona de ${task.zone.radius}`
                    : `Fuera de la zona de ${task.zone.radius}`}
                </Text>
              </View>
            )}
          </View>

          {task.subtasks && (
            <View className="mt-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
              <Text className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">
                {subDone} de {task.subtasks.length} subtareas completadas
              </Text>
              {task.subtasks.map((s) => (
                <Pressable
                  key={s.id}
                  onPress={() => onToggleSub(s.id)}
                  className="flex-row items-center py-1.5"
                >
                  <View
                    className={`mr-3 h-5 w-5 items-center justify-center rounded-md border ${
                      s.done
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-neutral-400 dark:border-neutral-500"
                    }`}
                  >
                    {s.done && (
                      <Text className="text-[10px] font-bold text-white">✓</Text>
                    )}
                  </View>
                  <Text
                    className={`text-sm ${
                      s.done
                        ? "text-neutral-400 line-through dark:text-neutral-500"
                        : "text-neutral-800 dark:text-neutral-200"
                    }`}
                  >
                    {s.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL);
  const [filter, setFilter] = useState<Filter>("all");
  const [note, setNote] = useState("");
  const scheme = useColorScheme();

  const toggleTask = (id: number) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  const toggleSub = (taskId: number, subId: number) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks?.map((s) =>
                s.id === subId ? { ...s, done: !s.done } : s
              ),
            }
          : t
      )
    );

  const doneCount = tasks.filter((t) => t.done).length;
  const pct = Math.round((doneCount / tasks.length) * 100);
  const visible = tasks.filter(
    (t) => filter === "all" || (filter === "done" ? t.done : !t.done)
  );

  return (
    <View
      className="flex-1 bg-neutral-50 dark:bg-neutral-950"
      style={{ paddingTop: StatusBar.currentHeight ?? 0 }}
    >
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable className="h-10 w-10 items-center justify-center rounded-full border border-neutral-200 active:bg-neutral-200 dark:border-neutral-800 dark:active:bg-neutral-800">
          <Text className="text-lg text-neutral-800 dark:text-neutral-100">☰</Text>
        </Pressable>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          Jueves 12 de noviembre
        </Text>
      </View>

      <View className="m-3 px-5 py-3 border rounded-xl border-emerald-600 bg-emerald-50  dark:bg-emerald-900">
        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
          Aviso
        </Text>
        <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-300">
          Esta interfaz fue diseñada por claude para verificar que nativewind estuviera funcionando, el diseño actual 
          no reflejara el proyecto completado, pero si es una aproximacion de la idea
        </Text>
      </View>

      <View className="px-5 pb-3">
        <Text className="text-3xl font-bold text-neutral-900 dark:text-neutral-50">
          Hoy
        </Text>
        <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {doneCount} de {tasks.length} tareas completadas
        </Text>
        <View className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <View
            className="h-2 rounded-full bg-emerald-600"
            style={{ width: `${pct}%` }}
          />
        </View>
      </View>

      <View className="flex-row px-5 pb-2">
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            className={`mr-2 rounded-full px-4 py-1.5 ${
              filter === f.key
                ? "bg-emerald-600"
                : "border border-neutral-300 dark:border-neutral-700"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                filter === f.key
                  ? "text-white"
                  : "text-neutral-700 dark:text-neutral-300"
              }`}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {visible.length === 0 ? (
          <Text className="mt-10 text-center text-neutral-500 dark:text-neutral-400">
            No hay tareas en esta vista.
          </Text>
        ) : (
          visible.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onToggle={() => toggleTask(t.id)}
              onToggleSub={(subId) => toggleSub(t.id, subId)}
            />
          ))
        )}
      </ScrollView>

      <Pressable className="absolute bottom-8 right-6 h-14 w-14 items-center justify-center rounded-full bg-emerald-600 shadow-lg active:bg-emerald-700">
        <Text className="text-3xl font-light text-white">+</Text>
      </Pressable>
    </View>
  );
}