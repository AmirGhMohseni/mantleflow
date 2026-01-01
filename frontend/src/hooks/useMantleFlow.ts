// src/hooks/useMantleFlow.ts
import { useWriteContract, useReadContract } from "wagmi"
import { mantleFlowContract } from "@/contracts/mantleFlow"

export function useCreateInvoice() {
  return useWriteContract({
    ...mantleFlowContract,
    functionName: "createInvoice",
  })
}
