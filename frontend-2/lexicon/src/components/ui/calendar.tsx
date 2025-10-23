import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-3",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-base font-semibold",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-transparent p-0 opacity-80 hover:opacity-100",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-10 font-medium text-[0.8rem]",
        row: "flex w-full mt-1",
        cell: "h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        // Make day cells simple, with larger click target and subtle hover
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-medium rounded-md hover:bg-muted aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        // Selected day: ring instead of solid fill to avoid clashing with modifiers
        day_selected:
          "ring-2 ring-primary ring-offset-2 ring-offset-background bg-transparent text-foreground",
        // Today: subtle ring if not selected
        day_today: "ring-1 ring-ring text-foreground",
        // Outside: dim
        day_outside: "day-outside text-muted-foreground opacity-40",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
