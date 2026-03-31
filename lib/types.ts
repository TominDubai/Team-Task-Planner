export type Vibe = "🚀" | "☕" | "🐢";
export type Timeframe = "daily" | "weekly" | "monthly";
export type TaskStatus = "pending" | "in_progress" | "complete" | "at_risk";
export type UserRole = "member" | "admin";

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  current_vibe: Vibe;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  timeframe: Timeframe;
  target_value: number;
  actual_value: number;
  status: TaskStatus;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskWithProfile extends Task {
  profile: Profile;
}

export interface TeamMemberSummary {
  profile: Profile;
  tasks: Task[];
  weeklyProgress: number;
  weeklyTarget: number;
  weeklyPct: number;
  atRiskCount: number;
}

export interface AdminStaffRow {
  profile: Profile;
  dailyPct: number;
  weeklyPct: number;
  monthlyPct: number;
  atRiskTasks: Task[];
  completedCount: number;
  totalCount: number;
}
