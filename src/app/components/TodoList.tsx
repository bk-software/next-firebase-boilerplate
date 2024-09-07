"use client";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";

interface Todo {
  id: string;
  text: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/signin");
      }
    });

    const q = query(collection(db, "todos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todosArray: Todo[] = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ id: doc.id, text: doc.data().text });
      });
      setTodos(todosArray);
    });

    return () => {
      unsubscribeAuth();
      unsubscribe();
    };
  }, [router]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === "") return;
    await addDoc(collection(db, "todos"), { text: newTodo });
    setNewTodo("");
  };

  const deleteTodo = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addTodo} className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="flex-grow"
          />
          <Button type="submit">Add</Button>
        </form>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-100 p-2 rounded"
            >
              <span>{todo.text}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
        <Button onClick={handleSignOut} className="mt-4 w-full">
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}
