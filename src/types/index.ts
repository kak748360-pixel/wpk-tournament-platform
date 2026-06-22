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
