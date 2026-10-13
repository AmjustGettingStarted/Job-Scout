"use client";

import { Combobox } from "@base-ui/react/combobox";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PLACES, type Place } from "@/lib/places";
import type { AiMode } from "@/lib/types";

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
    <section id="scout" className="flex scroll-mt-24 flex-col gap-4">
      <div>
        <h2 className="text-subheading font-bold text-ink">Search the fold</h2>
        <p className="mt-2 max-w-2xl text-body-sm text-steel">
          Pick a model, type a keyword, and choose a country. India is listed first. The first matching role scans on its own.
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
        <LocationField location={location} onLocation={onLocation} />
        <Button type="submit" disabled={loading || keyword.trim().length === 0}>
          {loading ? "Searching" : "Search"}
        </Button>
      </form>
    </section>
  );
}

function LocationField({
  location,
  onLocation,
}: {
  location: string;
  onLocation: (value: string) => void;
}) {
  const selected = PLACES.find((place) => place.value === location) ?? PLACES[0];

  return (
    <div className="flex w-full flex-col gap-2 md:w-72">
      <Label htmlFor="location">Location</Label>
      <Combobox.Root
        items={PLACES}
        value={selected}
        autoHighlight
        itemToStringLabel={(item) => item.label}
        isItemEqualToValue={(item, value) => item.value === value.value}
        onValueChange={(next) => {
          if (next) onLocation(next.value);
        }}
      >
        <Combobox.InputGroup className="relative flex w-full items-center">
          <Combobox.Input
            id="location"
            placeholder="Type a country"
            spellCheck={false}
            className="h-11 w-full rounded-inputs border border-crimson-line bg-input py-2 pr-9 pl-3 text-body-sm text-frost-white outline-none placeholder:text-frost-faint focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
          />
          <Combobox.Trigger
            type="button"
            aria-label="Open countries"
            className="absolute right-2 text-muted-foreground"
          >
            <ChevronDownIcon className="size-4" />
          </Combobox.Trigger>
        </Combobox.InputGroup>
        <Combobox.Portal>
          <Combobox.Positioner sideOffset={4} align="start" className="z-50">
            <Combobox.Popup
              data-lenis-prevent
              data-lenis-prevent-wheel
              className="country-scroll max-h-80 w-(--anchor-width) min-w-64 overflow-y-auto overscroll-contain rounded-inputs border border-crimson-line bg-popover text-popover-foreground shadow-plasma"
            >
              <Combobox.Empty className="px-3 py-2 text-caption text-frost-muted">
                No country matches.
              </Combobox.Empty>
              <Combobox.List>
                {(item: Place) => (
                  <Combobox.Item
                    key={item.value}
                    value={item}
                    className="cursor-default px-3 py-1.5 text-sm text-frost-white outline-none data-highlighted:bg-plasma-wash"
                  >
                    {item.label}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}
