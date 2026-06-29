"use client";

import { useRef, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import type { EventClickArg } from "@fullcalendar/core";
import type { AdminAppointment } from "@/types/appointment";

interface Props {
  appointments: AdminAppointment[];
  onEventClick: (appointment: AdminAppointment) => void;
}

export function AppointmentCalendar({
  appointments,
  onEventClick,
}: Props): React.JSX.Element {
  const calendarRef = useRef<FullCalendar>(null);

  const events = appointments.map((appt) => ({
    id: appt.id,
    title: appt.customer?.name ?? "Unknown",
    start: appt.startAt.toISOString(),
    end: appt.endAt.toISOString(),
    backgroundColor: appt.employee?.colorTag ?? "var(--color-accent)",
    borderColor: appt.employee?.colorTag ?? "var(--color-accent)",
    extendedProps: { appointment: appt },
  }));

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const appt = info.event.extendedProps.appointment as AdminAppointment;
      onEventClick(appt);
    },
    [onEventClick],
  );

  return (
    <div
      className="overflow-hidden rounded-xl border p-4"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <style>{`
        .fc { color: var(--color-text-primary); font-family: var(--font-body); }
        .fc-toolbar-title { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--color-text-primary); }
        .fc-button { background-color: var(--color-surface-raised) !important; border-color: var(--color-border) !important; color: var(--color-text-secondary) !important; font-size: 0.75rem !important; }
        .fc-button:hover { border-color: var(--color-accent) !important; color: var(--color-accent) !important; }
        .fc-button-active { background-color: var(--color-accent) !important; border-color: var(--color-accent) !important; color: var(--color-bg) !important; }
        .fc-col-header-cell { background-color: var(--color-surface-raised); padding: 8px 0; }
        .fc-col-header-cell-cushion { color: var(--color-text-muted); font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none; }
        .fc-daygrid-day, .fc-timegrid-slot { background-color: transparent; }
        .fc-daygrid-day:hover { background-color: var(--color-surface-raised); }
        .fc-day-today { background-color: color-mix(in srgb, var(--color-accent) 5%, transparent) !important; }
        .fc-scrollgrid, .fc-scrollgrid-section > td, .fc-scrollgrid-section > th { border-color: var(--color-border) !important; }
        .fc-timegrid-slot-label { color: var(--color-text-muted); font-size: 0.7rem; }
        .fc-event { border-radius: 4px; padding: 1px 4px; font-size: 0.75rem; cursor: pointer; }
        .fc-event-title { font-weight: 600; }
        .fc-list-day-cushion { background-color: var(--color-surface-raised) !important; color: var(--color-text-secondary) !important; }
        .fc-list-event:hover td { background-color: var(--color-surface-raised) !important; cursor: pointer; }
        .fc-list-event-title { color: var(--color-text-primary) !important; }
        .fc-list-event-time { color: var(--color-text-muted) !important; }
        .fc-theme-standard td, .fc-theme-standard th { border-color: var(--color-border); }
        .fc-daygrid-day-number { color: var(--color-text-secondary); font-size: 0.8rem; text-decoration: none; }
        .fc-day-other .fc-daygrid-day-number { color: var(--color-text-muted); }
      `}</style>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        allDaySlot={false}
        nowIndicator
        slotDuration="00:30:00"
        expandRows
      />
    </div>
  );
}