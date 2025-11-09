import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InputArea() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [region, setRegion] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (gameName.trim() && tagLine.trim() && region) {
      navigate("/loading", { state: { gameName, tagLine, region } });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 w-full max-w-sm"
    >
      <div>
        <Label htmlFor="gameName" className="text-left text-white/90">
          Gamer Name
        </Label>
        <Input
          id="gameName"
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          placeholder="Enter your gamer name"
          className="bg-background/80 text-foreground"
          required
        />
      </div>
      <div>
        <Label htmlFor="tagLine" className="text-left text-white/90">
          Tag Line
        </Label>
        <Input
          id="tagLine"
          type="text"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          placeholder="Enter your tag line (e.g., NA1)"
          className="bg-background/80 text-foreground"
          required
        />
      </div>
      <div>
        <Label htmlFor="region" className="text-left text-white/90">
          Region
        </Label>
        <Select value={region} onValueChange={setRegion} required>
          <SelectTrigger className="bg-background/80 text-foreground">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="americas">Americas</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asia</SelectItem>
            <SelectItem value="sea">SEA</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        size="lg"
        className="bg-primary hover:bg-primary/90"
      >
        View Summary
      </Button>
    </form>
  );
}
