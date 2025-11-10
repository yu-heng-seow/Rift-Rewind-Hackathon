import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayer } from "@/context/PlayerContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useYES, useSAW } from "@/hooks/useAPI";

export default function InputArea() {
  const navigate = useNavigate();
  const { playerData, setPlayerInput, setYesResponse, 
          setSawResponse, formatPlayerData } = usePlayer();
  const { fetchSAW } = useSAW();
  const { fetchYES } = useYES();

  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // save player input to context
      const inputData = { gameName, tagLine, region };
      setPlayerInput(inputData);

      // call APIs for summary (YES + SAW)
      const yesRes = await fetchYES(inputData);
      console.log("YES Response:", yesRes);

      const sawRes = await fetchSAW(inputData);
      console.log("SAW Response:", sawRes);

      // store API responses in context
      setYesResponse(yesRes);
      setSawResponse(sawRes);

      // format combined playerData and store in context
      formatPlayerData(yesRes, sawRes, null);
      console.log("Player Data:", playerData);

      // navigate to year end summary page
      navigate("/yes");
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to load player summary. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 w-full max-w-md"
    >
      <div className="flex gap-4 items-center">
        <Label htmlFor="gameName" className="min-w-fit items-center">Gamer Name: </Label>
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

      <div className="flex gap-4 items-center">
        <Label htmlFor="tagLine" className="min-w-fit items-center">Tag Line: </Label>
        <Input
          id="tagLine"
          type="text"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          placeholder="Enter your tag line"
          className="bg-background/80 text-foreground"
          required
        />
      </div>

      <div className="flex gap-4 items-center">
        <Label htmlFor="region" className="min-w-fit items-center">Region: </Label>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="bg-background/80 text-foreground">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent className="bg-background text-foreground">
            <SelectItem value="americas">Americas</SelectItem>
            <SelectItem value="europe">Europe</SelectItem>
            <SelectItem value="asia">Asia</SelectItem>
            <SelectItem value="sea">SEA</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-white text-black hover:bg-gray-200"
      >
        {loading ? "Loading..." : "View Summary"}
      </Button>
    </form>
  );
}
