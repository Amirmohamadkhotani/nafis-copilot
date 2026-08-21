import type {
  CustomerIntelligenceResponse,
  Customer360Response,
  CustomerListItem,
  CustomerMasterRecord,
  CustomerRecommendation,
  HealthResponse,
  UnavailableFeature,
} from '../types';
import { apiGet } from './client';

export function checkHealth(): Promise<HealthResponse> {
  return apiGet<HealthResponse>('/health');
}

export function fetchCustomers(): Promise<CustomerListItem[]> {
  return apiGet<CustomerListItem[]>('/customers');
}

export function fetchCustomerRecord(customerId: string): Promise<CustomerMasterRecord> {
  return apiGet<CustomerMasterRecord>(`/customers/${encodeURIComponent(customerId)}`);
}

export function fetchCustomerIntelligence(
  customerId: string,
): Promise<CustomerIntelligenceResponse> {
  return apiGet<CustomerIntelligenceResponse>(
    `/customers/${encodeURIComponent(customerId)}/intelligence`,
  );
}

export function fetchCustomer360(customerId: string): Promise<Customer360Response> {
  return apiGet<Customer360Response>(`/customers/${encodeURIComponent(customerId)}/360`);
}

export function fetchCustomerRecommendation(
  customerId: string,
): Promise<CustomerRecommendation> {
  return apiGet<CustomerRecommendation>(
    `/customers/${encodeURIComponent(customerId)}/recommendation`,
  );
}

// Compatibility aliases for callers that have not yet adopted the canonical names.
export const fetchAccounts = fetchCustomers;
export const fetchCustomerContract = fetchCustomerRecord;

function unsupportedFeature(): Promise<UnavailableFeature> {
  return Promise.resolve({ available: false, reason: 'not_supported_by_backend' });
}

export function fetchQualityChain(
  _customerId: string,
  _complaintId: string,
): Promise<UnavailableFeature> {
  return unsupportedFeature();
}

export function fetchMeetingBrief(_customerId: string): Promise<UnavailableFeature> {
  return unsupportedFeature();
}
