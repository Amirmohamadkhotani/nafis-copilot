import type {
  DashboardSummaryResponse,
  RecommendationFocusListResponse,
  RecommendationType,
} from '../types';
import { apiGet } from './client';

export function fetchDashboardSummary(): Promise<DashboardSummaryResponse> {
  return apiGet<DashboardSummaryResponse>('/dashboard/summary');
}

export function fetchRecommendations(
  type?: RecommendationType,
): Promise<RecommendationFocusListResponse> {
  const query = type ? `?type=${encodeURIComponent(type)}` : '';
  return apiGet<RecommendationFocusListResponse>(`/recommendations${query}`);
}
