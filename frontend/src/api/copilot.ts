import type { CopilotResponse, DemoScenario } from '../types';

export async function sendCopilotMessage(
  _message: string,
  _context?: Record<string, unknown>,
  _customerId?: string,
): Promise<CopilotResponse> {
  throw new Error('Copilot chat is not supported by the current backend');
}

export async function fetchDemoScenarios(): Promise<DemoScenario[]> {
  return [];
}
