"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/utils/format";

interface ActionResult {
  error: string | null;
}

/* ── Update appointment status ───────────────────────────────────────────── */

export async function updateAppointmentStatusAction(
  id: string,
  status: AppointmentStatus,
): Promise<ActionResult> {
  const supabase = await createClient();

  const updates = {
    status,
    ...(status === "cancelled"
      ? {
          cancelled_at: new Date().toISOString(),
          cancelled_by: "admin",
        }
      : {}),
  };

  const { error } = await supabase
    .from("appointments")
    .update(updates)
    .eq("id", id);

  if (error !== null) {
    return { error: "Could not update appointment status." };
  }

  revalidatePath("/admin/appointments");
  revalidatePath("/admin");

  return { error: null };
}

/* ── Update admin note ───────────────────────────────────────────────────── */

export async function updateAppointmentNoteAction(
  id: string,
  note: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("appointments")
    .update({ admin_note: note.length > 0 ? note : null })
    .eq("id", id);

  if (error !== null) {
    return { error: "Could not update note." };
  }

  revalidatePath("/admin/appointments");
  return { error: null };
}

/* ── Create appointment (admin manual booking) ───────────────────────────── */

interface CreateAdminAppointmentInput {
  customerId: string;
  employeeId: string;
  serviceId: string;
  startAt: string;
  endAt: string;
  priceSnapshot: number;
  adminNote?: string;
}

interface CreateResult {
  data: { id: string } | null;
  error: string | null;
}

export async function createAdminAppointmentAction(
  input: CreateAdminAppointmentInput,
): Promise<CreateResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .insert({
      customer_id: input.customerId,
      employee_id: input.employeeId,
      service_id: input.serviceId,
      start_at: input.startAt,
      end_at: input.endAt,
      status: "confirmed",
      price_snapshot: input.priceSnapshot,
      admin_note:
        input.adminNote !== undefined && input.adminNote.length > 0
          ? input.adminNote
          : null,
    })
    .select("id")
    .single();

  if (error !== null || data === null) {
    return { data: null, error: "Could not create appointment." };
  }

  revalidatePath("/admin/appointments");
  revalidatePath("/admin");
  return { data: { id: data.id }, error: null };
}