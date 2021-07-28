import { supabase } from "../lib/initSupabase";
import { Auth } from "@supabase/ui";
import TodoList from "../components/TodoList";

export default function IndexPage() {
  const { user } = Auth.useUser();

  return (
    <div className="w-full h-full bg-gray-300">
      {!user ? (
        <div className="flex items-center justify-center w-full h-full p-4">
          <Auth
            supabaseClient={supabase}
            providers={["google", "github"]}
            socialLayout="horizontal"
            socialButtonSize="xlarge"
          />
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center w-full h-full p-4"
          style={{ minWidth: 250, maxWidth: 600, margin: "auto" }}
        >
          <TodoList user={supabase.auth.user()} />
          <button
            className="w-full mt-12 btn-black"
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) console.log("Error logging out:", error.message);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
