import Link from "next/link";
import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <nav>
        <Link href="/register">Register</Link> |{" "}
        <Link href="/signin">Sign In</Link>
      </nav>
      <TodoList />
    </main>
  );
}
