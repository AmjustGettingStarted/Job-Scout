"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AiMode } from "@/lib/types";

const locations = [
  { value: "remote", label: "Remote" },
  { value: "united states", label: "United States" },
  { value: "europe", label: "Europe" },
  { value: "worldwide", label: "Worldwide" },
];

export function HeroSearch({
  keyword,
  location,
  mode,
  loading,
  onKeyword,
  onLocation,
  onMode,
  onSearch,
}: {
  keyword: string;
  location: string;
  mode: AiMode;
  loading: boolean;
  onKeyword: (value: string) => void;
  onLocation: (value: string) => void;
  onMode: (value: AiMode) => void;
  onSearch: () => void;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h1 className="text-heading font-bold text-frost-white">
          Scout the role. Keep the resume.
        </h1>
        <p className="mt-2 max-w-2xl text-body-sm text-frost-muted">
          Search remote jobs, paste your resume, and score the match. Private
          mode stays on your machine. Hosted mode calls an open-weight endpoint.
        </p>
      </div>

      <Tabs value={mode} onValueChange={(value) => onMode(value as AiMode)}>
        <TabsList>
          <TabsTrigger value="private">Private (Ollama)</TabsTrigger>
          <TabsTrigger value="hosted">Hosted (Tinker)</TabsTrigger>
        </TabsList>
      </Tabs>

      <form
        className="flex flex-col gap-3 md:flex-row md:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
      >
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor="keyword">Keyword</Label>
          <Input
            id="keyword"
            value={keyword}
            placeholder="react"
            onChange={(event) => onKeyword(event.target.value)}
          />
        </div>
        <div className="flex w-full flex-col gap-2 md:w-56">
          <Label>Location</Label>
          <Select
            value={location}
            items={locations}
            onValueChange={(value) => {
              if (typeof value === "string") onLocation(value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Remote" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={loading || keyword.trim().length === 0}>
          {loading ? "Searching" : "Search"}
        </Button>
      </form>
    </section>
  );
}
