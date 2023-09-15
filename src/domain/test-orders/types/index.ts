interface OrderableTest {
  id: string;
  testCode: string;
  testName: string;
  methodology: string;
  platform: string;
  version: number;
  turnAroundTime: number;
  status: string;
}

interface OrderablePanel {
  id: string;
  panelCode: string;
  panelName: string;
  type: string;
  version: number;
  status: string;
  tests: OrderableTest[];
}

interface OrderablePanelsAndTestsDto {
  panels: OrderablePanel[];
  tests: OrderableTest[];
}
