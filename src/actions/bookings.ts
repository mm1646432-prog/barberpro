"use server";

import { createClient } from "@/lib/supabase/server";

interface CreateBookingInput {
  serviceId: string;
  employeeId: string;
  startAt: string;
  endAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNote: string;
  priceSnapshot: number;
}

interface BookingResult {
  id: string;
  cancelToken: string;
}

interface ActionResult {
  data: BookingResult | null;
  error: string | null;
}

export async function createBookingAction(
  input: CreateBookingInput,
): Promise<ActionResult> {
  const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

console.log("USER:", user);
  const { data: roleData, error: roleError } = await supabase
    .from("customers")
    .select("id")
    .limit(1);

  console.log("ROLE TEST:", roleData, roleError);

  /* ── 1. Resolve employee ───────────────────────────── */
  let resolvedEmployeeId: string | null = null;

  if (input.employeeId !== "any") {
    resolvedEmployeeId = input.employeeId;
  } else {
    /* Find first available employee for this slot */
    const { data: employees } = await supabase
      .from("employees")
      .select("id")
      .eq("is_active", true);

    const startAt = new Date(input.startAt);
    const endAt = new Date(input.endAt);

    for (const emp of employees ?? []) {
      const { data: conflicts } = await supabase
        .from("appointments")
        .select("id")
        .eq("employee_id", emp.id)
        .in("status", ["pending", "confirmed"])
        .lt("start_at", endAt.toISOString())
        .gt("end_at", startAt.toISOString());

      if ((conflicts ?? []).length === 0) {
        resolvedEmployeeId = emp.id;
        break;
      }
    }

    if (resolvedEmployeeId === null) {
      return {
        data: null,
        error: "No barbers available for this slot. Please choose another time.",
      };
    }
  }

  /* ── 2. Resolve or create customer ──────────────────────────────────────── */

// Step 1: check if customer already exists by email
const { data: existingCustomer } = await supabase
  .from("customers")
  .select("id")
  .eq("email", input.customerEmail)
  .maybeSingle();

console.log("EXISTING CUSTOMER:", existingCustomer);

let customerId: string;

if (existingCustomer !== null) {
  // Step 2a: customer exists — use their id directly
  customerId = existingCustomer.id;
} else {
  // Step 2b: new customer — insert
  const { data: newCustomer, error: insertError } = await supabase
    .from("customers")
    .insert({
      name: input.customerName,
      email: input.customerEmail,
      phone: input.customerPhone,
    })
    .select("id")
    .single();

  console.log("NEW CUSTOMER:", newCustomer);
  console.log("INSERT ERROR:", insertError);

  if (insertError !== null || newCustomer === null) {
    return {
      data: null,
      error: "Could not save customer details.",
    };
  }

  customerId = newCustomer.id;
}

console.log("CUSTOMER ID:", customerId);

/* ── 3. Insert appointment ───────────────────────────────────────────── */
const { data: appointment, error: appointmentError } = await supabase
  .from("appointments")
  .insert({
    customer_id: customerId,
    employee_id: resolvedEmployeeId,
    service_id: input.serviceId,
    start_at: input.startAt,
    end_at: input.endAt,
    status: "confirmed",
    customer_note:
      input.customerNote.length > 0 ? input.customerNote : null,
    price_snapshot: input.priceSnapshot,
  })
  .select("id, cancel_token")
  .single();

  console.log("APPOINTMENT:", appointment);
console.log("APPOINTMENT ERROR:", appointmentError);

  if (appointmentError !== null || appointment === null) {
    return { data: null, error: "Could not create booking. Please try again." };
  }

  return {
    data: {
      id: appointment.id,
      cancelToken: appointment.cancel_token,
    },
    error: null,
  };
}

/* ── Cancel booking ──────────────────────────────────────────────────────── */

interface CancelResult {
  error: string | null;
}

export async function cancelBookingAction(
  cancelToken: string,
): Promise<CancelResult> {
  const supabase = await createClient();

  const { data: appointment, error: fetchError } = await supabase
    .from("appointments")
    .select("id, status, start_at")
    .eq("cancel_token", cancelToken)
    .single();

  if (fetchError !== null || appointment === null) {
    return { error: "Booking not found." };
  }

  if (
    appointment.status === "cancelled" ||
    appointment.status === "completed"
  ) {
    return { error: "This booking cannot be cancelled." };
  }

  /* Enforce cancellation window */
  const { data: profile } = await supabase
    .from("business_profile")
    .select("cancellation_hours")
    .single();

  const cancellationHours = profile?.cancellation_hours ?? 24;
  const startAt = new Date(appointment.start_at);
  const hoursUntilStart =
    (startAt.getTime() - Date.now()) / (1000 * 60 * 60);

  if (hoursUntilStart < cancellationHours) {
    return {
      error: `Cancellations must be made at least ${cancellationHours} hours in advance.`,
    };
  }

  const { error: updateError } = await supabase
    .from("appointments")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancelled_by: "customer",
    })
    .eq("id", appointment.id);

  if (updateError !== null) {
    return { error: "Could not cancel booking. Please try again." };
  }

  return { error: null };
}