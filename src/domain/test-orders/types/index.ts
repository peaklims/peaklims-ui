export interface OrderableTest {
  id: string;
  testCode: string;
  testName: string;
  methodology: string;
  platform: string;
  version: number;
  turnAroundTime: number;
  status: string;
}

export interface OrderablePanel {
  id: string;
  panelCode: string;
  panelName: string;
  type: string;
  version: number;
  status: string;
  tests: OrderableTest[];
}

export interface OrderablePanelsAndTestsDto {
  panels: OrderablePanel[];
  tests: OrderableTest[];
}

export interface TestOrderForCreationDto {
  testId?: string;
  panelId?: string;
}

export type TestOrderDto = {
  id: string;
  status: string;
  dueDate?: Date | null;
  tatSnapshot?: number;
  cancellationReason?: string;
  cancellationComments?: string;
  panelId?: string;
  testId?: string;
};
