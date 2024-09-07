import TodoList from "./components/TodoList";
import RootLayout from "./layout";

export default function Home() {
  return (
    <RootLayout>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <TodoList />
      </main>
    </RootLayout>
  );
}
