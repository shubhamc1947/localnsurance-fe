"use client";
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { STATES_BY_COUNTRY } from "@/data/data";

interface StateComboboxProps {
  country: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function StateCombobox({ country, value, onChange, placeholder = "Select state", className }: StateComboboxProps) {
  const [open, setOpen] = useState(false);
  const states = STATES_BY_COUNTRY[country] || [];

  if (states.length === 0) {
    return <Input value={value} onChange={e => onChange(e.target.value)} placeholder="State / Province" className={cn("h-9", className)} />;
  }

  const selectedLabel = states.find(s => s.value === value)?.label || "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className={cn("w-full justify-between font-normal h-9 text-sm", !value && "text-muted-foreground", className)}>
          {selectedLabel || placeholder}
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No state found.</CommandEmpty>
            <CommandGroup>
              {states.map(s => (
                <CommandItem key={s.value} value={s.label} onSelect={() => { onChange(s.value); setOpen(false); }}>
                  <Check className={cn("mr-2 h-3 w-3", value === s.value ? "opacity-100" : "opacity-0")} />
                  {s.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
