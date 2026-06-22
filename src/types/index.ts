export interface Tournament {
  id: string;
  title: string;
  description: string;
  entry_fee: number;
  prize_pool: number;
  start_time: string;
  registration_deadline?: string;
  status: string;
  rules?: string;
  created_at?: string;
}

export interface Registration {
  id: string;
  user_id: string;
  tournament_id: string;
  payment_status: string;
  payment_method: string;
  tx_hash?: string;
  notes?: string;
  created_at?: string;
}

export interface ResultEntry {
  id: string;
  user_id: string;
  tournament_id: string;
  rank: number;
  points: number;
  prize: number;
  proof_url?: string;
  created_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at?: string;
}
