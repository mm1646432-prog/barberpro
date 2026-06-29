import type { AppointmentStatus } from "@/lib/utils/format";

export interface AppointmentCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

export interface AppointmentService {
  id: string;
  name: string;
  durationMin: number;
  price: number;
}

export interface AppointmentEmployee {
  id: string;
  name: string;
  avatarUrl: string | null;
  colorTag: string;
}

export interface AdminAppointment {
  id: string;
  status: AppointmentStatus;
  startAt: Date;
  endAt: Date;
  priceSnapshot: number | null;
  customerNote: string | null;
  adminNote: string | null;
  cancelToken: string;
  cancelledAt: Date | null;
  cancelledBy: "customer" | "admin" | null;
  createdAt: Date;
  customer: AppointmentCustomer | null;
  service: AppointmentService | null;
  employee: AppointmentEmployee | null;
}