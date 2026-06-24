import type { CustomerVoiceInput, DemoDataset } from "../../../types/revenue";
import { clinicDemoData, clinicDemoInput } from "./clinicDemo";
import { hotelDemoData, hotelDemoInput } from "./hotelDemo";
import { weddingDemoData, weddingDemoInput } from "./weddingDemo";

export { clinicDemoData, clinicDemoInput } from "./clinicDemo";
export { hotelDemoData, hotelDemoInput } from "./hotelDemo";
export { weddingDemoData, weddingDemoInput } from "./weddingDemo";

export const demoDatasets: DemoDataset[] = [
  hotelDemoData,
  weddingDemoData,
  clinicDemoData
];

const demoInputs: Record<string, CustomerVoiceInput> = {
  [clinicDemoData.id]: clinicDemoInput,
  [hotelDemoData.id]: hotelDemoInput,
  [weddingDemoData.id]: weddingDemoInput
};

export function inputForDemoDataset(datasetId: string): CustomerVoiceInput {
  return demoInputs[datasetId] ?? hotelDemoInput;
}
