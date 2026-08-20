export interface CopilotResponse {
  answer: string;
  customer_id?: string | null;
  facts: string[];
  inferences: string[];
  hypotheses: string[];
  evidence: Array<{
    metric: string;
    value: string;
    source: string;
  }>;
  confidence: 'High' | 'Medium' | 'Low';
  recommendations: string[];
  next_best_action: string;
  data_gaps: string[];
  tools_called: string[];
  pending_action?: {
    action_id: string;
    action_type: string;
    target: string;
    reason: string;
    confirmation_prompt: string;
    is_dry_run: boolean;
  } | null;
  ui_action?: {
    type: 'FILTER_ACCOUNTS' | 'SELECT_CUSTOMER' | 'OPEN_QUALITY_MODAL' | 'OPEN_MEETING_BRIEF';
    payload: any;
  } | null;
}

export interface DemoScenario {
  id: string;
  title: string;
  prompt: string;
  target_customer: string;
  description: string;
}
