import { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { serviceworker } from "globals";

export default function InputArea() {
  const [playerId, setPlayerId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate("/loading", {state: {playerId} });
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Input
        type="text"
        value={playerId}
        onChange={(e) => setPlayerId(e.target.value)}
        placeholder="Please key in your id..."
        className="pr-30" 
        required
      />
      <Button
      type="submit"
        size="sm"
        className="absolute right-0.5 top-0.5 h-[calc(100%-0.25rem)]"
      >
        View Summary
      </Button>
    </form>
  );
}
