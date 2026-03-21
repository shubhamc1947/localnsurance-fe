"use client";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { COUNTRIES } from "@/data/data";

interface CountryComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CountryCombobox({ value, onChange, placeholder = "Select country", className }: CountryComboboxProps) {
  const [open, setOpen] = useState(false);
  const selectedLabel = COUNTRIES.find(c => c.value === value)?.label || "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className={cn("w-full justify-between font-normal h-9 text-sm", !value && "text-muted-foreground", className)}>
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map(c => (
                <CommandItem key={c.value} value={c.label} onSelect={() => { onChange(c.value); setOpen(false); }}>
                  <Check className={cn("mr-2 h-3 w-3", value === c.value ? "opacity-100" : "opacity-0")} />
                  {c.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
