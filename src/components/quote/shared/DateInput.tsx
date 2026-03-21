"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxDate?: Date;
  max?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function DateInput({ value, onChange, placeholder = "Select date", className, maxDate, max }: DateInputProps) {
  const [open, setOpen] = useState(false);
  const effectiveMax = maxDate || (max ? new Date(max) : new Date());
  const date = value ? new Date(value) : undefined;
  const [viewMonth, setViewMonth] = useState<Date>(date || new Date(1990, 0, 1));

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1929 }, (_, i) => currentYear - i);

  const handleMonthChange = (month: string) => {
    const d = new Date(viewMonth);
    d.setMonth(parseInt(month));
    setViewMonth(d);
  };

  const handleYearChange = (year: string) => {
    const d = new Date(viewMonth);
    d.setFullYear(parseInt(year));
    setViewMonth(d);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-9 text-sm",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarDays className="mr-2 h-3.5 w-3.5 shrink-0" />
          {date ? format(date, "MMM d, yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {/* Month/Year dropdowns */}
        <div className="flex items-center gap-2 px-3 pt-3">
          <Select value={String(viewMonth.getMonth())} onValueChange={handleMonthChange}>
            <SelectTrigger className="h-7 text-xs flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={i} value={String(i)} className="text-xs">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(viewMonth.getFullYear())} onValueChange={handleYearChange}>
            <SelectTrigger className="h-7 text-xs w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]">
              {years.map((y) => (
                <SelectItem key={y} value={String(y)} className="text-xs">{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          month={viewMonth}
          onMonthChange={setViewMonth}
          onSelect={(d) => {
            if (d) onChange(d.toISOString());
            setOpen(false);
          }}
          disabled={(d) => d > effectiveMax}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
